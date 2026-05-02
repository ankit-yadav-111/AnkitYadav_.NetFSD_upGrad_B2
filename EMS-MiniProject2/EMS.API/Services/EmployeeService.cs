using EMS.API.DTOs;

namespace EMS.API.Services
{
    public class EmployeeService
    {
        private readonly IEmployeeRepository _repo;

        public EmployeeService(IEmployeeRepository repo)
        {
            _repo = repo;
        }

        public async Task<PagedResult<EmployeeResponseDto>> GetAllAsync(EmployeeQueryParams q)
            => await _repo.GetAllAsync(q);

        public async Task<EmployeeResponseDto?> GetByIdAsync(int id)
            => await _repo.GetByIdAsync(id);

        public async Task<(EmployeeResponseDto? employee, string? error)> CreateAsync(EmployeeRequestDto dto)
        {
            if (await _repo.EmailExistsAsync(dto.Email))
                return (null, "Email already exists.");

            var employee = await _repo.AddAsync(dto);
            return (employee, null);
        }

        public async Task<(EmployeeResponseDto? employee, string? error)> UpdateAsync(int id, EmployeeRequestDto dto)
        {
            if (await _repo.EmailExistsAsync(dto.Email, id))
                return (null, "Email already exists.");

            var employee = await _repo.UpdateAsync(id, dto);
            if (employee == null) return (null, "Employee not found.");

            return (employee, null);
        }

        public async Task<bool> DeleteAsync(int id)
            => await _repo.RemoveAsync(id);

        public async Task<DashboardSummaryDto> GetDashboardAsync()
            => await _repo.GetDashboardAsync();
    }
}