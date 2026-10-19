using Vanguard.Application.DTOs.Requests;
using Vanguard.Application.Interfaces;
using Vanguard.Application.Interfaces.Persistence;
using Vanguard.Domain.Entities.Engine;

namespace Vanguard.Application.Services;

public class RequestHubService : IRequestHubService
{
    private readonly IExecutionRepository _executionRepository;

    // In-memory static store for demonstration seed items that dynamically combines with real executions
    private static readonly List<ServiceRequestDetailDto> SeedRequests = new()
    {
        new ServiceRequestDetailDto(
            Id: Guid.Parse("11111111-8891-4444-8888-000000000001"),
            RequestNumber: "#REQ-8891",
            Title: "AWS GPU Cluster for Deep Learning v4",
            WorkflowKey: "wf-cloud-provision-v2",
            RequesterName: "Devon Ramos",
            RequesterDepartment: "AI Platform",
            RequesterInitials: "DR",
            CurrentStage: "VP Finance Approval",
            CurrentOwner: "Alexander Vance",
            CurrentStepNumber: 3,
            TotalSteps: 5,
            EstimatedBudget: 12400.00m,
            RemainingTimeFormatted: "45m left",
            ProgressPercent: 60,
            Status: "In Review",
            CreatedAtUtc: DateTime.UtcNow.AddHours(-2),
            Timeline: new List<RequestTimelineStepDto>
            {
                new(1, "Request Submitted", "By Devon Ramos · Today at 08:32 AM", "Done", "08:32 AM"),
                new(2, "Architecture Policy Cleared", "Automated Sentinel static check PASSED · 08:34 AM", "Done", "08:34 AM"),
                new(3, "VP Finance Pending", "Assigned to: Alexander Vance (Org Admin)", "Active", "Pending"),
                new(4, "Automated Terraform Apply", "Runs on Worker pool `us-east-cluster-01`", "Future", "Upcoming"),
                new(5, "Cluster Live & Handover", "Kubeconfig injected into developer Vault secret", "Future", "Upcoming")
            },
            Parameters: new Dictionary<string, string>
            {
                { "Instance Type", "8x p4de.24xlarge" },
                { "Storage Volume", "20TB NVMe EBS GP3" },
                { "Region", "us-east-1 (N. Virginia)" },
                { "Auto-Shutdown", "Enabled (14 days idle)" }
            },
            AttachedDocuments: new List<AttachedDocumentDto>
            {
                new("AWS_Enterprise_Discount_Q3.pdf", "1.4 MB", "pdf"),
                new("Security_Impact_Assessment.pdf", "640 KB", "pdf")
            }
        ),
        new ServiceRequestDetailDto(
            Id: Guid.Parse("11111111-8884-4444-8888-000000000002"),
            RequestNumber: "#REQ-8884",
            Title: "Salesforce Enterprise 25-Seat Expansion",
            WorkflowKey: "wf-finance-po-v4",
            RequesterName: "Siddharth Kumar",
            RequesterDepartment: "Revenue Ops",
            RequesterInitials: "SK",
            CurrentStage: "Vendor Master Sync",
            CurrentOwner: "NetSuite Worker #08",
            CurrentStepNumber: 4,
            TotalSteps: 5,
            EstimatedBudget: 38500.00m,
            RemainingTimeFormatted: "3h 12m left",
            ProgressPercent: 80,
            Status: "In Progress",
            CreatedAtUtc: DateTime.UtcNow.AddHours(-5),
            Timeline: new List<RequestTimelineStepDto>
            {
                new(1, "Request Submitted", "By Siddharth Kumar", "Done", "05:10 AM"),
                new(2, "Budget Verification", "NetSuite ledger balance verified", "Done", "05:12 AM"),
                new(3, "CFO Digital Sign-Off", "Cryptographically sealed approval", "Done", "06:00 AM"),
                new(4, "Vendor Master Sync", "NetSuite Worker #08 sync in progress", "Active", "Current"),
                new(5, "License Provisioning", "Salesforce API user entitlement", "Future", "Upcoming")
            },
            Parameters: new Dictionary<string, string>
            {
                { "License Tier", "Enterprise Unlimited" },
                { "Seat Count", "25" },
                { "Department Code", "REV-402" }
            },
            AttachedDocuments: new List<AttachedDocumentDto>
            {
                new("Salesforce_Master_Order_Form.pdf", "890 KB", "pdf")
            }
        ),
        new ServiceRequestDetailDto(
            Id: Guid.Parse("11111111-8879-4444-8888-000000000003"),
            RequestNumber: "#REQ-8879",
            Title: "External Auditor Access Token (PwC SOC-2)",
            WorkflowKey: "wf-secops-key-v1",
            RequesterName: "Elena Rostova",
            RequesterDepartment: "InfoSec GRC",
            RequesterInitials: "EL",
            CurrentStage: "Token Generated",
            CurrentOwner: "HashiCorp Vault Pod",
            CurrentStepNumber: 4,
            TotalSteps: 4,
            EstimatedBudget: 0.00m,
            RemainingTimeFormatted: "Done",
            ProgressPercent: 100,
            Status: "Approved",
            CreatedAtUtc: DateTime.UtcNow.AddDays(-1),
            Timeline: new List<RequestTimelineStepDto>
            {
                new(1, "Request Submitted", "Elena Rostova for PwC Audit", "Done", "Yesterday"),
                new(2, "Security Lead Cleared", "Marcus Thorne authorized access", "Done", "Yesterday"),
                new(3, "Ephemeral Role Created", "Read-only access role initialized", "Done", "Yesterday"),
                new(4, "Token Generated", "HashiCorp Vault 24h lease active", "Done", "Yesterday")
            },
            Parameters: new Dictionary<string, string>
            {
                { "Auditor Firm", "PricewaterhouseCoopers (PwC)" },
                { "Scope", "SOC-2 Type II Control Evidence" },
                { "TTL", "24 Hours" }
            },
            AttachedDocuments: new List<AttachedDocumentDto>
            {
                new("PwC_Engagement_Letter.pdf", "2.1 MB", "pdf")
            }
        ),
        new ServiceRequestDetailDto(
            Id: Guid.Parse("11111111-8871-4444-8888-000000000004"),
            RequestNumber: "#REQ-8871",
            Title: "SOC-2 Compliance Snapshot Bucket Ingestion",
            WorkflowKey: "wf-secops-audit-v3",
            RequesterName: "Marcus Thorne",
            RequesterDepartment: "Cloud Reliability",
            RequesterInitials: "MT",
            CurrentStage: "IAM Policy Conflict",
            CurrentOwner: "Escalated to SecLead",
            CurrentStepNumber: 2,
            TotalSteps: 6,
            EstimatedBudget: 5000.00m,
            RemainingTimeFormatted: "+14m Breached",
            ProgressPercent: 35,
            Status: "Escalated",
            CreatedAtUtc: DateTime.UtcNow.AddHours(-8),
            Timeline: new List<RequestTimelineStepDto>
            {
                new(1, "Request Submitted", "Marcus Thorne", "Done", "01:00 AM"),
                new(2, "IAM Policy Conflict", "Escalated to SecLead due to bucket cross-account policy", "Active", "Escalated"),
                new(3, "Manual Exception Review", "Pending CISO approval", "Future", "Upcoming"),
                new(4, "KMS Encryption Policy Binding", "AWS KMS Key grant", "Future", "Upcoming"),
                new(5, "Snapshot Sync", "Data Transfer Job", "Future", "Upcoming"),
                new(6, "Audit Attestation", "Merkle tree root signature", "Future", "Upcoming")
            },
            Parameters: new Dictionary<string, string>
            {
                { "Source Bucket", "s3://vanguard-audit-archive-us-east-1" },
                { "Target Enclave", "Secure Audit Vault Vault-09" }
            },
            AttachedDocuments: new List<AttachedDocumentDto>()
        )
    };

