# Employee Management System - .NET 8 Web API

A production-ready ASP.NET Core Web API built with .NET 8, Entity Framework Core, SQL Server, and JWT authentication. This project demonstrates clean architecture principles, RESTful API design, role-based access control, and comprehensive unit testing.

## Features

- **Clean Architecture**: Separation of concerns with Core, Infrastructure, Service, and API layers
- **CRUD Operations**: Complete employee management with Create, Read, Update, Delete
- **Authentication**: JWT-based authentication with BCrypt password hashing
- **Authorization**: Role-based access control (Admin/User roles)
- **Database**: Entity Framework Core with SQL Server
- **Validation**: Data annotations and model validation
- **DTOs**: Request/response pattern for clean API contracts
- **Middleware**: Global exception handling and request logging
- **API Documentation**: Swagger/OpenAPI documentation
- **Unit Testing**: xUnit tests with Moq for dependency mocking
- **Logging**: Built-in ASP.NET Core logging

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Visual Studio 2022](https://visualstudio.microsoft.com/vs/) or [Visual Studio Code](https://code.visualstudio.com/)
- [SQL Server](https://www.microsoft.com/sql-server/sql-server-downloads) or SQL Server LocalDB
- [SQL Server Management Studio (SSMS)](https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms) (optional)

## Project Structure

```
EmployeeManagementSystem/
├── src/
│   ├── EmployeeManagement.Core/              # Domain models, DTOs, interfaces
│   │   ├── Models/                            # Employee, User
│   │   ├── DTOs/                              # Request/Response DTOs
│   │   ├── Enums/                             # Department, UserRole
│   │   └── Interfaces/                        # Service and repository contracts
│   ├── EmployeeManagement.Infrastructure/     # Data access layer
│   │   ├── Data/                              # DbContext
│   │   └── Repositories/                      # Repository implementations
│   ├── EmployeeManagement.Service/            # Business logic
│   │   └── Services/                          # EmployeeService, AuthService
│   └── EmployeeManagement.API/                # Web API
│       ├── Controllers/                       # API controllers
│       ├── Middleware/                        # Custom middleware
│       └── Program.cs                         # Application startup
└── tests/
    └── EmployeeManagement.Tests/              # Unit tests
        ├── Services/                          # Service tests
        └── Controllers/                       # Controller tests
```

## Getting Started

### 1. Clone or Download the Project

Navigate to the project directory:
```powershell
cd "c:\To Be Deleted\Perosnal Files\Personal Projects\Employee Managment System"
```

### 2. Update Connection String (if needed)

The default connection string in `src/EmployeeManagement.API/appsettings.json` uses SQL Server LocalDB:

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=EmployeeManagementDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

If you use a full SQL Server instance, update it to:
```json
"ConnectionStrings": {
  "DefaultConnection": "Server=YOUR_SERVER_NAME;Database=EmployeeManagementDb;Trusted_Connection=True;TrustServerCertificate=True;"
}
```

### 3. Restore Dependencies

```powershell
dotnet restore EmployeeManagement.sln
```

### 4. Build the Solution

```powershell
dotnet build EmployeeManagement.sln
```

### 5. Create Database and Run Migrations

Navigate to the API project:
```powershell
cd src\EmployeeManagement.API
```

Add initial migration:
```powershell
dotnet ef migrations add InitialCreate --project ..\EmployeeManagement.Infrastructure --startup-project .
```

Update the database:
```powershell
dotnet ef database update --project ..\EmployeeManagement.Infrastructure --startup-project .
```

Return to root:
```powershell
cd ..\..
```

### 6. Run the Application

```powershell
dotnet run --project src\EmployeeManagement.API
```

The API will be available at:
- HTTPS: `https://localhost:5001`
- HTTP: `http://localhost:5000`
- Swagger UI: `https://localhost:5001/swagger`

## Using the API

### Default User Accounts

The database is seeded with two default users:

| Username | Password   | Role  |
|----------|------------|-------|
| admin    | Admin@123  | Admin |
| user     | User@123   | User  |

### Authentication Flow

1. **Open Swagger**: Navigate to `https://localhost:5001/swagger`

2. **Register a new user** (optional):
   - POST `/api/auth/register`
   - Provide username, password, email, and role (1 = User, 2 = Admin)

3. **Login**:
   - POST `/api/auth/login`
   - Provide username and password
   - Copy the JWT token from the response

4. **Authorize in Swagger**:
   - Click the "Authorize" button (lock icon) at the top
   - Enter: `Bearer YOUR_TOKEN_HERE`
   - Click "Authorize" and "Close"

5. **Test Endpoints**:
   - GET `/api/employees` - View all employees (requires authentication)
   - GET `/api/employees/{id}` - View employee by ID (requires authentication)
   - POST `/api/employees` - Create employee (requires Admin role)
   - PUT `/api/employees/{id}` - Update employee (requires Admin role)
   - DELETE `/api/employees/{id}` - Delete employee (requires Admin role)

## Running Tests

Run all tests:
```powershell
dotnet test EmployeeManagement.sln
```

Run tests with detailed output:
```powershell
dotnet test EmployeeManagement.sln --verbosity normal
```

Run tests for a specific project:
```powershell
dotnet test tests\EmployeeManagement.Tests
```

## Database Management with SSMS

### Connect to LocalDB
1. Open SQL Server Management Studio (SSMS)
2. Server name: `(localdb)\mssqllocaldb`
3. Authentication: Windows Authentication
4. Click Connect

### View Database
- Expand "Databases" → "EmployeeManagementDb"
- Expand "Tables" to see:
  - `dbo.Employees`
  - `dbo.Users`
  - `dbo.__EFMigrationsHistory`

### Query Sample Data
```sql
SELECT * FROM Employees;
SELECT * FROM Users;
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Employee Management
- `GET /api/employees` - Get all employees (authenticated)
- `GET /api/employees/{id}` - Get employee by ID (authenticated)
- `POST /api/employees` - Create employee (Admin only)
- `PUT /api/employees/{id}` - Update employee (Admin only)
- `DELETE /api/employees/{id}` - Delete employee (Admin only)

## Key Technologies

- **ASP.NET Core 8.0** - Web API framework
- **Entity Framework Core 8.0** - ORM for database access
- **SQL Server** - Relational database
- **BCrypt.Net** - Password hashing
- **JWT Bearer** - Token-based authentication
- **Swashbuckle** - Swagger/OpenAPI documentation
- **xUnit** - Unit testing framework
- **Moq** - Mocking framework

## Security Considerations

- Passwords are hashed using BCrypt before storage
- JWT tokens expire after 24 hours
- Role-based authorization restricts sensitive operations
- HTTPS is enforced in production
- Connection strings should be moved to User Secrets or environment variables for production

## Production Deployment Checklist

- [ ] Update JWT secret key in production configuration
- [ ] Use Azure Key Vault or similar for secrets management
- [ ] Update connection string to production database
- [ ] Enable HTTPS redirection
- [ ] Configure CORS for specific origins
- [ ] Set up application monitoring and logging
- [ ] Review and harden security policies
- [ ] Set up CI/CD pipeline

## Troubleshooting

**Database connection fails:**
- Verify SQL Server is running
- Check connection string in `appsettings.json`
- Ensure LocalDB is installed (comes with Visual Studio)

**Migration errors:**
- Delete the `Migrations` folder in Infrastructure project
- Delete the database in SSMS
- Run migrations again

**JWT authentication fails:**
- Ensure token is prefixed with "Bearer " in Authorization header
- Check token expiration
- Verify JWT settings match in `appsettings.json`

## License

This project is created for educational and portfolio purposes.

## Contact

For questions or feedback, please reach out through your preferred contact method.
