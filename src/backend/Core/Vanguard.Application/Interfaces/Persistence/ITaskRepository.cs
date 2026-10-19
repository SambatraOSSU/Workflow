using Vanguard.Domain.Entities.Tasks;
using TaskStatus = Vanguard.Domain.Entities.Tasks.TaskStatus;

namespace Vanguard.Application.Interfaces.Persistence;

public interface ITaskRepository
{
    Task<TaskInstance?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<TaskInstance?> GetByIdWithExecutionAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<TaskInstance>> GetAllAsync(Guid? assignedToUserId = null, string? priority = null, TaskStatus? status = null, string? search = null, CancellationToken cancellationToken = default);
    Task AddAsync(TaskInstance task, CancellationToken cancellationToken = default);
    void Update(TaskInstance task);
    Task<int> GetPendingTasksCountAsync(Guid? userId = null, CancellationToken cancellationToken = default);
}
