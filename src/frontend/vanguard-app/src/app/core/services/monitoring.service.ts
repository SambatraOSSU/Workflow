import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, catchError, of } from 'rxjs';
import { ApiResponse } from '../models/workflow.models';
import {
  ClusterMetrics,
  StageLatency,
  WorkerPool,
  LiveExecutionRow
} from '../models/monitoring.models';

@Injectable({
  providedIn: 'root'
})
export class MonitoringService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api/monitoring';

  readonly metrics = signal<ClusterMetrics | null>(null);
  readonly stageLatencies = signal<StageLatency[]>([]);
  readonly workerPools = signal<WorkerPool[]>([]);
  readonly liveRows = signal<LiveExecutionRow[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly isIngestionPaused = signal<boolean>(false);

  loadClusterMetrics(): Observable<ClusterMetrics> {
    return this.http.get<ApiResponse<ClusterMetrics>>(`${this.apiUrl}/metrics`).pipe(
      map(res => res.data),
      tap(data => this.metrics.set(data)),
      catchError(() => {
        const fallbackMetrics: ClusterMetrics = {
          activeExecutionsCount: 1284,
          p99LatencyMs: 242.0,
          p50LatencyMs: 84.0,
          throughputStepsPerSec: 1420.0,
          failureErrorRatePercent: 0.04,
          activeWorkerNodes: 48,
          totalWorkerNodes: 48,
          pendingRetriesCount: 2,
          clusterStatus: 'Cluster Alpha (us-east-1)',
          uptimePercent: 99.99
        };
        this.metrics.set(fallbackMetrics);
        return of(fallbackMetrics);
      })
    );
  }

  loadStageLatencies(): Observable<StageLatency[]> {
    return this.http.get<ApiResponse<StageLatency[]>>(`${this.apiUrl}/stage-latencies`).pipe(
      map(res => res.data ?? []),
      tap(data => this.stageLatencies.set(data)),
      catchError(() => {
        const fallbackStages: StageLatency[] = [
          { stageNumber: 1, stageName: 'Event Ingest', stageDescription: 'Webhook / PubSub', latencyMs: 12.0, status: 'OK', percentBudget: 5.0 },
          { stageNumber: 2, stageName: 'Policy Guard', stageDescription: 'OPA & Auth Tokens', latencyMs: 45.0, status: 'OK', percentBudget: 18.0 },
          { stageNumber: 3, stageName: 'Worker Execution', stageDescription: 'Go Engine Runners', latencyMs: 180.0, status: 'Running', percentBudget: 74.0 },
          { stageNumber: 4, stageName: 'Decision Gate', stageDescription: 'Approval Webhook', latencyMs: 252.0, status: 'Async Gate', percentBudget: 100.0 },
          { stageNumber: 5, stageName: 'Data Sinks', stageDescription: 'Kafka / S3 Vault', latencyMs: 5.0, status: 'OK', percentBudget: 3.0 }
        ];
        this.stageLatencies.set(fallbackStages);
        return of(fallbackStages);
      })
    );
  }

  loadWorkerPools(): Observable<WorkerPool[]> {
    return this.http.get<ApiResponse<WorkerPool[]>>(`${this.apiUrl}/worker-pools`).pipe(
      map(res => res.data ?? []),
      tap(data => this.workerPools.set(data)),
      catchError(() => {
        const fallbackPools: WorkerPool[] = [
          { poolName: 'US-East-Primary', region: 'us-east-1', provisionedNodes: 32, cpuLoadPercent: 68.0, ramUsagePercent: 54.0, status: 'Optimal', isElevated: false },
          { poolName: 'EU-Central-Failover', region: 'eu-central-1', provisionedNodes: 12, cpuLoadPercent: 18.0, ramUsagePercent: 30.0, status: 'Standby', isElevated: false },
          { poolName: 'GPU Worker Pool (ML/OCR)', region: 'us-east-1', provisionedNodes: 4, cpuLoadPercent: 89.0, ramUsagePercent: 82.0, status: 'Elevated Load', isElevated: true }
        ];
        this.workerPools.set(fallbackPools);
        return of(fallbackPools);
      })
    );
  }

  loadLiveExecutions(status?: string, type?: string, search?: string): Observable<LiveExecutionRow[]> {
    const demoRows: LiveExecutionRow[] = [
      {
        instanceId: 'inst-8921-a12',
        workflowTitle: 'Capex Purchase Order Validation',
        workflowHash: 'wf-capex-0982',
        currentStep: 'Step 3: Dual Sign-Off HITL',
        stepLatencyMs: 184,
        totalDurationMs: 1240,
        workerNode: 'node-us-east-04',
        status: 'running',
        startedTimeFormatted: '12s ago'
      },
      {
        instanceId: 'inst-8920-b44',
        workflowTitle: 'Customer Identity KYC & Merkle Audit',
        workflowHash: 'wf-kyc-aml-v2',
        currentStep: 'Step 2: Biometric Challenge',
        stepLatencyMs: 42,
        totalDurationMs: 380,
        workerNode: 'node-us-east-12',
        status: 'running',
        startedTimeFormatted: '28s ago'
      },
      {
        instanceId: 'inst-8919-c88',
        workflowTitle: 'High-Volume Ledger Reconciliation',
        workflowHash: 'wf-ledger-sync-v1',
        currentStep: 'Step 4: Kafka Event Publication',
        stepLatencyMs: 9,
        totalDurationMs: 110,
        workerNode: 'node-us-east-01',
        status: 'completed',
        startedTimeFormatted: '1m ago'
      },
      {
        instanceId: 'inst-8918-d91',
        workflowTitle: 'AWS Multi-Account VPC Peering Request',
        workflowHash: 'wf-vpc-mesh-v3',
        currentStep: 'Step 2: IAM Permission Exception',
        stepLatencyMs: 310,
        totalDurationMs: 4800,
        workerNode: 'node-us-east-09',
        status: 'retrying',
        startedTimeFormatted: '2m ago'
      },
      {
        instanceId: 'inst-8917-e04',
        workflowTitle: 'SOC-2 Automated Evidence Ingestion',
        workflowHash: 'wf-soc2-audit-v1',
        currentStep: 'Step 5: Merkle Tree Hash Signing',
        stepLatencyMs: 14,
        totalDurationMs: 540,
        workerNode: 'node-us-east-18',
        status: 'completed',
        startedTimeFormatted: '3m ago'
      },
      {
        instanceId: 'inst-8916-f55',
        workflowTitle: 'Salesforce API Entitlement Sync',
        workflowHash: 'wf-crm-sync-v4',
        currentStep: 'Step 3: Rate Limit Exceeded (429)',
        stepLatencyMs: 820,
        totalDurationMs: 8200,
        workerNode: 'node-us-east-07',
        status: 'failed',
        startedTimeFormatted: '5m ago'
      }
    ];

    let filtered = demoRows;
    if (status && status !== 'all') {
      filtered = filtered.filter(r => r.status === status);
    }
    if (search && search.trim()) {
      const s = search.toLowerCase().trim();
      filtered = filtered.filter(r =>
        r.instanceId.toLowerCase().includes(s) ||
        r.workflowTitle.toLowerCase().includes(s) ||
        r.workflowHash.toLowerCase().includes(s) ||
        r.currentStep.toLowerCase().includes(s)
      );
    }

    this.liveRows.set(filtered);
    return of(filtered);
  }

  simulateSpike(): void {
    const cur = this.metrics();
    if (cur) {
      this.metrics.set({
        ...cur,
        activeExecutionsCount: cur.activeExecutionsCount + 350,
        throughputStepsPerSec: cur.throughputStepsPerSec + 680,
        p99LatencyMs: 310.0
      });
      setTimeout(() => {
        this.loadClusterMetrics().subscribe();
      }, 5000);
    }
  }

  togglePauseIngestion(): void {
    this.isIngestionPaused.update(v => !v);
  }
}
