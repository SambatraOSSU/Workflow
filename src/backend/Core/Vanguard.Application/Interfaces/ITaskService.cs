using Vanguard.Application.DTOs.Tasks;
using TaskStatus = Vanguard.Domain.Entities.Tasks.TaskStatus;

namespace Vanguard.Application.Interfaces;

public interface ITaskService
{
    Task<List<TaskSummaryDto>> GetTasksAsync(Guid? userId = null, string? priority = null, TaskStatus? status = null, string? search = null, CancellationToken cancellationToken = default);
    Task<TaskDetailDto?> GetTaskByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<TaskDetailDto> ApproveTaskAsync(Guid id, ApproveTaskRequestDto request, Guid userId, CancellationToken cancellationToken = default);
    Task<TaskDetailDto> RejectTaskAsync(Guid id, RejectTaskRequestDto request, Guid userId, CancellationToken cancellationToken = default);
    Task<TaskDetailDto> DelegateTaskAsync(Guid id, DelegateTaskRequestDto request, Guid userId, CancellationToken cancellationToken = default);
}
