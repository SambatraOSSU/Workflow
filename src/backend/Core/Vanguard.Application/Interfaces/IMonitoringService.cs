using Vanguard.Application.DTOs.Monitoring;

namespace Vanguard.Application.Interfaces;

public interface IMonitoringService
{
    Task<ClusterMetricsDto> GetClusterMetricsAsync(CancellationToken cancellationToken = default);
    Task<List<StageLatencyDto>> GetStageLatenciesAsync(CancellationToken cancellationToken = default);
    Task<List<WorkerPoolDto>> GetWorkerPoolsAsync(CancellationToken cancellationToken = default);
}
