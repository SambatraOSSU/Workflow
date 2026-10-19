using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using Vanguard.Application.Common.Interfaces;
using Vanguard.Application.DTOs.Tasks;
using Vanguard.Application.Interfaces;
using Vanguard.Application.Interfaces.Persistence;
using Vanguard.Application.Services;
using Vanguard.Application.Validators.Tasks;
using Vanguard.Domain.Entities.Audit;
using Vanguard.Domain.Entities.Engine;
using Vanguard.Domain.Entities.Tasks;
using Xunit;
using TaskStatus = Vanguard.Domain.Entities.Tasks.TaskStatus;

namespace Vanguard.Tests.Unit;

public class TaskServiceTests
{
    private readonly Mock<ITaskRepository> _taskRepoMock = new();
    private readonly Mock<IExecutionRepository> _execRepoMock = new();
    private readonly Mock<IWorkflowEngine> _engineMock = new();
    private readonly Mock<IAuditRepository> _auditRepoMock = new();
    private readonly Mock<ICurrentTenantService> _tenantServiceMock = new();
    private readonly Mock<IUnitOfWork> _uowMock = new();

    private readonly TaskService _service;
    private readonly Guid _tenantId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    private readonly Guid _userId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");

    public TaskServiceTests()
    {
        _tenantServiceMock.Setup(t => t.TenantId).Returns(_tenantId);
        _auditRepoMock.Setup(a => a.GetLastHashAsync(It.IsAny<Guid>(), It.IsAny<CancellationToken>()))
            .ReturnsAsync("0000000000000000000000000000000000000000000000000000000000000000");

        _service = new TaskService(
            _taskRepoMock.Object,
            _execRepoMock.Object,
            _engineMock.Object,
            _auditRepoMock.Object,
            _tenantServiceMock.Object,
            _uowMock.Object
        );
    }

    private TaskInstance CreateSampleTask(Guid taskId, Guid execId, TaskStatus status = TaskStatus.Pending)
    {
        return new TaskInstance
        {
            Id = taskId,
            TenantId = _tenantId,
            ExecutionInstanceId = execId,
            Title = "Approve CapEx Expenditure",
            Description = "Review and approve CapEx request",
            StepKey = "task-approval-1",
            Status = status,
            Priority = "Urgent",
            AssignedToRole = "Finance VP",
            AssignedToDepartment = "Treasury",
            DueAtUtc = DateTime.UtcNow.AddHours(4),
            SlaHours = 4,
            ConsensusPolicy = "FourEyes",
            RowVersion = new byte[] { 0x01, 0x02, 0x03, 0x04 },
            ExecutionInstance = new ExecutionInstance
            {
                Id = execId,
                TenantId = _tenantId,
                ReferenceNumber = "WF-9901",
                Status = ExecutionStatus.Running,
                PayloadJson = "{\"amount\":75000,\"vendor\":\"Datadog\"}"
            }
        };
    }

