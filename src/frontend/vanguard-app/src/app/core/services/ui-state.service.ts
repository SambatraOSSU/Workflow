import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UiStateService {
  /** État d'ouverture du drawer mobile sur écrans < 1024px */
  readonly mobileSidebarOpen = signal(false);

  /** État d'ouverture de l'inspecteur du Workflow Designer sur écrans compacts */
  readonly designerInspectorOpen = signal(true);

  toggleMobileSidebar(): void {
    this.mobileSidebarOpen.update((v) => !v);
  }

  closeMobileSidebar(): void {
    this.mobileSidebarOpen.set(false);
  }

  openMobileSidebar(): void {
    this.mobileSidebarOpen.set(true);
  }

  toggleDesignerInspector(): void {
    this.designerInspectorOpen.update((v) => !v);
  }
}
