import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, map, catchError, of } from 'rxjs';
import { ApiResponse } from '../models/workflow.models';
import { NotificationItem, ChannelHealth, NotificationSummary } from '../models/notification.models';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api/notifications';

  readonly notifications = signal<NotificationItem[]>([]);
  readonly summary = signal<NotificationSummary | null>(null);
  readonly channels = signal<ChannelHealth[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly activeFilter = signal<string>('all');

  loadNotifications(category?: string, severity?: string, unreadOnly?: boolean, search?: string): Observable<NotificationItem[]> {
    this.isLoading.set(true);
    let url = this.apiUrl;
    const params: string[] = [];
    if (category && category !== 'all') params.push(`category=${encodeURIComponent(category)}`);
    if (severity && severity !== 'all') params.push(`severity=${encodeURIComponent(severity)}`);
    if (unreadOnly) params.push(`unreadOnly=true`);
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (params.length > 0) url += `?${params.join('&')}`;

    return this.http.get<ApiResponse<NotificationItem[]>>(url).pipe(
      map(res => res.data ?? []),
      tap(data => {
        this.notifications.set(data);
        this.isLoading.set(false);
      }),
      catchError(() => {
        const fallbacks = this.getFallbackNotifications();
        let filtered = fallbacks;
        if (category && category !== 'all') {
          if (category === 'unread') {
            filtered = filtered.filter(n => !n.isRead);
          } else {
            filtered = filtered.filter(n => n.category === category);
          }
        }
        if (severity && severity !== 'all') {
          filtered = filtered.filter(n => n.severity === severity);
        }
        if (search) {
          const q = search.toLowerCase();
          filtered = filtered.filter(n => n.title.toLowerCase().includes(q) || n.message.toLowerCase().includes(q));
        }
        this.notifications.set(filtered);
        this.isLoading.set(false);
        return of(filtered);
      })
    );
  }

  loadSummary(): Observable<NotificationSummary> {
    return this.http.get<ApiResponse<NotificationSummary>>(`${this.apiUrl}/summary`).pipe(
      map(res => res.data),
      tap(s => this.summary.set(s)),
      catchError(() => {
        const s: NotificationSummary = {
          unreadCount: 5,
          criticalIncidentsCount: 2,
          pendingApprovalsCount: 7,
          pipelineTelemetryCount: 24,
          rateCapacityPercent: 34.2,
          rateCapacityCurrent: 342,
          rateCapacityMax: 1000,
          quietHoursActive: true,
          dispatchedCount24h: 14291,
          slaDeliveryRate: 99.98,
          avgAckLatency: '1.4m'
        };
        this.summary.set(s);
        return of(s);
      })
    );
  }

  loadChannels(): Observable<ChannelHealth[]> {
    return this.http.get<ApiResponse<ChannelHealth[]>>(`${this.apiUrl}/channels`).pipe(
      map(res => res.data ?? []),
      tap(c => this.channels.set(c)),
      catchError(() => {
        const fallbackChannels: ChannelHealth[] = [
          { id: 'in-app', name: 'In-App Web Console', description: 'Persistent WebSocket (0 drop)', status: 'Active', isHealthy: true },
          { id: 'slack', name: 'Slack #eng-war-room', description: 'High-priority alerts & pings', status: 'Active', isHealthy: true },
          { id: 'pagerduty', name: 'PagerDuty Escalation', description: 'P1/P2 On-Call Ringing', status: 'Active', isHealthy: true },
          { id: 'email', name: 'Executive Email Digest', description: 'Daily Schedule @ 08:00 UTC', status: 'Active', isHealthy: true },
          { id: 'webhook', name: 'HMAC Webhook', description: 'api.vanguard.corp/events', status: 'Active', isHealthy: true }
        ];
        this.channels.set(fallbackChannels);
        return of(fallbackChannels);
      })
    );
  }

  markAsRead(id: string): Observable<boolean> {
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/${id}/read`, {}).pipe(
      map(res => res.data),
      tap(() => {
        this.notifications.update(items =>
          items.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
        this.summary.update(s => s ? { ...s, unreadCount: Math.max(0, s.unreadCount - 1) } : null);
      }),
      catchError(() => {
        this.notifications.update(items =>
          items.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
        this.summary.update(s => s ? { ...s, unreadCount: Math.max(0, s.unreadCount - 1) } : null);
        return of(true);
      })
    );
  }

  markAllAsRead(): Observable<boolean> {
    return this.http.post<ApiResponse<boolean>>(`${this.apiUrl}/read-all`, {}).pipe(
      map(res => res.data),
      tap(() => {
        this.notifications.update(items => items.map(n => ({ ...n, isRead: true })));
        this.summary.update(s => s ? { ...s, unreadCount: 0 } : null);
      }),
      catchError(() => {
        this.notifications.update(items => items.map(n => ({ ...n, isRead: true })));
        this.summary.update(s => s ? { ...s, unreadCount: 0 } : null);
        return of(true);
      })
    );
  }

  private getFallbackNotifications(): NotificationItem[] {
    return [
      {
        id: 'notif-001',
        type: 'CRITICAL SLA BREACH',
        category: 'sla',
        severity: 'critical',
        title: 'Workflow wf-ledger-sync SLA Target Exceeded',
        message: 'Persistent lock contention encountered on fin_general_ledger_q4 during batch reconciliations. PagerDuty P1 incident automatically raised to on-call roster.',
        relativeTime: '3 mins ago',
        createdAtUtc: new Date(Date.now() - 3 * 60000).toISOString(),
        incidentId: '#INC-80924',
        resource: 'fin_general_ledger_q4',
        isRead: false,
        diagnostics: {
          'Assigned': 'DataOps Primary Escalation',
          'Cluster': 'us-east-1-prod-c02',
          'Recovery Window': '17m remaining before cascade'
        },
        actions: [
          { label: 'Inspect Trace Log', action: 'inspect_trace', variant: 'primary' },
          { label: 'Acknowledge', action: 'acknowledge', variant: 'secondary' },
          { label: 'Escalate to VP Ops', action: 'escalate', variant: 'danger' }
        ]
      },
      {
        id: 'notif-002',
        type: 'PENDING URGENT APPROVAL',
        category: 'approval',
        severity: 'warning',
        title: 'Global AWS Infrastructure Expansion PO #88319 ($124,500.00)',
        message: 'Reserved Instance renewal for Kubernetes compute node cluster group k8s-prod-primary-eu. Requester: Kenji Sato (Cloud Architecture Lead).',
        relativeTime: '14 mins ago',
        createdAtUtc: new Date(Date.now() - 14 * 60000).toISOString(),
        incidentId: 'PO #88319',
        resource: 'k8s-prod-primary-eu',
        amount: '$124,500.00',
        isRead: false,
        diagnostics: {
          'Auto-escalation': 'in 1h 48m',
          'Budget Status': 'Within Q4 CapEx Budget',
          'Signatures': '2/3 Signatures Collected'
        },
        actions: [
          { label: 'Review & Sign', action: 'review_sign', variant: 'primary' },
          { label: 'Delegate Sign-off', action: 'delegate', variant: 'secondary' }
        ]
      },
      {
        id: 'notif-003',
        type: 'SECURITY POLICY ALERT',
        category: 'security',
        severity: 'critical',
        title: 'Unauthorized CapEx Bypass Attempt Blocked',
        message: 'Autonomous Policy Engine intervened on task execution from service identity svc-batch-billing@vanguard.internal. Role lacked secondary cryptographic attestation for tier-1 disbursement.',
        relativeTime: '48 mins ago',
        createdAtUtc: new Date(Date.now() - 48 * 60000).toISOString(),
        incidentId: '#AUD-994129',
        resource: 'svc-batch-billing@vanguard.internal',
        isRead: false,
        diagnostics: {
          'Enclave ID': '#AUD-994129',
          'Status': 'Auto-Intercepted',
          'Gateway': 'zero-trust-gw-01'
        },
        actions: [
          { label: 'View Audit Enclave Log', action: 'view_audit', variant: 'secondary' },
          { label: 'Report to InfoSec', action: 'report_infosec', variant: 'secondary' }
        ]
      },
      {
        id: 'notif-004',
        type: 'DEPLOYMENT SUCCESSFUL',
        category: 'system',
        severity: 'info',
        title: 'Pipeline wf-procurement-v2.4 Deployed to US-East-1 Prod',
        message: 'Blue/green traffic cutover completed with zero dropped requests. Automated smoke test suite passed with 100% assertions across 48 integration vectors.',
        relativeTime: '2 hours ago',
        createdAtUtc: new Date(Date.now() - 120 * 60000).toISOString(),
        incidentId: 'Release v2.4.11',
        resource: 'wf-procurement-v2.4',
        isRead: false,
        diagnostics: {
          'Commit': '8fd29ab',
          'Triggered by': 'Devon Ramos'
        },
        actions: []
      },
      {
        id: 'notif-005',
        type: 'WEBHOOK RETRY SPIKE',
        category: 'system',
        severity: 'warning',
        title: 'SAP Invoice Dispatch Retrying with Elevated Latency',
        message: 'Remote edge proxy responded with HTTP 429 Rate Limiting on secondary invoice payload sync. Backoff schedule activated (Attempt 3/5).',
        relativeTime: '3 hours ago',
        createdAtUtc: new Date(Date.now() - 180 * 60000).toISOString(),
        incidentId: 'Partner API: SAP S/4HANA',
        resource: 'SAP S/4HANA Edge Proxy',
        isRead: false,
        diagnostics: {
          'Latency': '850ms',
          'Next retry': 'in 4m 12s'
        },
        actions: [
          { label: 'Force Immediate Retry', action: 'force_retry', variant: 'secondary' },
          { label: 'View Rate Limits', action: 'view_limits', variant: 'secondary' }
        ]
      }
    ];
  }
}
