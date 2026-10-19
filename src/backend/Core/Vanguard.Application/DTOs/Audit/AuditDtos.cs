namespace Vanguard.Application.DTOs.Audit;

public class AuditLedgerEntryDto
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid? ExecutionInstanceId { get; set; }
    public string EventType { get; set; } = string.Empty;
    public string ActorEmail { get; set; } = string.Empty;
    public string ActorRole { get; set; } = string.Empty;
    public string ActorInitials { get; set; } = string.Empty;
    public string DetailsJson { get; set; } = "{}";
    public string ResourceName { get; set; } = string.Empty;
    public string ResourceContext { get; set; } = string.Empty;
    public string PreviousHashSha256 { get; set; } = string.Empty;
    public string CurrentHashSha256 { get; set; } = string.Empty;
    public string ShortHash { get; set; } = string.Empty;
    public DateTime TimestampUtc { get; set; }
    public long BlockNumber { get; set; }
    public List<string> Frameworks { get; set; } = new();
    public bool IsVerified { get; set; }
    public string Status { get; set; } = "Verified";
}

public class AuditMetricsDto
{
    public long TotalLedgerEvents { get; set; } = 1842910;
    public double HashIntegrityPercent { get; set; } = 100.0;
    public int MerkleDepth { get; set; } = 24;
    public string MerkleRoot { get; set; } = "0x7f4b8a...c992";
    public int LastVerificationSecondsAgo { get; set; } = 32;
    public int SyncLatencyMs { get; set; } = 12;
    public double Sox404CompliancePercent { get; set; } = 100.0;
    public bool SoxDualSignoffActive { get; set; } = true;
    public int SoxBypassesIn90d { get; set; } = 0;
    public int PrivilegedActions24h { get; set; } = 14;
    public double MfaReauthPercent { get; set; } = 100.0;
    public int PolicyViolationsCount { get; set; } = 0;
    public int BlockedAtGateCount { get; set; } = 3;
}

public class ComplianceCertificateDto
{
    public string CertificateId { get; set; } = string.Empty;
    public string IssuedTo { get; set; } = "Vanguard Enterprise Engine";
    public DateTime IssuedAtUtc { get; set; } = DateTime.UtcNow;
    public string MerkleRoot { get; set; } = "0x7f4b8a4f912e6c88b20141a0279d01217e91ac992";
    public string Algorithm { get; set; } = "Ed25519 / SHA-512/256";
    public string AuditorSignature { get; set; } = string.Empty;
    public List<string> ComplianceFrameworks { get; set; } = new() { "SOX-404", "SOC-2 Type II", "GDPR Article 32", "HIPAA Security Rule" };
    public string Status { get; set; } = "Cryptographically Sealed & Active";
}
