using System.Text.Json;
using FluentAssertions;
using Moq;
using Vanguard.Application.Common.Interfaces;
using Vanguard.Application.DTOs.Executions;
using Vanguard.Application.DTOs.Tasks;
using Vanguard.Application.DTOs.Workflows;
using Vanguard.Application.Interfaces;
using Vanguard.Application.Interfaces.Persistence;
using Vanguard.Application.Services;
using Vanguard.Domain.Entities.Audit;
using Vanguard.Domain.Entities.Engine;
using Vanguard.Domain.Entities.Tasks;
using Vanguard.Domain.Entities.Workflows;
using Xunit;
using TaskStatus = Vanguard.Domain.Entities.Tasks.TaskStatus;

namespace Vanguard.Tests.Unit;

public class WorkflowEngineTests
{
    private readonly Mock<IExecutionRepository> _execRepoMock = new();
    private readonly Mock<ITaskRepository> _taskRepoMock = new();
    private readonly Mock<IWorkflowRepository> _wfRepoMock = new();
    private readonly Mock<IAuditRepository> _auditRepoMock = new();
    private readonly Mock<ICurrentTenantService> _tenantServiceMock = new();
    private readonly Mock<IUnitOfWork> _uowMock = new();

    private readonly WorkflowEngine _engine;
    private readonly TaskService _taskService;
    private readonly Guid _tenantId = Guid.Parse("11111111-1111-1111-1111-111111111111");
    private readonly Guid _userId = Guid.Parse("22222222-2222-2222-2222-222222222222");

    public WorkflowEngineTests()
    {
        _tenantServiceMock.Setup(t => t.TenantId).Returns(_tenantId);
        _execRepoMock.Setup(e => e.GenerateReferenceNumberAsync(It.IsAny<CancellationToken>()))
            .ReturnsAsync("WF-8821");
        _auditRepoMock.Setup(a => a.GetLastHashAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync("0000000000000000000000000000000000000000000000000000000000000000");

        _engine = new WorkflowEngine(
            _execRepoMock.Object,
            _taskRepoMock.Object,
            _wfRepoMock.Object,
            _auditRepoMock.Object,
            _tenantServiceMock.Object,
            _uowMock.Object
        );

        _taskService = new TaskService(
            _taskRepoMock.Object,
            _execRepoMock.Object,
            _engine,
            _auditRepoMock.Object,
            _tenantServiceMock.Object,
            _uowMock.Object
        );
    }

    [Fact]
    public async Task StartWorkflowAsync_StandardPipeline_ShouldSpawnExecutionAndTask()
    {
        // Arrange
        var wfId = Guid.NewGuid();
        var graph = new WorkflowGraphDto(
            Nodes: new List<WorkflowNodeDto>
            {
                new("trigger-1", "trigger", "webhook", "Webhook Trigger", "PO ingest", new NodePositionDto(0, 0), null),
                new("gate-1", "gate", "condition", "Check CapEx", "Rule", new NodePositionDto(100, 0), new NodeConfigDto(ConditionExpression: "amount > 50000")),
                new("task-1", "task", "approval", "VP Approval", "Signoff", new NodePositionDto(200, 0), new NodeConfigDto(Prompt: "Approve CapEx", TargetSlaHours: 4)),
                new("end-1", "end", "slack", "Complete", "Notify", new NodePositionDto(300, 0), null)
            },
            Edges: new List<WorkflowEdgeDto>
            {
                new("e1", "trigger-1", "gate-1", null, null, null),
                new("e2", "gate-1", "task-1", "True", "amount > 50000", null),
                new("e3", "task-1", "end-1", null, null, null)
            }
        );

        var wf = new WorkflowDefinition
        {
            Id = wfId,
            TenantId = _tenantId,
            Key = "wf-capex-pipeline",
            Title = "CapEx Pipeline",
            Status = WorkflowStatus.Published,
            Versions = new List<WorkflowVersion>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    WorkflowDefinitionId = wfId,
                    VersionNumber = 1,
                    GraphDefinitionJson = JsonSerializer.Serialize(graph)
                }
            }
        };

