using EMS.API.Controllers;
using EMS.API.DTOs;
using EMS.API.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;

namespace EMS.Tests.Controllers
{
    [TestFixture]
    public class EmployeesControllerTests
    {
        private Mock<EmployeeService> _serviceMock;
        private EmployeesController _controller;
        private Mock<IEmployeeRepository> _repoMock;

        [SetUp]
        public void Setup()
        {
            _repoMock = new Mock<IEmployeeRepository>();
            _serviceMock = new Mock<EmployeeService>(_repoMock.Object);
            _controller = new EmployeesController(_serviceMock.Object);
        }

        [Test]
        public async Task GetById_ValidId_ReturnsOk()
        {
            var fakeEmployee = new EmployeeResponseDto { Id = 1, FirstName = "Priya" };
            _serviceMock.Setup(s => s.GetByIdAsync(1))
                        .ReturnsAsync(fakeEmployee);

            var result = await _controller.GetById(1);

            Assert.That(result, Is.InstanceOf<OkObjectResult>());
        }

        [Test]
        public async Task GetById_InvalidId_ReturnsNotFound()
        {
            _serviceMock.Setup(s => s.GetByIdAsync(9999))
                        .ReturnsAsync((EmployeeResponseDto?)null);

            var result = await _controller.GetById(9999);

            Assert.That(result, Is.InstanceOf<NotFoundObjectResult>());
        }

        [Test]
        public async Task Delete_ValidId_ReturnsOk()
        {
            _serviceMock.Setup(s => s.DeleteAsync(1)).ReturnsAsync(true);

            var result = await _controller.Delete(1);

            Assert.That(result, Is.InstanceOf<OkObjectResult>());
        }

        [Test]
        public async Task Delete_InvalidId_ReturnsNotFound()
        {
            _serviceMock.Setup(s => s.DeleteAsync(9999)).ReturnsAsync(false);

            var result = await _controller.Delete(9999);

            Assert.That(result, Is.InstanceOf<NotFoundObjectResult>());
        }
    }
}