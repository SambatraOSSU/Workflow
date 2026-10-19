---
name: Vanguard Workflow Engine
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f3f3'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#45464d'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f1f1f1'
  outline: '#75777e'
  outline-variant: '#c5c6ce'
  surface-tint: '#525e7d'
  primary: '#000a24'
  on-primary: '#ffffff'
  primary-container: '#14213d'
  on-primary-container: '#7c89aa'
  inverse-primary: '#b9c6ea'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#ffa515'
  on-secondary-container: '#684000'
  tertiary: '#130900'
  on-tertiary: '#ffffff'
  tertiary-container: '#321d00'
  on-tertiary-container: '#a58359'
  error: '#EF4444'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d9e2ff'
  primary-fixed-dim: '#b9c6ea'
  on-primary-fixed: '#0d1b36'
  on-primary-fixed-variant: '#3a4664'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#ffddb6'
  tertiary-fixed-dim: '#e7c092'
  on-tertiary-fixed: '#2a1800'
  on-tertiary-fixed-variant: '#5c421e'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  noir-text: '#000000'
  pure-white: '#FFFFFF'
  success: '#10B981'
  warning: '#F59E0B'
  info: '#3B82F6'
  disabled: '#9CA3AF'
typography:
  display:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.015em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-lg: 1.5rem
  margin: 1rem
  margin-md: 1.5rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
  space-2xl: 2rem
  space-3xl: 2.5rem
  space-4xl: 3rem
  space-5xl: 4rem
---

## Brand & Style

This design system embodies modern enterprise authority, high computational reliability, and direct operational clarity. Tailored for enterprise orchestration, automation pipelines, and complex workflow management, the interface prioritizes immediate clarity, high density without clutter, and decisive visual hierarchy.

The design movement blends **Corporate Modernism** with **Functional Precision**:
- High-contrast structural boundaries for enterprise certainty.
- Command-center structure utilizing deep navy foundation framing crisp, luminous canvases.
- Vibrant energetic amber/orange action anchors ensuring primary workflow triggers, execution states, and next-best actions are impossible to miss.
- Minimal visual ornamentation; elevation and contrast are derived purely from structural surface contrasts, subtle neutral borders, and tactical micro-shadows.

## Colors

The palette is engineered around high functional contrast to support complex workflow diagrams, dense tabular data, and clear operational states.

- **Primary (`#14213D` - Navy):** Serves as the structural anchor. Applied across sidebars, primary navigation rails, top-level system headers, and persistent contextual frames. Evokes stability, deep technical capability, and enterprise confidence.
- **Secondary (`#FCA311` - Orange / Accent):** The action engine. Reserved strictly for forward momentum—primary call-to-action buttons, active node selections, critical workflow triggers, process indicators, and milestone states.
- **Neutral (`#E5E5E5` - Gris clair):** Structural delineator used for container strokes, data table dividers, interactive element borders, and background fills for secondary utility blocks.
- **Canvas & Surface (`#FFFFFF` - Blanc):** Pure white canvas providing an uncluttered, high-legibility backdrop for graph nodes, data tables, and input groups.
- **Base Typography (`#000000` - Noir):** Maximum legibility for high-density information, code blocks, and primary labels.

### Functional Status Indicators
- **Success (`#10B981`):** Completed pipeline stages, passing health checks, active triggers.
- **Warning (`#F59E0B`):** SLA thresholds near breach, non-blocking workflow warnings, queued jobs.
- **Error (`#EF4444`):** Failed pipeline tasks, invalid logic blocks, critical alerts.
- **Info (`#3B82F6`):** Execution metadata, general audit trails, informational callouts.
- **Disabled (`#9CA3AF`):** Inactive nodes, unconfigured parameters, read-only system defaults.

## Typography

The typography uses Inter across all application surfaces to preserve strict vertical alignment, numerical legibility, and visual discipline.

- **Display & Headlines (20px - 32px):** Set with negative tracking (`-0.005em` to `-0.02em`) to build visual authority on dashboards, pipeline views, and modal headers.
- **Body Text (14px & 16px):** Standardized on `line-height: 1.45` to `1.5` to ensure comfortable scanning through logs, payload JSONs, and configuration forms.
- **Labels & Captions (12px - 14px):** Medium-weighted labels guarantee clear visibility for form inputs, table headers, and status badges. Captions in 12px provide secondary context (e.g., timestamps, node IDs) without competing with operational data.

## Layout & Spacing

The layout is built upon an 8pt structural rhythm, with a supplementary 4pt scale used for compact components and micro-spacing.

