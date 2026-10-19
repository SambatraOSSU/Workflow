import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map, catchError, of } from 'rxjs';
import { ApiResponse } from '../models/workflow.models';
import {
  CatalogTemplate,
  ServiceRequestSummary,
  ServiceRequestDetail,
  SubmitCatalogRequest
} from '../models/request.models';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api/requests';

  readonly templates = signal<CatalogTemplate[]>([]);
  readonly requests = signal<ServiceRequestSummary[]>([]);
  readonly selectedRequest = signal<ServiceRequestDetail | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  loadTemplates(): Observable<CatalogTemplate[]> {
    return this.http.get<ApiResponse<CatalogTemplate[]>>(`${this.apiUrl}/templates`).pipe(
      map(res => res.data ?? []),
      tap(data => this.templates.set(data)),
      catchError(() => {
        // Fallback demo templates
        const demoTemplates: CatalogTemplate[] = [
          {
            templateId: 'cloud-alloc',
            title: 'Enterprise Cloud Resource Allocation',
            category: 'IT Ops & Cloud',
            description: 'Self-serve multi-tenant VPC instances, high-memory GPU nodes, and transient sandbox clusters.',
            targetSla: 'SLA: 2h',
            badge: 'Auto-approved <$5k',
            defaultBudget: 12400.0,
            icon: 'cloud'
          },
          {
            templateId: 'capex-po',
            title: 'Capex & PO Procurement > $10,000',
            category: 'Finance & Accounting',
            description: 'Automated dual-signature verification, NetSuite purchase order routing, and vendor tax validations.',
            targetSla: 'SLA: 24h',
            badge: 'Multi-signature',
            defaultBudget: 124500.0,
            icon: 'credit_card'
          },
          {
            templateId: 'secops-mfa',
            title: 'Security Key Enclave Access / MFA Reset',
            category: 'SecOps & IAM',
            description: 'Hardware token credential cycling, biometric identity re-challenge, and HashiCorp Vault cert issuance.',
            targetSla: 'SLA: 15m',
            badge: 'Ephemeral lease',
            defaultBudget: 0.0,
            icon: 'lock'
          },
          {
            templateId: 'onboarding-hr',
            title: 'New Contractor & Employee Onboarding',
            category: 'People Ops & HR',
            description: 'Complete automated lifecycle provisioning for Google Workspace, Okta groups, GitHub, and Slack.',
            targetSla: 'SLA: 48h',
            badge: 'Bundle pack',
            defaultBudget: 2500.0,
            icon: 'group_add'
          }
        ];
        this.templates.set(demoTemplates);
        return of(demoTemplates);
      })
    );
  }

  loadRequests(status?: string, department?: string, search?: string): Observable<ServiceRequestSummary[]> {
    this.isLoading.set(true);
    this.error.set(null);

    let params = new HttpParams();
    if (status && status !== 'All') {
      params = params.set('status', status);
    }
    if (department && department !== 'All Departments') {
      params = params.set('department', department);
    }
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<ApiResponse<ServiceRequestSummary[]>>(this.apiUrl, { params }).pipe(
      map(res => res.data ?? []),
      tap(data => {
        this.requests.set(data);
        this.isLoading.set(false);
      }),
      catchError(() => {
        // Fallback demo requests matching mockup
        const demoRequests: ServiceRequestSummary[] = [
          {
            id: '11111111-8891-4444-8888-000000000001',
            requestNumber: '#REQ-8891',
            title: 'AWS GPU Cluster for Deep Learning v4',
            workflowKey: 'wf-cloud-provision-v2',
            requesterName: 'Devon Ramos',
            requesterDepartment: 'AI Platform',
            requesterInitials: 'DR',
            currentStage: 'VP Finance Approval',
            currentOwner: 'Alexander Vance',
            currentStepNumber: 3,
            totalSteps: 5,
            estimatedBudget: 12400.0,
            remainingTimeFormatted: '45m left',
            progressPercent: 60,
            status: 'In Review',
            createdAtUtc: new Date().toISOString()
          },
          {
            id: '11111111-8884-4444-8888-000000000002',
            requestNumber: '#REQ-8884',
            title: 'Salesforce Enterprise 25-Seat Expansion',
            workflowKey: 'wf-finance-po-v4',
            requesterName: 'Siddharth Kumar',
            requesterDepartment: 'Revenue Ops',
            requesterInitials: 'SK',
            currentStage: 'Vendor Master Sync',
            currentOwner: 'NetSuite Worker #08',
            currentStepNumber: 4,
            totalSteps: 5,
            estimatedBudget: 38500.0,
            remainingTimeFormatted: '3h 12m left',
            progressPercent: 80,
            status: 'In Progress',
            createdAtUtc: new Date().toISOString()
          },
          {
            id: '11111111-8879-4444-8888-000000000003',
            requestNumber: '#REQ-8879',
            title: 'External Auditor Access Token (PwC SOC-2)',
            workflowKey: 'wf-secops-key-v1',
            requesterName: 'Elena Rostova',
            requesterDepartment: 'InfoSec GRC',
            requesterInitials: 'EL',
            currentStage: 'Token Generated',
            currentOwner: 'HashiCorp Vault Pod',
            currentStepNumber: 4,
            totalSteps: 4,
            estimatedBudget: 0.0,
            remainingTimeFormatted: 'Done',
            progressPercent: 100,
            status: 'Approved',
            createdAtUtc: new Date().toISOString()
          },
          {
            id: '11111111-8871-4444-8888-000000000004',
            requestNumber: '#REQ-8871',
            title: 'SOC-2 Compliance Snapshot Bucket Ingestion',
            workflowKey: 'wf-secops-audit-v3',
            requesterName: 'Marcus Thorne',
            requesterDepartment: 'Cloud Reliability',
            requesterInitials: 'MT',
            currentStage: 'IAM Policy Conflict',
            currentOwner: 'Escalated to SecLead',
            currentStepNumber: 2,
            totalSteps: 6,
            estimatedBudget: 5000.0,
            remainingTimeFormatted: '+14m Breached',
            progressPercent: 35,
            status: 'Escalated',
            createdAtUtc: new Date().toISOString()
          }
        ];
        this.requests.set(demoRequests);
        this.isLoading.set(false);
        return of(demoRequests);
      })
    );
  }

  loadRequestDetail(id: string): Observable<ServiceRequestDetail | null> {
    this.isLoading.set(true);

    return this.http.get<ApiResponse<ServiceRequestDetail>>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data ?? null),
      tap(detail => {
        this.selectedRequest.set(detail);
        this.isLoading.set(false);
      }),
      catchError(() => {
        const fallbackDetail: ServiceRequestDetail = {
          id: id,
          requestNumber: '#REQ-8891',
          title: 'AWS GPU Cluster for Deep Learning v4',
          workflowKey: 'wf-cloud-provision-v2',
          requesterName: 'Devon Ramos',
          requesterDepartment: 'AI Platform',
          requesterInitials: 'DR',
          currentStage: 'VP Finance Approval',
          currentOwner: 'Alexander Vance',
          currentStepNumber: 3,
          totalSteps: 5,
          estimatedBudget: 12400.0,
          remainingTimeFormatted: '45m left',
          progressPercent: 60,
          status: 'In Review',
          createdAtUtc: new Date().toISOString(),
          timeline: [
            { stepNumber: 1, title: '1. Request Submitted', description: 'By Devon Ramos · Today at 08:32 AM', status: 'Done', timestampFormatted: '08:32 AM' },
            { stepNumber: 2, title: '2. Architecture Policy Cleared', description: 'Automated Sentinel static check PASSED · 08:34 AM', status: 'Done', timestampFormatted: '08:34 AM' },
            { stepNumber: 3, title: '3. VP Finance Pending', description: 'Assigned to: Alexander Vance (Org Admin)', status: 'Active', timestampFormatted: 'Action Needed' },
            { stepNumber: 4, title: '4. Automated Terraform Apply', description: 'Runs on Worker pool `us-east-cluster-01`', status: 'Future', timestampFormatted: 'Upcoming' },
            { stepNumber: 5, title: '5. Cluster Live & Handover', description: 'Kubeconfig injected into developer Vault secret', status: 'Future', timestampFormatted: 'Upcoming' }
          ],
          parameters: {
            'Instance Type': '8x p4de.24xlarge',
            'Storage Volume': '20TB NVMe EBS GP3',
            'Region': 'us-east-1 (N. Virginia)',
            'Auto-Shutdown': 'Enabled (14 days idle)'
          },
          attachedDocuments: [
            { fileName: 'AWS_Enterprise_Discount_Q3.pdf', fileSize: '1.4 MB', fileType: 'pdf' },
            { fileName: 'Security_Impact_Assessment.pdf', fileSize: '640 KB', fileType: 'pdf' }
          ]
        };
        this.selectedRequest.set(fallbackDetail);
        this.isLoading.set(false);
        return of(fallbackDetail);
      })
    );
  }

  submitRequest(request: SubmitCatalogRequest): Observable<ServiceRequestSummary> {
    return this.http.post<ApiResponse<ServiceRequestSummary>>(`${this.apiUrl}/submit`, request).pipe(
      map(res => res.data),
      tap(created => {
        this.requests.update(list => [created, ...list]);
      })
    );
  }

  expediteSla(id: string): Observable<boolean> {
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/${id}/expedite`, {}).pipe(
      map(res => res.data ?? true),
      tap(() => {
        this.requests.update(list =>
          list.map(r => r.id === id ? { ...r, remainingTimeFormatted: '15m left (Expedited)' } : r)
        );
        const sel = this.selectedRequest();
        if (sel && sel.id === id) {
          this.selectedRequest.set({ ...sel, remainingTimeFormatted: '15m left (Expedited)' });
        }
      })
    );
  }

  rejectRequest(id: string, reason: string): Observable<boolean> {
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/${id}/reject`, { reason }).pipe(
      map(res => res.data ?? true),
      tap(() => {
        this.requests.update(list =>
          list.map(r => r.id === id ? { ...r, status: 'Rejected', currentStage: `Rejected: ${reason}` } : r)
        );
        const sel = this.selectedRequest();
        if (sel && sel.id === id) {
          this.selectedRequest.set({ ...sel, status: 'Rejected', currentStage: `Rejected: ${reason}` });
        }
      })
    );
  }
}
