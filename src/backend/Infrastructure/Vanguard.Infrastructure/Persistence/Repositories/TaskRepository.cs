using Microsoft.EntityFrameworkCore;
using Vanguard.Application.Interfaces.Persistence;
using Vanguard.Domain.Entities.Tasks;
using TaskStatus = Vanguard.Domain.Entities.Tasks.TaskStatus;

namespace Vanguard.Infrastructure.Persistence.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly VanguardDbContext _context;

    public TaskRepository(VanguardDbContext context)
    {
        _context = context;
    }

    public Task<TaskInstance?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _context.TaskInstances
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
    }

    public Task<TaskInstance?> GetByIdWithExecutionAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _context.TaskInstances
            .Include(t => t.ExecutionInstance!)
                .ThenInclude(e => e.WorkflowDefinition)
            .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);
    }

    public Task<List<TaskInstance>> GetAllAsync(
        Guid? assignedToUserId = null,
        string? priority = null,
        TaskStatus? status = null,
        string? search = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.TaskInstances.AsNoTracking()
            .Include(t => t.ExecutionInstance!)
                .ThenInclude(e => e.WorkflowDefinition)
            .AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(t => t.Status == status.Value);
        }

        if (assignedToUserId.HasValue)
        {
            query = query.Where(t => t.AssignedToUserId == assignedToUserId.Value || t.AssignedToUserId == null);
        }

        if (!string.IsNullOrWhiteSpace(priority) && !string.Equals(priority, "All", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(t => t.Priority.ToLower() == priority.ToLower());
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.Trim().ToLower();
            query = query.Where(t => t.Title.ToLower().Contains(searchLower) ||
                                     t.ExecutionInstance!.ReferenceNumber.ToLower().Contains(searchLower) ||
                                     t.ExecutionInstance.WorkflowDefinition!.Title.ToLower().Contains(searchLower));
        }

        return query
            .OrderByDescending(t => t.Priority == "Urgent")
            .ThenBy(t => t.DueAtUtc ?? DateTime.MaxValue)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(TaskInstance task, CancellationToken cancellationToken = default)
    {
        await _context.TaskInstances.AddAsync(task, cancellationToken);
    }

    public void Update(TaskInstance task)
    {
        _context.TaskInstances.Update(task);
    }

    public Task<int> GetPendingTasksCountAsync(Guid? userId = null, CancellationToken cancellationToken = default)
    {
        var query = _context.TaskInstances.AsNoTracking().Where(t => t.Status == TaskStatus.Pending);
        if (userId.HasValue)
        {
            query = query.Where(t => t.AssignedToUserId == userId.Value || t.AssignedToUserId == null);
        }

        return query.CountAsync(cancellationToken);
    }
}
