export interface ClusterMetrics {
  activeExecutionsCount: number;
  p99LatencyMs: number;
  p50LatencyMs: number;
  throughputStepsPerSec: number;
  failureErrorRatePercent: number;
  activeWorkerNodes: number;
  totalWorkerNodes: number;
  pendingRetriesCount: number;
  clusterStatus: string;
  uptimePercent: number;
}

export interface StageLatency {
  stageNumber: number;
  stageName: string;
  stageDescription: string;
  latencyMs: number;
  status: string;
  percentBudget: number;
}

export interface WorkerPool {
  poolName: string;
  region: string;
  provisionedNodes: number;
  cpuLoadPercent: number;
  ramUsagePercent: number;
  status: string;
  isElevated: boolean;
}

export interface LiveExecutionRow {
  instanceId: string;
  workflowTitle: string;
  workflowHash: string;
  currentStep: string;
  stepLatencyMs: number;
  totalDurationMs: number;
  workerNode: string;
  status: 'running' | 'retrying' | 'completed' | 'failed';
  startedTimeFormatted: string;
}
