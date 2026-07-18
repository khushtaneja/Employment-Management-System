using EmployeeManagement.Core.DTOs.Auth;

namespace EmployeeManagement.Core.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginRequestDto dto);
    Task<bool> RegisterAsync(RegisterRequestDto dto);
}
