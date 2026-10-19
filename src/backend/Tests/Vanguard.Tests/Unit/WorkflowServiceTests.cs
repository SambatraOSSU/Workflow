using System.Security.Cryptography;
using System.Text;
using FluentAssertions;
using Moq;
using Vanguard.Application.Common.Interfaces;
using Vanguard.Application.DTOs.Workflows;
using Vanguard.Application.Interfaces;
using Vanguard.Application.Interfaces.Persistence;
using Vanguard.Application.Services;
using Vanguard.Domain.Entities.Audit;
using Vanguard.Domain.Entities.Workflows;
using Xunit;

namespace Vanguard.Tests.Unit;

public class WorkflowServiceTests
{
    private readonly Mock<IWorkflowRepository> _workflowRepoMock = new();
    private readonly Mock<IAuditRepository> _auditRepoMock = new();
    private readonly Mock<IGraphValidator> _validatorMock = new();
    private readonly Mock<ICurrentTenantService> _tenantServiceMock = new();
    private readonly Mock<IUnitOfWork> _uowMock = new();

    private readonly WorkflowService _service;
    private readonly Guid _tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");
    private readonly Guid _userId = Guid.Parse("22222222-2222-2222-2222-222222222222");

    public WorkflowServiceTests()
    {
        _tenantServiceMock.Setup(t => t.TenantId).Returns(_tenantId);
        _auditRepoMock.Setup(a => a.GetLastHashAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync("0000000000000000000000000000000000000000000000000000000000000000");

        _service = new WorkflowService(
            _workflowRepoMock.Object,
            _auditRepoMock.Object,
            _validatorMock.Object,
            _tenantServiceMock.Object,
            _uowMock.Object
        );
    }

    [Fact]
    public async Task CreateWorkflowAsync_DuplicateKey_ShouldThrowInvalidOperationException()
    {
        // Arrange
        _workflowRepoMock.Setup(r => r.ExistsKeyAsync("duplicate-key", It.IsAny<CancellationToken>()))
            .ReturnsAsync(true);

        var request = new CreateWorkflowRequestDto("duplicate-key", "Title", "Desc", "Finance", "General");

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            _service.CreateWorkflowAsync(request, _userId));
    }

    [Fact]
    public async Task CreateWorkflowAsync_ValidRequest_ShouldCreateWorkflowAndInitialDraftVersion()
    {
        // Arrange
        _workflowRepoMock.Setup(r => r.ExistsKeyAsync("wf-capex-v1", It.IsAny<CancellationToken>()))
            .ReturnsAsync(false);

        var request = new CreateWorkflowRequestDto("wf-capex-v1", "CapEx Approval", "Description", "Finance", "Capital");

        // Act
        var result = await _service.CreateWorkflowAsync(request, _userId);

        // Assert
        result.Should().NotBeNull();
        result.Key.Should().Be("wf-capex-v1");
        result.Status.Should().Be(WorkflowStatus.Draft);
        result.CurrentVersionNumber.Should().Be(1);

        _workflowRepoMock.Verify(r => r.AddAsync(It.Is<WorkflowDefinition>(w => w.Key == "wf-capex-v1"), It.IsAny<CancellationToken>()), Times.Once);
        _workflowRepoMock.Verify(r => r.AddVersionAsync(It.Is<WorkflowVersion>(v => v.VersionNumber == 1 && !string.IsNullOrEmpty(v.HashSha256)), It.IsAny<CancellationToken>()), Times.Once);
        _auditRepoMock.Verify(a => a.AppendEntryAsync(It.IsAny<AuditLedgerEntry>(), It.IsAny<CancellationToken>()), Times.Once);
        _uowMock.Verify(u => u.CommitAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task PublishVersionAsync_InvalidGraphTopology_ShouldRejectPublication()
    {
        // Arrange
        var wfId = Guid.NewGuid();
        var wf = new WorkflowDefinition
        {
            Id = wfId,
            TenantId = _tenantId,
            Key = "test-wf",
            Title = "Test",
            CurrentVersionNumber = 1,
            Status = WorkflowStatus.Draft
        };
        var draftVersion = new WorkflowVersion
        {
            Id = Guid.NewGuid(),
            WorkflowDefinitionId = wfId,
            VersionNumber = 1,
            GraphDefinitionJson = "{\"nodes\":[],\"edges\":[]}"
        };
        wf.Versions.Add(draftVersion);

        _workflowRepoMock.Setup(r => r.GetByIdWithVersionsAsync(wfId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(wf);

        _validatorMock.Setup(v => v.ValidateGraph(It.IsAny<string>()))
            .Returns(new GraphValidationResultDto(false, new List<string> { "Missing trigger node." }, new List<string>(), 0, 0, 0, ""));

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() =>
            _service.PublishVersionAsync(wfId, new PublishWorkflowVersionRequestDto("Release v1"), _userId));

        ex.Message.Should().Contain("erreurs de topologie");
        wf.Status.Should().Be(WorkflowStatus.Draft);
        _uowMock.Verify(u => u.CommitAsync(It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task PublishVersionAsync_ValidGraph_ShouldPublishAndCryptosealVersion()
    {
        // Arrange
        var wfId = Guid.NewGuid();
        var wf = new WorkflowDefinition
        {
            Id = wfId,
            TenantId = _tenantId,
            Key = "wf-capex",
            Title = "CapEx Approval",
            CurrentVersionNumber = 1,
            Status = WorkflowStatus.Draft
        };
        var validGraphJson = "{\"nodes\":[{\"id\":\"n1\",\"type\":\"trigger\"},{\"id\":\"n2\",\"type\":\"end\"}],\"edges\":[{\"from\":\"n1\",\"to\":\"n2\"}]}";
        var draftVersion = new WorkflowVersion
        {
            Id = Guid.NewGuid(),
            WorkflowDefinitionId = wfId,
            VersionNumber = 1,
            GraphDefinitionJson = validGraphJson
        };
        wf.Versions.Add(draftVersion);

        _workflowRepoMock.Setup(r => r.GetByIdWithVersionsAsync(wfId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(wf);

        _validatorMock.Setup(v => v.ValidateGraph(validGraphJson))
            .Returns(new GraphValidationResultDto(true, new List<string>(), new List<string>(), 2, 1, 0, "2 Nodes • 1 Branches • 0 Cycles"));

        // Act
        var result = await _service.PublishVersionAsync(wfId, new PublishWorkflowVersionRequestDto("Initial release"), _userId);

        // Assert
        result.Should().NotBeNull();
        result.VersionNumber.Should().Be(1);
        result.HashSha256.Should().HaveLength(64); // SHA-256 hex string length
        wf.Status.Should().Be(WorkflowStatus.Published);

        _auditRepoMock.Verify(a => a.AppendEntryAsync(It.Is<AuditLedgerEntry>(e => e.EventType == "Publication" && e.CurrentHashSha256.Length == 64), It.IsAny<CancellationToken>()), Times.Once);
        _uowMock.Verify(u => u.CommitAsync(It.IsAny<CancellationToken>()), Times.Once);
    }
}
