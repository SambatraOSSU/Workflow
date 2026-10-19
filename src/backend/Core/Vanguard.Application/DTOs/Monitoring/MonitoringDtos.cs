namespace Vanguard.Application.DTOs.Monitoring;

public record ClusterMetricsDto(
    int ActiveExecutionsCount,
    double P99LatencyMs,
    double P50LatencyMs,
    double ThroughputStepsPerSec,
    double FailureErrorRatePercent,
    int ActiveWorkerNodes,
    int TotalWorkerNodes,
    int PendingRetriesCount,
    string ClusterStatus,
    double UptimePercent);

public record StageLatencyDto(
    int StageNumber,
    string StageName,
    string StageDescription,
    double LatencyMs,
    string Status,
    double PercentBudget);

public record WorkerPoolDto(
    string PoolName,
    string Region,
    int ProvisionedNodes,
    double CpuLoadPercent,
    double RamUsagePercent,
    string Status,
    bool IsElevated);