    public RequestHubService(IExecutionRepository executionRepository)
    {
        _executionRepository = executionRepository;
    }

    public Task<List<CatalogTemplateDto>> GetCatalogTemplatesAsync(CancellationToken cancellationToken = default)
    {
        var templates = new List<CatalogTemplateDto>
        {
            new("cloud-alloc", "Enterprise Cloud Resource Allocation", "IT Ops & Cloud", "Self-serve multi-tenant VPC instances, high-memory GPU nodes, and transient sandbox clusters.", "SLA: 2h", "Auto-approved <$5k", 12400.00m, "cloud"),
            new("capex-po", "Capex & PO Procurement > $10,000", "Finance & Accounting", "Automated dual-signature verification, NetSuite purchase order routing, and vendor tax validations.", "SLA: 24h", "Multi-signature", 124500.00m, "credit_card"),
            new("secops-mfa", "Security Key Enclave Access / MFA Reset", "SecOps & IAM", "Hardware token credential cycling, biometric identity re-challenge, and HashiCorp Vault cert issuance.", "SLA: 15m", "Ephemeral lease", 0.00m, "lock"),
            new("onboarding-hr", "New Contractor & Employee Onboarding", "People Ops & HR", "Complete automated lifecycle provisioning for Google Workspace, Okta groups, GitHub, and Slack.", "SLA: 48h", "Bundle pack", 2500.00m, "group_add")
        };

        return Task.FromResult(templates);
    }

