using EmployeeManagement.Core.Enums;
using EmployeeManagement.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace EmployeeManagement.Infrastructure.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Employee> Employees { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Employee>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.FirstName).IsRequired().HasMaxLength(50);
            entity.Property(e => e.LastName).IsRequired().HasMaxLength(50);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Position).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Salary).HasColumnType("decimal(18,2)");
            entity.HasIndex(e => e.Email).IsUnique();
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(u => u.Id);
            entity.Property(u => u.Username).IsRequired().HasMaxLength(50);
            entity.Property(u => u.PasswordHash).IsRequired();
            entity.Property(u => u.Email).IsRequired().HasMaxLength(100);
            entity.HasIndex(u => u.Username).IsUnique();
            entity.HasIndex(u => u.Email).IsUnique();
        });

        modelBuilder.Entity<User>().HasData(
            new User
            {
                Id = 1,
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                Email = "admin@employeemanagement.com",
                Role = UserRole.Admin
            },
            new User
            {
                Id = 2,
                Username = "user",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("User@123"),
                Email = "user@employeemanagement.com",
                Role = UserRole.User
            }
        );

        modelBuilder.Entity<Employee>().HasData(
            new Employee
            {
                Id = 1,
                FirstName = "John",
                LastName = "Doe",
                Email = "john.doe@company.com",
                Department = Department.Engineering,
                Position = "Senior Software Engineer",
                Salary = 95000,
                DateOfJoining = new DateTime(2020, 1, 15),
                IsActive = true
           },
            new Employee
            {
                Id = 2,
                FirstName = "Jane",
                LastName = "Smith",
                Email = "jane.smith@company.com",
                Department = Department.HR,
                Position = "HR Manager",
                Salary = 75000,
                DateOfJoining = new DateTime(2019, 3, 10),
                IsActive = true
            },
            new Employee
            {
                Id = 3,
                FirstName = "Mike",
                LastName = "Johnson",
                Email = "mike.johnson@company.com",
                Department = Department.Finance,
                Position = "Financial Analyst",
                Salary = 68000,
                DateOfJoining = new DateTime(2021, 6, 1),
                IsActive = true
            },
            new Employee
            {
                Id = 4,
                FirstName = "Sarah",
                LastName = "Williams",
                Email = "sarah.williams@company.com",
                Department = Department.Marketing,
                Position = "Marketing Specialist",
                Salary = 62000,
                DateOfJoining = new DateTime(2022, 2, 14),
                IsActive = true
            },
            new Employee
            {
                Id = 5,
                FirstName = "David",
                LastName = "Brown",
                Email = "david.brown@company.com",
                Department = Department.Operations,
                Position = "Operations Manager",
                Salary = 82000,
                DateOfJoining = new DateTime(2018, 11, 5),
                IsActive = true
            }
        );
    }
}