        _wfRepoMock.Setup(r => r.GetByIdWithVersionsAsync(wfId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(wf);

        var payload = JsonSerializer.Serialize(new { amount = 124500.00, vendor = "AWS" });
        var request = new StartExecutionRequestDto(wfId, "Webhook", payload);

        // Act
        var result = await _engine.StartWorkflowAsync(request, _userId);

        // Assert
        result.Should().NotBeNull();
        result.ReferenceNumber.Should().Be("WF-8821");
        result.Status.Should().Be(ExecutionStatus.Running);

        _execRepoMock.Verify(e => e.AddAsync(It.Is<ExecutionInstance>(i => i.ReferenceNumber == "WF-8821"), It.IsAny<CancellationToken>()), Times.Once);
        _taskRepoMock.Verify(t => t.AddAsync(It.Is<TaskInstance>(task => task.Title == "VP Approval" && task.Priority == "Urgent"), It.IsAny<CancellationToken>()), Times.Once);
        _auditRepoMock.Verify(a => a.AppendEntryAsync(It.Is<AuditLedgerEntry>(entry => entry.EventType == "ExecutionStarted"), It.IsAny<CancellationToken>()), Times.Once);
        _uowMock.Verify(u => u.CommitAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ApproveTaskAsync_ShouldApproveAndRecordAuditTrail()
    {
        // Arrange
        var taskId = Guid.NewGuid();
        var execId = Guid.NewGuid();

        var task = new TaskInstance
        {
            Id = taskId,
            TenantId = _tenantId,
            ExecutionInstanceId = execId,
            Title = "VP Finance Sign-off",
            StepKey = "task-1",
            Status = TaskStatus.Pending,
            Priority = "Urgent",
            ExecutionInstance = new ExecutionInstance
            {
                Id = execId,
                TenantId = _tenantId,
                ReferenceNumber = "WF-8821",
                Status = ExecutionStatus.Running,
                PayloadJson = "{}"
            }
        };

        _taskRepoMock.Setup(t => t.GetByIdWithExecutionAsync(taskId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(task);

        var request = new ApproveTaskRequestDto("Approved PO for AWS cluster", "FIDO2-SIG-OK");

        // Act
        var result = await _taskService.ApproveTaskAsync(taskId, request, _userId);

        // Assert
        result.Should().NotBeNull();
        task.Status.Should().Be(TaskStatus.Approved);
        task.DecisionNotes.Should().Be("Approved PO for AWS cluster");

        _taskRepoMock.Verify(t => t.Update(It.Is<TaskInstance>(t => t.Status == TaskStatus.Approved)), Times.Once);
        _auditRepoMock.Verify(a => a.AppendEntryAsync(It.Is<AuditLedgerEntry>(e => e.EventType == "TaskApproved"), It.IsAny<CancellationToken>()), Times.Once);
        _uowMock.Verify(u => u.CommitAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task StartWorkflowAsync_ConditionFalseBranch_ShouldLogConditionPassedFalseAndComplete()
    {
        // Arrange: Gate with False branch -> end-auto
        var wfId = Guid.NewGuid();
        var graph = new WorkflowGraphDto(
            Nodes: new List<WorkflowNodeDto>
            {
                new("trigger-1", "trigger", "webhook", "Webhook Trigger", null, new NodePositionDto(0, 0), null),
                new("gate-1", "gate", "condition", "Check CapEx", null, new NodePositionDto(100, 0), new NodeConfigDto(ConditionExpression: "amount > 50000")),
                new("end-auto", "end", "slack", "Auto Approved", null, new NodePositionDto(200, 100), null)
            },
            Edges: new List<WorkflowEdgeDto>
            {
                new("e1", "trigger-1", "gate-1", null, null, null),
                new("e2", "gate-1", "end-auto", "False", "amount <= 50000", null)
            }
        );

        var wf = new WorkflowDefinition
        {
            Id = wfId,
            TenantId = _tenantId,
            Key = "wf-capex-fasttrack",
            Title = "CapEx FastTrack",
            Status = WorkflowStatus.Published,
            Versions = new List<WorkflowVersion>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    WorkflowDefinitionId = wfId,
                    VersionNumber = 1,
                    GraphDefinitionJson = JsonSerializer.Serialize(graph)
                }
            }
        };

        _wfRepoMock.Setup(r => r.GetByIdWithVersionsAsync(wfId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(wf);

        // Payload with amount below threshold (12000 < 50000)
        var lowAmountPayload = JsonSerializer.Serialize(new { amount = 12000.00, vendor = "OfficeSupplies" });
        var request = new StartExecutionRequestDto(wfId, "Webhook", lowAmountPayload);

        // Act
        var result = await _engine.StartWorkflowAsync(request, _userId);

        // Assert: Task should NEVER be spawned, status should be Completed directly
        result.Should().NotBeNull();
        result.Status.Should().Be(ExecutionStatus.Completed);
        _taskRepoMock.Verify(t => t.AddAsync(It.IsAny<TaskInstance>(), It.IsAny<CancellationToken>()), Times.Never);
        _execRepoMock.Verify(e => e.AddStepLogAsync(It.Is<ExecutionStepLog>(log =>
            log.StepKey == "gate-1" && log.OutputPayloadJson.Contains("\"ConditionPassed\":false")), It.IsAny<CancellationToken>()), Times.Once);
        _execRepoMock.Verify(e => e.AddAsync(It.Is<ExecutionInstance>(i => i.Status == ExecutionStatus.Completed), It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task StartWorkflowAsync_MalformedPayload_ShouldFallbackSafelyWithoutCrashing()
    {
        // Arrange
        var wfId = Guid.NewGuid();
        var graph = new WorkflowGraphDto(
            Nodes: new List<WorkflowNodeDto>
            {
                new("trigger-1", "trigger", "webhook", "Webhook Trigger", null, new NodePositionDto(0, 0), null),
                new("gate-1", "gate", "condition", "Check Amount", null, new NodePositionDto(100, 0), new NodeConfigDto(ConditionExpression: "amount > 50000")),
                new("end-1", "end", "slack", "Complete", null, new NodePositionDto(200, 0), null)
            },
            Edges: new List<WorkflowEdgeDto>
            {
                new("e1", "trigger-1", "gate-1", null, null, null),
                new("e2", "gate-1", "end-1", "True", null, null)
            }
        );

        var wf = new WorkflowDefinition
        {
            Id = wfId,
            TenantId = _tenantId,
            Key = "wf-malformed-test",
            Title = "Malformed Test",
            Status = WorkflowStatus.Published,
            Versions = new List<WorkflowVersion>
            {
                new()
                {
                    Id = Guid.NewGuid(),
                    WorkflowDefinitionId = wfId,
                    VersionNumber = 1,
                    GraphDefinitionJson = JsonSerializer.Serialize(graph)
                }
            }
        };

        _wfRepoMock.Setup(r => r.GetByIdWithVersionsAsync(wfId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(wf);

        var malformedPayload = "{ not a valid json syntax ...";
        var request = new StartExecutionRequestDto(wfId, "Webhook", malformedPayload);

        // Act
        var result = await _engine.StartWorkflowAsync(request, _userId);

        // Assert: Engine must safely handle malformed JSON without raising unhandled JSON parser exceptions
        result.Should().NotBeNull();
        _uowMock.Verify(u => u.CommitAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task StartWorkflowAsync_WorkflowNotFound_ShouldThrowKeyNotFoundException()
    {
        // Arrange
        var nonExistentWfId = Guid.NewGuid();
        _wfRepoMock.Setup(r => r.GetByIdWithVersionsAsync(nonExistentWfId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((WorkflowDefinition?)null);

        var request = new StartExecutionRequestDto(nonExistentWfId, "Webhook", "{}");

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            _engine.StartWorkflowAsync(request, _userId));
    }

    [Fact]
    public async Task StartWorkflowAsync_WorkflowWithoutVersions_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var wfId = Guid.NewGuid();
        var wf = new WorkflowDefinition
        {
            Id = wfId,
            TenantId = _tenantId,
            Key = "wf-empty-versions",
            Title = "Empty Versions",
            Versions = new List<WorkflowVersion>() // Zero versions
        };

        _wfRepoMock.Setup(r => r.GetByIdWithVersionsAsync(wfId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(wf);

        var request = new StartExecutionRequestDto(wfId, "Webhook", "{}");

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() =>
            _engine.StartWorkflowAsync(request, _userId));

        ex.Message.Should().Contain("Aucune version");
    }
}
