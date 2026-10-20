using Vanguard.Domain.Entities.Engine;

namespace Vanguard.Application.Interfaces.Persistence;

public interface IExecutionRepository
{
    Task<ExecutionInstance?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<ExecutionInstance?> GetByIdWithLogsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<List<ExecutionInstance>> GetAllAsync(ExecutionStatus? status = null, Guid? workflowDefinitionId = null, string? search = null, CancellationToken cancellationToken = default);
    Task<int> CountAsync(ExecutionStatus? status = null, CancellationToken cancellationToken = default);
    Task AddAsync(ExecutionInstance execution, CancellationToken cancellationToken = default);
    void Update(ExecutionInstance execution);
    Task AddStepLogAsync(ExecutionStepLog log, CancellationToken cancellationToken = default);
    Task<string> GenerateReferenceNumberAsync(CancellationToken cancellationToken = default);
}
