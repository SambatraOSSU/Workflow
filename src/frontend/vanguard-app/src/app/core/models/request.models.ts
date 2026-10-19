export interface CatalogTemplate {
  templateId: string;
  title: string;
  category: string;
  description: string;
  targetSla: string;
  badge: string;
  defaultBudget: number;
  icon: string;
}

export interface SubmitCatalogRequest {
  templateId: string;
  title: string;
  department: string;
  estimatedBudget: number;
  parameters: Record<string, string>;
}

export interface ServiceRequestSummary {
  id: string;
  requestNumber: string;
  title: string;
  workflowKey: string;
  requesterName: string;
  requesterDepartment: string;
  requesterInitials: string;
  currentStage: string;
  currentOwner: string;
  currentStepNumber: number;
  totalSteps: number;
  estimatedBudget: number;
  remainingTimeFormatted: string;
  progressPercent: number;
  status: string;
  createdAtUtc: string;
}

export interface RequestTimelineStep {
  stepNumber: number;
  title: string;
  description: string;
  status: 'Done' | 'Active' | 'Future';
  timestampFormatted: string;
}

export interface AttachedDocument {
  fileName: string;
  fileSize: string;
  fileType: string;
}

export interface ServiceRequestDetail extends ServiceRequestSummary {
  timeline: RequestTimelineStep[];
  parameters: Record<string, string>;
  attachedDocuments: AttachedDocument[];
}
