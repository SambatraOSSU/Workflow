export interface TaskSummary {
  id: string;
  executionInstanceId: string;
  workflowReferenceNumber: string;
  workflowTitle: string;
  title: string;
  description: string;
  stepKey: string;
  assignedToUserName?: string;
  assignedToRole?: string;
  assignedToDepartment?: string;
  priority: string; // 'Urgent' | 'High' | 'Medium' | 'Low'
  status: 'Pending' | 'Approved' | 'Rejected' | 'Delegated' | 'Cancelled';
  dueAtUtc?: string;
  slaHours?: number;
  consensusPolicy: string;
  secondsRemaining: number;
  createdAtUtc: string;
}

export interface TaskDetail {
  id: string;
  executionInstanceId: string;
  workflowReferenceNumber: string;
  workflowTitle: string;
  title: string;
  description: string;
  stepKey: string;
  payloadJson: string;
  assignedToUserId?: string;
  assignedToUserName?: string;
  assignedToRole?: string;
  assignedToDepartment?: string;
  priority: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Delegated' | 'Cancelled';
  dueAtUtc?: string;
  slaHours?: number;
  consensusPolicy: string;
  secondsRemaining: number;
  actionTakenAtUtc?: string;
  decisionNotes?: string;
  createdAtUtc: string;
}

export interface ApproveTaskRequest {
  decisionNotes?: string;
  webAuthnSignature?: string;
}

export interface RejectTaskRequest {
  rejectionReason: string;
  rejectionCode?: string;
}

export interface DelegateTaskRequest {
  delegateToUserEmail: string;
  delegateNotes?: string;
}
