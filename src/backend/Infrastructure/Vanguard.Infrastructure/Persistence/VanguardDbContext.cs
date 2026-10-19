using Microsoft.EntityFrameworkCore;
using Vanguard.Application.Common.Interfaces;
using Vanguard.Domain.Common;
using Vanguard.Domain.Entities.Audit;
using Vanguard.Domain.Entities.Engine;
using Vanguard.Domain.Entities.Identity;
using Vanguard.Domain.Entities.Tasks;
using Vanguard.Domain.Entities.Workflows;

namespace Vanguard.Infrastructure.Persistence;

public class VanguardDbContext : DbContext
{
    private readonly ICurrentTenantService _currentTenantService;

    public VanguardDbContext(
        DbContextOptions<VanguardDbContext> options,
        ICurrentTenantService currentTenantService) : base(options)
    {
        _currentTenantService = currentTenantService;
    }

    public DbSet<Tenant> Tenants => Set<Tenant>();
    public DbSet<User> Users => Set<User>();
    public DbSet<WorkflowDefinition> WorkflowDefinitions => Set<WorkflowDefinition>();
    public DbSet<WorkflowVersion> WorkflowVersions => Set<WorkflowVersion>();
    public DbSet<ExecutionInstance> ExecutionInstances => Set<ExecutionInstance>();
    public DbSet<ExecutionStepLog> ExecutionStepLogs => Set<ExecutionStepLog>();
    public DbSet<TaskInstance> TaskInstances => Set<TaskInstance>();
    public DbSet<AuditLedgerEntry> AuditLedgerEntries => Set<AuditLedgerEntry>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // --- Tenant ---
        modelBuilder.Entity<Tenant>(builder =>
        {
            builder.ToTable("tenants");
            builder.HasKey(t => t.Id);
            builder.Property(t => t.Name).HasMaxLength(200).IsRequired();
            builder.Property(t => t.Slug).HasMaxLength(100).IsRequired();
            builder.HasIndex(t => t.Slug).IsUnique();
            builder.HasQueryFilter(t => !t.IsDeleted);
        });

        // --- User ---
        modelBuilder.Entity<User>(builder =>
        {
            builder.ToTable("users");
            builder.HasKey(u => u.Id);
            builder.Property(u => u.Email).HasMaxLength(256).IsRequired();
            builder.Property(u => u.FullName).HasMaxLength(200).IsRequired();
            builder.Property(u => u.Role).HasConversion<string>().HasMaxLength(50);
            builder.HasIndex(u => new { u.TenantId, u.Email }).IsUnique();
            builder.HasQueryFilter(u => (!u.IsDeleted) && (_currentTenantService.TenantId == null || u.TenantId == _currentTenantService.TenantId));
        });

        // --- WorkflowDefinition ---
        modelBuilder.Entity<WorkflowDefinition>(builder =>
        {
            builder.ToTable("workflow_definitions");
            builder.HasKey(w => w.Id);
            builder.Property(w => w.Key).HasMaxLength(150).IsRequired();
            builder.Property(w => w.Title).HasMaxLength(300).IsRequired();
            builder.Property(w => w.Status).HasConversion<string>().HasMaxLength(50);
            builder.HasIndex(w => new { w.TenantId, w.Key }).IsUnique();
            builder.HasIndex(w => new { w.TenantId, w.Status });
            builder.HasQueryFilter(w => (!w.IsDeleted) && (_currentTenantService.TenantId == null || w.TenantId == _currentTenantService.TenantId));
        });

        // --- WorkflowVersion ---
        modelBuilder.Entity<WorkflowVersion>(builder =>
        {
            builder.ToTable("workflow_versions");
            builder.HasKey(v => v.Id);
            builder.Property(v => v.GraphDefinitionJson).HasColumnType("jsonb").IsRequired();
            builder.Property(v => v.HashSha256).HasMaxLength(64).IsRequired();
            builder.HasIndex(v => new { v.TenantId, v.WorkflowDefinitionId, v.VersionNumber }).IsUnique();
            builder.HasQueryFilter(v => _currentTenantService.TenantId == null || v.TenantId == _currentTenantService.TenantId);
        });

        // --- ExecutionInstance ---
        modelBuilder.Entity<ExecutionInstance>(builder =>
        {
            builder.ToTable("execution_instances");
            builder.HasKey(e => e.Id);
            builder.Property(e => e.ReferenceNumber).HasMaxLength(100).IsRequired();
            builder.Property(e => e.Status).HasConversion<string>().HasMaxLength(50);
            builder.Property(e => e.PayloadJson).HasColumnType("jsonb").IsRequired();
            builder.Property(e => e.RowVersion).IsRowVersion();
            builder.HasIndex(e => new { e.TenantId, e.ReferenceNumber }).IsUnique();
            builder.HasIndex(e => new { e.TenantId, e.Status, e.StartedAtUtc });
            builder.HasQueryFilter(e => _currentTenantService.TenantId == null || e.TenantId == _currentTenantService.TenantId);
        });

        // --- ExecutionStepLog ---
        modelBuilder.Entity<ExecutionStepLog>(builder =>
        {
            builder.ToTable("execution_step_logs");
            builder.HasKey(s => s.Id);
            builder.Property(s => s.InputPayloadJson).HasColumnType("jsonb");
            builder.Property(s => s.OutputPayloadJson).HasColumnType("jsonb");
            builder.HasIndex(s => new { s.TenantId, s.ExecutionInstanceId });
            builder.HasQueryFilter(s => _currentTenantService.TenantId == null || s.TenantId == _currentTenantService.TenantId);
        });

        // --- TaskInstance ---
        modelBuilder.Entity<TaskInstance>(builder =>
        {
            builder.ToTable("task_instances");
            builder.HasKey(t => t.Id);
            builder.Property(t => t.Title).HasMaxLength(300).IsRequired();
            builder.Property(t => t.Status).HasConversion<string>().HasMaxLength(50);
            builder.Property(t => t.RowVersion).IsRowVersion();
            builder.HasIndex(t => new { t.TenantId, t.Status, t.AssignedToUserId });
            builder.HasQueryFilter(t => _currentTenantService.TenantId == null || t.TenantId == _currentTenantService.TenantId);
        });

        // --- AuditLedgerEntry ---
        modelBuilder.Entity<AuditLedgerEntry>(builder =>
        {
            builder.ToTable("audit_ledger_entries");
            builder.HasKey(a => a.Id);
            builder.Property(a => a.EventType).HasMaxLength(100).IsRequired();
            builder.Property(a => a.DetailsJson).HasColumnType("jsonb");
            builder.Property(a => a.CurrentHashSha256).HasMaxLength(64).IsRequired();
            builder.Property(a => a.PreviousHashSha256).HasMaxLength(64).IsRequired();
            builder.HasIndex(a => new { a.TenantId, a.TimestampUtc });
            builder.HasQueryFilter(a => _currentTenantService.TenantId == null || a.TenantId == _currentTenantService.TenantId);
        });
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        foreach (var entry in ChangeTracker.Entries<BaseEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedAtUtc = DateTime.UtcNow;
                    if (entry.Entity is ITenantScoped tenantScoped && tenantScoped.TenantId == Guid.Empty && _currentTenantService.TenantId.HasValue)
                    {
                        tenantScoped.TenantId = _currentTenantService.TenantId.Value;
                    }
                    break;
                case EntityState.Modified:
                    entry.Entity.UpdatedAtUtc = DateTime.UtcNow;
                    break;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