    public Task<List<ServiceRequestSummaryDto>> GetRequestsAsync(string? status, string? department, string? search, CancellationToken cancellationToken = default)
    {
        lock (SeedRequests)
        {
            var query = SeedRequests.AsEnumerable();

            if (!string.IsNullOrWhiteSpace(status) && !status.Equals("All", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(r => r.Status.Equals(status, StringComparison.OrdinalIgnoreCase) ||
                                         (status == "InReview" && r.Status == "In Review") ||
                                         (status == "InProgress" && r.Status == "In Progress"));
            }

            if (!string.IsNullOrWhiteSpace(department) && !department.Equals("All Departments", StringComparison.OrdinalIgnoreCase))
            {
                query = query.Where(r => r.RequesterDepartment.Contains(department, StringComparison.OrdinalIgnoreCase));
            }

            if (!string.IsNullOrWhiteSpace(search))
            {
                var s = search.Trim();
                query = query.Where(r => r.RequestNumber.Contains(s, StringComparison.OrdinalIgnoreCase) ||
                                         r.Title.Contains(s, StringComparison.OrdinalIgnoreCase) ||
                                         r.RequesterName.Contains(s, StringComparison.OrdinalIgnoreCase) ||
                                         r.WorkflowKey.Contains(s, StringComparison.OrdinalIgnoreCase));
            }

            var summaries = query.Select(r => new ServiceRequestSummaryDto(
                r.Id,
                r.RequestNumber,
                r.Title,
                r.WorkflowKey,
                r.RequesterName,
                r.RequesterDepartment,
                r.RequesterInitials,
                r.CurrentStage,
                r.CurrentOwner,
                r.CurrentStepNumber,
                r.TotalSteps,
                r.EstimatedBudget,
                r.RemainingTimeFormatted,
                r.ProgressPercent,
                r.Status,
                r.CreatedAtUtc
            )).ToList();

            return Task.FromResult(summaries);
        }
    }

    public Task<ServiceRequestDetailDto?> GetRequestByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        lock (SeedRequests)
        {
            var item = SeedRequests.FirstOrDefault(r => r.Id == id);
            return Task.FromResult(item);
        }
    }

    public Task<ServiceRequestSummaryDto> SubmitRequestAsync(SubmitCatalogRequestDto request, Guid? userId, CancellationToken cancellationToken = default)
    {
        var id = Guid.NewGuid();
        var num = $"#REQ-{new Random().Next(8900, 9999)}";
        var initials = !string.IsNullOrWhiteSpace(request.Department) && request.Department.Length >= 2
            ? request.Department[..2].ToUpperInvariant()
            : "AV";

        var newDetail = new ServiceRequestDetailDto(
            Id: id,
            RequestNumber: num,
            Title: request.Title,
            WorkflowKey: $"wf-{request.TemplateId}-v1",
            RequesterName: "Alexander Vance",
            RequesterDepartment: request.Department,
            RequesterInitials: initials,
            CurrentStage: "Automated Policy Evaluation",
            CurrentOwner: "System Engine",
            CurrentStepNumber: 1,
            TotalSteps: 5,
            EstimatedBudget: request.EstimatedBudget,
            RemainingTimeFormatted: "2h left",
            ProgressPercent: 20,
            Status: "In Progress",
            CreatedAtUtc: DateTime.UtcNow,
            Timeline: new List<RequestTimelineStepDto>
            {
                new(1, "Request Submitted", "Via Enterprise Catalog", "Done", DateTime.UtcNow.ToString("HH:mm")),
                new(2, "Automated Policy Evaluation", "Roslyn engine running checks", "Active", "Current"),
                new(3, "Dual Sign-off HITL", "Waiting for manager review", "Future", "Upcoming"),
                new(4, "Provisioning & Integration", "External cloud execution", "Future", "Upcoming"),
                new(5, "Delivery & Closure", "Handover to requester", "Future", "Upcoming")
            },
            Parameters: request.Parameters,
            AttachedDocuments: new List<AttachedDocumentDto>()
        );

        lock (SeedRequests)
        {
            SeedRequests.Insert(0, newDetail);
        }

        var summary = new ServiceRequestSummaryDto(
            newDetail.Id,
            newDetail.RequestNumber,
            newDetail.Title,
            newDetail.WorkflowKey,
            newDetail.RequesterName,
            newDetail.RequesterDepartment,
            newDetail.RequesterInitials,
            newDetail.CurrentStage,
            newDetail.CurrentOwner,
            newDetail.CurrentStepNumber,
            newDetail.TotalSteps,
            newDetail.EstimatedBudget,
            newDetail.RemainingTimeFormatted,
            newDetail.ProgressPercent,
            newDetail.Status,
            newDetail.CreatedAtUtc
        );

        return Task.FromResult(summary);
    }

    public Task<bool> ExpediteSlaAsync(Guid id, CancellationToken cancellationToken = default)
    {
        lock (SeedRequests)
        {
            var idx = SeedRequests.FindIndex(r => r.Id == id);
            if (idx == -1) return Task.FromResult(false);

            var curr = SeedRequests[idx];
            SeedRequests[idx] = curr with
            {
                RemainingTimeFormatted = "15m left (Expedited)",
                Status = "In Review"
            };

            return Task.FromResult(true);
        }
    }

    public Task<bool> RejectRequestAsync(Guid id, string reason, CancellationToken cancellationToken = default)
    {
        lock (SeedRequests)
        {
            var idx = SeedRequests.FindIndex(r => r.Id == id);
            if (idx == -1) return Task.FromResult(false);

            var curr = SeedRequests[idx];
            SeedRequests[idx] = curr with
            {
                Status = "Rejected",
                CurrentStage = $"Rejected: {reason}",
                RemainingTimeFormatted = "Cancelled"
            };

            return Task.FromResult(true);
        }
    }
}
