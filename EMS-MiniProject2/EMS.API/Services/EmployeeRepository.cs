using EMS.API.Data;
using EMS.API.DTOs;
using EMS.API.Models;
using Microsoft.EntityFrameworkCore;

namespace EMS.API.Services
{
    public class EmployeeRepository : IEmployeeRepository
    {
        private readonly AppDbContext _context;

        public EmployeeRepository(AppDbContext context)
        {
            _context = context;
        }

        // --------------------------------------------------------
        // GetAllAsync — server side search, filter, sort, pagination
        // --------------------------------------------------------
        public async Task<PagedResult<EmployeeResponseDto>> GetAllAsync(EmployeeQueryParams q)
        {
            var query = _context.Employees.AsQueryable();

            // Search
            if (!string.IsNullOrWhiteSpace(q.Search))
            {
                var term = q.Search.ToLower();
                query = query.Where(e =>
                    (e.FirstName + " " + e.LastName).ToLower().Contains(term) ||
                    e.Email.ToLower().Contains(term));
            }

            // Department filter
            if (!string.IsNullOrWhiteSpace(q.Department))
                query = query.Where(e => e.Department == q.Department);

            // Status filter
            if (!string.IsNullOrWhiteSpace(q.Status))
                query = query.Where(e => e.Status == q.Status);

            // Sort
            query = q.SortBy?.ToLower() switch
            {
                "salary" => q.SortDir == "desc" ? query.OrderByDescending(e => e.Salary) : query.OrderBy(e => e.Salary),
                "joindate" => q.SortDir == "desc" ? query.OrderByDescending(e => e.JoinDate) : query.OrderBy(e => e.JoinDate),
                _ => q.SortDir == "desc"
                    ? query.OrderByDescending(e => e.LastName).ThenByDescending(e => e.FirstName)
                    : query.OrderBy(e => e.LastName).ThenBy(e => e.FirstName)
            };

            var totalCount = await query.CountAsync();

            // Cap pageSize at 100
            var pageSize = Math.Min(q.PageSize, 100);
            var page = Math.Max(q.Page, 1);
            var totalPages = (int)Math.Ceiling((double)totalCount / pageSize);

            var data = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(e => MapToResponseDto(e))
                .ToListAsync();

            return new PagedResult<EmployeeResponseDto>
            {
                Data = data,
                TotalCount = totalCount,
                Page = page,
                PageSize = pageSize,
                TotalPages = totalPages,
                HasNextPage = page < totalPages,
                HasPrevPage = page > 1
            };
        }

        // --------------------------------------------------------
        // GetByIdAsync
        // --------------------------------------------------------
        public async Task<EmployeeResponseDto?> GetByIdAsync(int id)
        {
            var emp = await _context.Employees.FindAsync(id);
            return emp == null ? null : MapToResponseDto(emp);
        }

        // --------------------------------------------------------
        // AddAsync
        // --------------------------------------------------------
        public async Task<EmployeeResponseDto> AddAsync(EmployeeRequestDto dto)
        {
            var employee = new Employee
            {
                FirstName = dto.FirstName.Trim(),
                LastName = dto.LastName.Trim(),
                Email = dto.Email.Trim(),
                Phone = dto.Phone.Trim(),
                Department = dto.Department.Trim(),
                Designation = dto.Designation.Trim(),
                Salary = dto.Salary,
                JoinDate = dto.JoinDate,
                Status = dto.Status.Trim(),
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Employees.Add(employee);
            await _context.SaveChangesAsync();
            return MapToResponseDto(employee);
        }

        // --------------------------------------------------------
        // UpdateAsync
        // --------------------------------------------------------
        public async Task<EmployeeResponseDto?> UpdateAsync(int id, EmployeeRequestDto dto)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return null;

            employee.FirstName = dto.FirstName.Trim();
            employee.LastName = dto.LastName.Trim();
            employee.Email = dto.Email.Trim();
            employee.Phone = dto.Phone.Trim();
            employee.Department = dto.Department.Trim();
            employee.Designation = dto.Designation.Trim();
            employee.Salary = dto.Salary;
            employee.JoinDate = dto.JoinDate;
            employee.Status = dto.Status.Trim();
            employee.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return MapToResponseDto(employee);
        }

        // --------------------------------------------------------
        // RemoveAsync
        // --------------------------------------------------------
        public async Task<bool> RemoveAsync(int id)
        {
            var employee = await _context.Employees.FindAsync(id);
            if (employee == null) return false;

            _context.Employees.Remove(employee);
            await _context.SaveChangesAsync();
            return true;
        }

        // --------------------------------------------------------
        // EmailExistsAsync
        // --------------------------------------------------------
        public async Task<bool> EmailExistsAsync(string email, int? excludeId = null)
        {
            return await _context.Employees.AnyAsync(e =>
                e.Email.ToLower() == email.ToLower() &&
                (excludeId == null || e.Id != excludeId));
        }

        // --------------------------------------------------------
        // GetDashboardAsync
        // --------------------------------------------------------
        public async Task<DashboardSummaryDto> GetDashboardAsync()
        {
            var employees = await _context.Employees.ToListAsync();

            var total = employees.Count;
            var active = employees.Count(e => e.Status == "Active");
            var inactive = employees.Count(e => e.Status == "Inactive");
            var deptCount = employees.Select(e => e.Department).Distinct().Count();

            var breakdown = employees
                .GroupBy(e => e.Department)
                .OrderBy(g => g.Key)
                .Select(g => new DepartmentBreakdownDto
                {
                    Department = g.Key,
                    Count = g.Count(),
                    Percentage = total > 0 ? Math.Round((double)g.Count() / total * 100, 1) : 0
                }).ToList();

            var recent = employees
                .OrderByDescending(e => e.CreatedAt)
                .ThenByDescending(e => e.Id)
                .Take(5)
                .Select(e => MapToResponseDto(e))
                .ToList();

            return new DashboardSummaryDto
            {
                TotalEmployees = total,
                ActiveEmployees = active,
                InactiveEmployees = inactive,
                TotalDepartments = deptCount,
                DepartmentBreakdown = breakdown,
                RecentEmployees = recent
            };
        }

        // --------------------------------------------------------
        // MapToResponseDto — private helper
        // --------------------------------------------------------
        private static EmployeeResponseDto MapToResponseDto(Employee e) => new()
        {
            Id = e.Id,
            FirstName = e.FirstName,
            LastName = e.LastName,
            Email = e.Email,
            Phone = e.Phone,
            Department = e.Department,
            Designation = e.Designation,
            Salary = e.Salary,
            JoinDate = e.JoinDate,
            Status = e.Status,
            CreatedAt = e.CreatedAt,
            UpdatedAt = e.UpdatedAt
        };
    }
}