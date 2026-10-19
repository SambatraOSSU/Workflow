export interface EngineSettings {
  defaultWorkflowTimeoutSeconds: number;
  maxConcurrencyPerTenant: number;
  automaticRetryEnabled: boolean;
  strictSlaBreachAlerting: boolean;
  signatureAlgorithm: string;
  hsmKeyRotationCadenceDays: number;
  merkleTreeBatchInterval: string;
  publicKeyEndpoint: string;
  stepUpMfaHighValueEnabled: boolean;
  mfaThresholdAmount: number;
  outOfOfficeRoutingEnabled: boolean;
  fourEyesPrincipleMandatory: boolean;
  clusterMode: string;
  clusterVersion: string;
  activeWorkers: number;
  maxWorkers: number;
  avgLatencyMs: number;
  availabilityZonesCount: number;
}

export interface ActionResult {
  success: boolean;
  message: string;
  auditLedgerId: string;
  executedAtUtc: string;
}
