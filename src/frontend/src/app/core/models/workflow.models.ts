export interface NodePosition {
  x: number;
  y: number;
}

export interface NodeConfig {
  prompt?: string;
  consensusPolicy?: string; // 'FourEyes' | 'Majority' | 'Unanimous' | 'Single'
  assignedRoles?: string[];
  targetSlaHours?: number;
  escalationPath?: string;
  requireMfa?: boolean;
  allowRejection?: boolean;
  notificationTarget?: string;
  conditionExpression?: string;
  eventName?: string;
  engine?: string;
  algo?: string;
  topic?: string;
  cronExpression?: string;
}

export interface WorkflowNode {
  id: string;
  type: string; // 'trigger' | 'task' | 'gate' | 'integration' | 'end'
  subType: string; // 'webhook' | 'cron' | 'kafka' | 'approval' | 'consensus' | 'doc-sign' | 'condition' | 'worker' | 'subflow' | 'sap' | 'vault' | 'slack'
  label: string;
  description?: string;
  position: NodePosition;
  config?: NodeConfig;
}

export interface WorkflowEdge {
  id: string;
  from: string;
  to: string;
  label?: string;
  condition?: string;
  style?: string; // 'navy' | 'orange' | 'green' | 'dashed'
}

export interface WorkflowGraph {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export type WorkflowStatus = 'Draft' | 'Published' | 'Archived' | 'Deprecated';

export interface WorkflowSummary {
  id: string;
  key: string;
  title: string;
  description: string;
  department: string;
  category: string;
  currentVersionNumber: number;
  status: WorkflowStatus;
  isActive: boolean;
  nodeCount: number;
  updatedAtUtc?: string;
  createdAtUtc: string;
}

export interface WorkflowVersionSummary {
  id: string;
  versionNumber: number;
  hashSha256: string;
  isActive: boolean;
  publishedAtUtc: string;
  publishedByName?: string;
}

export interface WorkflowVersion {
  id: string;
  workflowDefinitionId: string;
  versionNumber: number;
  graphDefinitionJson: string;
  hashSha256: string;
  isActive: boolean;
  publishedAtUtc: string;
  publishedByUserId?: string;
  publishedByName?: string;
}

export interface WorkflowDetail {
  id: string;
  key: string;
  title: string;
  description: string;
  department: string;
  category: string;
  currentVersionNumber: number;
  status: WorkflowStatus;
  isActive: boolean;
  updatedAtUtc?: string;
  createdAtUtc: string;
  activeVersion?: WorkflowVersion;
  versions: WorkflowVersionSummary[];
}

export interface GraphValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  nodeCount: number;
  branchCount: number;
  cycleCount: number;
  topologySummary: string;
}

export interface CreateWorkflowRequest {
  key: string;
  title: string;
  description: string;
  department: string;
  category: string;
}

export interface UpdateWorkflowRequest {
  title: string;
  description: string;
  department: string;
  category: string;
  status: WorkflowStatus;
}

export interface SaveWorkflowGraphRequest {
  graphDefinitionJson: string;
}

export interface PublishWorkflowRequest {
  changeNotes?: string;
}

export interface ApiResponse<T> {
  isSuccess: boolean;
  data: T;
  message?: string;
  errors?: Record<string, string[]>;
  timestampUtc: string;
}
