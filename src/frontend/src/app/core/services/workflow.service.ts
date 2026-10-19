import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, map, catchError, throwError } from 'rxjs';
import {
  WorkflowSummary,
  WorkflowDetail,
  WorkflowVersion,
  WorkflowVersionSummary,
  GraphValidationResult,
  CreateWorkflowRequest,
  UpdateWorkflowRequest,
  SaveWorkflowGraphRequest,
  PublishWorkflowRequest,
  ApiResponse
} from '../models/workflow.models';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:5000/api/workflows';

  // Signals réactifs pour l'état global des workflows
  readonly workflows = signal<WorkflowSummary[]>([]);
  readonly currentWorkflow = signal<WorkflowDetail | null>(null);
  readonly currentVersion = signal<WorkflowVersion | null>(null);
  readonly validationResult = signal<GraphValidationResult | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  /**
   * Récupère la liste des workflows avec filtres optionnels
   */
  loadWorkflows(category?: string, search?: string): Observable<WorkflowSummary[]> {
    this.isLoading.set(true);
    this.error.set(null);

    let params = new HttpParams();
    if (category && category !== 'All') {
      params = params.set('category', category);
    }
    if (search && search.trim().length > 0) {
      params = params.set('search', search.trim());
    }

    return this.http.get<ApiResponse<WorkflowSummary[]>>(this.apiUrl, { params }).pipe(
      map(res => res.data),
      tap(data => {
        this.workflows.set(data);
        this.isLoading.set(false);
      }),
      catchError(err => {
        this.isLoading.set(false);
        const errorMsg = err.error?.message || 'Erreur lors du chargement des workflows.';
        this.error.set(errorMsg);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  /**
   * Récupère un workflow par son ID avec son graphe actif et son historique
   */
  loadWorkflow(id: string): Observable<WorkflowDetail> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.get<ApiResponse<WorkflowDetail>>(`${this.apiUrl}/${id}`).pipe(
      map(res => res.data),
      tap(data => {
        this.currentWorkflow.set(data);
        if (data.activeVersion) {
          this.currentVersion.set(data.activeVersion);
        }
        this.isLoading.set(false);
      }),
      catchError(err => {
        this.isLoading.set(false);
        const errorMsg = err.error?.message || `Impossible de charger le workflow ${id}.`;
        this.error.set(errorMsg);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  /**
   * Crée un nouveau workflow
   */
  createWorkflow(payload: CreateWorkflowRequest): Observable<WorkflowSummary> {
    this.isLoading.set(true);
    this.error.set(null);

    return this.http.post<ApiResponse<WorkflowSummary>>(this.apiUrl, payload).pipe(
      map(res => res.data),
      tap(newWf => {
        this.workflows.update(list => [newWf, ...list]);
        this.isLoading.set(false);
      }),
      catchError(err => {
        this.isLoading.set(false);
        const errorMsg = err.error?.message || 'Erreur lors de la création du workflow.';
        this.error.set(errorMsg);
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  /**
   * Met à jour les métadonnées d'un workflow
   */
  updateWorkflow(id: string, payload: UpdateWorkflowRequest): Observable<WorkflowSummary> {
    this.isLoading.set(true);

    return this.http.put<ApiResponse<WorkflowSummary>>(`${this.apiUrl}/${id}`, payload).pipe(
      map(res => res.data),
      tap(updated => {
        this.workflows.update(list => list.map(item => item.id === id ? updated : item));
        if (this.currentWorkflow()?.id === id) {
          this.currentWorkflow.update(curr => curr ? {
            ...curr,
            title: updated.title,
            description: updated.description,
            department: updated.department,
            category: updated.category,
            status: updated.status
          } : null);
        }
        this.isLoading.set(false);
      }),
      catchError(err => {
        this.isLoading.set(false);
        const errorMsg = err.error?.message || 'Erreur lors de la mise à jour du workflow.';
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  /**
   * Valide la topologie DAG d'un graphe
   */
  validateGraph(graphDefinitionJson: string): Observable<GraphValidationResult> {
    const payload: SaveWorkflowGraphRequest = { graphDefinitionJson };
    return this.http.post<ApiResponse<GraphValidationResult>>(`${this.apiUrl}/validate-graph`, payload).pipe(
      map(res => res.data),
      tap(result => this.validationResult.set(result)),
      catchError(err => {
        const fallback: GraphValidationResult = {
          isValid: false,
          errors: [err.error?.message || 'Échec de la validation de la topologie.'],
          warnings: [],
          nodeCount: 0,
          branchCount: 0,
          cycleCount: 0,
          topologySummary: 'Erreur d\'analyse'
        };
        this.validationResult.set(fallback);
        return throwError(() => new Error(fallback.errors[0]));
      })
    );
  }

  /**
   * Sauvegarde le graphe en état de brouillon
   */
  saveDraftGraph(id: string, graphDefinitionJson: string): Observable<WorkflowDetail> {
    const payload: SaveWorkflowGraphRequest = { graphDefinitionJson };

    return this.http.put<ApiResponse<WorkflowDetail>>(`${this.apiUrl}/${id}/graph`, payload).pipe(
      map(res => res.data),
      tap(detail => {
        this.currentWorkflow.set(detail);
        if (detail.activeVersion) {
          this.currentVersion.set(detail.activeVersion);
        }
      }),
      catchError(err => {
        const errorMsg = err.error?.message || 'Erreur lors de la sauvegarde du brouillon.';
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  /**
   * Publie une version immuable scellée cryptographiquement
   */
  publishVersion(id: string, changeNotes?: string): Observable<WorkflowVersion> {
    const payload: PublishWorkflowRequest = { changeNotes };
    this.isLoading.set(true);

    return this.http.post<ApiResponse<WorkflowVersion>>(`${this.apiUrl}/${id}/publish`, payload).pipe(
      map(res => res.data),
      tap(version => {
        this.currentVersion.set(version);
        if (this.currentWorkflow()?.id === id) {
          this.currentWorkflow.update(curr => curr ? {
            ...curr,
            status: 'Published',
            currentVersionNumber: version.versionNumber,
            activeVersion: version
          } : null);
        }
        this.isLoading.set(false);
      }),
      catchError(err => {
        this.isLoading.set(false);
        const errorMsg = err.error?.message || 'Échec de la publication du workflow.';
        return throwError(() => new Error(errorMsg));
      })
    );
  }

  /**
   * Récupère l'historique complet des versions
   */
  loadVersions(id: string): Observable<WorkflowVersionSummary[]> {
    return this.http.get<ApiResponse<WorkflowVersionSummary[]>>(`${this.apiUrl}/${id}/versions`).pipe(
      map(res => res.data)
    );
  }
}
