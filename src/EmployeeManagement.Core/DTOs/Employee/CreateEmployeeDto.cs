using System.ComponentModel.DataAnnotations;
using EmployeeManagement.Core.Enums;

namespace EmployeeManagement.Core.DTOs.Employee;

public class CreateEmployeeDto
{
    [Required]
    [StringLength(50)]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    [StringLength(50)]
    public string LastName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public Department Department { get; set; }

    [Required]
    [StringLength(100)]
    public string Position { get; set; } = string.Empty;

    [Required]
    [Range(0, 10000000)]
    public decimal Salary { get; set; }

    [Required]
    public DateTime DateOfJoining { get; set; }

    public bool IsActive { get; set; } = true;
}
