using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Vanguard.Application.Common.Models;
using Vanguard.Application.DTOs.Audit;
using Vanguard.Application.Interfaces;

namespace Vanguard.Api.Controllers;

[ApiController]
[Route("api/audit")]
[Authorize(Roles = "SuperAdmin,OrgAdmin,Auditor")]
[Produces("application/json")]
public class AuditController : ControllerBase
{
    private readonly IAuditService _auditService;

    public AuditController(IAuditService auditService)
    {
        _auditService = auditService;
    }

    [HttpGet("entries")]
    [ProducesResponseType(typeof(ApiResponse<List<AuditLedgerEntryDto>>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<List<AuditLedgerEntryDto>>>> GetLedgerEntries(
        [FromQuery] string? search,
        [FromQuery] string? category,
        [FromQuery] string? severity,
        CancellationToken cancellationToken)
    {
        var entries = await _auditService.GetLedgerEntriesAsync(search, category, severity, cancellationToken);
        return Ok(ApiResponse.Success(entries));
    }

    [HttpGet("metrics")]
    [ProducesResponseType(typeof(ApiResponse<AuditMetricsDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<AuditMetricsDto>>> GetMetrics(CancellationToken cancellationToken)
    {
        var metrics = await _auditService.GetMetricsAsync(cancellationToken);
        return Ok(ApiResponse.Success(metrics));
    }

    [HttpGet("certificate")]
    [ProducesResponseType(typeof(ApiResponse<ComplianceCertificateDto>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<ComplianceCertificateDto>>> GenerateCertificate(CancellationToken cancellationToken)
    {
        var cert = await _auditService.GenerateCertificateAsync(cancellationToken);
        return Ok(ApiResponse.Success(cert));
    }

    [HttpPost("verify/{id:guid}")]
    [ProducesResponseType(typeof(ApiResponse<bool>), StatusCodes.Status200OK)]
    public async Task<ActionResult<ApiResponse<bool>>> VerifyHash(Guid id, CancellationToken cancellationToken)
    {
        var isValid = await _auditService.VerifyEntryHashAsync(id, cancellationToken);
        return Ok(ApiResponse.Success(isValid));
    }
}
