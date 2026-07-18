using EmployeeManagement.Core.Models;

namespace EmployeeManagement.Core.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByUsernameAsync(string username);
    Task<User> CreateAsync(User user);
    Task<bool> UsernameExistsAsync(string username);
    Task<bool> EmailExistsAsync(string email);
}
