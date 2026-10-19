using System.Text.Json;
using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using Moq;
using Vanguard.Application.Common.Interfaces;
using Vanguard.Application.DTOs.Executions;
using Vanguard.Application.DTOs.Tasks;
using Vanguard.Application.DTOs.Workflows;
using Vanguard.Application.Interfaces;
using Vanguard.Application.Services;
using Vanguard.Domain.Entities.Audit;
using Vanguard.Domain.Entities.Engine;
using Vanguard.Domain.Entities.Identity;
using Vanguard.Domain.Entities.Tasks;
using Vanguard.Domain.Entities.Workflows;
using Vanguard.Infrastructure.Persistence;
using Vanguard.Infrastructure.Persistence.Repositories;
using Xunit;
using TaskStatus = Vanguard.Domain.Entities.Tasks.TaskStatus;

namespace Vanguard.Tests.Security;

public class TestCurrentTenantService : ICurrentTenantService
{
    public Guid? TenantId { get; set; }
    public string? TenantSlug { get; set; }

    public void SetTenant(Guid tenantId, string? slug = null)
    {
        TenantId = tenantId;
        TenantSlug = slug;
    }
}

public class MultiTenantIsolationTests
{
    private readonly Guid _tenantAId = Guid.Parse("11111111-1111-1111-1111-111111111111");
    private readonly Guid _tenantBId = Guid.Parse("22222222-2222-2222-2222-222222222222");

    private readonly Guid _userAId = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
    private readonly Guid _userBId = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");

    private VanguardDbContext CreateDbContext(string dbName, Guid? tenantId)
    {
        var tenantService = new TestCurrentTenantService { TenantId = tenantId };
        var options = new DbContextOptionsBuilder<VanguardDbContext>()
            .UseInMemoryDatabase(databaseName: dbName)
            .Options;

        return new VanguardDbContext(options, tenantService);
    }