    [Fact]
    public async Task ApproveTaskAsync_ValidPendingTask_ShouldTransitionStatusToApprovedAndAdvanceWorkflow()
    {
        // Arrange
        var taskId = Guid.NewGuid();
        var execId = Guid.NewGuid();
        var task = CreateSampleTask(taskId, execId, TaskStatus.Pending);

        _taskRepoMock.Setup(r => r.GetByIdWithExecutionAsync(taskId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(task);

        var request = new ApproveTaskRequestDto("Approved within quarterly budget.", "SIG-WEBAUTHN-VALID");

        // Act
        var result = await _service.ApproveTaskAsync(taskId, request, _userId);

        // Assert
        result.Should().NotBeNull();
        task.Status.Should().Be(TaskStatus.Approved);
        task.ActionTakenByUserId.Should().Be(_userId);
        task.ActionTakenAtUtc.Should().NotBeNull();
        task.DecisionNotes.Should().Be("Approved within quarterly budget.");

        _taskRepoMock.Verify(r => r.Update(It.Is<TaskInstance>(t => t.Id == taskId && t.Status == TaskStatus.Approved)), Times.Once);
        _auditRepoMock.Verify(a => a.AppendEntryAsync(It.Is<AuditLedgerEntry>(e =>
            e.EventType == "TaskApproved" &&
            e.ExecutionInstanceId == execId &&
            e.IsVerified &&
            e.CurrentHashSha256.Length == 64), It.IsAny<CancellationToken>()), Times.Once);
        _uowMock.Verify(u => u.CommitAsync(It.IsAny<CancellationToken>()), Times.Once);
        _engineMock.Verify(e => e.AdvanceWorkflowAsync(execId, "task-approval-1", task.ExecutionInstance!.PayloadJson, It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task ApproveTaskAsync_NullDecisionNotes_ShouldUseDefaultPolicyNotes()
    {
        // Arrange
        var taskId = Guid.NewGuid();
        var execId = Guid.NewGuid();
        var task = CreateSampleTask(taskId, execId, TaskStatus.Pending);

        _taskRepoMock.Setup(r => r.GetByIdWithExecutionAsync(taskId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(task);

        var request = new ApproveTaskRequestDto(null, null);

        // Act
        var result = await _service.ApproveTaskAsync(taskId, request, _userId);

        // Assert
        result.Should().NotBeNull();
        task.DecisionNotes.Should().Be("Approved under policy FIN-SEC-2024.");
    }

    [Fact]
    public async Task ApproveTaskAsync_TaskNotFound_ShouldThrowKeyNotFoundException()
    {
        // Arrange
        var nonExistentId = Guid.NewGuid();
        _taskRepoMock.Setup(r => r.GetByIdWithExecutionAsync(nonExistentId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((TaskInstance?)null);

        var request = new ApproveTaskRequestDto("Approve", null);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            _service.ApproveTaskAsync(nonExistentId, request, _userId));

        ex.Message.Should().Contain(nonExistentId.ToString());
    }

    [Fact]
    public async Task ApproveTaskAsync_TaskAlreadyApproved_ShouldThrowInvalidOperationException()
    {
        // Arrange
        var taskId = Guid.NewGuid();
        var execId = Guid.NewGuid();
        var task = CreateSampleTask(taskId, execId, TaskStatus.Approved);

        _taskRepoMock.Setup(r => r.GetByIdWithExecutionAsync(taskId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(task);

        var request = new ApproveTaskRequestDto("Re-approve attempt", null);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<InvalidOperationException>(() =>
            _service.ApproveTaskAsync(taskId, request, _userId));

        ex.Message.Should().Contain("déjà été résolue");
        _uowMock.Verify(u => u.CommitAsync(It.IsAny<CancellationToken>()), Times.Never);
        _engineMock.Verify(e => e.AdvanceWorkflowAsync(It.IsAny<Guid>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task RejectTaskAsync_ValidPendingTask_ShouldSetStatusRejectedAndTerminateExecution()
    {
        // Arrange
        var taskId = Guid.NewGuid();
        var execId = Guid.NewGuid();
        var task = CreateSampleTask(taskId, execId, TaskStatus.Pending);

        _taskRepoMock.Setup(r => r.GetByIdWithExecutionAsync(taskId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(task);

        var request = new RejectTaskRequestDto("Exceeds allocated Q3 budget threshold.", "BUDGET_OVERRUN");

        // Act
        var result = await _service.RejectTaskAsync(taskId, request, _userId);

        // Assert
        result.Should().NotBeNull();
        task.Status.Should().Be(TaskStatus.Rejected);
        task.ActionTakenByUserId.Should().Be(_userId);
        task.ActionTakenAtUtc.Should().NotBeNull();
        task.DecisionNotes.Should().Be("Exceeds allocated Q3 budget threshold.");

        task.ExecutionInstance.Should().NotBeNull();
        task.ExecutionInstance!.Status.Should().Be(ExecutionStatus.Terminated);
        task.ExecutionInstance.CompletedAtUtc.Should().NotBeNull();

        _taskRepoMock.Verify(r => r.Update(It.Is<TaskInstance>(t => t.Id == taskId && t.Status == TaskStatus.Rejected)), Times.Once);
        _execRepoMock.Verify(e => e.Update(It.Is<ExecutionInstance>(i => i.Id == execId && i.Status == ExecutionStatus.Terminated)), Times.Once);
        _auditRepoMock.Verify(a => a.AppendEntryAsync(It.Is<AuditLedgerEntry>(entry =>
            entry.EventType == "TaskRejected" &&
            entry.ExecutionInstanceId == execId &&
            entry.DetailsJson.Contains("BUDGET_OVERRUN")), It.IsAny<CancellationToken>()), Times.Once);
        _uowMock.Verify(u => u.CommitAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task RejectTaskAsync_TaskNotFound_ShouldThrowKeyNotFoundException()
    {
        // Arrange
        var nonExistentId = Guid.NewGuid();
        _taskRepoMock.Setup(r => r.GetByIdWithExecutionAsync(nonExistentId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((TaskInstance?)null);

        var request = new RejectTaskRequestDto("Reason", "ERR");

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            _service.RejectTaskAsync(nonExistentId, request, _userId));
    }

    [Fact]
    public async Task DelegateTaskAsync_ValidTask_ShouldUpdateDecisionNotesAndAudit()
    {
        // Arrange
        var taskId = Guid.NewGuid();
        var execId = Guid.NewGuid();
        var task = CreateSampleTask(taskId, execId, TaskStatus.Pending);

        _taskRepoMock.Setup(r => r.GetByIdWithExecutionAsync(taskId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(task);

        var request = new DelegateTaskRequestDto("cfo.deputy@vanguard.io", "Delegated during CFO travel absence.");

        // Act
        var result = await _service.DelegateTaskAsync(taskId, request, _userId);

        // Assert
        result.Should().NotBeNull();
        task.DecisionNotes.Should().Contain("cfo.deputy@vanguard.io");
        task.DecisionNotes.Should().Contain("Delegated during CFO travel absence.");

        _taskRepoMock.Verify(r => r.Update(It.Is<TaskInstance>(t => t.Id == taskId)), Times.Once);
        _auditRepoMock.Verify(a => a.AppendEntryAsync(It.Is<AuditLedgerEntry>(entry =>
            entry.EventType == "TaskDelegated" &&
            entry.DetailsJson.Contains("cfo.deputy@vanguard.io")), It.IsAny<CancellationToken>()), Times.Once);
        _uowMock.Verify(u => u.CommitAsync(It.IsAny<CancellationToken>()), Times.Once);
    }

    [Fact]
    public async Task DelegateTaskAsync_TaskNotFound_ShouldThrowKeyNotFoundException()
    {
        // Arrange
        var nonExistentId = Guid.NewGuid();
        _taskRepoMock.Setup(r => r.GetByIdWithExecutionAsync(nonExistentId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((TaskInstance?)null);

        var request = new DelegateTaskRequestDto("deputy@vanguard.io", null);

        // Act & Assert
        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            _service.DelegateTaskAsync(nonExistentId, request, _userId));
    }

    [Fact]
    public async Task TaskService_OptimisticConcurrencyConflict_ShouldPropagateDbUpdateConcurrencyException()
    {
        // Arrange: simulate concurrent modification detected during SaveChanges/Commit
        var taskId = Guid.NewGuid();
        var execId = Guid.NewGuid();
        var task = CreateSampleTask(taskId, execId, TaskStatus.Pending);

        _taskRepoMock.Setup(r => r.GetByIdWithExecutionAsync(taskId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(task);

        _uowMock.Setup(u => u.CommitAsync(It.IsAny<CancellationToken>()))
            .ThrowsAsync(new DbUpdateConcurrencyException("Store update, insert, or delete statement affected 0 rows."));

        var request = new ApproveTaskRequestDto("Approve conflict", null);

        // Act & Assert
        await Assert.ThrowsAsync<DbUpdateConcurrencyException>(() =>
            _service.ApproveTaskAsync(taskId, request, _userId));

        // Moteur ne doit pas avoir avancé en cas de conflit de concurrence
        _engineMock.Verify(e => e.AdvanceWorkflowAsync(It.IsAny<Guid>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<CancellationToken>()), Times.Never);
    }

    [Fact]
    public async Task GetTasksAsync_ShouldReturnProjectedSummaries()
    {
        // Arrange
        var taskId = Guid.NewGuid();
        var execId = Guid.NewGuid();
        var task = CreateSampleTask(taskId, execId, TaskStatus.Pending);

        _taskRepoMock.Setup(r => r.GetAllAsync(null, null, null, null, It.IsAny<CancellationToken>()))
            .ReturnsAsync(new List<TaskInstance> { task });

        // Act
        var result = await _service.GetTasksAsync();

        // Assert
        result.Should().HaveCount(1);
        result[0].Id.Should().Be(taskId);
        result[0].WorkflowReferenceNumber.Should().Be("WF-9901");
        result[0].Priority.Should().Be("Urgent");
        result[0].Status.Should().Be(TaskStatus.Pending);
        result[0].SecondsRemaining.Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task GetTaskByIdAsync_ExistingTask_ShouldReturnDetail()
    {
        // Arrange
        var taskId = Guid.NewGuid();
        var execId = Guid.NewGuid();
        var task = CreateSampleTask(taskId, execId, TaskStatus.Pending);

        _taskRepoMock.Setup(r => r.GetByIdWithExecutionAsync(taskId, It.IsAny<CancellationToken>()))
            .ReturnsAsync(task);

        // Act
        var result = await _service.GetTaskByIdAsync(taskId);

        // Assert
        result.Should().NotBeNull();
        result!.Id.Should().Be(taskId);
        result.Title.Should().Be("Approve CapEx Expenditure");
    }

    [Fact]
    public async Task GetTaskByIdAsync_NonExistentTask_ShouldReturnNull()
    {
        // Arrange
        var nonExistentId = Guid.NewGuid();
        _taskRepoMock.Setup(r => r.GetByIdWithExecutionAsync(nonExistentId, It.IsAny<CancellationToken>()))
            .ReturnsAsync((TaskInstance?)null);

        // Act
        var result = await _service.GetTaskByIdAsync(nonExistentId);

        // Assert
        result.Should().BeNull();
    }

    // --- Validators Tests ---

    [Fact]
    public void RejectTaskRequestValidator_EmptyReason_ShouldFailValidation()
    {
        // Arrange
        var validator = new RejectTaskRequestValidator();
        var invalidDto = new RejectTaskRequestDto("", "ERR01");

        // Act
        var result = validator.Validate(invalidDto);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(RejectTaskRequestDto.RejectionReason));
    }

    [Fact]
    public void RejectTaskRequestValidator_ValidReason_ShouldPassValidation()
    {
        // Arrange
        var validator = new RejectTaskRequestValidator();
        var validDto = new RejectTaskRequestDto("Non-compliant with SOC2 criteria.", "SOC2_NON_COMPLIANT");

        // Act
        var result = validator.Validate(validDto);

        // Assert
        result.IsValid.Should().BeTrue();
    }

    [Fact]
    public void DelegateTaskRequestValidator_InvalidEmail_ShouldFailValidation()
    {
        // Arrange
        var validator = new DelegateTaskRequestValidator();
        var invalidDto = new DelegateTaskRequestDto("invalid-email-format", "Please review");

        // Act
        var result = validator.Validate(invalidDto);

        // Assert
        result.IsValid.Should().BeFalse();
        result.Errors.Should().Contain(e => e.PropertyName == nameof(DelegateTaskRequestDto.DelegateToUserEmail));
    }

    [Fact]
    public void DelegateTaskRequestValidator_ValidEmail_ShouldPassValidation()
    {
        // Arrange
        var validator = new DelegateTaskRequestValidator();
        var validDto = new DelegateTaskRequestDto("deputy.cfo@enterprise.org", "Urgent escalation review");

        // Act
        var result = validator.Validate(validDto);

        // Assert
        result.IsValid.Should().BeTrue();
    }
}
