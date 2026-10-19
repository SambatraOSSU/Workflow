export interface AuditLedgerEntry {
  id: string;
  tenantId: string;
  executionInstanceId?: string;
  eventType: string;
  actorEmail: string;
  actorRole: string;
  actorInitials: string;
  detailsJson: string;
  resourceName: string;
  resourceContext: string;
  previousHashSha256: string;
  currentHashSha256: string;
  shortHash: string;
  timestampUtc: string;
  blockNumber: number;
  frameworks: string[];
  isVerified: boolean;
  status: string;
}

export interface AuditMetrics {
  totalLedgerEvents: number;
  hashIntegrityPercent: number;
  merkleDepth: number;
  merkleRoot: string;
  lastVerificationSecondsAgo: number;
  syncLatencyMs: number;
  sox404CompliancePercent: number;
  soxDualSignoffActive: boolean;
  soxBypassesIn90d: number;
  privilegedActions24h: number;
  mfaReauthPercent: number;
  policyViolationsCount: number;
  blockedAtGateCount: number;
}

export interface ComplianceCertificate {
  certificateId: string;
  issuedTo: string;
  issuedAtUtc: string;
  merkleRoot: string;
  algorithm: string;
  auditorSignature: string;
  complianceFrameworks: string[];
  status: string;
}
