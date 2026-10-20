using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vanguard.Application.Common.Models;
using Vanguard.Application.DTOs.Monitoring;
using Vanguard.Application.Interfaces;

namespace Vanguard.Api.Controllers;

[ApiController]
[Route("api/monitoring")]
[Authorize]
[Produces("application/json")]
public class MonitoringController : ControllerBase
{
    private readonly IMonitoringService _monitoringService;

    public MonitoringController(IMonitoringService monitoringService)
    {
        _monitoringService = monitoringService;
    }

    [HttpGet("metrics")]
    [ProducesResponseType(typeof(ApiResponse<ClusterMetricsDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<ClusterMetricsDto>>> GetClusterMetrics(CancellationToken cancellationToken)
    {
        var result = await _monitoringService.GetClusterMetricsAsync(cancellationToken);
        return Ok(ApiResponse.Success(result));
    }

    [HttpGet("stage-latencies")]
    [ProducesResponseType(typeof(ApiResponse<List<StageLatencyDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<StageLatencyDto>>>> GetStageLatencies(CancellationToken cancellationToken)
    {
        var result = await _monitoringService.GetStageLatenciesAsync(cancellationToken);
        return Ok(ApiResponse.Success(result));
    }

    [HttpGet("worker-pools")]
    [ProducesResponseType(typeof(ApiResponse<List<WorkerPoolDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<WorkerPoolDto>>>> GetWorkerPools(CancellationToken cancellationToken)
    {
        var result = await _monitoringService.GetWorkerPoolsAsync(cancellationToken);
        return Ok(ApiResponse.Success(result));
    }
}
