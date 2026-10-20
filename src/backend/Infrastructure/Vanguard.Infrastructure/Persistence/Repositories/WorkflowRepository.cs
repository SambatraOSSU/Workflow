using Microsoft.EntityFrameworkCore;
using Vanguard.Application.Interfaces.Persistence;
using Vanguard.Domain.Entities.Workflows;

namespace Vanguard.Infrastructure.Persistence.Repositories;

public class WorkflowRepository : IWorkflowRepository
{
    private readonly VanguardDbContext _context;

    public WorkflowRepository(VanguardDbContext context)
    {
        _context = context;
    }

    public Task<WorkflowDefinition?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _context.WorkflowDefinitions
            .FirstOrDefaultAsync(w => w.Id == id, cancellationToken);
    }

    public Task<WorkflowDefinition?> GetByIdWithVersionsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return _context.WorkflowDefinitions
            .Include(w => w.Versions)
            .FirstOrDefaultAsync(w => w.Id == id, cancellationToken);
    }

    public Task<WorkflowDefinition?> GetByKeyAsync(string key, CancellationToken cancellationToken = default)
    {
        return _context.WorkflowDefinitions
            .FirstOrDefaultAsync(w => w.Key == key, cancellationToken);
    }

    public Task<List<WorkflowDefinition>> GetAllAsync(string? category = null, string? search = null, CancellationToken cancellationToken = default)
    {
        var query = _context.WorkflowDefinitions.AsNoTracking().AsQueryable();

        if (!string.IsNullOrWhiteSpace(category) && !string.Equals(category, "All", StringComparison.OrdinalIgnoreCase))
        {
            query = query.Where(w => w.Category == category || w.Department == category);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.Trim().ToLower();
            query = query.Where(w => w.Title.ToLower().Contains(searchLower) ||
                                     w.Key.ToLower().Contains(searchLower) ||
                                     w.Description.ToLower().Contains(searchLower));
        }

        return query
            .OrderByDescending(w => w.UpdatedAtUtc ?? w.CreatedAtUtc)
            .ToListAsync(cancellationToken);
    }

    public Task<bool> ExistsKeyAsync(string key, CancellationToken cancellationToken = default)
    {
        return _context.WorkflowDefinitions
            .AnyAsync(w => w.Key == key, cancellationToken);
    }

    public async Task AddAsync(WorkflowDefinition workflow, CancellationToken cancellationToken = default)
    {
        await _context.WorkflowDefinitions.AddAsync(workflow, cancellationToken);
    }

    public void Update(WorkflowDefinition workflow)
    {
        _context.WorkflowDefinitions.Update(workflow);
    }

    public async Task AddVersionAsync(WorkflowVersion version, CancellationToken cancellationToken = default)
    {
        await _context.WorkflowVersions.AddAsync(version, cancellationToken);
    }

    public Task<WorkflowVersion?> GetLatestVersionAsync(Guid workflowDefinitionId, CancellationToken cancellationToken = default)
    {
        return _context.WorkflowVersions
            .Where(v => v.WorkflowDefinitionId == workflowDefinitionId)
            .OrderByDescending(v => v.VersionNumber)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public Task<List<WorkflowVersion>> GetVersionsAsync(Guid workflowDefinitionId, CancellationToken cancellationToken = default)
    {
        return _context.WorkflowVersions
            .Where(v => v.WorkflowDefinitionId == workflowDefinitionId)
            .OrderByDescending(v => v.VersionNumber)
            .ToListAsync(cancellationToken);
    }

    public Task<WorkflowVersion?> GetVersionByNumberAsync(Guid workflowDefinitionId, int versionNumber, CancellationToken cancellationToken = default)
    {
        return _context.WorkflowVersions
            .FirstOrDefaultAsync(v => v.WorkflowDefinitionId == workflowDefinitionId && v.VersionNumber == versionNumber, cancellationToken);
    }
}
