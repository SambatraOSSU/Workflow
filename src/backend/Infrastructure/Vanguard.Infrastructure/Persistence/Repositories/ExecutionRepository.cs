using Microsoft.EntityFrameworkCore;
using Vanguard.Application.Interfaces.Persistence;
using Vanguard.Domain.Entities.Engine;

namespace Vanguard.Infrastructure.Persistence.Repositories;

public class ExecutionRepository : IExecutionRepository
{
    private readonly VanguardDbContext _context;

    public ExecutionRepository(VanguardDbContext context)
    {
        _context = context;
    }

    public Task<ExecutionInstance?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _context.ExecutionInstances
            .Include(e => e.WorkflowDefinition)
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    public Task<ExecutionInstance?> GetByIdWithLogsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _context.ExecutionInstances
            .Include(e => e.WorkflowDefinition)
            .Include(e => e.WorkflowVersion)
            .Include(e => e.StepLogs.OrderBy(s => s.CreatedAtUtc))
            .FirstOrDefaultAsync(e => e.Id == id, cancellationToken);
    }

    public Task<List<ExecutionInstance>> GetAllAsync(
        ExecutionStatus? status = null,
        Guid? workflowDefinitionId = null,
        string? search = null,
        CancellationToken cancellationToken = default)
    {
        var query = _context.ExecutionInstances.AsNoTracking()
            .Include(e => e.WorkflowDefinition)
            .Include(e => e.StepLogs)
            .AsQueryable();

        if (status.HasValue)
        {
            query = query.Where(e => e.Status == status.Value);
        }

        if (workflowDefinitionId.HasValue)
        {
            query = query.Where(e => e.WorkflowDefinitionId == workflowDefinitionId.Value);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.Trim().ToLower();
            query = query.Where(e => e.ReferenceNumber.ToLower().Contains(searchLower) ||
                                     e.WorkflowDefinition!.Title.ToLower().Contains(searchLower));
        }

        return query
            .OrderByDescending(e => e.StartedAtUtc)
            .ToListAsync(cancellationToken);
    }

    public async Task AddAsync(ExecutionInstance execution, CancellationToken cancellationToken = default)
    {
        await _context.ExecutionInstances.AddAsync(execution, cancellationToken);
    }

    public void Update(ExecutionInstance execution)
    {
        _context.ExecutionInstances.Update(execution);
    }

    public async Task AddStepLogAsync(ExecutionStepLog log, CancellationToken cancellationToken = default)
    {
        await _context.ExecutionStepLogs.AddAsync(log, cancellationToken);
    }

    public Task<int> CountAsync(ExecutionStatus? status = null, CancellationToken cancellationToken = default)
    {
        var query = _context.ExecutionInstances.AsNoTracking();
        if (status.HasValue)
        {
            query = query.Where(e => e.Status == status.Value);
        }
        return query.CountAsync(cancellationToken);
    }

    public Task<string> GenerateReferenceNumberAsync(CancellationToken cancellationToken = default)
    {
        var suffix = Guid.NewGuid().ToString("N")[..6].ToUpperInvariant();
        return Task.FromResult($"WF-{DateTime.UtcNow:yyyyMMdd}-{suffix}");
    }
}
