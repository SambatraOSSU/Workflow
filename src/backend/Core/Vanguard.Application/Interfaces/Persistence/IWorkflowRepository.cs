using Vanguard.Domain.Entities.Workflows;

namespace Vanguard.Application.Interfaces.Persistence;

public interface IWorkflowRepository
{
    Task<WorkflowDefinition?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<WorkflowDefinition?> GetByIdWithVersionsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<WorkflowDefinition?> GetByKeyAsync(string key, CancellationToken cancellationToken = default);
    Task<List<WorkflowDefinition>> GetAllAsync(string? category = null, string? search = null, CancellationToken cancellationToken = default);
    Task<bool> ExistsKeyAsync(string key, CancellationToken cancellationToken = default);
    Task AddAsync(WorkflowDefinition workflow, CancellationToken cancellationToken = default);
    void Update(WorkflowDefinition workflow);
    Task AddVersionAsync(WorkflowVersion version, CancellationToken cancellationToken = default);
    Task<WorkflowVersion?> GetLatestVersionAsync(Guid workflowDefinitionId, CancellationToken cancellationToken = default);
    Task<List<WorkflowVersion>> GetVersionsAsync(Guid workflowDefinitionId, CancellationToken cancellationToken = default);
    Task<WorkflowVersion?> GetVersionByNumberAsync(Guid workflowDefinitionId, int versionNumber, CancellationToken cancellationToken = default);
}
