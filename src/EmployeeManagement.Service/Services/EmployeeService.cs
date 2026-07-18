using EmployeeManagement.Core.DTOs.Employee;
using EmployeeManagement.Core.Interfaces;
using EmployeeManagement.Core.Models;

namespace EmployeeManagement.Service.Services;

public class EmployeeService : IEmployeeService
{
    private readonly IEmployeeRepository _repository;

    public EmployeeService(IEmployeeRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<EmployeeResponseDto>> GetAllAsync()
    {
        var employees = await _repository.GetAllAsync();
        return employees.Select(MapToResponseDto);
    }

    public async Task<EmployeeResponseDto?> GetByIdAsync(int id)
    {
        var employee = await _repository.GetByIdAsync(id);
        return employee == null ? null : MapToResponseDto(employee);
    }

    public async Task<EmployeeResponseDto> CreateAsync(CreateEmployeeDto dto)
    {
        var employee = new Employee
        {
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Email = dto.Email,
            Department = dto.Department,
            Position = dto.Position,
            Salary = dto.Salary,
            DateOfJoining = dto.DateOfJoining,
            IsActive = dto.IsActive
        };

        var created = await _repository.CreateAsync(employee);
        return MapToResponseDto(created);
    }

    public async Task<EmployeeResponseDto> UpdateAsync(int id, UpdateEmployeeDto dto)
    {
        var employee = await _repository.GetByIdAsync(id);
        if (employee == null)
        {
            throw new KeyNotFoundException($"Employee with ID {id} not found");
        }

        employee.FirstName = dto.FirstName;
        employee.LastName = dto.LastName;
        employee.Email = dto.Email;
        employee.Department = dto.Department;
        employee.Position = dto.Position;
        employee.Salary = dto.Salary;
        employee.DateOfJoining = dto.DateOfJoining;
        employee.IsActive = dto.IsActive;

        var updated = await _repository.UpdateAsync(employee);
        return MapToResponseDto(updated);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        return await _repository.DeleteAsync(id);
    }

    private static EmployeeResponseDto MapToResponseDto(Employee employee)
    {
        return new EmployeeResponseDto
        {
            Id = employee.Id,
            FirstName = employee.FirstName,
            LastName = employee.LastName,
            Email = employee.Email,
            Department = employee.Department,
            DepartmentName = employee.Department.ToString(),
            Position = employee.Position,
            Salary = employee.Salary,
            DateOfJoining = employee.DateOfJoining,
            IsActive = employee.IsActive
        };
    }
}