- **Application Shell:** Fluid dashboard model comprising a collapsible 240px–280px primary Navy navigation sidebar, a 64px persistent utility toolbar, and a dynamic fluid canvas for node graphs and data tables.
- **Grid Architecture:** 12-column responsive fluid grid with `1.5rem` (24px) gutters on desktop systems (`>=1280px`), adapting to `1rem` (16px) gutters on intermediate tablet viewports.
- **Responsive Adaptations:**
  - **Desktop (1280px+):** Full multi-pane workflow layout: persistent sidebar, central infinite or pannable canvas, and right-hand inspector panel.
  - **Tablet (768px - 1279px):** Inspector transitions into an off-canvas drawer. Outer canvas margin shrinks to `1.5rem`.
  - **Mobile (<768px):** Navigation transitions to a drawer menu; complex workflow canvas switches to list-view linear execution logs; margins compress to `1rem`.

## Elevation & Depth

Visual depth follows a restrained, layered structural model using subtle neutral container strokes combined with diffused ambient shadows.

- **Base Layer (Level 0):** Pure White `#FFFFFF` for primary work surfaces and canvas backdrops.
- **Structural Elevation (Level 1 / sm):** Used for cards, table containers, and inactive workflow nodes. Characterized by a border of `1px solid #E5E5E5` coupled with an ambient shadow: `0 1px 2px 0 rgba(0, 0, 0, 0.05)`.
- **Active / Hover Elevation (Level 2 / md):** Applied to hovered cards, active workflow blocks, flyout tooltips, and floating control bars: `0 4px 6px -1px rgba(20, 33, 61, 0.08), 0 2px 4px -2px rgba(20, 33, 61, 0.04)`.
- **Overlay Elevation (Level 3 / lg):** Reserved for contextual dropdowns, modal dialogs, drawer panels, and slide-over inspectors: `0 10px 15px -3px rgba(20, 33, 61, 0.12), 0 4px 6px -4px rgba(20, 33, 61, 0.06)`.
- **Canvas Depth:** The visual graph environment uses subtle dotted or crossed grid lines in `#E5E5E5` over pure white `#FFFFFF` to orient node spatial placement.

## Shapes

The geometric framework balances clean engineering rigor with modern tactile feel:

- **Base Components (Inputs, Buttons, Badges):** Standardized on `8px` (`rounded-md`) for balanced visual sharpness that integrates cleanly into dense grids.
- **Inner Micro-Elements (Checkboxes, Nested Tags):** Scaled down to `6px` (`rounded-sm`) to avoid excessive circularity in small form factors.
- **Containers & Panels (Cards, Modals, Flyouts):** Set to `12px` (`rounded-lg`) to clearly define bounded execution context.
- **Pills (`999px`):** Reserved exclusively for semantic execution chips, workflow run badges, and numeric step counters.

## Components

### Buttons
- **Primary CTA:** Solid accent `#FCA311` with `#000000` text (700 weight), `8px` border radius, padding `10px 20px`. Hover state shifts to `#e5920a` with a micro-shadow.
- **Secondary / Enterprise:** Solid `#14213D` with `#FFFFFF` text (600 weight). Used for operational commands (e.g., "Deploy Pipeline", "Commit Changes").
- **Tertiary / Outline:** Background transparent, `1px solid #E5E5E5`, `#000000` text. Hover state introduces `#F9FAFB` fill and `#14213D` text.
- **Destructive:** Solid `#EF4444` or outline with `#EF4444` border and text.

### Chips & Status Badges
- **Shape:** Pill radius (`999px`), padding `2px 10px`, font size `12px` with `500` weight.
- **Execution States:**
  - *Running:* Soft blue tint background (`rgba(59, 130, 246, 0.12)`), `#3B82F6` text, with a pulsing circular indicator.
  - *Success:* `#10B981` tint background (`rgba(16, 185, 129, 0.12)`), `#059669` text.
  - *Failed:* `#EF4444` tint background (`rgba(239, 68, 68, 0.12)`), `#DC2626` text.

### Input Fields & Controls
- **Form Inputs:** Height `40px`, border `1px solid #E5E5E5`, background `#FFFFFF`, border-radius `8px`, typography `14px`. Focus state triggers a crisp `2px` ring in `#14213D` or `#FCA311` with zero interior blur.
- **Checkboxes & Radios:** `16px` diameter/box, border `1.5px solid #14213D`. Checked state fills `#14213D` with white checkmark; focused state adds `#FCA311` outer ring.

### Workflow Nodes & Cards
- **Canvas Nodes:** Minimum width `220px`, surface `#FFFFFF`, border `1px solid #E5E5E5`, radius `12px`. Header bar utilizes `#14213D` background for system nodes or `#FFFFFF` with colored accent icons for user tasks.
- **Selected Node:** Border shifts to `2px solid #FCA311` with ambient shadow level 2.
- **Connector Ports:** `10px` circles protruding from card edges with `#FFFFFF` center and `2px solid #14213D` stroke, turning solid `#FCA311` on active drag/connection.

### Data Tables & Execution Lists
- **Headers:** Background `#FAFAFA`, border-bottom `1px solid #E5E5E5`, text `13px` uppercase with `600` weight in `#14213D`.
- **Rows:** Height `48px`, border-bottom `1px solid #E5E5E5`, hover highlight `rgba(20, 33, 61, 0.02)`. Alternating stripes are avoided in favor of crisp row dividers.