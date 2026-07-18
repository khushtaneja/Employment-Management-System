using EmployeeManagement.Core.DTOs.Employee;
using EmployeeManagement.Core.Enums;
using EmployeeManagement.Core.Interfaces;
using EmployeeManagement.Core.Models;
using EmployeeManagement.Service.Services;
using Moq;
using Xunit;

namespace EmployeeManagement.Tests.Services;

public class EmployeeServiceTests
{
    private readonly Mock<IEmployeeRepository> _mockRepository;
    private readonly EmployeeService _service;

    public EmployeeServiceTests()
    {
        _mockRepository = new Mock<IEmployeeRepository>();
        _service = new EmployeeService(_mockRepository.Object);
    }

    [Fact]
    public async Task GetAllAsync_ShouldReturnAllEmployees()
    {
        var employees = new List<Employee>
        {
            new Employee
            {
                Id = 1,
                FirstName = "John",
                LastName = "Doe",
                Email = "john@test.com",
                Department = Department.Engineering,
                Position = "Developer",
                Salary = 75000,
                DateOfJoining = DateTime.Now,
                IsActive = true
            },
            new Employee
            {
                Id = 2,
                FirstName = "Jane",
                LastName = "Smith",
                Email = "jane@test.com",
                Department = Department.HR,
                Position = "Manager",
                Salary = 85000,
                DateOfJoining = DateTime.Now,
                IsActive = true
            }
        };

        _mockRepository.Setup(r => r.GetAllAsync()).ReturnsAsync(employees);

        var result = await _service.GetAllAsync();

        Assert.NotNull(result);
        Assert.Equal(2, result.Count());
        Assert.Equal("John", result.First().FirstName);
    }

    [Fact]
    public async Task GetByIdAsync_WithValidId_ShouldReturnEmployee()
    {
        var employee = new Employee
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            Email = "john@test.com",
            Department = Department.Engineering,
            Position = "Developer",
            Salary = 75000,
            DateOfJoining = DateTime.Now,
            IsActive = true
        };

        _mockRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(employee);

        var result = await _service.GetByIdAsync(1);

        Assert.NotNull(result);
        Assert.Equal(1, result.Id);
        Assert.Equal("John", result.FirstName);
    }

    [Fact]
    public async Task GetByIdAsync_WithInvalidId_ShouldReturnNull()
    {
        _mockRepository.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Employee?)null);

        var result = await _service.GetByIdAsync(999);

        Assert.Null(result);
    }

    [Fact]
    public async Task CreateAsync_ShouldCreateEmployee()
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

        var createdEmployee = new Employee
        {
            Id = 1,
            FirstName = createDto.FirstName,
            LastName = createDto.LastName,
            Email = createDto.Email,
            Department = createDto.Department,
            Position = createDto.Position,
            Salary = createDto.Salary,
            DateOfJoining = createDto.DateOfJoining,
            IsActive = createDto.IsActive
        };

        _mockRepository.Setup(r => r.CreateAsync(It.IsAny<Employee>())).ReturnsAsync(createdEmployee);

        var result = await _service.CreateAsync(createDto);

        Assert.NotNull(result);
        Assert.Equal(1, result.Id);
        Assert.Equal("John", result.FirstName);
    }

    [Fact]
    public async Task UpdateAsync_WithValidId_ShouldUpdateEmployee()
    {
        var updateDto = new UpdateEmployeeDto
        {
            FirstName = "John",
            LastName = "Updated",
            Email = "john.updated@test.com",
            Department = Department.Engineering,
            Position = "Senior Developer",
            Salary = 85000,
            DateOfJoining = DateTime.Now,
            IsActive = true
        };

        var existingEmployee = new Employee
        {
            Id = 1,
            FirstName = "John",
            LastName = "Doe",
            Email = "john@test.com",
            Department = Department.Engineering,
            Position = "Developer",
            Salary = 75000,
            DateOfJoining = DateTime.Now,
            IsActive = true
        };

        _mockRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(existingEmployee);
        _mockRepository.Setup(r => r.UpdateAsync(It.IsAny<Employee>())).ReturnsAsync(existingEmployee);

        var result = await _service.UpdateAsync(1, updateDto);

        Assert.NotNull(result);
        Assert.Equal("Updated", result.LastName);
        Assert.Equal(85000, result.Salary);
    }

    [Fact]
    public async Task UpdateAsync_WithInvalidId_ShouldThrowKeyNotFoundException()
    {
        var updateDto = new UpdateEmployeeDto
        {
            FirstName = "John",
            LastName = "Updated",
            Email = "john.updated@test.com",
            Department = Department.Engineering,
            Position = "Senior Developer",
            Salary = 85000,
            DateOfJoining = DateTime.Now,
            IsActive = true
        };

        _mockRepository.Setup(r => r.GetByIdAsync(999)).ReturnsAsync((Employee?)null);

        await Assert.ThrowsAsync<KeyNotFoundException>(() => _service.UpdateAsync(999, updateDto));
    }

    [Fact]
    public async Task DeleteAsync_WithValidId_ShouldReturnTrue()
    {
        _mockRepository.Setup(r => r.DeleteAsync(1)).ReturnsAsync(true);

        var result = await _service.DeleteAsync(1);

        Assert.True(result);
    }

    [Fact]
    public async Task DeleteAsync_WithInvalidId_ShouldReturnFalse()
    {
        _mockRepository.Setup(r => r.DeleteAsync(999)).ReturnsAsync(false);

        var result = await _service.DeleteAsync(999);

        Assert.False(result);
    }
}
