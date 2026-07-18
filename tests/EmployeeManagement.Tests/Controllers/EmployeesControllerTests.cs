using EmployeeManagement.API.Controllers;
using EmployeeManagement.Core.DTOs.Employee;
using EmployeeManagement.Core.Enums;
using EmployeeManagement.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace EmployeeManagement.Tests.Controllers;

public class EmployeesControllerTests
{
    private readonly Mock<IEmployeeService> _mockService;
    private readonly Mock<ILogger<EmployeesController>> _mockLogger;
    private readonly EmployeesController _controller;

    public EmployeesControllerTests()
    {
        _mockService = new Mock<IEmployeeService>();
        _mockLogger = new Mock<ILogger<EmployeesController>>();
        _controller = new EmployeesController(_mockService.Object, _mockLogger.Object);
    }

    [Fact]
    public async Task GetAll_ShouldReturnOkWithEmployeeList()
    {
        var employees = new List<EmployeeResponseDto>
        {
            new EmployeeResponseDto
            {
                Id = 1,
                FirstName = "John",
                LastName = "Doe",
                Email = "john@test.com",
                Department = Department.Engineering,
                DepartmentName = "Engineering",
                Position = "Developer",
                Salary = 75000,
                DateOfJoining = DateTime.Now,
                IsActive = true
            }
        };

        _mockService.Setup(s => s.GetAllAsync()).ReturnsAsync(employees);

        var result = await _controller.GetAll();

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedEmployees = Assert.IsAssignableFrom<IEnumerable<EmployeeResponseDto>>(okResult.Value);
        Assert.Single(returnedEmployees);
    }

    [Fact]
    public async Task GetById_WithValidId_ShouldReturnOkWithEmployee()
    {
        var employee = new EmployeeResponseDto
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            Email = "john@test.com",
            Department = Department.Engineering,
            DepartmentName = "Engineering",
            Position = "Developer",
            Salary = 75000,
            DateOfJoining = DateTime.Now,
            IsActive = true
        };

        _mockService.Setup(s => s.GetByIdAsync(1)).ReturnsAsync(employee);

        var result = await _controller.GetById(1);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedEmployee = Assert.IsType<EmployeeResponseDto>(okResult.Value);
        Assert.Equal(1, returnedEmployee.Id);
    }

    [Fact]
    public async Task GetById_WithInvalidId_ShouldReturnNotFound()
    {
        _mockService.Setup(s => s.GetByIdAsync(999)).ReturnsAsync((EmployeeResponseDto?)null);

        var result = await _controller.GetById(999);

        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public async Task Create_WithValidDto_ShouldReturnCreatedAtAction()
    {
        var createDto = new CreateEmployeeDto
        {
            FirstName = "John",
            LastName = "Doe",
            Email = "john@test.com",
            Department = Department.Engineering,
            Position = "Developer",
            Salary = 75000,
            DateOfJoining = DateTime.Now,
            IsActive = true
        };

        var createdEmployee = new EmployeeResponseDto
        {
            Id = 1,
            FirstName = createDto.FirstName,
            LastName = createDto.LastName,
            Email = createDto.Email,
            Department = createDto.Department,
            DepartmentName = "Engineering",
            Position = createDto.Position,
            Salary = createDto.Salary,
            DateOfJoining = createDto.DateOfJoining,
            IsActive = createDto.IsActive
        };

        _mockService.Setup(s => s.CreateAsync(createDto)).ReturnsAsync(createdEmployee);

        var result = await _controller.Create(createDto);

        var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        var returnedEmployee = Assert.IsType<EmployeeResponseDto>(createdResult.Value);
        Assert.Equal(1, returnedEmployee.Id);
    }

    [Fact]
    public async Task Delete_WithValidId_ShouldReturnNoContent()
    {
        _mockService.Setup(s => s.DeleteAsync(1)).ReturnsAsync(true);

        var result = await _controller.Delete(1);

        Assert.IsType<NoContentResult>(result);
    }

    [Fact]
    public async Task Delete_WithInvalidId_ShouldReturnNotFound()
    {
        _mockService.Setup(s => s.DeleteAsync(999)).ReturnsAsync(false);

        var result = await _controller.Delete(999);

        Assert.IsType<NotFoundObjectResult>(result);
    }
}
