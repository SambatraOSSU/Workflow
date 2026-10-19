# PRODUCT & UX SPECIFICATION — ENTERPRISE WORKFLOW ENGINE (VANGUARD)

## 1. Product Vision & Value Proposition
Vanguard is an enterprise-grade, high-reliability Workflow Engine and Orchestration SaaS designed for mid-market and enterprise organizations. It empowers business analysts, operations managers, and IT teams to visually design, automate, audit, and monitor complex multi-step human-in-the-loop and automated workflows with strict governance and SLA enforcement.

## 2. Personas & RBAC Matrix

| Persona | Primary Goals | Key Permissions | Accessible Screens | Critical User Journeys |
| :--- | :--- | :--- | :--- | :--- |
| **Super Admin** | System health, tenant provisioning, global security | Full read/write across all tenants, global configs | All screens + Tenant Manager + Global Security | Tenant onboarding, disaster recovery, license management |
| **Organization Admin** | Org structure, user access, compliance, audit policies | Manage users, roles, teams, SLA rules, integrations | Users, Roles, Org Settings, Monitoring, Audit | Onboard department, assign roles, configure SSO/SCIM |
| **Workflow Designer** | Build, simulate, version, and publish automated workflows | Create/edit workflows, node config, rule sets, test runs | Workflows, Designer, Versions, Executions | Design workflow, configure conditions, publish version |
| **Manager** | SLA tracking, approvals, workload redistribution | Approve/reject tasks, reassign, delegate, view team queue | Dashboard, My Tasks, Task Details, Requests | Review high-value approval, reassign bottleneck task |
| **Employee** | Submit requests, track status, complete simple forms | Submit request, view self-initiated instances, fulfill task | Dashboard, Requests, My Tasks (assigned) | Submit expense/hiring request, upload missing document |
| **Auditor** | Compliance verification, forensics, SLA breach analysis | Read-only access to all execution histories and immutable logs | Audit Center, Monitoring, Workflow Versions | Export SOX compliance report, inspect failed instance trace |

## 3. Core UX Journeys
1. **Workflow Design & Release**:
   `Dashboard → Workflows → Create → General Info → Drag & Drop Canvas → Step Config (Human/Auto/Rule) → SLA & Timeout → Pre-publish Validation → Test Run Preview → Version Tagging & Publish`
2. **Execution & Human Task Resolution**:
   `Request Triggered → Execution Instance Spawned → Automated Rules Evaluated → Manager Assigned Task → In-app / Email Notification → Task Review & Action → State Transition → Real-time Audit Log Recorded → Completion`

## 4. UI/UX Architecture & Layout Rules
- **3-Panel Workflow Designer**:
  - *Left Panel (280px)*: Searchable Component Library (Start, Human Task, Approval, Condition, Delay, Webhook/Automation, End).
  - *Center Canvas (Flex-1)*: Infinite pan/zoom canvas, interactive grid, node snapping, bezier connection curves, minimap, quick actions.
  - *Right Inspector (340px)*: Context-aware properties panel for selected node/edge with live validation feedback.
- **Enterprise Design System**:
  - Strict palette: #000000 (Ink), #14213D (Deep Navy), #FCA311 (Vibrant Accent Orange), #E5E5E5 (Border/Muted), #FFFFFF (Surface).
  - Font: Inter.
  - States coverage: Default, Hover, Active, Focus, Disabled, Loading/Skeleton, Empty, Error, Unauthorized, Saved/Unsaved.
