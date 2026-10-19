using Moq;
using Vanguard.Application.Common.Interfaces;
using Vanguard.Application.DTOs.Settings;
using Vanguard.Application.Interfaces.Persistence;
using Vanguard.Application.Services;
using Vanguard.Domain.Entities.Audit;
using Xunit;

namespace Vanguard.Tests.Unit;

public class AuditAndSettingsTests
{
    private readonly Mock<IAuditRepository> _auditRepoMock;
    private readonly Mock<ICurrentTenantService> _tenantServiceMock;
    private readonly Mock<IUnitOfWork> _unitOfWorkMock;
    private readonly Guid _testTenantId = Guid.NewGuid();

    public AuditAndSettingsTests()
    {
        _auditRepoMock = new Mock<IAuditRepository>();
        _tenantServiceMock = new Mock<ICurrentTenantService>();
        _unitOfWorkMock = new Mock<IUnitOfWork>();

        _tenantServiceMock.Setup(t => t.TenantId).Returns(_testTenantId);
        _auditRepoMock.Setup(r => r.GetRecentEntriesAsync(It.IsAny<int>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<AuditLedgerEntry>());
        _auditRepoMock.Setup(r => r.GetLastHashAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync("8f9ac41e88912ba09110cf91a82bc129e0018fa09912");
        _unitOfWorkMock.Setup(u => u.CommitAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync(1);
    }

    [Fact]
    public async Task AuditService_GetMetrics_ReturnsCompleteMetrics()
    {
        // Arrange
        var service = new AuditService(_auditRepoMock.Object, _tenantServiceMock.Object, _unitOfWorkMock.Object);

        // Act
        var metrics = await service.GetMetricsAsync();

        // Assert
        Assert.NotNull(metrics);
        Assert.Equal(100.0, metrics.HashIntegrityPercent);
        Assert.Equal(100.0, metrics.Sox404CompliancePercent);
        Assert.True(metrics.SoxDualSignoffActive);
        Assert.Equal(0, metrics.PolicyViolationsCount);
        Assert.Equal(24, metrics.MerkleDepth);
    }

    [Fact]
    public async Task AuditService_GenerateCertificate_ProducesCryptographicCertificate()
    {
        // Arrange
        var service = new AuditService(_auditRepoMock.Object, _tenantServiceMock.Object, _unitOfWorkMock.Object);

        // Act
        var cert = await service.GenerateCertificateAsync();

        // Assert
        Assert.NotNull(cert);
        Assert.StartsWith("CERT-", cert.CertificateId);
        Assert.StartsWith("SIG-ED25519-", cert.AuditorSignature);
        Assert.Contains("SOX-404", cert.ComplianceFrameworks);
        Assert.Contains("SOC-2 Type II", cert.ComplianceFrameworks);
    }

    [Fact]
    public async Task AuditService_GetLedgerEntries_ReturnsSeededEntriesWhenDbEmpty()
    {
        // Arrange
        var service = new AuditService(_auditRepoMock.Object, _tenantServiceMock.Object, _unitOfWorkMock.Object);

        // Act
        var entries = await service.GetLedgerEntriesAsync();

        // Assert
        Assert.NotEmpty(entries);
        Assert.Contains(entries, e => e.EventType == "Executive Approval");
        Assert.Contains(entries, e => e.EventType == "Workflow Gate Cleared");
        Assert.Contains(entries, e => e.EventType == "Bypass Blocked");
    }

    [Fact]
    public async Task NotificationService_GetNotifications_ReturnsConfiguredAlerts()
    {
        // Arrange
        var service = new NotificationService();

        // Act
        var all = await service.GetNotificationsAsync();
        var critical = await service.GetNotificationsAsync(severity: "critical");

        // Assert
        Assert.NotEmpty(all);
        Assert.Contains(all, n => n.Type == "CRITICAL SLA BREACH");
        Assert.All(critical, n => Assert.Equal("critical", n.Severity));
    }

    [Fact]
    public async Task NotificationService_MarkAsRead_UpdatesStatus()
    {
        // Arrange
        var service = new NotificationService();

        // Act
        var result = await service.MarkAsReadAsync("notif-001");
        var notifs = await service.GetNotificationsAsync();
        var item = notifs.FirstOrDefault(n => n.Id == "notif-001");

        // Assert
        Assert.True(result);
        Assert.NotNull(item);
        Assert.True(item.IsRead);
    }

    [Fact]
    public async Task NotificationService_GetChannelHealth_ReturnsAllActiveChannels()
    {
        // Arrange
        var service = new NotificationService();

        // Act
        var channels = await service.GetChannelHealthAsync();

        // Assert
        Assert.Equal(5, channels.Count);
        Assert.All(channels, c => Assert.True(c.IsHealthy));
    }

    [Fact]
    public async Task SettingsService_GetAndUpdate_SavesAndLogsAudit()
    {
        // Arrange
        var service = new SettingsService(_auditRepoMock.Object, _tenantServiceMock.Object, _unitOfWorkMock.Object);

        // Act
        var initial = await service.GetSettingsAsync();
        Assert.NotNull(initial);

        var updated = await service.UpdateSettingsAsync(new EngineSettingsDto
        {
            DefaultWorkflowTimeoutSeconds = 7200,
            MaxConcurrencyPerTenant = 5000,
            SignatureAlgorithm = "ECDSA"
        });

        // Assert
        Assert.Equal(7200, updated.DefaultWorkflowTimeoutSeconds);
        Assert.Equal(5000, updated.MaxConcurrencyPerTenant);
        Assert.Equal("ECDSA", updated.SignatureAlgorithm);

        _auditRepoMock.Verify(r => r.AppendEntryAsync(It.Is<AuditLedgerEntry>(e => e.EventType == "SettingsUpdated"), It.IsAny<CancellationToken>()), Times.Once);
        _unitOfWorkMock.Verify(u => u.CommitAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task SettingsService_ExecuteDangerZoneAction_CreatesTamperEvidentAuditLog()
    {
        // Arrange
        var service = new SettingsService(_auditRepoMock.Object, _tenantServiceMock.Object, _unitOfWorkMock.Object);

        // Act
        var result = await service.ExecuteDangerZoneActionAsync("Flush Cache", "Scheduled maintenance purge");

        // Assert
        Assert.True(result.Success);
        Assert.StartsWith("LG-", result.AuditLedgerId);

        _auditRepoMock.Verify(r => r.AppendEntryAsync(It.Is<AuditLedgerEntry>(e => e.EventType == "DangerZone:Flush Cache"), It.IsAny<CancellationToken>()), Times.Once);
        _unitOfWorkMock.Verify(u => u.CommitAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
