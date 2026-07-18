using EmployeeManagement.Core.Enums;

namespace EmployeeManagement.Core.DTOs.Employee;

public class EmployeeResponseDto
{
    public int Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public Department Department { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public decimal Salary { get; set; }
    public DateTime DateOfJoining { get; set; }
    public bool IsActive { get; set; }
}
