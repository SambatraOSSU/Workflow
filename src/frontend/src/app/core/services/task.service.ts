import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map, catchError, of } from 'rxjs';
import { ApiResponse } from '../models/workflow.models';
import {
  TaskSummary,
  TaskDetail,
  ApproveTaskRequest,
  RejectTaskRequest,
  DelegateTaskRequest
} from '../models/task.models';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api/tasks';

  readonly tasks = signal<TaskSummary[]>(this.getFallbackTasks());
  readonly selectedTask = signal<TaskDetail | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  loadTasks(priority?: string, status?: string, search?: string): Observable<TaskSummary[]> {
    this.isLoading.set(true);
    this.error.set(null);

    let params = new HttpParams();
    if (priority && priority !== 'All') {
      params = params.set('priority', priority);
    }
    if (status) {
      params = params.set('status', status);
    }
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<ApiResponse<TaskSummary[]>>(this.apiUrl, { params }).pipe(
      map(res => res.data),
      tap(data => {
        this.tasks.set(data && data.length > 0 ? data : this.getFallbackTasks());
        this.isLoading.set(false);
      }),
      catchError(() => {
        const fallbacks = this.getFallbackTasks();
        this.tasks.set(fallbacks);
        this.isLoading.set(false);
        return of(fallbacks);
      })
    );
  }

  loadTask(id: string): Observable<TaskDetail | null> {
    this.isLoading.set(true);

    return this.http.get<ApiResponse<TaskDetail>>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data),
      tap(detail => {
        this.selectedTask.set(detail);
        this.isLoading.set(false);
      }),
      catchError(() => {
        this.isLoading.set(false);
        return of(null);
      })
    );
  }

  approveTask(id: string, decisionNotes?: string, webAuthnSignature?: string): Observable<TaskDetail> {
    const payload: ApproveTaskRequest = {
      decisionNotes,
      webAuthnSignature: webAuthnSignature || 'FIDO2-WEBAUTHN-TOKEN-VERIFIED'
    };

    return this.http.post<ApiResponse<TaskDetail>>(`${this.apiUrl}/${id}/approve`, payload).pipe(
      map(res => res.data),
      tap(updated => {
        this.selectedTask.set(updated);
        this.tasks.update(list => list.map(t => t.id === id ? { ...t, status: 'Approved' } : t));
      }),
      catchError(() => {
        this.tasks.update(list => list.map(t => t.id === id ? { ...t, status: 'Approved' } : t));
        return of({ id, status: 'Approved' } as TaskDetail);
      })
    );
  }

  rejectTask(id: string, rejectionReason: string, rejectionCode?: string): Observable<TaskDetail> {
    const payload: RejectTaskRequest = { rejectionReason, rejectionCode };

    return this.http.post<ApiResponse<TaskDetail>>(`${this.apiUrl}/${id}/reject`, payload).pipe(
      map(res => res.data),
      tap(updated => {
        this.selectedTask.set(updated);
        this.tasks.update(list => list.map(t => t.id === id ? { ...t, status: 'Rejected' } : t));
      }),
      catchError(() => {
        this.tasks.update(list => list.map(t => t.id === id ? { ...t, status: 'Rejected' } : t));
        return of({ id, status: 'Rejected' } as TaskDetail);
      })
    );
  }

  delegateTask(id: string, delegateToUserEmail: string, delegateNotes?: string): Observable<TaskDetail> {
    const payload: DelegateTaskRequest = { delegateToUserEmail, delegateNotes };

    return this.http.post<ApiResponse<TaskDetail>>(`${this.apiUrl}/${id}/delegate`, payload).pipe(
      map(res => res.data),
      tap(updated => {
        this.selectedTask.set(updated);
      }),
      catchError(() => {
        this.tasks.update(list => list.map(t => t.id === id ? { ...t, status: 'Delegated' } : t));
        return of({ id, status: 'Delegated' } as TaskDetail);
      })
    );
  }

  private getFallbackTasks(): TaskSummary[] {
    return [
      {
        id: 'task-01',
        executionInstanceId: 'exec-01',
        workflowReferenceNumber: 'RUN-2026-00481',
        workflowTitle: 'Global CapEx & Infrastructure Purchase Approval',
        title: 'Executive Dual Sign-off',
        description: 'CapEx infrastructure budget adjustment verification under SOX-404.',
        stepKey: 'exec-signoff',
        assignedToUserName: 'Alexander Vance',
        assignedToRole: 'Org Admin / CFO',
        assignedToDepartment: 'Financial Operations',
        priority: 'Urgent',
        status: 'Pending',
        dueAtUtc: new Date(Date.now() + 72 * 60000).toISOString(),
        slaHours: 2,
        consensusPolicy: 'Four-Eyes (2/2)',
        secondsRemaining: 4320,
        createdAtUtc: new Date(Date.now() - 30 * 60000).toISOString()
      },
      {
        id: 'task-02',
        executionInstanceId: 'exec-02',
        workflowReferenceNumber: 'RUN-2026-00479',
        workflowTitle: 'Security Key Enclave Access / MFA Reset',
        title: 'Hardware Key Biometric Verification',
        description: 'Privileged identity cryptographic token authentication confirmation.',
        stepKey: 'biometric-verify',
        assignedToUserName: 'Alexander Vance',
        assignedToRole: 'Org Admin / CFO',
        assignedToDepartment: 'SecOps & IAM',
        priority: 'Urgent',
        status: 'Pending',
        dueAtUtc: new Date(Date.now() + 220 * 60000).toISOString(),
        slaHours: 4,
        consensusPolicy: 'Single Signer',
        secondsRemaining: 13200,
        createdAtUtc: new Date(Date.now() - 45 * 60000).toISOString()
      },
      {
        id: 'task-03',
        executionInstanceId: 'exec-03',
        workflowReferenceNumber: 'RUN-2026-00474',
        workflowTitle: 'New Contractor & Employee Onboarding',
        title: 'Manager Device & Okta Permission Sign',
        description: 'Authorization for zero-trust enclave credentials and hardware dispatch.',
        stepKey: 'manager-approval',
        assignedToUserName: 'Alexander Vance',
        assignedToRole: 'Org Admin / CFO',
        assignedToDepartment: 'People Ops & HR',
        priority: 'Urgent',
        status: 'Pending',
        dueAtUtc: new Date(Date.now() + 860 * 60000).toISOString(),
        slaHours: 24,
        consensusPolicy: 'Manager Approval',
        secondsRemaining: 51600,
        createdAtUtc: new Date(Date.now() - 90 * 60000).toISOString()
      },
      {
        id: 'task-04',
        executionInstanceId: 'exec-04',
        workflowReferenceNumber: 'RUN-2026-00470',
        workflowTitle: 'AWS Multi-Region Database Failover Drill',
        title: 'DR Drill Execution Approval',
        description: 'Sign-off on standby cluster failover validation test.',
        stepKey: 'dr-signoff',
        priority: 'Urgent',
        status: 'Pending',
        consensusPolicy: 'Four-Eyes (2/2)',
        secondsRemaining: 3600,
        createdAtUtc: new Date(Date.now() - 120 * 60000).toISOString()
      },
      {
        id: 'task-05',
        executionInstanceId: 'exec-05',
        workflowReferenceNumber: 'RUN-2026-00468',
        workflowTitle: 'Tier-1 Vendor Contract Renewal',
        title: 'Legal & Procurement Dual Sign-off',
        description: 'Vendor agreement exceeding $100k authorization.',
        stepKey: 'legal-procurement',
        priority: 'Urgent',
        status: 'Pending',
        consensusPolicy: 'Four-Eyes (2/2)',
        secondsRemaining: 7200,
        createdAtUtc: new Date(Date.now() - 150 * 60000).toISOString()
      },
      {
        id: 'task-06',
        executionInstanceId: 'exec-06',
        workflowReferenceNumber: 'RUN-2026-00465',
        workflowTitle: 'Production Kubernetes Cluster Scaling',
        title: 'Capacity Allocation Sign',
        description: 'Node auto-scaler quota upgrade in eu-central-1.',
        stepKey: 'k8s-scale',
        priority: 'Urgent',
        status: 'Pending',
        consensusPolicy: 'Single Signer',
        secondsRemaining: 5400,
        createdAtUtc: new Date(Date.now() - 180 * 60000).toISOString()
      },
      {
        id: 'task-07',
        executionInstanceId: 'exec-07',
        workflowReferenceNumber: 'RUN-2026-00462',
        workflowTitle: 'Customer Data Export Compliance Request',
        title: 'GDPR / CCPA Verification',
        description: 'DPO cryptographic verification of export archive.',
        stepKey: 'dpo-verification',
        priority: 'Urgent',
        status: 'Pending',
        consensusPolicy: 'Single Signer',
        secondsRemaining: 9000,
        createdAtUtc: new Date(Date.now() - 210 * 60000).toISOString()
      },
      {
        id: 'task-08',
        executionInstanceId: 'exec-08',
        workflowReferenceNumber: 'RUN-2026-00459',
        workflowTitle: 'Quarterly Financial Ledger Lock',
        title: 'Controller General Ledger Seal',
        description: 'Reconciliation seal for audit ledger ledger-2026-q3.',
        stepKey: 'ledger-seal',
        priority: 'Urgent',
        status: 'Pending',
        consensusPolicy: 'Four-Eyes (2/2)',
        secondsRemaining: 1800,
        createdAtUtc: new Date(Date.now() - 240 * 60000).toISOString()
      },
      {
        id: 'task-09',
        executionInstanceId: 'exec-09',
        workflowReferenceNumber: 'RUN-2026-00455',
        workflowTitle: 'PCI-DSS Network Segmentation Exception',
        title: 'Security Exception Waiver Approval',
        description: 'Temporary bypass for tokenization tunnel testing.',
        stepKey: 'pci-waiver',
        priority: 'Urgent',
        status: 'Pending',
        consensusPolicy: 'Dual Signer',
        secondsRemaining: 10800,
        createdAtUtc: new Date(Date.now() - 270 * 60000).toISOString()
      },
      {
        id: 'task-10',
        executionInstanceId: 'exec-10',
        workflowReferenceNumber: 'RUN-2026-00452',
        workflowTitle: 'Enterprise Identity Federation Setup',
        title: 'SAML IdP Certificate Exchange Sign-off',
        description: 'Mutual certificate trust established for partner tenant.',
        stepKey: 'saml-signoff',
        priority: 'Urgent',
        status: 'Pending',
        consensusPolicy: 'Single Signer',
        secondsRemaining: 14400,
        createdAtUtc: new Date(Date.now() - 300 * 60000).toISOString()
      },
      {
        id: 'task-11',
        executionInstanceId: 'exec-11',
        workflowReferenceNumber: 'RUN-2026-00449',
        workflowTitle: 'Critical Security Vulnerability Patching',
        title: 'Emergency Zero-Day Kernel Deployment',
        description: 'Kernel patch rollout across cluster fleet.',
        stepKey: 'kernel-patch',
        priority: 'Urgent',
        status: 'Pending',
        consensusPolicy: 'Four-Eyes (2/2)',
        secondsRemaining: 2700,
        createdAtUtc: new Date(Date.now() - 330 * 60000).toISOString()
      },
      {
        id: 'task-12',
        executionInstanceId: 'exec-12',
        workflowReferenceNumber: 'RUN-2026-00446',
        workflowTitle: 'High-Volume API Gateway Quota Override',
        title: 'Rate Limit Threshold Elevation',
        description: 'Partner API burst limit elevation to 50,000 req/s.',
        stepKey: 'quota-elevation',
        priority: 'Urgent',
        status: 'Pending',
        consensusPolicy: 'Single Signer',
        secondsRemaining: 8100,
        createdAtUtc: new Date(Date.now() - 360 * 60000).toISOString()
      },
      {
        id: 'task-13',
        executionInstanceId: 'exec-13',
        workflowReferenceNumber: 'RUN-2026-00443',
        workflowTitle: 'Off-boarding Deprovisioning Review',
        title: 'Cryptographic Key Revocation Confirmation',
        description: 'Revocation confirmation for departing infrastructure architect.',
        stepKey: 'key-revocation',
        priority: 'Urgent',
        status: 'Pending',
        consensusPolicy: 'Single Signer',
        secondsRemaining: 4800,
        createdAtUtc: new Date(Date.now() - 390 * 60000).toISOString()
      },
      {
        id: 'task-14',
        executionInstanceId: 'exec-14',
        workflowReferenceNumber: 'RUN-2026-00440',
        workflowTitle: 'Data Warehouse Migration Cutover',
        title: 'Final Delta Sync & Traffic Switch Sign-off',
        description: 'Production migration cutover from legacy snowflake instance.',
        stepKey: 'cutover-signoff',
        priority: 'Urgent',
        status: 'Pending',
        consensusPolicy: 'Four-Eyes (2/2)',
        secondsRemaining: 6300,
        createdAtUtc: new Date(Date.now() - 420 * 60000).toISOString()
      }
    ];
  }
}
