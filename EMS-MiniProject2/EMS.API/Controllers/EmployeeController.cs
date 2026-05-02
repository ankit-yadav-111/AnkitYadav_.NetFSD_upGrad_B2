using EMS.API.DTOs;
using EMS.API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EMS.API.Controllers
{
    [ApiController]
    [Route("api/employees")]
    [Authorize]
    public class EmployeesController : ControllerBase
    {
        private readonly EmployeeService _employeeService;

        public EmployeesController(EmployeeService employeeService)
        {
            _employeeService = employeeService;
        }

        // GET /api/employees
        [HttpGet]
        [Authorize(Roles = "Admin,Viewer")]
        public async Task<IActionResult> GetAll([FromQuery] EmployeeQueryParams queryParams)
        {
            var result = await _employeeService.GetAllAsync(queryParams);
            return Ok(result);
        }

        // GET /api/employees/dashboard
        [HttpGet("dashboard")]
        [Authorize(Roles = "Admin,Viewer")]
        public async Task<IActionResult> GetDashboard()
        {
            var result = await _employeeService.GetDashboardAsync();
            return Ok(result);
        }

        // GET /api/employees/{id}
        [HttpGet("{id}")]
        [Authorize(Roles = "Admin,Viewer")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _employeeService.GetByIdAsync(id);
            if (result == null) return NotFound(new { message = "Employee not found." });
            return Ok(result);
        }

        // POST /api/employees
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create([FromBody] EmployeeRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (employee, error) = await _employeeService.CreateAsync(dto);

            if (error != null)
                return Conflict(new { message = error });

            return CreatedAtAction(nameof(GetById), new { id = employee!.Id }, employee);
        }

        // PUT /api/employees/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Update(int id, [FromBody] EmployeeRequestDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var (employee, error) = await _employeeService.UpdateAsync(id, dto);

            if (error == "Employee not found.")
                return NotFound(new { message = error });

            if (error != null)
                return Conflict(new { message = error });

            return Ok(employee);
        }

        // DELETE /api/employees/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _employeeService.DeleteAsync(id);
            if (!result) return NotFound(new { message = "Employee not found." });
            return Ok(new { message = "Employee deleted successfully." });
        }
    }
}