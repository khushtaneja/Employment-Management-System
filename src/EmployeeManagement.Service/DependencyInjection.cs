using EmployeeManagement.Core.Interfaces;
using EmployeeManagement.Service.Services;
using Microsoft.Extensions.DependencyInjection;

namespace EmployeeManagement.Service;

public static class DependencyInjection
{
    public static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddScoped<IEmployeeService, EmployeeService>();
        services.AddScoped<IAuthService, AuthService>();

        return services;
    }
}
