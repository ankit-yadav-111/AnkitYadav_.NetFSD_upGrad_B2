using EMS.API.Data;
using EMS.API.DTOs;
using EMS.API.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using NUnit.Framework;

namespace EMS.Tests.Services
{
    [TestFixture]
    public class AuthServiceTests
    {
        private AppDbContext _db;
        private Mock<IConfiguration> _mockConfig;
        private AuthService _service;

        [SetUp]
        public void Setup()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;

            _db = new AppDbContext(options);

            _mockConfig = new Mock<IConfiguration>();
            _mockConfig.Setup(c => c["Jwt:Key"])
                       .Returns("TestSecretKey_32Chars_ForNUnit!!");
            _mockConfig.Setup(c => c["Jwt:Issuer"])
                       .Returns("EMS.API");
            _mockConfig.Setup(c => c["Jwt:Audience"])
                       .Returns("EMS.Client");
            _mockConfig.Setup(c => c["Jwt:ExpiryHours"])
                       .Returns("8");

            _service = new AuthService(_db, _mockConfig.Object);
        }

        [TearDown]
        public void TearDown()
        {
            _db.Dispose();
        }

        [Test]
        public async Task RegisterAsync_NewUser_ReturnsSuccess()
        {
            var dto = new AuthRequestDto
            {
                Username = "testuser",
                Password = "test123",
                Role = "Viewer"
            };

            var result = await _service.RegisterAsync(dto);

            Assert.That(result.Success, Is.True);
            Assert.That(result.Username, Is.EqualTo("testuser"));
        }

        [Test]
        public async Task RegisterAsync_DuplicateUsername_ReturnsFailure()
        {
            var dto = new AuthRequestDto
            {
                Username = "admin",
                Password = "admin123",
                Role = "Admin"
            };

            await _service.RegisterAsync(dto);
            var result = await _service.RegisterAsync(dto);

            Assert.That(result.Success, Is.False);
            Assert.That(result.Message, Does.Contain("already exists"));
        }

        [Test]
        public async Task LoginAsync_ValidCredentials_ReturnsToken()
        {
            var registerDto = new AuthRequestDto
            {
                Username = "admin",
                Password = "admin123",
                Role = "Admin"
            };
            await _service.RegisterAsync(registerDto);

            var loginDto = new LoginRequestDto
            {
                Username = "admin",
                Password = "admin123"
            };

            var result = await _service.LoginAsync(loginDto);

            Assert.That(result.Success, Is.True);
            Assert.That(result.Token, Is.Not.Null.And.Not.Empty);
        }

        [Test]
        public async Task LoginAsync_WrongPassword_ReturnsFailure()
        {
            var registerDto = new AuthRequestDto
            {
                Username = "admin",
                Password = "admin123",
                Role = "Admin"
            };
            await _service.RegisterAsync(registerDto);

            var loginDto = new LoginRequestDto
            {
                Username = "admin",
                Password = "wrongpassword"
            };

            var result = await _service.LoginAsync(loginDto);

            Assert.That(result.Success, Is.False);
        }

        [Test]
        public async Task LoginAsync_NonExistentUser_ReturnsFailure()
        {
            var loginDto = new LoginRequestDto
            {
                Username = "nonexistent",
                Password = "pass123"
            };

            var result = await _service.LoginAsync(loginDto);

            Assert.That(result.Success, Is.False);
            Assert.That(result.Message, Is.EqualTo("Invalid credentials. Please try again."));
        }
    }
}