    private async Task<(Guid workflowAId, Guid versionAId, Guid execAId, Guid taskAId, Guid workflowBId, Guid versionBId, Guid execBId, Guid taskBId)>
        SeedMultiTenantDatabaseAsync(string dbName)
    {
        // Use system context (tenantId = null) to seed data across both tenants
        using var context = CreateDbContext(dbName, null);

        var tenantA = new Tenant { Id = _tenantAId, Name = "Acme Corp", Slug = "acme" };
        var tenantB = new Tenant { Id = _tenantBId, Name = "Globex Inc", Slug = "globex" };
        context.Tenants.AddRange(tenantA, tenantB);

        var userA = new User { Id = _userAId, TenantId = _tenantAId, Email = "alice@acme.com", FullName = "Alice Acme", Role = UserRole.OrgAdmin };
        var userB = new User { Id = _userBId, TenantId = _tenantBId, Email = "bob@globex.com", FullName = "Bob Globex", Role = UserRole.OrgAdmin };
        context.Users.AddRange(userA, userB);

        var workflowA = new WorkflowDefinition
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantAId,
            Key = "wf-capex-approval",
            Title = "CapEx Approval Acme",
            Status = WorkflowStatus.Published,
            CurrentVersionNumber = 1
        };
        var graphJson = JsonSerializer.Serialize(new WorkflowGraphDto(
            Nodes: new List<WorkflowNodeDto>
            {
                new("trigger-1", "trigger", "webhook", "Trigger PO", null, new NodePositionDto(0, 0), null),
                new("task-1", "task", "approval", "VP Signoff", null, new NodePositionDto(100, 0), new NodeConfigDto(Prompt: "Approve")),
                new("end-1", "end", "slack", "Done", null, new NodePositionDto(200, 0), null)
            },
            Edges: new List<WorkflowEdgeDto>
            {
                new("e1", "trigger-1", "task-1", null, null, null),
                new("e2", "task-1", "end-1", null, null, null)
            }
        ));
        var versionA = new WorkflowVersion
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantAId,
            WorkflowDefinitionId = workflowA.Id,
            VersionNumber = 1,
            GraphDefinitionJson = graphJson,
            HashSha256 = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            IsActive = true
        };
        workflowA.Versions.Add(versionA);

        var execA = new ExecutionInstance
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantAId,
            WorkflowDefinitionId = workflowA.Id,
            WorkflowVersionId = versionA.Id,
            ReferenceNumber = "WF-ACME-001",
            Status = ExecutionStatus.Running,
            CurrentStepKey = "task-1",
            PayloadJson = "{\"amount\":80000}"
        };
        var stepLogA = new ExecutionStepLog
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantAId,
            ExecutionInstanceId = execA.Id,
            StepKey = "trigger-1",
            StepName = "Trigger PO",
            StepType = "Trigger",
            Status = "Succeeded"
        };
        var taskA = new TaskInstance
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantAId,
            ExecutionInstanceId = execA.Id,
            Title = "VP Signoff Acme",
            StepKey = "task-1",
            Status = TaskStatus.Pending,
            Priority = "Urgent"
        };
        var auditA = new AuditLedgerEntry
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantAId,
            ExecutionInstanceId = execA.Id,
            EventType = "ExecutionStarted",
            CurrentHashSha256 = "hash-a",
            PreviousHashSha256 = "genesis"
        };

        var workflowB = new WorkflowDefinition
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantBId,
            Key = "wf-vendor-onboarding",
            Title = "Vendor Onboarding Globex",
            Status = WorkflowStatus.Published,
            CurrentVersionNumber = 1
        };
        var versionB = new WorkflowVersion
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantBId,
            WorkflowDefinitionId = workflowB.Id,
            VersionNumber = 1,
            GraphDefinitionJson = graphJson,
            HashSha256 = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb",
            IsActive = true
        };
        workflowB.Versions.Add(versionB);

        var execB = new ExecutionInstance
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantBId,
            WorkflowDefinitionId = workflowB.Id,
            WorkflowVersionId = versionB.Id,
            ReferenceNumber = "WF-GLOBEX-001",
            Status = ExecutionStatus.Running,
            CurrentStepKey = "task-1",
            PayloadJson = "{\"vendor\":\"Globex\"}"
        };
        var stepLogB = new ExecutionStepLog
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantBId,
            ExecutionInstanceId = execB.Id,
            StepKey = "trigger-1",
            StepName = "Trigger PO",
            StepType = "Trigger",
            Status = "Succeeded"
        };
        var taskB = new TaskInstance
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantBId,
            ExecutionInstanceId = execB.Id,
            Title = "VP Signoff Globex",
            StepKey = "task-1",
            Status = TaskStatus.Pending,
            Priority = "High"
        };
        var auditB = new AuditLedgerEntry
        {
            Id = Guid.NewGuid(),
            TenantId = _tenantBId,
            ExecutionInstanceId = execB.Id,
            EventType = "ExecutionStarted",
            CurrentHashSha256 = "hash-b",
            PreviousHashSha256 = "genesis"
        };

        context.WorkflowDefinitions.AddRange(workflowA, workflowB);
        context.WorkflowVersions.AddRange(versionA, versionB);
        context.ExecutionInstances.AddRange(execA, execB);
        context.ExecutionStepLogs.AddRange(stepLogA, stepLogB);
        context.TaskInstances.AddRange(taskA, taskB);
        context.AuditLedgerEntries.AddRange(auditA, auditB);

        await context.SaveChangesAsync();

        return (workflowA.Id, versionA.Id, execA.Id, taskA.Id, workflowB.Id, versionB.Id, execB.Id, taskB.Id);
    }

    [Fact]
    public async Task QueryFilter_TenantAContext_CannotAccessTenantB_WorkflowsOrVersions()
    {
        // Arrange
        var dbName = Guid.NewGuid().ToString();
        var seed = await SeedMultiTenantDatabaseAsync(dbName);

        using var contextA = CreateDbContext(dbName, _tenantAId);

        // Act
        var workflows = await contextA.WorkflowDefinitions.ToListAsync();
        var versions = await contextA.WorkflowVersions.ToListAsync();
        var directAccessB = await contextA.WorkflowDefinitions.FirstOrDefaultAsync(w => w.Id == seed.workflowBId);
        var directVersionB = await contextA.WorkflowVersions.FirstOrDefaultAsync(v => v.Id == seed.versionBId);

        // Assert
        workflows.Should().HaveCount(1);
        workflows[0].TenantId.Should().Be(_tenantAId);
        workflows[0].Key.Should().Be("wf-capex-approval");

        versions.Should().HaveCount(1);
        versions[0].TenantId.Should().Be(_tenantAId);

        directAccessB.Should().BeNull("Tenant A should never be able to query Tenant B's workflow");
        directVersionB.Should().BeNull("Tenant A should never be able to query Tenant B's workflow version");
    }

    [Fact]
    public async Task QueryFilter_TenantBContext_CannotAccessTenantA_ExecutionsOrStepLogs()
    {
        // Arrange
        var dbName = Guid.NewGuid().ToString();
        var seed = await SeedMultiTenantDatabaseAsync(dbName);

        using var contextB = CreateDbContext(dbName, _tenantBId);

        // Act
        var executions = await contextB.ExecutionInstances.ToListAsync();
        var stepLogs = await contextB.ExecutionStepLogs.ToListAsync();
        var directExecA = await contextB.ExecutionInstances.FirstOrDefaultAsync(e => e.Id == seed.execAId);

        // Assert
        executions.Should().HaveCount(1);
        executions[0].TenantId.Should().Be(_tenantBId);
        executions[0].ReferenceNumber.Should().Be("WF-GLOBEX-001");

        stepLogs.Should().HaveCount(1);
        stepLogs[0].TenantId.Should().Be(_tenantBId);

        directExecA.Should().BeNull("Tenant B should never be able to query Tenant A's execution instance");
    }

    [Fact]
    public async Task QueryFilter_TenantAContext_CannotAccessTenantB_TaskInstances()
    {
        // Arrange
        var dbName = Guid.NewGuid().ToString();
        var seed = await SeedMultiTenantDatabaseAsync(dbName);

        using var contextA = CreateDbContext(dbName, _tenantAId);

        // Act
        var tasks = await contextA.TaskInstances.ToListAsync();
        var directTaskB = await contextA.TaskInstances.FirstOrDefaultAsync(t => t.Id == seed.taskBId);

        // Assert
        tasks.Should().HaveCount(1);
        tasks[0].TenantId.Should().Be(_tenantAId);
        tasks[0].Title.Should().Be("VP Signoff Acme");

        directTaskB.Should().BeNull("Tenant A should never be able to query Tenant B's task instance");
    }

    [Fact]
    public async Task QueryFilter_TenantBContext_CannotAccessTenantA_AuditLedgerEntries()
    {
        // Arrange
        var dbName = Guid.NewGuid().ToString();
        await SeedMultiTenantDatabaseAsync(dbName);

        using var contextB = CreateDbContext(dbName, _tenantBId);

        // Act
        var auditEntries = await contextB.AuditLedgerEntries.ToListAsync();

        // Assert
        auditEntries.Should().HaveCount(1);
        auditEntries[0].TenantId.Should().Be(_tenantBId);
        auditEntries.Should().NotContain(a => a.TenantId == _tenantAId);
    }

    [Fact]
    public async Task QueryFilter_TenantAContext_CannotAccessTenantB_Users()
    {
        // Arrange
        var dbName = Guid.NewGuid().ToString();
        await SeedMultiTenantDatabaseAsync(dbName);

        using var contextA = CreateDbContext(dbName, _tenantAId);

        // Act
        var users = await contextA.Users.ToListAsync();
        var userB = await contextA.Users.FirstOrDefaultAsync(u => u.Id == _userBId);

        // Assert
        users.Should().HaveCount(1);
        users[0].Email.Should().Be("alice@acme.com");
        userB.Should().BeNull("Tenant A context must not expose Tenant B users");
    }

    [Fact]
    public async Task QueryFilter_SuperAdmin_NullTenant_CanAccessAllTenants()
    {
        // Arrange
        var dbName = Guid.NewGuid().ToString();
        await SeedMultiTenantDatabaseAsync(dbName);

        using var superAdminContext = CreateDbContext(dbName, null);

        // Act
        var workflows = await superAdminContext.WorkflowDefinitions.ToListAsync();
        var executions = await superAdminContext.ExecutionInstances.ToListAsync();
        var tasks = await superAdminContext.TaskInstances.ToListAsync();

        // Assert
        workflows.Should().HaveCount(2);
        executions.Should().HaveCount(2);
        tasks.Should().HaveCount(2);
    }

    [Fact]
    public async Task QueryFilter_SoftDeletedWorkflow_IsHiddenEvenForSameTenant()
    {
        // Arrange
        var dbName = Guid.NewGuid().ToString();
        var seed = await SeedMultiTenantDatabaseAsync(dbName);

        using (var setupContext = CreateDbContext(dbName, null))
        {
            var wfA = await setupContext.WorkflowDefinitions.FirstAsync(w => w.Id == seed.workflowAId);
            wfA.IsDeleted = true;
            wfA.DeletedAtUtc = DateTime.UtcNow;
            await setupContext.SaveChangesAsync();
        }

        using var contextA = CreateDbContext(dbName, _tenantAId);

        // Act
        var workflows = await contextA.WorkflowDefinitions.ToListAsync();
        var directWf = await contextA.WorkflowDefinitions.FirstOrDefaultAsync(w => w.Id == seed.workflowAId);

        // Assert
        workflows.Should().BeEmpty();
        directWf.Should().BeNull();
    }

    [Fact]
    public async Task SaveChangesAsync_AutomaticallyAssignsCurrentTenantId_WhenEntityTenantIdIsEmpty()
    {
        // Arrange
        var dbName = Guid.NewGuid().ToString();
        using var contextA = CreateDbContext(dbName, _tenantAId);

        var newWf = new WorkflowDefinition
        {
            Id = Guid.NewGuid(),
            TenantId = Guid.Empty, // Not explicitly set
            Key = "wf-auto-tenant",
            Title = "Auto Tenant Workflow",
            Status = WorkflowStatus.Draft
        };

        // Act
        contextA.WorkflowDefinitions.Add(newWf);
        await contextA.SaveChangesAsync();

        // Assert
        newWf.TenantId.Should().Be(_tenantAId, "DbContext must auto-assign TenantId from ICurrentTenantService");
    }

    [Fact]
    public async Task Repositories_TenantIsolation_WorkflowRepository()
    {
        // Arrange
        var dbName = Guid.NewGuid().ToString();
        var seed = await SeedMultiTenantDatabaseAsync(dbName);

        using var contextB = CreateDbContext(dbName, _tenantBId);
        var repo = new WorkflowRepository(contextB);

        // Act
        var getByIdA = await repo.GetByIdAsync(seed.workflowAId);
        var getByIdWithVersionsA = await repo.GetByIdWithVersionsAsync(seed.workflowAId);
        var existsKeyA = await repo.ExistsKeyAsync("wf-capex-approval");
        var allB = await repo.GetAllAsync();

        // Assert
        getByIdA.Should().BeNull();
        getByIdWithVersionsA.Should().BeNull();
        existsKeyA.Should().BeFalse("Tenant B should not see Tenant A keys, allowing distinct tenant namespaces");
        allB.Should().HaveCount(1);
        allB[0].Id.Should().Be(seed.workflowBId);
    }

    [Fact]
    public async Task Repositories_TenantIsolation_ExecutionRepository()
    {
        // Arrange
        var dbName = Guid.NewGuid().ToString();
        var seed = await SeedMultiTenantDatabaseAsync(dbName);

        using var contextB = CreateDbContext(dbName, _tenantBId);
        var repo = new ExecutionRepository(contextB);

        // Act
        var getByIdA = await repo.GetByIdAsync(seed.execAId);
        var getByIdWithLogsA = await repo.GetByIdWithLogsAsync(seed.execAId);
        var allB = await repo.GetAllAsync();

        // Assert
        getByIdA.Should().BeNull();
        getByIdWithLogsA.Should().BeNull();
        allB.Should().HaveCount(1);
        allB[0].Id.Should().Be(seed.execBId);
    }

    [Fact]
    public async Task Repositories_TenantIsolation_TaskRepository()
    {
        // Arrange
        var dbName = Guid.NewGuid().ToString();
        var seed = await SeedMultiTenantDatabaseAsync(dbName);

        using var contextB = CreateDbContext(dbName, _tenantBId);
        var repo = new TaskRepository(contextB);

        // Act
        var getByIdA = await repo.GetByIdAsync(seed.taskAId);
        var getByIdWithExecutionA = await repo.GetByIdWithExecutionAsync(seed.taskAId);
        var allB = await repo.GetAllAsync();
        var pendingCountB = await repo.GetPendingTasksCountAsync();

        // Assert
        getByIdA.Should().BeNull();
        getByIdWithExecutionA.Should().BeNull();
        allB.Should().HaveCount(1);
        allB[0].Id.Should().Be(seed.taskBId);
        pendingCountB.Should().Be(1);
    }

    [Fact]
    public async Task EndToEnd_TenantB_CannotStartTenantA_Workflow()
    {
        // Arrange: Tenant B attempts to start execution of Tenant A's workflow
        var dbName = Guid.NewGuid().ToString();
        var seed = await SeedMultiTenantDatabaseAsync(dbName);

        using var contextB = CreateDbContext(dbName, _tenantBId);
        var tenantServiceB = new TestCurrentTenantService { TenantId = _tenantBId };
        var execRepo = new ExecutionRepository(contextB);
        var taskRepo = new TaskRepository(contextB);
        var wfRepo = new WorkflowRepository(contextB);
        var auditRepo = new AuditRepository(contextB);
        var uow = new UnitOfWork(contextB);

        var engine = new WorkflowEngine(execRepo, taskRepo, wfRepo, auditRepo, tenantServiceB, uow);

        var request = new StartExecutionRequestDto(seed.workflowAId, "Webhook", "{\"amount\":100}");

        // Act & Assert
        var ex = await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            engine.StartWorkflowAsync(request, _userBId));

        ex.Message.Should().Contain(seed.workflowAId.ToString());
    }

    [Fact]
    public async Task EndToEnd_TenantB_CannotApproveTenantA_Task()
    {
        // Arrange: Tenant B attempts to approve a task belonging to Tenant A
        var dbName = Guid.NewGuid().ToString();
        var seed = await SeedMultiTenantDatabaseAsync(dbName);

        using var contextB = CreateDbContext(dbName, _tenantBId);
        var tenantServiceB = new TestCurrentTenantService { TenantId = _tenantBId };
        var execRepo = new ExecutionRepository(contextB);
        var taskRepo = new TaskRepository(contextB);
        var wfRepo = new WorkflowRepository(contextB);
        var auditRepo = new AuditRepository(contextB);
        var uow = new UnitOfWork(contextB);
        var engine = new WorkflowEngine(execRepo, taskRepo, wfRepo, auditRepo, tenantServiceB, uow);

        var taskService = new TaskService(taskRepo, execRepo, engine, auditRepo, tenantServiceB, uow);

        var request = new ApproveTaskRequestDto("Tenant B unauthorized approval", null);

        // Act & Assert
        var ex = await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            taskService.ApproveTaskAsync(seed.taskAId, request, _userBId));

        ex.Message.Should().Contain(seed.taskAId.ToString());
    }

    [Fact]
    public async Task EndToEnd_TenantB_CannotRejectTenantA_Task()
    {
        // Arrange: Tenant B attempts to reject a task belonging to Tenant A
        var dbName = Guid.NewGuid().ToString();
        var seed = await SeedMultiTenantDatabaseAsync(dbName);

        using var contextB = CreateDbContext(dbName, _tenantBId);
        var tenantServiceB = new TestCurrentTenantService { TenantId = _tenantBId };
        var execRepo = new ExecutionRepository(contextB);
        var taskRepo = new TaskRepository(contextB);
        var wfRepo = new WorkflowRepository(contextB);
        var auditRepo = new AuditRepository(contextB);
        var uow = new UnitOfWork(contextB);
        var engine = new WorkflowEngine(execRepo, taskRepo, wfRepo, auditRepo, tenantServiceB, uow);

        var taskService = new TaskService(taskRepo, execRepo, engine, auditRepo, tenantServiceB, uow);

        var request = new RejectTaskRequestDto("Unauthorized reject", "SECURITY_ERR");

        // Act & Assert
        var ex = await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            taskService.RejectTaskAsync(seed.taskAId, request, _userBId));

        ex.Message.Should().Contain(seed.taskAId.ToString());
    }

    [Fact]
    public async Task EndToEnd_TenantB_CannotDelegateTenantA_Task()
    {
        // Arrange: Tenant B attempts to delegate a task belonging to Tenant A
        var dbName = Guid.NewGuid().ToString();
        var seed = await SeedMultiTenantDatabaseAsync(dbName);

        using var contextB = CreateDbContext(dbName, _tenantBId);
        var tenantServiceB = new TestCurrentTenantService { TenantId = _tenantBId };
        var execRepo = new ExecutionRepository(contextB);
        var taskRepo = new TaskRepository(contextB);
        var wfRepo = new WorkflowRepository(contextB);
        var auditRepo = new AuditRepository(contextB);
        var uow = new UnitOfWork(contextB);
        var engine = new WorkflowEngine(execRepo, taskRepo, wfRepo, auditRepo, tenantServiceB, uow);

        var taskService = new TaskService(taskRepo, execRepo, engine, auditRepo, tenantServiceB, uow);

        var request = new DelegateTaskRequestDto("delegated@globex.com", "Malicious delegation");

        // Act & Assert
        var ex = await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            taskService.DelegateTaskAsync(seed.taskAId, request, _userBId));

        ex.Message.Should().Contain(seed.taskAId.ToString());
    }

    [Fact]
    public async Task EndToEnd_TenantB_CannotUpdateOrPublishTenantA_Workflow()
    {
        // Arrange
        var dbName = Guid.NewGuid().ToString();
        var seed = await SeedMultiTenantDatabaseAsync(dbName);

        using var contextB = CreateDbContext(dbName, _tenantBId);
        var tenantServiceB = new TestCurrentTenantService { TenantId = _tenantBId };
        var wfRepo = new WorkflowRepository(contextB);
        var auditRepo = new AuditRepository(contextB);
        var validatorMock = new Mock<IGraphValidator>();
        var uow = new UnitOfWork(contextB);

        var wfService = new WorkflowService(wfRepo, auditRepo, validatorMock.Object, tenantServiceB, uow);

        // Act & Assert - Update
        var updateDto = new UpdateWorkflowRequestDto("Hacked Title", "Desc", "Finance", "General", WorkflowStatus.Draft);
        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            wfService.UpdateWorkflowAsync(seed.workflowAId, updateDto));

        // Act & Assert - Publish
        var publishDto = new PublishWorkflowVersionRequestDto("Hacked publish");
        await Assert.ThrowsAsync<KeyNotFoundException>(() =>
            wfService.PublishVersionAsync(seed.workflowAId, publishDto, _userBId));
    }
}
