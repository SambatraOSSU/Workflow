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

  readonly tasks = signal<TaskSummary[]>([]);
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
        this.tasks.set(data);
        this.isLoading.set(false);
      }),
      catchError(() => {
        this.isLoading.set(false);
        return of([]);
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
      })
    );
  }

  delegateTask(id: string, delegateToUserEmail: string, delegateNotes?: string): Observable<TaskDetail> {
    const payload: DelegateTaskRequest = { delegateToUserEmail, delegateNotes };

    return this.http.post<ApiResponse<TaskDetail>>(`${this.apiUrl}/${id}/delegate`, payload).pipe(
      map(res => res.data),
      tap(updated => {
        this.selectedTask.set(updated);
      })
    );
  }
}
