export interface NotificationAction {
  label: string;
  action: string;
  variant: 'primary' | 'secondary' | 'danger';
}

export interface NotificationItem {
  id: string;
  type: string;
  category: 'sla' | 'approval' | 'security' | 'system';
  severity: 'critical' | 'warning' | 'high' | 'info';
  title: string;
  message: string;
  relativeTime: string;
  createdAtUtc: string;
  incidentId?: string;
  resource?: string;
  amount?: string;
  isRead: boolean;
  actions: NotificationAction[];
  diagnostics: Record<string, string>;
}

export interface ChannelHealth {
  id: string;
  name: string;
  description: string;
  status: string;
  isHealthy: boolean;
}

export interface NotificationSummary {
  unreadCount: number;
  criticalIncidentsCount: number;
  pendingApprovalsCount: number;
  pipelineTelemetryCount: number;
  rateCapacityPercent: number;
  rateCapacityCurrent: number;
  rateCapacityMax: number;
  quietHoursActive: boolean;
  dispatchedCount24h: number;
  slaDeliveryRate: number;
  avgAckLatency: string;
}
