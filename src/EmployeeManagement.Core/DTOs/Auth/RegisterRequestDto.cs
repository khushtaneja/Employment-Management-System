using System.ComponentModel.DataAnnotations;
using EmployeeManagement.Core.Enums;

namespace EmployeeManagement.Core.DTOs.Auth;

public class RegisterRequestDto
{
    [Required]
    [StringLength(50)]
    public string Username { get; set; } = string.Empty;

    [Required]
    [StringLength(100, MinimumLength = 6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public UserRole Role { get; set; }
}
