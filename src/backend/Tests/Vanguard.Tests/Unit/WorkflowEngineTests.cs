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
}
