using EMS.API.DTOs;
using EMS.API.Models;

namespace EMS.API.Services
{
    public interface IEmployeeRepository
    {
        Task<PagedResult<EmployeeResponseDto>> GetAllAsync(EmployeeQueryParams queryParams);
        Task<EmployeeResponseDto?> GetByIdAsync(int id);
        Task<EmployeeResponseDto> AddAsync(EmployeeRequestDto dto);
        Task<EmployeeResponseDto?> UpdateAsync(int id, EmployeeRequestDto dto);
        Task<bool> RemoveAsync(int id);
        Task<bool> EmailExistsAsync(string email, int? excludeId = null);
        Task<DashboardSummaryDto> GetDashboardAsync();
    }
}