using Microsoft.EntityFrameworkCore;
using Vanguard.Application.Interfaces;
using Vanguard.Domain.Entities.Audit;
using Vanguard.Domain.Entities.Engine;
using Vanguard.Domain.Entities.Identity;
using Vanguard.Domain.Entities.Tasks;
using Vanguard.Domain.Entities.Workflows;
using TaskStatus = Vanguard.Domain.Entities.Tasks.TaskStatus;

namespace Vanguard.Infrastructure.Persistence;

public static class DbInitializer
{
    public static async Task SeedAsync(VanguardDbContext context, IPasswordHasher passwordHasher)
    {
        // Si le tenant Vanguard HQ existe déjà, les données de base sont déjà présentes
        if (await context.Tenants.IgnoreQueryFilters().AnyAsync(t => t.Slug == "vanguard-hq"))
        {
            return;
        }

        var defaultPassword = passwordHasher.HashPassword("Password123!");

        // 1. Tenant Principal
        var tenant = new Tenant
        {
            Id = Guid.Parse("11111111-1111-1111-1111-111111111111"),
            Name = "Vanguard HQ",
            Slug = "vanguard-hq",
            ClusterRegion = "us-east-1",
            IsActive = true
        };
        await context.Tenants.AddAsync(tenant);

        // 2. Utilisateurs clés des personas Vanguard
        var adminUser = new User
        {
            Id = Guid.Parse("22222222-2222-2222-2222-222222222222"),
            TenantId = tenant.Id,
            Email = "alexander.vance@vanguard.io",
            FullName = "Alexander Vance",
            Role = UserRole.OrgAdmin,
            Department = "Executive / CFO",
            PasswordHash = defaultPassword,
            IsActive = true
        };

        var securityUser = new User
        {
            Id = Guid.Parse("33333333-3333-3333-3333-333333333333"),
            TenantId = tenant.Id,
            Email = "sarah.chen@vanguard.io",
            FullName = "Sarah Chen",
            Role = UserRole.Manager,
            Department = "VP InfoSec / CISO",
            PasswordHash = defaultPassword,
            IsActive = true
        };

        var designerUser = new User
        {
            Id = Guid.Parse("44444444-4444-4444-4444-444444444444"),
            TenantId = tenant.Id,
            Email = "designer@vanguard.io",
            FullName = "Elena Rostova",
            Role = UserRole.WorkflowDesigner,
            Department = "Platform Engineering",
            PasswordHash = defaultPassword,
            IsActive = true
        };

        var auditorUser = new User
        {
            Id = Guid.Parse("55555555-5555-5555-5555-555555555555"),
            TenantId = tenant.Id,
            Email = "auditor@vanguard.io",
            FullName = "Marcus Brody",
            Role = UserRole.Auditor,
            Department = "Risk & Compliance",
            PasswordHash = defaultPassword,
            IsActive = true
        };

        await context.Users.AddRangeAsync(adminUser, securityUser, designerUser, auditorUser);

        // 3. Définitions de Workflows (référencées dans les maquettes)
        var capexWorkflow = new WorkflowDefinition
        {
            Id = Guid.Parse("66666666-6666-6666-6666-666666666666"),
            TenantId = tenant.Id,
            Key = "wf-enterprise-capex-approval-v3",
            Title = "Global CapEx & Infrastructure Purchase Approval",
            Description = "Capital expenditure approval for Tier-4 cluster upgrades. Double signature mandatory under policy FIN-SEC-2024.",
            Department = "Financial Operations",
            Category = "Finance & Accounting",
            CurrentVersionNumber = 3,
            Status = WorkflowStatus.Published,
            IsActive = true
        };

        var cloudAllocWorkflow = new WorkflowDefinition
        {
            Id = Guid.NewGuid(),
            TenantId = tenant.Id,
            Key = "wf-cloud-resource-alloc",
            Title = "Enterprise Cloud Resource Allocation",
            Description = "Self-serve multi-tenant VPC instances, high-memory GPU nodes, and transient sandbox clusters.",
            Department = "IT Ops & Cloud",
            Category = "IT Ops & Cloud",
            CurrentVersionNumber = 1,
            Status = WorkflowStatus.Published,
            IsActive = true
        };

        var mfaWorkflow = new WorkflowDefinition
        {
            Id = Guid.NewGuid(),
            TenantId = tenant.Id,
            Key = "wf-security-key-mfa",
            Title = "Security Key Enclave Access / MFA Reset",
            Description = "Hardware token credential cycling, biometric identity re-challenge, and HashiCorp Vault cert issuance.",
            Department = "SecOps & IAM",
            Category = "SecOps & IAM",
            CurrentVersionNumber = 1,
            Status = WorkflowStatus.Published,
            IsActive = true
        };

        var onboardingWorkflow = new WorkflowDefinition
        {
            Id = Guid.NewGuid(),
            TenantId = tenant.Id,
            Key = "wf-onboarding-lifecycle",
            Title = "New Contractor & Employee Onboarding",
            Description = "Complete automated lifecycle provisioning for Google Workspace, Okta groups, GitHub, and Slack.",
            Department = "People Ops & HR",
            Category = "People Ops & HR",
            CurrentVersionNumber = 1,
            Status = WorkflowStatus.Published,
            IsActive = true
        };

        await context.WorkflowDefinitions.AddRangeAsync(capexWorkflow, cloudAllocWorkflow, mfaWorkflow, onboardingWorkflow);

        // Version immuable du workflow CapEx
        var capexVersion = new WorkflowVersion
        {
            Id = Guid.NewGuid(),
            TenantId = tenant.Id,
            WorkflowDefinitionId = capexWorkflow.Id,
            VersionNumber = 3,
            GraphDefinitionJson = "{\"nodes\":[{\"id\":\"node-1\",\"type\":\"trigger\",\"label\":\"Webhook Ingest\"},{\"id\":\"node-2\",\"type\":\"approval\",\"label\":\"Executive Dual Sign-off\"},{\"id\":\"node-3\",\"type\":\"integration\",\"label\":\"SAP S/4HANA PO Sync\"},{\"id\":\"node-4\",\"type\":\"end\",\"label\":\"Completed\"}],\"edges\":[{\"from\":\"node-1\",\"to\":\"node-2\"},{\"from\":\"node-2\",\"to\":\"node-3\"},{\"from\":\"node-3\",\"to\":\"node-4\"}]}",
            HashSha256 = "7f4b8a8b1c992c63f112e45781a93b4f65c19985a213e4b7c6f0928e145b98a1",
            IsActive = true,
            PublishedAtUtc = DateTime.UtcNow.AddDays(-7),
            PublishedByUserId = designerUser.Id
        };
        await context.WorkflowVersions.AddAsync(capexVersion);

        // 4. Instance d'exécution & Tâche d'approbation (correspondant à l'écran Tasks / Approvals)
        var executionInstance = new ExecutionInstance
        {
            Id = Guid.NewGuid(),
            TenantId = tenant.Id,
            WorkflowDefinitionId = capexWorkflow.Id,
            WorkflowVersionId = capexVersion.Id,
            ReferenceNumber = "RUN-2026-00481",
            Status = ExecutionStatus.Running,
            CurrentStepKey = "node-2",
            PayloadJson = "{\"amount\":124500.00,\"currency\":\"USD\",\"department\":\"Tier-4 Infrastructure Upgrade\",\"vendor\":\"Supermicro Corp\"}",
            StartedAtUtc = DateTime.UtcNow.AddHours(-3),
            TriggerSource = "Webhook",
            InitiatorUserId = adminUser.Id
        };
        await context.ExecutionInstances.AddAsync(executionInstance);

        var urgentTask = new TaskInstance
        {
            Id = Guid.NewGuid(),
            TenantId = tenant.Id,
            ExecutionInstanceId = executionInstance.Id,
            Title = "VP Finance & CISO Dual Sign-off",
            Description = "Capital expenditure approval for Tier-4 cluster upgrade ($124,500.00). Double signature mandatory under policy FIN-SEC-2024.",
            StepKey = "node-2",
            Priority = "Urgent",
            Status = TaskStatus.Pending,
            ConsensusPolicy = "FourEyes",
            AssignedToUserId = adminUser.Id,
            AssignedToRole = "OrgAdmin",
            AssignedToDepartment = "Executive / CFO",
            SlaHours = 4,
            DueAtUtc = DateTime.UtcNow.AddHours(1)
        };
        await context.TaskInstances.AddAsync(urgentTask);

        // 5. Registre d'audit scellé (correspondant à Audit Center)
        var auditEntry = new AuditLedgerEntry
        {
            Id = Guid.NewGuid(),
            TenantId = tenant.Id,
            ExecutionInstanceId = executionInstance.Id,
            EventType = "WorkflowInitiated",
            ActorEmail = adminUser.Email,
            ActorRole = adminUser.Role.ToString(),
            DetailsJson = "{\"reference\":\"RUN-2026-00481\",\"policy\":\"SOX-404\",\"trigger\":\"Webhook Ingest\"}",
            PreviousHashSha256 = "0000000000000000000000000000000000000000000000000000000000000000",
            CurrentHashSha256 = "7f4b8a8b1c992c63f112e45781a93b4f65c19985a213e4b7c6f0928e145b98a1",
            TimestampUtc = DateTime.UtcNow.AddHours(-3),
            IsVerified = true
        };
        await context.AuditLedgerEntries.AddAsync(auditEntry);

        await context.SaveChangesAsync();
    }
}
