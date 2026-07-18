using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using EmployeeManagement.Core.DTOs.Auth;
using EmployeeManagement.Core.Interfaces;
using EmployeeManagement.Core.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace EmployeeManagement.Service.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IConfiguration _configuration;

    public AuthService(IUserRepository userRepository, IConfiguration configuration)
    {
        _userRepository = userRepository;
        _configuration = configuration;
    }

    public async Task<LoginResponseDto> LoginAsync(LoginRequestDto dto)
    {
        var user = await _userRepository.GetByUsernameAsync(dto.Username);
        
        if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid username or password");
        }

        var token = GenerateJwtToken(user);

        return new LoginResponseDto
        {
            Token = token,
            Username = user.Username,
            Role = user.Role.ToString()
        };
    }

    public async Task<bool> RegisterAsync(RegisterRequestDto dto)
    {
        if (await _userRepository.UsernameExistsAsync(dto.Username))
        {
            throw new InvalidOperationException("Username already exists");
        }

        if (await _userRepository.EmailExistsAsync(dto.Email))
        {
            throw new InvalidOperationException("Email already exists");
        }

        var user = new User
        {
            Username = dto.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Email = dto.Email,
            Role = dto.Role
        };

        await _userRepository.CreateAsync(user);
        return true;
    }

    private string GenerateJwtToken(User user)
    {
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var secretKey = jwtSettings["SecretKey"] ?? throw new InvalidOperationException("JWT SecretKey not configured");
        var issuer = jwtSettings["Issuer"] ?? throw new InvalidOperationException("JWT Issuer not configured");
        var audience = jwtSettings["Audience"] ?? throw new InvalidOperationException("JWT Audience not configured");

        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(24),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
