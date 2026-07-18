using EmployeeManagement.Core.DTOs.Employee;
using EmployeeManagement.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EmployeeManagement.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class EmployeesController : ControllerBase
{
    private readonly IEmployeeService _employeeService;
    private readonly ILogger<EmployeesController> _logger;

    public EmployeesController(IEmployeeService employeeService, ILogger<EmployeesController> logger)
    {
        _employeeService = employeeService;
        _logger = logger;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<EmployeeResponseDto>>> GetAll()
    {
        var employees = await _employeeService.GetAllAsync();
        return Ok(employees);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<EmployeeResponseDto>> GetById(int id)
    {
        var employee = await _employeeService.GetByIdAsync(id);
        if (employee == null)
        {
            return NotFound(new { message = $"Employee with ID {id} not found" });
        }
        return Ok(employee);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<EmployeeResponseDto>> Create([FromBody] CreateEmployeeDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var employee = await _employeeService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = employee.Id }, employee);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<EmployeeResponseDto>> Update(int id, [FromBody] UpdateEmployeeDto dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var employee = await _employeeService.UpdateAsync(id, dto);
            return Ok(employee);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _employeeService.DeleteAsync(id);
        if (!result)
        {
            return NotFound(new { message = $"Employee with ID {id} not found" });
        }
        return NoContent();
    }
}
