using EMS.API.DTOs;
using EMS.API.Services;
using Moq;
using NUnit.Framework;

namespace EMS.Tests.Services
{
    [TestFixture]
    public class EmployeeServiceTests
    {
        private Mock<IEmployeeRepository> _repoMock;
        private EmployeeService _service;

        [SetUp]
        public void Setup()
        {
            _repoMock = new Mock<IEmployeeRepository>();
            _service = new EmployeeService(_repoMock.Object);
        }

        [Test]
        public async Task GetByIdAsync_ValidId_ReturnsMappedDto()
        {
            var fakeEmployee = new EmployeeResponseDto
            {
                Id = 1,
                FirstName = "Priya",
                LastName = "Menon",
                Email = "priya.menon@XYZ.com",
                Status = "Active"
            };

            _repoMock.Setup(r => r.GetByIdAsync(1))
                     .ReturnsAsync(fakeEmployee);

            var result = await _service.GetByIdAsync(1);

            Assert.That(result, Is.Not.Null);
            Assert.That(result!.FirstName, Is.EqualTo("Priya"));
            _repoMock.Verify(r => r.GetByIdAsync(1), Times.Once);
        }

        [Test]
        public async Task GetByIdAsync_InvalidId_ReturnsNull()
        {
            _repoMock.Setup(r => r.GetByIdAsync(9999))
                     .ReturnsAsync((EmployeeResponseDto?)null);

            var result = await _service.GetByIdAsync(9999);

            Assert.That(result, Is.Null);
        }

        [Test]
        public async Task CreateAsync_ValidData_CallsAddAsync()
        {
            var dto = new EmployeeRequestDto
            {
                FirstName = "Rahul",
                LastName = "Sharma",
                Email = "rahul.sharma@XYZ.com",
                Phone = "9823456781",
                Department = "Marketing",
                Designation = "Marketing Executive",
                Salary = 550000,
                JoinDate = DateTime.Now,
                Status = "Active"
            };

            var fakeResponse = new EmployeeResponseDto { Id = 16, FirstName = "Rahul" };

            _repoMock.Setup(r => r.EmailExistsAsync(dto.Email, null))
                     .ReturnsAsync(false);
            _repoMock.Setup(r => r.AddAsync(dto))
                     .ReturnsAsync(fakeResponse);

            var (employee, error) = await _service.CreateAsync(dto);

            Assert.That(error, Is.Null);
            Assert.That(employee, Is.Not.Null);
            _repoMock.Verify(r => r.AddAsync(dto), Times.Once);
        }

        [Test]
        public async Task CreateAsync_DuplicateEmail_ReturnsError()
        {
            var dto = new EmployeeRequestDto { Email = "priya.menon@XYZ.com" };

            _repoMock.Setup(r => r.EmailExistsAsync(dto.Email, null))
                     .ReturnsAsync(true);

            var (employee, error) = await _service.CreateAsync(dto);

            Assert.That(employee, Is.Null);
            Assert.That(error, Is.EqualTo("Email already exists."));
        }

        [Test]
        public async Task DeleteAsync_ValidId_ReturnsTrue()
        {
            _repoMock.Setup(r => r.RemoveAsync(1)).ReturnsAsync(true);

            var result = await _service.DeleteAsync(1);

            Assert.That(result, Is.True);
            _repoMock.Verify(r => r.RemoveAsync(1), Times.Once);
        }

        [Test]
        public async Task DeleteAsync_InvalidId_ReturnsFalse()
        {
            _repoMock.Setup(r => r.RemoveAsync(9999)).ReturnsAsync(false);

            var result = await _service.DeleteAsync(9999);

            Assert.That(result, Is.False);
        }
    }
}