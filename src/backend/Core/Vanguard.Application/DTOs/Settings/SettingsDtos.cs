namespace Vanguard.Application.DTOs.Settings;

public class EngineSettingsDto
{
    public int DefaultWorkflowTimeoutSeconds { get; set; } = 3600;
    public int MaxConcurrencyPerTenant { get; set; } = 2500;
    public bool AutomaticRetryEnabled { get; set; } = true;
    public bool StrictSlaBreachAlerting { get; set; } = true;
    public string SignatureAlgorithm { get; set; } = "Ed25519 (Recommended)";
    public int HsmKeyRotationCadenceDays { get; set; } = 90;
    public string MerkleTreeBatchInterval { get; set; } = "500ms Real-Time Consensus";
    public string PublicKeyEndpoint { get; set; } = "https://keys.vanguard.internal/v4/certs/vanguard-pub-key-2024-v4.pem";
    public bool StepUpMfaHighValueEnabled { get; set; } = true;
    public decimal MfaThresholdAmount { get; set; } = 50000.00m;
    public bool OutOfOfficeRoutingEnabled { get; set; } = true;
    public bool FourEyesPrincipleMandatory { get; set; } = true;
    
    // Cluster status
    public string ClusterMode { get; set; } = "Distributed Micro-Sharded";
    public string ClusterVersion { get; set; } = "v4.19.2";
    public int ActiveWorkers { get; set; } = 1842;
    public int MaxWorkers { get; set; } = 2500;
    public double AvgLatencyMs { get; set; } = 14.2;
    public int AvailabilityZonesCount { get; set; } = 4;
}

public class DangerZoneActionRequestDto
{
    public string ActionName { get; set; } = string.Empty;
    public string Justification { get; set; } = string.Empty;
}

public class ActionResultDto
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string AuditLedgerId { get; set; } = string.Empty;
    public DateTime ExecutedAtUtc { get; set; } = DateTime.UtcNow;
}
