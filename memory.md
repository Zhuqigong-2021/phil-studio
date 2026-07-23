# Project Memory

## How AI Must Use This File

- Start every project task by reading this file.
- Before implementation, read `development.md` when it exists.
- After each confirmed workflow step, decide whether durable state, decisions, preferences, risks, or lessons need an incremental update here.
- Do not store secrets, tokens, passwords, sensitive personal information, or chat transcripts.

## Current Project State

- Status: Personal-use digital workspace defined with eighteen confirmed MVP features.
- Last updated: 2026-07-23

## Workflow State

- Product Mode: Personal Use
- Current Stage: 4. Design Definition reopened after historical UI Freeze `5.8-freeze`
- Completed Gates: 1. Discovery and Personal Value; 2. Product Definition; historical 3. Product Freeze (`project.md` `4.1-freeze`) and 5. UI Freeze (`design.md` `5.8-freeze`) remain as baselines; both specifications are reopened through `D-084`, which adds `F-019 Calendar Widget` and `F-020 To-Do Widget`.
- Current Work: Review `project.md` `4.18-draft` and `design.md` `5.33-draft`. Large-background styling remains TBD; Cards use the reversible very-light transparent blue-Indigo veil, while the desktop Sidebar shell is explicitly colorless and fully transparent so the future background remains clear beneath it.
- Blockers: Explicit Product Freeze and UI Freeze re-authorization remain. `development.md` does not yet exist, and implementation remains unauthorized.
- Next Step: Obtain renewed `Freeze Product` followed by renewed `Freeze UI`; only then resume Development Definition.

## User Preferences

### PREF-001: English-only website content

- Status: Active
- Date: 2026-07-18
- Scope: All user-visible content inside the website, including navigation, headings, labels, buttons, descriptions, empty states, validation messages, errors, tooltips, and help text.
- Preference: Use English only; do not include Chinese in the website UI or content.
- Why: The user explicitly wants the website experience to be entirely in English.
- Example: Use concise English labels such as `Learn`, `Open`, and `Search` rather than Chinese equivalents.
- Source: Explicit user instruction on 2026-07-18.
- Exceptions: Preserve official product, brand, and proper names in their official form. Chinese may still be used in planning conversations unless the user requests otherwise.

### PREF-002: Keep tags and compact UI labels short

- Status: Active
- Date: 2026-07-18
- Scope: Tags, category chips, filter labels, card badges, compact navigation controls, and short action buttons.
- Preference: Prefer short, plain English words that fit cleanly in the layout; avoid long phrases when a clear shorter label exists.
- Why: Long tag text makes the interface harder to arrange and scan.
- Example: Use concise Tag tabs such as `AI`, `Design`, `ServiceNow`, `Work`, and `Learn`. `Search` and `Open` remain concise UI labels but are not Tags.
- Source: Explicit user correction on 2026-07-18.
- Exceptions: Do not shorten official tool names, and do not sacrifice clarity merely to reduce character count.

## Active Decisions

### D-001: Use Personal Use product mode

- Status: Active
- Date: 2026-07-18
- Context: The workflow needed a mode before selecting discovery questions and gates.
- Decision/Finding: Build the product as a personal-use tool for the user.
- Why: The user explicitly selected personal use.
- Alternatives: Public Consumer, Developer Product, Business Product, Internal Tool, Portfolio/Learning, or a mixed mode.
- Consequences: Skip pricing, payment, acquisition, conversion, and commercial validation questions. Evaluate personal value, usage frequency, privacy, reliability, data portability, maintenance cost, and available time instead.

### D-002: Organize personal apps and tools in one hub

- Status: Active
- Date: 2026-07-18
- Context: The user has many apps and tools scattered across different places without consistent classification, and often cannot find their links.
- Decision/Finding: The product will provide a unified way to organize, find, and manage personal apps and tools for work and personal development.
- Why: A single organized system should reduce search friction and improve day-to-day efficiency.
- Alternatives: Continue using separate bookmarks, notes, and app launchers without a unified structure.
- Consequences: Discovery should prioritize capture, classification, retrieval, and maintainability. API orchestration and control of tool internals are out of scope.

### D-003: Link to independent tools without API integration

- Status: Active
- Date: 2026-07-18
- Context: Each existing tool operates independently and already has its own access link.
- Decision/Finding: The hub will organize and open existing links rather than call tool APIs or combine their internal functionality.
- Why: The user's problem is fragmented discovery and access, not cross-tool data processing.
- Alternatives: Build API integrations or an automation control center.
- Consequences: The current inventory includes an art portfolio, online CV, online image editor, online PDF editor, stick-figure animation maker, mind-map tool, StudyMate for ServiceNow exam practice, Notion, and AI-agent learning notes. The MVP can remain smaller and easier to maintain.

### D-004: Restrict the hub to one Owner through Google OAuth

- Status: Active
- Date: 2026-07-18
- Context: The user corrected the earlier rejection of authentication and requires private access to the entire personal hub.
- Decision/Finding: Require Google OAuth and allow only one deployment-configured Owner email. The exact address is intentionally not stored in project memory.
- Why: The user explicitly requires login through their own Google account and no access for other accounts.
- Alternatives: No authentication, password login, public registration, or multi-user accounts.
- Consequences: Authentication and Owner authorization must be enforced at a trusted server boundary. The Owner email and OAuth credentials must be environment configuration and must not appear in source, client output, public documentation, or logs.
- Evidence/Links: `project.md` `F-008`, including the confirmed standalone sign-in page requirement.

### D-005: Use a collapsible Sidebar Dashboard after sign-in

- Status: Active
- Date: 2026-07-18
- Context: The user defined the high-level product layout that begins immediately after successful Google OAuth sign-in.
- Decision/Finding: Successful Owner sign-in goes directly to a Dashboard with an expandable/collapsible left Sidebar and a large right Main area. Expanded navigation shows icons with short English labels; collapsed navigation shows icons only.
- Why: This gives the personal tool hub a scalable navigation shell while preserving maximum space for the working area.
- Alternatives: Top navigation, fixed expanded Sidebar, or a page without a persistent Dashboard shell.
- Consequences: Product behavior is tracked in `project.md`; confirmed structure and remaining design TBDs are tracked in `design.md`. UI is not frozen.
- Evidence/Links: `project.md` `FR-045` and `FR-046`; `design.md` `DD-001`, `S-001`, and `S-002`.

### D-006: Separate categories, views, functions, and actions

- Status: Superseded by `D-008`
- Date: 2026-07-18
- Context: The earlier short-label list mixed tool categories with navigation and actions.
- Decision/Finding: Category tags are `Brand`, `Create`, `Learn`, and `Work`. `All`, `Favs`, and `Recent` are collection views. `Search` is an independent function, and `Open` is a tool-card action. The confirmed primary Sidebar destinations are `Dashboard`, `All`, `Favs`, `Recent`, and `Manage`; Dashboard Main shows `Search`, `Favs`, `Recent`, then `All`.
- Why: Search and opening are behaviors, not meaningful classifications of tools; separating these concepts keeps filtering and layout clear.
- Alternatives: Treat every short label as a tag, or omit the requested `Work` category.
- Consequences: Category selectors and stored category values must exclude collection views, functions, and actions. UI remains unfrozen pending detailed design.
- Evidence/Links: `project.md` `FR-047` through `FR-050`; `design.md` `DD-002`, `C-005`, and `C-006`.

### D-007: Put Owner account controls in the Sidebar footer

- Status: Superseded in part by `D-013`
- Date: 2026-07-18
- Context: The user refined the authenticated Sidebar navigation and account-control placement.
- Decision/Finding: Rename `Home` to `Dashboard`. Place the signed-in Google avatar and username at the bottom of the Sidebar. Clicking this identity area opens `Settings` and `Log out`; `Settings` is not a primary navigation item.
- Why: Account and session controls belong with the signed-in identity and should remain visually separate from workspace navigation.
- Alternatives: Keep `Home`, or keep `Settings` as a regular Sidebar destination.
- Consequences: Expanded Sidebar shows avatar plus username; collapsed Sidebar retains an accessible avatar trigger. Logging out returns to the standalone sign-in page.
- Evidence/Links: `project.md` `FR-049`, `FR-051`, and `FR-052`; `design.md` `C-001` and `C-007`.

### D-008: Use selectable Tag tabs and render Settings in Main

- Status: Superseded in part by `D-013`
- Date: 2026-07-18
- Context: The user changed the earlier category set and confirmed the destination behavior for `Settings`.
- Decision/Finding: Use selectable Tag tabs `AI`, `Design`, `ServiceNow`, `Automation`, `Productivity`, `Developer`, `Work`, and `Learn`. Tools may carry one or more of these Tags. Selecting `Settings` from the Google account menu renders the Settings page in the right Main area while preserving the Sidebar and authenticated Dashboard Shell.
- Why: The revised Tags better match the user's actual tool domains, while in-shell Settings keeps navigation context stable.
- Alternatives: Keep `Brand`, `Create`, `Learn`, and `Work`, or open Settings as a separate standalone page.
- Consequences: Current product and design specs must use the eight new Tags; old category values are historical only. Settings sections remain TBD.
- Evidence/Links: `project.md` `FR-053` and `FR-054`; `design.md` `C-008` and `S-003`.

### D-009: Open tools by clicking the whole item

- Status: Active
- Date: 2026-07-18
- Context: The word `Open` was incorrectly interpreted as a separate visible card button.
- Decision/Finding: In both `Grid` and `List` Views, the entire tool item is clickable and opens the corresponding independent application in a new tab. Do not display a separate `Open` text button. A small northeast external-link arrow may appear in the top-right corner as a visual cue. `StudyMate` is confirmed with both `ServiceNow` and `Learn` Tags.
- Why: The user wants direct launch behavior with less visual clutter while retaining a clear external-navigation hint.
- Alternatives: Add a separate `Open` button or make only the arrow clickable.
- Consequences: Cards, icons, and list items require one unified click and keyboard target. The arrow must represent the same action rather than a second control.
- Evidence/Links: `project.md` `FR-017` and `FR-055`; `design.md` `C-006`.

### D-010: Provide an installable online-only PWA

- Status: Active
- Date: 2026-07-18
- Context: Proposal `P-010 Install` was paused until the user clarified whether it meant a Progressive Web App.
- Decision/Finding: Accept `P-010` as `F-009 Installable PWA`. The product may be installed from supported computer and mobile browsers, launched like a standalone App, and must remain online for login and use.
- Why: Installation provides fast desktop and phone access without building or distributing separate native applications.
- Alternatives: Browser-only website, native desktop/mobile Apps, or an offline-capable PWA.
- Consequences: Browser and installed modes share Google OAuth and single-Owner authorization. Offline protected data and offline editing are excluded; unsupported browsers retain normal website access. Minimum supported browser and OS versions remain TBD.
- Evidence/Links: `project.md` `F-009` and `FR-056` through `FR-060`; `design.md` `DD-003`.

### D-011: Support automatic and custom tool icons

- Status: Superseded by `D-018`
- Date: 2026-07-18
- Context: Proposal `P-011 Tool Icons` was offered to improve recognition in the confirmed Grid and List Views.
- Decision/Finding: Accept `P-011` as `F-010 Tool Icons`. Attempt website-icon detection from the tool URL, allow a custom image URL or uploaded icon, and fall back to a tool-name initial when no valid image is available.
- Why: Distinctive icons reduce scanning time and make the hub feel consistent across card and compact views.
- Alternatives: Text-only tools, automatic website icons with no override, or uploaded icons only.
- Consequences: Icon failure cannot block tool access. Uploaded icon files are entry presentation assets, not backup/export functionality. Validation limits and storage design remain for Development Definition.
- Evidence/Links: `project.md` `F-010` and `FR-061` through `FR-066`; `design.md` `C-009`.

### D-012: Allow Owner-managed Tags

- Status: Active
- Date: 2026-07-18
- Context: The user accepted `P-013 Manage Tags` after confirming the initial eight Tag tabs.
- Decision/Finding: Accept `P-013` as `F-011 Manage Tags`. Settings supports adding, renaming, reordering, and hiding short English Tags. Used Tags cannot be permanently deleted until associations are reassigned, and reserved UI words cannot be Tag names.
- Why: The classification system can evolve without code changes or broken tool associations.
- Alternatives: Keep the eight Tags permanently fixed or allow unrestricted deletion.
- Consequences: The current eight Tags become defaults rather than an immutable set. Tag validation and association-safe updates are required.
- Evidence/Links: `project.md` `F-011` and `FR-069` through `FR-071`.

### D-013: Place Search and Settings in the top Navbar

- Status: Active
- Date: 2026-07-18
- Context: The user supplied visual references and corrected the placement of Search and Settings.
- Decision/Finding: A shared Navbar sits at the top of the Main region beside the Sidebar. Search occupies the left side and retains `Ctrl + K`. The right side contains a `Light/Dark` switch and Settings icon. Settings opens inside Main. The Sidebar footer Google account menu retains `Log out` but no longer contains Settings.
- Why: This keeps global discovery and display controls visible while separating settings from session controls.
- Alternatives: Put Search in Dashboard content and Settings inside the account menu.
- Consequences: `Auto` remains available within Settings. Screenshot-only notification and Activity elements are not included because the user did not request them.
- Evidence/Links: `project.md` `FR-067` and `FR-068`; `design.md` `C-010` and `S-003`.

### D-014: Sync hub data across Owner devices

- Status: Active
- Date: 2026-07-18
- Context: The confirmed PWA supports computers and phones, so the user accepted `P-014 Cross-device Sync` to keep those experiences consistent.
- Decision/Finding: Accept `P-014` as `F-012 Cross-device Sync`. Synchronize hub tool data, icons, Tags, favorites, Recent, ordering, theme, and View preferences through Owner-protected shared storage. Use the latest successful server save for MVP conflicts.
- Why: The Owner should see one consistent workspace across browser and installed PWA sessions on different devices.
- Alternatives: Device-local state, manual export/import, or offline-first conflict resolution.
- Consequences: Independent application data and files remain out of scope. The product remains online-only, does not queue offline edits, preserves unsaved form input on failure, and still needs a shared persistence technology decision.
- Evidence/Links: `project.md` `F-012` and `FR-072` through `FR-077`; `design.md` `C-011`.

### D-015: Extend Search into a Command Palette

- Status: Active
- Date: 2026-07-18
- Context: The user accepted `P-015 Command Palette` after confirming Navbar Search placement and `Ctrl + K`.
- Decision/Finding: Accept `P-015` as `F-013 Command Palette`. The shared Search entry returns separate Tools and Commands groups and supports navigation, view, theme, Add Tool, Settings, and logout actions.
- Why: A single keyboard-friendly launcher reduces navigation friction while preserving the existing click-based Search entry.
- Alternatives: Tool search only, separate command UI, or unrestricted commands including destructive actions.
- Consequences: Query text is not persisted. Tool results open externally; internal Commands remain within the Dashboard Shell. Permanent deletion is excluded, and logout remains a distinct session action.
- Evidence/Links: `project.md` `F-013` and `FR-078` through `FR-083`; `design.md` `C-012`.

### D-016: Check links manually and non-destructively

- Status: Active
- Date: 2026-07-18
- Context: The user accepted `P-016 Link Check` to identify tool links that may need maintenance.
- Decision/Finding: Accept `P-016` as `F-014 Link Check`. Owner-triggered checks use `Working`, `Check`, or `Unknown`, store `Last checked`, synchronize results, and never hide, delete, or disable a tool.
- Why: Link maintenance helps keep the hub useful, but authentication redirects and access restrictions make binary broken-link judgments unreliable.
- Alternatives: No checks, automatic background monitoring, or a binary working/broken result.
- Consequences: Checks use minimal reachability information only, remain manually triggered, and require Development Definition safeguards against unsafe URL schemes and private/reserved network targets.
- Evidence/Links: `project.md` `F-014` and `FR-084` through `FR-091`; `design.md` `C-013`.

### D-017: Let the Owner customize Dashboard sections

- Status: Active
- Date: 2026-07-18
- Context: The user accepted `P-017 Customize Dashboard` after the default `Favs`, `Recent`, `All` composition was confirmed.
- Decision/Finding: Accept `P-017` as `F-015 Customize Dashboard`. Settings allows reordering and hiding the three content sections, requires at least one visible section, and provides `Reset Layout`.
- Why: The Dashboard can follow changing personal priorities without destabilizing global navigation.
- Alternatives: Fixed Dashboard order or unrestricted layout editing that includes Navbar and Sidebar.
- Consequences: Navbar and Sidebar remain fixed. Layout preferences sync across devices, while mobile preserves order and visibility in a vertical flow rather than desktop widths.
- Evidence/Links: `project.md` `F-015` and `FR-092` through `FR-097`; `design.md` `C-014`.

### D-018: Use a Codex-assisted static icon registry

- Status: Active
- Date: 2026-07-18
- Context: The user replaced the earlier favicon/upload approach with a unified icon-management system and asked whether personal Codex usage could support icon selection or generation.
- Decision/Finding: Revise `F-010 Tool Icons` to use this priority: licensed official/market icon, semantically matching icon from one library, then a unified Monogram such as `SM` for `StudyMate`. Codex may assist during development or maintenance, but the website only serves finalized static assets.
- Why: This preserves a consistent visual language and can use interactive Codex work when assets need curation without adding runtime AI integration.
- Alternatives: Automatic favicons, arbitrary user uploads, or a runtime `Generate Icon` button.
- Consequences: The website does not reuse Owner Codex/ChatGPT credentials or plan usage and does not require an OpenAI API Key for icons. Runtime AI icon generation would require a separate future proposal covering API billing, secrets, and cost controls. Third-party icon licensing and brand rules must be checked.
- Evidence/Links: `project.md` revised `F-010`, `FR-061` through `FR-066`, `FR-098`, and `FR-099`; `design.md` `C-009`.

### D-019: Provide reviewed URL-based Quick Add

- Status: Active
- Date: 2026-07-18
- Context: The user accepted `P-018 Quick Add Tool` after revising the Icon system.
- Decision/Finding: Accept `P-018` as `F-016 Quick Add Tool`. Pasting a URL can suggest a name, normalized domain, and static Icon registry choice, but Owner review and explicit save are mandatory.
- Why: Quick Add reduces repetitive entry without sacrificing data quality, Icon consistency, or control.
- Alternatives: Fully manual Add Tool, automatic save, favicon retrieval, or runtime AI Icon generation.
- Consequences: Suggestion failure preserves form content and falls back to manual entry. URL handling reuses Link Check network safeguards and does not read authenticated pages or store page bodies.
- Evidence/Links: `project.md` `F-016` and `FR-100` through `FR-106`; `design.md` `S-004`.

### D-020: Make Aliases editable for every tool

- Status: Active
- Date: 2026-07-18
- Context: The user accepted `P-019 Search Aliases` and specified that both Add Tool and Manage must support Alias editing, including tools preloaded by the website.
- Decision/Finding: Accept `P-019` as `F-017 Search Aliases`. Aliases are searchable, non-visible keywords maintained in Add Tool and the common Manage Edit Tool window for both preloaded and Owner-added tools.
- Why: Abbreviations and task words make tools easier to find without expanding the visible Tag system.
- Alternatives: Search only names/descriptions/Tags, allow Alias editing only during creation, or lock preloaded tools.
- Consequences: Aliases sync across devices, do not appear as Tags or names, and require a warning against passwords, Tokens, API Keys, and other sensitive content.
- Evidence/Links: `project.md` `F-017` and `FR-107` through `FR-113`; `design.md` `S-004` and `S-005`.

### D-021: Warn about duplicates but allow repeated Aliases

- Status: Active
- Date: 2026-07-18
- Context: The user accepted `P-020 Duplicate Tool Warning` and clarified that Aliases may repeat while other identity fields should preferably differ.
- Decision/Finding: Accept revised `P-020` as `F-018 Duplicate Tool Warning`. Compare normalized URL, name, and domain; ignore Aliases. Exact URLs receive a clear warning, while name/domain matches are possible duplicates that Owner may continue past.
- Why: Shared search terms are expected across tools, whereas repeated URLs or names are more likely accidental duplicates.
- Alternatives: Treat Aliases as unique, block every same-domain record, or silently allow all duplicates.
- Consequences: Same-domain different paths remain valid. Preloaded and Owner-added tools use the same comparison rules, and no warning action automatically merges or overwrites data.
- Evidence/Links: `project.md` `F-018` and `FR-114` through `FR-120`; `design.md` `C-015`.

### D-022: Use practical personal-use success metrics

- Status: Active
- Date: 2026-07-18
- Context: Remaining Product Definition began after feature discovery closed.
- Decision/Finding: Success means use on at least 5 days per week, typical tool launch within 10 seconds, at least 90% of tool finding without external link records, Quick Add within 1 minute, consistent saved state across computer and phone, and 30 days without product-caused loss of hub data or settings.
- Why: These metrics measure habit, retrieval speed, centralization, entry effort, synchronization, and reliability for a personal-use product.
- Alternatives: Leave success subjective or use commercial acquisition and revenue metrics.
- Consequences: Validation and later release checks must measure these personal outcomes; commercial metrics remain out of scope.
- Evidence/Links: `project.md` Goals and Success Metrics.

### D-023: Support the Owner's computers and phones

- Status: Active with minimum-version TBDs
- Date: 2026-07-18
- Context: Product Definition required the actual personal device and browser scope.
- Decision/Finding: Support Windows 11 with Chrome and Edge; Mac Studio M4 with Safari and Chrome; iPhone with Safari and Chrome; and Android phone with Chrome.
- Why: These are the devices the Owner expects to use for the browser and installed PWA experience.
- Alternatives: Broad compatibility for every desktop, phone, and tablet platform.
- Consequences: Minimum supported browser/OS versions and tablet-specific support remain unconfirmed. Responsive and PWA validation must cover every confirmed device/browser combination.
- Evidence/Links: `project.md` Non-Functional Requirements.

### D-024: Use an Owner-only private cloud database

- Status: Active
- Date: 2026-07-18
- Context: Cross-device Sync requires one authoritative persistence source across computers and phones.
- Decision/Finding: Store hub tools, Tags, Aliases, favorites, Recent, ordering, preferences, layout, Icon references, and sync state in an Owner-protected private cloud database. Local device storage is limited to secure sessions and temporary UI state and is not authoritative.
- Why: A shared cloud source supports consistent online-only behavior across all confirmed devices.
- Alternatives: Browser-local-only storage, manual export/import, or storing independent application data.
- Consequences: Database provider, hosting model, and region remain for Development Definition. Independent app credentials, Tokens, files, and internal data remain prohibited, and file backup/import/export remains outside product features.
- Evidence/Links: `project.md` Data and Integration Requirements.

### D-025: Set measurable reliability boundaries

- Status: Active
- Date: 2026-07-18
- Context: Product Definition required a reliability target for the personal hub and cross-device state.
- Decision/Finding: Target 99.5% monthly hub availability, latest saved data within 5 seconds after another online device reloads, truthful save confirmation, retained form input and retry on failure, safe session expiry, and no product-caused loss of hub data or settings.
- Why: The hub must be dependable enough to replace scattered link records without pretending that failed writes or stale data are current.
- Alternatives: No measurable reliability target or treating linked-app outages as hub failures.
- Consequences: Independent application outages and access failures are excluded from hub availability. Database and network failure states must not expose stale protected data as safely editable current state.
- Evidence/Links: `project.md` Non-Functional Requirements.

### D-026: Deploy on Vercel within a small maintenance budget

- Status: Active
- Date: 2026-07-18
- Context: The user selected a deployment platform and accepted the proposed personal maintenance limits.
- Decision/Finding: Deploy the product on Vercel. Limit routine maintenance to 2 hours per month, review dependencies/auth/sync/PWA monthly, target high-risk security updates within 48 hours, retain manual Link Check, and prefer managed services with concise operational documentation.
- Why: The personal tool should remain useful without becoming a high-maintenance infrastructure project.
- Alternatives: Self-hosted infrastructure, no maintenance target, or continuous background link monitoring.
- Consequences: Database provider remains a separate decision. Development Definition must align architecture, deployment, OAuth, and documentation with Vercel and the maintenance budget.
- Evidence/Links: `project.md` Non-Functional Requirements.

### D-027: Provide global access with North American data residency

- Status: Active
- Date: 2026-07-18
- Context: The user was asked for the preferred data-hosting region and prioritized worldwide usability.
- Decision/Finding: Make the Vercel-hosted product globally reachable where dependencies are available. Prefer a Canadian database region; if the selected managed provider cannot meet that requirement, use a United States region.
- Why: The Owner wants to use the product globally while keeping personal hub data in Canada or the United States.
- Alternatives: Canada-only access, United States-only access, or unrestricted data residency with no regional preference.
- Consequences: Global reach and database residency are separate requirements. Development Definition must select a provider and region that preserve Owner-only authorization and acceptable latency.
- Evidence/Links: `project.md` Non-Functional Requirements.

### D-028: Use a rolling supported-browser policy

- Status: Active
- Date: 2026-07-18
- Context: Fixed browser and OS version numbers would become stale and increase personal maintenance cost.
- Decision/Finding: Support vendor-secured OS releases; current and previous major Chrome, Edge, and Safari; current and previous major macOS and iOS; current and previous two major Android releases; and supported Windows 11.
- Why: A rolling policy keeps the confirmed device matrix current without promising indefinite legacy compatibility.
- Alternatives: Fixed minimum version numbers, latest-version-only support, or best-effort support for all legacy releases.
- Consequences: Older versions may attempt access but do not receive PWA, layout, or full-function guarantees. The test matrix is refreshed during monthly maintenance.
- Evidence/Links: `project.md` Non-Functional Requirements.

### D-029: Exclude dedicated tablet support from MVP

- Status: Active
- Date: 2026-07-18
- Context: The confirmed device matrix included computers and phones but tablet scope remained open.
- Decision/Finding: iPad and Android Tablet are not formally supported in MVP.
- Why: The Owner does not need tablet support.
- Alternatives: Add dedicated tablet layouts, PWA installation validation, and release testing.
- Consequences: Tablets may attempt browser access on a best-effort basis, but layout, PWA installation, and complete functionality are not guaranteed or included in release testing.
- Evidence/Links: `project.md` Non-Functional Requirements.

### D-030: Require an accessible keyboard-first baseline

- Status: Active
- Date: 2026-07-18
- Context: Product Definition needed a minimum accessibility baseline across the confirmed Dashboard, navigation, forms, and themes.
- Decision/Finding: Require full keyboard operation, logical visible focus, accessible names and tooltips for icon-only controls, Enter launch for tools, Command Palette keyboard behavior, sufficient contrast, non-color-only status, reduced-motion support, and explicit programmatically associated English form errors.
- Why: The interface relies on compact labels, icon-only collapsed navigation, theme switching, and keyboard shortcuts, all of which need consistent accessible behavior.
- Alternatives: Mouse-only operation or deferring all accessibility decisions until after implementation.
- Consequences: Design Freeze and release validation must include keyboard, focus, contrast, motion, status, and form-error checks across supported devices and themes.
- Evidence/Links: `project.md` Non-Functional Requirements; `design.md` Accessibility.

### D-031: Set responsive personal-use performance targets

- Status: Active
- Date: 2026-07-18
- Context: Product Definition needed measurable interaction targets across supported computers and phones.
- Decision/Finding: Target interactive sign-in/Dashboard within 3 seconds, Search and Command Palette updates within 200 milliseconds for up to 500 tools, new-tab trigger within 500 milliseconds, and normal Add/Edit saves within 2 seconds with `Saving…` thereafter.
- Why: The hub is intended to reduce tool-finding friction and must feel faster than searching scattered links.
- Alternatives: No performance budget or targets based on linked-application load time.
- Consequences: Local layout/theme/View changes cannot wait for the server; static Icons require compression and caching; phone clients must avoid desktop-only large assets; linked-app loading is excluded from the hub target.
- Evidence/Links: `project.md` Non-Functional Requirements.

### D-032: Treat Online PS as an Owner-built image editor

- Status: Active
- Date: 2026-07-18
- Context: `Online PS` was ambiguous during initial inventory Tag mapping.
- Decision/Finding: `Online PS` is an online Photoshop-style image editor built by the Owner with Claude Code, not a Personal Statement tool.
- Why: The clarification determines its inventory description and appropriate usage Tags.
- Alternatives: Interpret `PS` as Personal Statement.
- Consequences: Treat it as an Owner-built creative tool. Development method alone does not automatically assign the `Developer` Tag; Tags describe tool purpose.
- Evidence/Links: `project.md` Known Initial Inventory.

### D-033: Confirm the initial inventory Tag mapping

- Status: Active
- Date: 2026-07-18
- Context: Product Definition needed initial Tags for the known tool inventory.
- Decision/Finding: Confirm the proposed initial mapping in `project.md`, including `StudyMate` as `ServiceNow` plus `Learn` and `Online PS` as `Design` plus `Productivity`.
- Why: Seed data can be prepared consistently while remaining editable through Manage.
- Alternatives: Leave all initial Tags blank or treat the mapping as immutable.
- Consequences: This is initial data only; the Owner may change Tags later without reopening product scope.
- Evidence/Links: `project.md` Confirmed Initial Tag Mapping.

### D-034: Freeze product scope at version 4.1-freeze

- Status: Active
- Date: 2026-07-18
- Context: Discovery and Product Definition Gates passed, and the Owner provided the required independent Product Freeze authorization.
- Decision/Finding: Freeze `project.md` at `4.1-freeze`, covering `F-001` through `F-018` and their associated product definition.
- Why: Design and later development need a stable, explicitly authorized product baseline.
- Alternatives: Continue changing MVP scope during design or defer the freeze.
- Consequences: New features enter Future Features by default. Behavioral or scope changes require explicit reopening. UI Freeze, implementation, deployment, OAuth setup, database creation, and release remain separately unauthorized.
- Evidence/Links: `project.md` Product Freeze.

### D-035: Name the product Phil's studio

- Status: Active
- Date: 2026-07-18
- Context: Design Definition began with the product identity question after Product Freeze.
- Decision/Finding: Use `Phil's studio` as the official display name with the exact confirmed capitalization.
- Why: The Owner explicitly selected this name.
- Alternatives: `Phil's Toolkit` or another product identity.
- Consequences: Use the name on Sign-in, Sidebar branding, browser title, PWA install identity, and accessible product-name references. Logo, Monogram, tagline, and PWA icon remain open design work.
- Evidence/Links: `design.md` `DD-004`.

### D-036: Use a blue-green glass visual system

- Status: Active
- Date: 2026-07-18
- Context: The Owner selected the final visual direction after considering alternative Dark Theme color families.
- Decision/Finding: Use a blue-green theme in Light and Dark modes. Cards retain glass translucency, layered shadows, and background gradients. Hover-capable cards show a glass-reflection sweep and thin bright theme-color edge motion at bottom-left and top-right. Tool Icons use varied colors inside unified semi-transparent rounded glass containers.
- Why: The Owner wants a consistent but visually rich glass interface and individually recognizable Icons.
- Alternatives: Graphite violet, emerald, charcoal blue, carbon orange, or flat opaque cards.
- Consequences: Text contrast and focus must remain readable; reduced-motion replaces moving reflection/edge effects with static highlights; touch devices cannot depend on hover; exact tokens and motion values remain adjustable until UI Freeze.
- Evidence/Links: `design.md` `DD-005`, Color, Icons and Imagery, Animation and Motion, and `C-006`.

### D-037: Keep frequent card and command interactions restrained

- Status: Active
- Date: 2026-07-18
- Context: The installed `emil-design-eng` Skill was used to review the Owner's requested glass reflection and corner-flow effects against interaction frequency, purpose, speed, interruptibility, performance, and accessibility.
- Decision/Finding: Card hover plays one `180–220ms` reflection and dual-corner edge-light pass, then remains statically highlighted without looping. Moving hover is limited to fine pointers; keyboard focus and reduced-motion use static feedback; Command Palette opens and closes without animation.
- Why: This preserves the Owner's visual concept while preventing high-frequency motion from feeling slow, repetitive, or distracting.
- Alternatives: continuous looping edge light, long hover animation, animated keyboard Command Palette, or removing the requested glass effects entirely.
- Consequences: Motion implementation must be interruptible, avoid layout changes, preserve the whole-card click target, and be reviewed on real pointer and touch devices.
- Evidence/Links: `design.md` `DD-006`, `C-006`, and `C-012`.

### D-038: Use a stable 248px/72px Sidebar transition

- Status: Active
- Date: 2026-07-18
- Context: Design Definition needed exact computer Sidebar widths and motion behavior after the Emil-guided card motion decision.
- Decision/Finding: Use `248px` expanded and `72px` collapsed widths with a `180–220ms` custom ease-in-out. Labels move at most `8px` with opacity; Icons stay stable; Main has no extra fade; rapid toggles retarget; reduced-motion switches width immediately with opacity-only Label feedback.
- Why: The Sidebar should communicate spatial change without making frequent navigation or Main content feel animated.
- Alternatives: Instant switching for everyone, a wide slow animation, rotating/scaling Icons, or reusing desktop behavior on mobile.
- Consequences: Implementation must verify layout-animation smoothness on supported computer browsers. Mobile uses a separate glass Drawer.
- Evidence/Links: `design.md` `DD-007`, `C-001`, and `C-003`.

### D-039: Keep Sidebar state local to each browser and device

- Status: Active
- Date: 2026-07-18
- Context: Sidebar persistence needed a clear boundary against confirmed Cross-device Sync and different viewport conditions.
- Decision/Finding: Remember expanded/collapsed state per local browser/device profile. Use viewport-based first-use defaults, always start the mobile Drawer closed, and avoid cloud synchronization of this UI state.
- Why: Windows, Mac, browsers, and phones need independent navigation density choices.
- Alternatives: Sync one Sidebar state across every device or reset it every visit.
- Consequences: Sign-out may keep the non-sensitive preference but must clear protected access. Initial render must avoid visible state flashing, and invalid local state falls back to the viewport default.
- Evidence/Links: `design.md` `DD-008` and `C-001`.

### D-040: Use an interruptible mobile glass Drawer

- Status: Active
- Date: 2026-07-18
- Context: Mobile navigation behavior remained open after computer Sidebar sizing and persistence were confirmed.
- Decision/Finding: Use a left overlay Drawer sized `min(86vw, 320px)`, opening around `240ms` and closing around `180ms` with `cubic-bezier(0.32, 0.72, 0, 1)`. Animate transform/backdrop opacity only and support backdrop, navigation, Esc, swipe, and velocity-based dismissal.
- Why: This preserves Main width on phones and follows the installed Emil design-engineering guidance for responsive, interruptible gesture motion.
- Alternatives: Fixed mobile rail, full-screen navigation page, symmetric slow timing, or non-interruptible animation.
- Consequences: Drawer includes navigation and Owner logout identity, handles focus return/trapping, respects reduced motion, and requires real-device pointer-capture, damping, and multi-touch testing.
- Evidence/Links: `design.md` `DD-009` and Responsive Behavior.

### D-041: Organize Settings into four focused sections

- Status: Active
- Date: 2026-07-18
- Context: Settings information architecture was a Design Definition blocker after its Navbar placement and Main rendering behavior were confirmed.
- Decision/Finding: Use `Appearance`, `Dashboard`, `Tags`, and `App` sections. Computer uses compact secondary navigation plus content; phone uses one vertical flow with no nested Drawer. Section changes are immediate and logout remains only in the Owner account menu.
- Why: The structure maps confirmed settings-related features without mixing session actions or adding mobile navigation complexity.
- Alternatives: One unstructured settings page, nested mobile Drawer, or duplicating logout in Settings.
- Consequences: Appearance contains Theme/View; Dashboard contains layout controls; Tags contains management and usage counts; App contains PWA and sync status. Exact controls remain adjustable until UI Freeze.
- Evidence/Links: `design.md` `S-003` and Interaction and State Rules.

### D-042: Use a restrained glass Sign-in page

- Status: Active
- Date: 2026-07-18
- Context: The standalone Sign-in page required final layout, copy, states, privacy, and motion decisions.
- Decision/Finding: Use a centered glass panel on a blue-green gradient with `Phil's studio`, `Your tools, one place.`, `Continue with Google`, and `Private access for the owner.` Confirm concise English loading, non-Owner, network, and expired-session copy.
- Why: The screen should establish product identity while remaining private, direct, and low-friction.
- Alternatives: Dashboard login modal, visible Owner email, animated background/edge effects, or long explanatory copy.
- Consequences: No continuous decorative motion. Button press may use subtle `scale(0.97)` around `120–160ms`; reduced-motion uses color/opacity only; OAuth transition cannot be delayed; exact dimensions and typography remain adjustable.
- Evidence/Links: `design.md` `S-001` and `C-004`.

### D-043: Use a compact personalized Dashboard welcome area

- Status: Active
- Date: 2026-07-18
- Context: Dashboard content needed a welcome treatment consistent with the supplied visual reference and frozen product scope.
- Decision/Finding: Place a compact glass welcome area below Navbar with a time-aware greeting using the Google Profile display name, `Your tools are ready when you are.`, and one `Add Tool` action. Fall back to `Welcome back` when the name is unavailable.
- Why: It gives the Dashboard identity and a useful creation action without duplicating Search or rejected analytics.
- Alternatives: No welcome area, a large marketing hero, duplicate `Launch a tool`, or Frequent/Activity usage panels.
- Consequences: Never show the allowlist email. The welcome panel has no hover flow animation, mobile height is reduced, and the collection area follows saved customization while its current initial/reset template follows `D-080`.
- Evidence/Links: `design.md` `S-002` and `C-016`.

### D-044: Use compact 4/6/8 Dashboard collection previews

- Status: Active
- Date: 2026-07-18
- Context: The Dashboard sections needed exact density, item limits, and navigation behavior.
- Decision/Finding: Dashboard Favs shows up to 4 compact items, Recent shows up to 6 list rows, and All previews up to 8 tools. Favs and All provide View-all navigation; Grid/List content follows confirmed data rules.
- Why: The Dashboard stays scannable while full collections remain available from Sidebar destinations.
- Alternatives: Render every item on Dashboard, use large individual tool cards for Recent instead of compact rows inside the `D-079` parent Card, or add Frequent/open-count analytics.
- Consequences: The former 4/6/8 Dashboard density and multi-row Favs behavior are superseded by `D-080`; the two-Tag cap, no-placeholder rule, Sidebar access, whole-item external launch, and restrained glass hover remain active.
- Evidence/Links: `design.md` `C-017`, `C-018`, `C-019`, and Shared Dashboard Collection Rules.

### D-045: Use consistent full collection pages

- Status: Active
- Date: 2026-07-18
- Context: Full All, Favs, and Recent destinations needed a common hierarchy, scale behavior, empty states, and motion rules.
- Decision/Finding: Use a shared title/count/View header without duplicate Search. All uses horizontal Tags and 24-item `Load more`; Favs filters favorites by Tags with confirmed empty copy; Recent remains capped at 6 with Clear confirmation and confirmed empty copy.
- Why: The collection pages stay predictable and performant while Navbar Search remains the single discovery input.
- Alternatives: Duplicate page Search, infinite scroll, multi-line mobile Tags, or animated list transitions.
- Consequences: Filter/View changes are immediate; no large stagger; appended results may use subtle opacity only; whole-item launch and external arrows remain consistent.
- Evidence/Links: `design.md` `S-006`, `S-007`, `S-008`, and `C-020`.

### D-046: Make Manage an editing workspace

- Status: Active
- Date: 2026-07-18
- Context: Manage needed clear separation between editing a hub record and opening its external App, plus exact desktop/mobile editing behavior.
- Decision/Finding: Manage uses an editing table on computer and compact management rows on phone. Selecting a row opens Edit Tool, while only the northeast arrow launches the external App. Edit Tool is a right glass panel on computer and a near-full-screen sheet on phone.
- Why: This prevents accidental external navigation during maintenance and keeps management context visible while editing.
- Alternatives: Make the whole row launch the App, add a duplicate Manage Search field, use a centered modal, or provide permanent deletion.
- Consequences: Add Tool, Check Links, Visible/Hidden/All filters, drag plus accessible Up/Down ordering, and explicit favorite/visibility controls remain available. Edit motion uses an interruptible 220ms enter and 180ms exit with transform/backdrop opacity only; reduced motion is immediate. Save failures preserve content and unsaved close requires confirmation.
- Evidence/Links: `design.md` `DD-010`, `S-009`, `C-021`, and `C-022`.

### D-047: Use a single-surface Add Tool flow

- Status: Active
- Date: 2026-07-18
- Context: Quick Add needed an exact sequence, failure behavior, English feedback copy, and relationship to duplicate detection.
- Decision/Finding: Add Tool remains one continuous surface: enter `Tool URL`, select `Get details`, review or edit all fields, and select `Save tool`. Suggestions never create a tool or lock the full form; duplicate detection appears only when saving.
- Why: A single surface keeps a small personal tool fast and understandable while allowing the Owner to correct incomplete or incorrect metadata before saving.
- Alternatives: A multi-step wizard, automatic save after suggestions, a blocking full-form loader, or clearing values after an error.
- Consequences: Suggestions may fill Name, normalized Domain, and Icon; all other fields remain editable. Confirmed concise English copy covers loading, ready, partial, failure, saving, saved, and save-error states. Failures preserve entered content, and suggestion results use at most a short opacity-only transition with subtle press feedback.
- Evidence/Links: `design.md` `DD-011`, `S-004`, `C-015`, and `C-023`.

### D-048: Use three viewport-based responsive layouts

- Status: Active
- Date: 2026-07-18
- Context: The supported computers and phones needed exact shell breakpoints, padding, Sidebar defaults, and compact Navbar behavior.
- Decision/Finding: At `1200px+`, default to the expanded `248px` Sidebar; at `900–1199px`, default to the collapsed `72px` Sidebar; below `900px`, use the mobile Drawer with no fixed rail. Page padding is `32px`, `24px`, and `16px` respectively.
- Why: These ranges preserve useful Main width across desktop, compact windows, and phone landscape while keeping navigation predictable.
- Alternatives: Device-name detection, a fixed Sidebar on phone landscape, identical padding at every width, or animated whole-layout breakpoint transitions.
- Consequences: Navbar remains visible and preserves menu, Search, Theme, and Settings. Full Search may collapse to an accessible icon that opens the same Command Palette. Browser and installed PWA share identical rules, and breakpoint changes occur immediately without whole-page motion.
- Evidence/Links: `design.md` `DD-012`, `C-010`, and Responsive Behavior.

### D-049: Use a compact Geist typography system

- Status: Active
- Date: 2026-07-18
- Context: The blue-green glass interface needed a consistent, readable type hierarchy across Windows, macOS, iPhone, Android, browser, and PWA modes.
- Decision/Finding: Use Geist Sans with Inter and system fallbacks; reserve Geist Mono for shortcuts and limited technical information. Use confirmed page, section, tool, body, metadata, action, and phone title sizes and weights.
- Why: The modern neutral forms support fast scanning and glass surfaces without adding decorative complexity.
- Alternatives: Decorative product-name typography, all-uppercase labels, ultra-light text, or inconsistent native-only fonts.
- Consequences: `Phil's studio` uses Geist Sans at weight `700`. Body line height is approximately `1.5`; labels remain concise English. Font loading must preserve visible text and minimize layout shift through compatible fallbacks.
- Evidence/Links: `design.md` `DD-013`, Typography, and Design Tokens.

### D-050: Use exact blue-green glass material tokens

- Status: Active
- Date: 2026-07-18
- Context: The confirmed glass direction needed reproducible Dark and Light color values, opacity, blur, radius, shadow, and performance fallback rules.
- Decision/Finding: Use the confirmed blue-green background, gradient, primary, highlight, text, glass-surface, and border values in both themes. Cards use `18px` radius, Icon containers `12px`, and responsive `18px/12px` blur with `1px` borders.
- Why: Exact tokens allow later mockups and implementation to preserve one visual identity across platforms instead of approximating the glass effect independently.
- Alternatives: Animated ambient gradients, uniform Icon color, fixed heavy blur on every device, or lowering text contrast to preserve transparency.
- Consequences: Gradients remain static; Icon accents may vary inside unified containers. Readability takes priority by increasing surface opacity when necessary. Safari and constrained devices may reduce blur while retaining borders, shadows, opacity, and hierarchy.
- Evidence/Links: `design.md` `DD-014`, Color, and Design Tokens.

### D-051: Use a single-letter P product mark

- Status: Active
- Date: 2026-07-18
- Context: `Phil's studio` needed a distinct mark for Sign-in, Sidebar, favicon, and installed PWA surfaces without conflicting with the existing Online PS tool.
- Decision/Finding: Use a white uppercase `P` in a rounded-square blue-to-teal diagonal gradient, with approximately 26% corner radius. Use the confirmed tagline `Your tools, one place.`
- Why: The single letter remains legible at favicon and collapsed-Sidebar sizes while avoiding `PS` ambiguity.
- Alternatives: A `PS` Monogram, a decorative wordmark, transparent-edge PWA icons, or an animated glowing logo.
- Consequences: Expanded Sidebar shows mark plus product name; collapsed Sidebar shows only the mark; Sign-in uses a larger treatment. Produce 512, 192, 180, and 32 pixel assets plus a Maskable PWA version with an opaque background and safe central content. The mark remains static.
- Evidence/Links: `design.md` `DD-015`, Product Identity, and Icons and Imagery.

### D-052: Separate UI Icons from tool brand Icons

- Status: Active; Tool Icon visual grammar refined by `D-073`
- Date: 2026-07-18
- Context: Navigation controls and varied tool identities needed one predictable management system while retaining recognizable brands and a fallback for Owner-built Apps.
- Decision/Finding: Use Lucide for UI/navigation with confirmed mappings, sizes, and `1.75` stroke. Tool Icons prioritize official assets, then Simple Icons, a semantically close Lucide Icon, and finally a maximum-two-letter uppercase Monogram.
- Why: Separating interface symbols from tool identity keeps controls visually consistent without forcing every App into one generic color or symbol.
- Alternatives: Emoji, one universal tool Icon, uncontrolled mixed UI libraries, or generated runtime Icons.
- Consequences: Brand colors may vary inside unified glass containers; StudyMate may use `SM`. Icon-only controls require English accessible names and Tooltips. Third-party brand assets require trademark and license review before production adoption.
- Evidence/Links: `design.md` `DD-016` and Icons and Imagery.

### D-053: Use a four-pixel spacing and density system

- Status: Active
- Date: 2026-07-18
- Context: The interface needed exact spacing, control, card, row, touch-target, and responsive Grid values before visual mockups.
- Decision/Finding: Use the confirmed 4px-based token scale, 72px Navbar, 88px Sidebar brand area, 40px controls, 44px inputs and phone touch targets, defined card/row heights, responsive padding/gaps, and a four-to-one-column All Tools Grid.
- Why: A consistent density system keeps the personal Dashboard compact and scannable across large computers and phones without sacrificing interaction comfort.
- Alternatives: Ad hoc spacing, dense undersized controls, one Grid column count at every width, or animated Grid reflow at breakpoints.
- Consequences: Content can grow beyond minimum heights for zoom, wrapping, validation, and accessibility. Typography and touch targets cannot be reduced merely to fit more tools. Grid structure changes immediately with viewport width.
- Evidence/Links: `design.md` `DD-017`, Spacing and Grid, and Design Tokens.

### D-054: Treat accessibility states as component acceptance criteria

- Status: Active
- Date: 2026-07-18
- Context: The confirmed keyboard-first direction needed exact contrast, focus, error, announcement, zoom, modal-focus, and equivalent-input behavior before UI Freeze.
- Decision/Finding: Target WCAG 2.2 AA with `4.5:1` normal-text contrast, `3:1` large-text/essential-graphic contrast, a `2px` highlight focus ring plus `2px` offset, semantic landmarks, concise live regions, field and form-level errors, and managed modal focus.
- Why: The product must remain fully usable across keyboard, pointer, and touch and cannot allow glass transparency or motion to obscure operation or status.
- Alternatives: Color-only states, Hover-only discovery, drag-only ordering, silent async changes, or accessibility as a post-implementation visual review.
- Consequences: Core tasks need equivalent inputs; status includes text/icons; external links receive contextual new-tab labels; content remains usable at 200% zoom and with text spacing changes. Reduced motion removes sweeps, flowing edges, and position movement while retaining static feedback.
- Evidence/Links: `design.md` `DD-018` and Accessibility.

### D-055: Use shell-first non-blocking loading states

- Status: Active
- Date: 2026-07-18
- Context: Tool collections, forms, refreshes, pagination, and the online-only PWA needed loading behavior that feels fast without flashes, blocking, or misleading offline data.
- Decision/Finding: Render Sidebar/Navbar first; omit Skeletons for responses within 250ms and otherwise use size-matched static glass placeholders with no moving Shimmer. Keep old data during refresh, localize action loading, preserve pagination position, and show Empty only after confirmed success.
- Why: Delayed, static placeholders avoid unnecessary flicker and decorative motion while preserving product structure and perceived speed.
- Alternatives: Whole-page spinner, immediate flashing Skeleton, moving Shimmer, replacing valid data during refresh, or artificial minimum loading time.
- Consequences: Region errors retain the shell and offer `Retry`; Skeletons are not focusable or individually announced. The offline state uses `You’re offline.`, `Phil's studio needs an internet connection.`, and `Try again`, without implying offline synchronization.
- Evidence/Links: `design.md` `DD-019`, `C-024`, and `S-010`.

### D-056: Use restrained Toasts and focused confirmations

- Status: Active
- Date: 2026-07-18
- Context: Completed background actions, reversible visibility changes, failures, and consequential decisions needed consistent feedback without duplicating form errors or introducing a notification feature.
- Decision/Finding: Place up to three Toasts bottom-right on desktop and above the safe area on phone. Success lasts 3s, information 4s, and Error/Retry remains. Hide Tool provides `Tool hidden` with `Undo`; Restore and Link Check use confirmed concise copy. Consequential actions use confirmation dialogs.
- Why: Toasts keep global feedback visible but lightweight, while inline errors and focused dialogs remain better for correction or deliberate decisions.
- Alternatives: Toast every interaction, replace form errors with Toasts, show a blocking confirmation before Hide, add a notification center, or use long/bouncy motion.
- Consequences: Theme/View/filter/Search/launch changes stay silent. Toasts use 180ms enter and 140ms exit, pause while interacted with or when the document is hidden, remain keyboard operable, do not steal focus, and use opacity-only reduced motion. Clear Recent, Reset Layout, unsaved close, and duplicate save retain confirmation dialogs.
- Evidence/Links: `design.md` `DD-020`, `C-025`, and `C-026`.

### D-057: Use immediate synchronized Theme and View controls

- Status: Active; Navbar Theme presentation refined by `D-071`
- Date: 2026-07-18
- Context: The Navbar quick Theme action, Settings three-state Theme choice, and shared Grid/List preference needed exact behavior across devices and collections.
- Decision/Finding: Navbar directly toggles Light/Dark; when Auto is active it displays the resolved Theme and activation chooses the opposite explicit value. Settings retains Light/Dark/Auto. Grid/List uses an Icon-plus-text segmented control shared by All, Favs, and Dashboard All Preview.
- Why: Quick controls remain compact while Settings preserves complete preference control, and one View behavior prevents collection pages from drifting apart.
- Alternatives: Put Auto in the Navbar switch, force phone to List, reload on Theme change, reset filters/scroll on View change, or animate every card after switching.
- Consequences: Auto synchronizes as a preference but resolves from each device's system. Theme uses at most a 150ms color/surface transition and is immediate under reduced motion. View synchronizes, remains available on phone, preserves Tag/scroll context, and produces no Toast or stagger.
- Evidence/Links: `design.md` `DD-021`, `C-027`, Theme, and Interaction and State Rules.

### D-058: Use safe compact Tag management

- Status: Active
- Date: 2026-07-18
- Context: Settings Tags needed exact creation, rename, validation, visibility, association, ordering, device, and feedback behavior.
- Decision/Finding: Use compact rows with Tag name, tool count, visibility, and reorder controls. Names allow concise English letters, numbers, spaces, and hyphens up to 18 characters; trim outer spaces, reject case-insensitive duplicates, and reserve All/Favs/Recent/Search/Open.
- Why: Strict short names protect the compact Tag-tab layout while safe Hide and inline validation prevent broken tool associations or lost edits.
- Alternatives: Random Tag colors, deleting in-use Tags, case-sensitive duplicates, drag-only ordering, or a Toast for every small change.
- Consequences: In-use Tags can be renamed or hidden but not deleted. Hidden Tags remain associated, disappear from filters, and appear as `Hidden` in tool editing. Order synchronizes and uses drag plus Move up/down equivalents; feedback remains inline.
- Evidence/Links: `design.md` `DD-022`, `C-008`, `C-028`, and `S-003`.

### D-059: Use a keyboard-first Command Palette layout

- Status: Active
- Date: 2026-07-18
- Context: The shared Search/Ctrl+K surface needed exact desktop/mobile dimensions, default content, matching fields, result rows, empty copy, focus return, and motion behavior.
- Decision/Finding: Use a top-centered 640px/70vh glass panel on computer and a near-full-width safe-area top Sheet on phone. Autofocus Search; with no query show up to four Recent Tools plus common Commands; match Name, Description, Tags, and Aliases.
- Why: One compact, predictable surface supports rapid keyboard launch while remaining usable on phone and avoiding a duplicate Search experience.
- Alternatives: Full-page Search, saved query history, animated opening, mixed ungrouped results, or destructive management Commands.
- Consequences: Results show Icon/name/supporting context and tool arrows; matching highlights do not change row height. Arrow keys, Enter, and Esc operate immediately. Exact no-result copy is confirmed, queries remain ephemeral, and focus returns to the correct invoker.
- Evidence/Links: `design.md` `DD-023` and `C-012`.

### D-060: Use manual non-destructive Link Check states

- Status: Active
- Date: 2026-07-18
- Context: Link Check needed exact status Icons, meanings, colors, timestamps, progress, failure continuation, reduced-motion, and execution timing.
- Decision/Finding: Use Working/CircleCheck/green, Check/TriangleAlert/amber, Unknown/CircleHelp/neutral, and Checking/LoaderCircle with text. Provide `Check link`, `Check links`, relative Last checked plus exact date on Hover/focus, and batch progress such as `Checking 3 of 12`.
- Why: Cautious, text-supported statuses help the Owner review uncertain login, permission, and timeout results without treating network ambiguity as deletion-worthy failure.
- Alternatives: Binary valid/broken labels, color-only badges, auto-scheduled checking, blocking the entire Manage screen, or stopping a batch after one failure.
- Consequences: Checks are manual, partial failures continue, unrelated management and external launch remain available, completion uses `Link check complete`, and reduced motion uses a static progress Icon. Status never changes tool data, favorite, visibility, or availability automatically.
- Evidence/Links: `design.md` `DD-024` and `C-013`.

### D-061: Use immediate safe Dashboard customization

- Status: Active
- Date: 2026-07-18
- Context: Dashboard layout settings needed exact row controls, accessible ordering, visibility validation, immediate result, save feedback, reset confirmation, and synchronization failure behavior.
- Decision/Finding: Manage Favs/Recent/All through rows with drag plus Move up/down, Visible switches, and immediate Dashboard updates. Keep at least one visible with exact validation copy. Reset uses confirmed dialog copy and restores all three using the current default template defined by `D-080`; fixed Quick Access is outside this editor.
- Why: Direct settings make a small personal Dashboard easy to customize while preserving predictable global navigation and recovery.
- Alternatives: Separate visual layout-builder mode, hiding Sidebar destinations, silently allowing an empty Dashboard, Toasting every reorder, or animated section flying.
- Consequences: Hidden applies only to Dashboard. Changes synchronize with inline Saving/Saved; failure preserves controls and offers Retry. Reset requires confirmation, and ordering/visibility changes avoid large motion.
- Evidence/Links: `design.md` `DD-025` and `C-014`.

### D-062: Use capability-aware App and Install settings

- Status: Active
- Date: 2026-07-18
- Context: Settings App needed precise PWA install availability, synchronization, support guidance, loading, and excluded-action behavior across the confirmed browsers and devices.
- Decision/Finding: Divide App into Install, Sync, and Support. Use Installed/Available/Browser setup required based on actual install capability; show Install app only when callable and otherwise show relevant setup guidance. Use Synced/Syncing/Sync issue, Last synced, and Retry.
- Why: Capability-driven presentation avoids dead installation controls and remains accurate across browser and PWA differences while keeping the personal settings page compact.
- Alternatives: Universal install button, store badges, dense browser version tables, backup/export controls, or celebration animation.
- Consequences: State that internet is required; list confirmed supported device/browser families and Tablet Best effort. Local actions alone show loading; installation updates inline. Browser and PWA share auth, data, Theme, and View; no notification bell is added.
- Evidence/Links: `design.md` `DD-026`, `C-029`, and `S-003`.

### D-063: Use safe private authentication and session feedback

- Status: Active
- Date: 2026-07-18
- Context: Owner-only Google OAuth needed final English error copy and exact behavior for retry, duplicate activation, non-Owner denial, session expiry, successful reauthentication, and Logout.
- Decision/Finding: Use confirmed general OAuth, non-Owner, network, and expired-session messages inside Sign-in. Redirecting blocks duplicate activation; failure restores retry. Non-Owner cannot enter or read protected data; expiry clears protected UI; success goes directly to Dashboard; Logout is immediate without confirmation.
- Why: Concise panel-local feedback helps the Owner recover while avoiding disclosure of the allowlist email or authorization/configuration details.
- Alternatives: Show the allowed email, expose matching logic, use auth Toasts, retain protected UI after expiry, confirm Logout, or show a success celebration/intermediate screen.
- Consequences: Authentication status remains panel-local, protected content disappears on expiry/logout, and the exact Owner email remains absent from user-visible content and project documentation.
- Evidence/Links: `design.md` `DD-027`, `S-001`, `C-004`, and `C-007`.

### D-064: Use clear preserving Add/Edit validation

- Status: Active
- Date: 2026-07-18
- Context: Add/Edit Tool needed final field requirements, limits, protocol safety, validation timing, focus, normalization, duplicate order, content preservation, and Alias behavior.
- Decision/Finding: Require Name up to 60, absolute HTTPS URL, at least one Tag, Source Owned/Third-party, and an Icon or Monogram fallback. Description is optional up to 160; up to ten Aliases of 32 characters each are optional. Reject unsafe schemes, trim values, and deduplicate Aliases only within the same tool.
- Why: Explicit limits keep data compact and safe while blur/save timing and preserved content help the Owner correct errors without disruptive validation.
- Alternatives: Continuous typing errors, disabled unexplained Save, HTTP/unsafe schemes, clearing failed forms, or treating Source as different launch behavior.
- Consequences: Save attempt focuses the first invalid field; URL normalization precedes duplicate detection; cross-tool Alias repetition remains allowed. Inline errors expose no implementation detail, and Alias Chips plus hidden Tags remain keyboard accessible.
- Evidence/Links: `design.md` `DD-028`, `C-030`, `S-004`, and `S-005`.

### D-065: Use a non-destructive Duplicate Warning choice

- Status: Active
- Date: 2026-07-18
- Context: Duplicate detection needed final exact-URL and possible-match copy, displayed identity, action outcomes, visual priority, focus behavior, and same-domain handling.
- Decision/Finding: Exact URL uses `This tool already exists.` with confirmed copy; name/domain uses `Possible duplicate` with confirmed copy. Show Icon, Name, URL, and up to two Tags. Offer Edit existing, Continue anyway, and Cancel with Cancel initially focused.
- Why: A contextual choice reduces accidental duplicates without preventing legitimate separate Apps or paths and without silently changing data.
- Alternatives: Automatic merge, hard-block exact URLs, danger-red continuation, disclose Aliases, or discard the Add form on close.
- Consequences: Edit existing intentionally leaves Add for the matched record; Continue anyway preserves and saves a distinct tool; Cancel returns to Save. Exact URLs may continue at lowest priority, Aliases never trigger, same-domain paths remain allowed, and the Dialog uses only optional short opacity motion.
- Evidence/Links: `design.md` `DD-029` and `C-015`.

### D-066: Provide direct Favorite without weakening tool launch

- Status: Active
- Date: 2026-07-18
- Context: The proposed Card/List composition initially omitted Favorite to protect whole-item launch, but the Owner needed a convenient way to favorite tools at the point of use.
- Decision/Finding: Keep the main Card/List surface as external launch and add a separate Star control with isolated events/focus. ExternalLink remains a cue in the launch surface. Define exact Grid/List Icon sizes, text clamps, Tag overflow, stable heights, target sizes, and keyboard order.
- Why: Direct Favorite removes the friction of visiting Manage for a frequent action while explicit interaction separation prevents accidental tool launch.
- Alternatives: Favorite only in Manage/Edit, make the external arrow a separate third action, or place overlapping controls without event isolation.
- Consequences: Favorite updates Favs immediately, rolls back with exact error copy on failure, and uses no Toast/celebration. Manage/Edit retain Favorite. Hidden tools are excluded from all launch collections, and long text/Icon fallback never shifts controls or item height.
- Evidence/Links: `design.md` `DD-030`, `C-006`, and `C-031`.

### D-067: Use a reviewed static Icon selector

- Status: Active; candidate visual grammar refined by `D-073`
- Date: 2026-07-18
- Context: Add/Edit Icon selection needed exact preview sizes, source groups, suggestion count, Monogram controls, save timing, fallback, keyboard behavior, and Codex/runtime boundaries.
- Decision/Finding: Show Grid/List previews and Suggested, Brands, Icons, and Monogram groups. Suggested provides 3–6 static options; Brands uses reviewed assets; Icons searches Lucide; Monogram allows 1–2 uppercase characters and limited accent presets. Label sources and persist only on Tool Save.
- Why: A structured registry makes Icon management consistent and transparent while keeping the Owner in control and avoiding runtime AI/API complexity.
- Alternatives: Runtime AI generation, unrestricted color picker, auto-save on selection, unlabelled mixed sources, or broken-asset empty space.
- Consequences: No Codex credentials/quota/session access. Missing or failed assets use Monogram with reselect available. Keyboard selection is supported, candidate changes avoid decorative motion, and brand assets require license/trademark review before registry inclusion.
- Evidence/Links: `design.md` `DD-031`, `C-009`, and `C-032`.

### D-068: Use final compact component sizing

- Status: Active
- Date: 2026-07-18
- Context: Sign-in, Welcome, Owner Menu, Navbar Search, virtual keyboard, safe-area, landscape, and zoom edge cases were the last unresolved sizing items before visual mockup review.
- Decision/Finding: Confirm the 440px/32px computer and inset/24px phone Sign-in panel, 56px mark, 44px sign-in action, 32px/20px Welcome padding, 220px Owner Menu, responsive 480px/280px Search, 8px Navbar action gap, and content-defined/stacked responsive behavior.
- Why: Exact compact dimensions make the upcoming visual mockup reproducible while preserving phone comfort, safe areas, keyboard visibility, and zoom reflow.
- Alternatives: Fixed-height Welcome, email in account menu, narrow Search at all widths, ignoring virtual keyboard/safe areas, or horizontal clipping at zoom.
- Consequences: Phone landscape stays Drawer-based; Add Tool becomes full-width in stacked Welcome; Command Palette keeps input visible; iPhone overlays/status respect insets; 200% zoom may wrap and stack. Settings remains absent from the account menu.
- Evidence/Links: `design.md` `DD-032`, `S-001`, `C-007`, `C-010`, and `C-016`.

### D-069: Generate a five-frame visual mockup review pack

- Status: Active
- Date: 2026-07-18
- Context: Textual Design Definition and final component sizing are sufficiently complete for the Owner to review the first visual direction before UI Freeze.
- Decision/Finding: Generate Desktop Dark Dashboard, Desktop Light Dashboard, Mobile Dark Dashboard, standalone Sign-in, and Desktop Manage/Edit review frames using the confirmed English-only blue-green glass system and frozen feature scope.
- Why: Visual evidence lets the Owner identify composition and polish changes that textual specifications cannot reveal before UI Freeze and development planning.
- Alternatives: Freeze UI from text only, begin development without visual review, or generate only one screen/theme.
- Consequences: Mockups are review material rather than code or final assets. They must exclude Notification, Activity, Frequent, visible Open buttons, usage analytics, runtime AI, and other unconfirmed scope. Owner refinements remain allowed before explicit UI Freeze.
- Evidence/Links: `design.md` `DD-033` and References and Links.

### D-070: Strengthen layered glass and card gradient depth

- Status: Active
- Date: 2026-07-18
- Context: The first visual review made the Card surfaces feel closer to ordinary dark panels than the more dimensional glass treatment shown in the Owner's new Dashboard and Sign-in references.
- Decision/Finding: Use stronger translucent multi-stop blue-green gradients, inset highlights, environmental shadows, low-opacity themed glow, and restrained one-shot reflection plus corner edge-light motion on eligible Tool Cards. Preserve a quieter material hierarchy for functional panels, Navbar, and Sidebar. Use the Sign-in references only for gradient, spacing, and material qualities; retain Google OAuth as the sole authentication control.
- Why: Layered material cues make glass legible in both themes and separate cards from the background while preserving the confirmed blue-green identity and fast-scanning dashboard hierarchy.
- Alternatives: Keep nearly flat dark panels, apply equally strong glass to every surface, use continuous animated gradients, or copy the references' email/password and registration controls.
- Consequences: The next visual revision must show more visible card depth in Dark and Light themes, keep colorful Icons clear, gate hover motion to fine pointers, remove it for reduced motion, and exclude email/password, registration, notification, Activity, Frequent, and other unconfirmed controls.
- Evidence/Links: `design.md` `DD-034`, Theme, Color, Animation and Motion, and References and Links.

### D-071: Show only the opposite Theme in the Navbar

- Status: Active
- Date: 2026-07-18
- Context: The material-validation mockups displayed Light and Dark as simultaneous Navbar choices, creating unnecessary visual weight and ambiguity about whether labels represented current state or available actions.
- Decision/Finding: Keep the confirmed layered Card gradients and glass material. Replace the two-choice Navbar Theme presentation with one compact opposite-Theme action: Light mode shows only `Dark`, and Dark mode shows only `Light`. Keep `Auto` exclusively in Settings.
- Why: A single action is faster to scan, uses less Navbar space, and makes the next result of activation explicit while preserving complete Theme preference control in Settings.
- Alternatives: Show both Light and Dark simultaneously, use an unlabeled Icon-only toggle, or expose Auto in the Navbar.
- Consequences: The action label and Icon always represent the destination Theme; accessible names use `Switch to ... theme`; Auto resolution determines the opposite action until activation replaces Auto with an explicit Theme.
- Evidence/Links: `design.md` `DD-021`, `DD-035`, Theme, and Accessibility.

### D-072: Use a compact pill Theme-toggle visual

- Status: Active
- Date: 2026-07-18
- Context: The Owner supplied a close-up visual reference for the Navbar Theme control after confirming the single opposite-Theme behavior.
- Decision/Finding: Style the action as one compact rounded glass pill containing a destination Theme Icon, bold destination label, and decorative switch-shaped indicator. Keep the whole control as one semantic button and retain the confirmed blue-green accent system.
- Why: The reference provides a recognizable, space-efficient Theme affordance while a single semantic target avoids nested-control ambiguity for keyboard and assistive-technology users.
- Alternatives: Plain text button, Icon-only button, two-choice segmented control, or a separately focusable switch nested inside the pill.
- Consequences: Light still shows only `Dark`, Dark still shows only `Light`, Auto remains in Settings, the indicator is not independently interactive, and focus/press feedback applies to the complete pill.
- Evidence/Links: `design.md` `DD-035`, `DD-036`, Theme, and Accessibility.

### D-073: Normalize every Tool Icon to one tinted line-Glyph system

- Status: Active
- Date: 2026-07-18
- Context: The visual mockups mixed full-color brand tiles, filled illustrations, gradients, and line Icons, making the Card collection feel inconsistent despite shared containers.
- Decision/Finding: Use one single-color line Glyph per tool inside a same-hue translucent rounded-square container. Normalize Glyph size, stroke, optical scale, alignment, container, border, opacity, and radius. Allow different restrained accent colors for recognition.
- Why: Consistent geometry and rendering style let the dashboard scan as one system while color and tool names retain individual identity.
- Alternatives: Original full-color logos, mixed icon libraries, 3D or illustrated app tiles, universal one-color Icons, or runtime-generated Icons.
- Consequences: Brand assets must be line-compatible and normalized; otherwise use a semantic line Glyph or unified one/two-letter Monogram. Icon selector previews and all Grid/List surfaces must use the same grammar in Dark and Light Themes.
- Evidence/Links: `design.md` `DD-016`, `DD-031`, `DD-037`, `C-009`, and Icons and Imagery.

### D-074: Use an editorial split layout for Grid Tool Cards

- Status: Superseded by `D-075`
- Date: 2026-07-18
- Context: The Owner supplied a Card-layout reference with large three-column Cards, a clear left information block, and a right-side visual field.
- Decision/Finding: Grid Tool Cards use an editorial split composition with unified line Icon, Name, Description, and Tags on the left, plus a faded non-interactive static visual field on the right. Use three/two/one responsive columns. Preserve whole-Card launch, separate Favorite, and ExternalLink cue without a visible Explore/Open button.
- Why: The larger composition creates stronger hierarchy and gives the confirmed glass gradients, consistent Icons, and each tool's identity enough visual space without changing launch behavior.
- Alternatives: Retain compact four-column cards, copy the reference's Explore buttons, use live App screenshots, or animate/parallax the decorative artwork.
- Consequences: Standard Grid Cards become at least 232px high; Dashboard Grid sections adopt the same composition within available width; List and Recent rows remain compact. Missing art uses a deterministic themed texture, and decorative media never blocks content, accessibility, or launch.
- Evidence/Links: `design.md` `DD-038`, `C-006`, `C-017`, `C-019`, Spacing and Grid, and Responsive Behavior.

### D-075: Apply the reference only to vertical Card content order

- Status: Active
- Date: 2026-07-18
- Context: The Owner clarified that the supplied reference described the internal Card layout, not a forced three-column Grid or a right-side artwork field, and identified the northeast arrow as the control to retain.
- Decision/Finding: Restore the existing four/three/two/one collection Grid and existing Dashboard columns. Use a smaller unified Icon, then Name, Description, and bottom Tags. Retain the independent Favorite Star and the northeast `ExternalLink` launch cue; the arrow is not Edit.
- Why: This matches the requested scanning hierarchy without adding unnecessary artwork, changing collection density, or confusing external launch with editing.
- Alternatives: Three-column editorial cards, right-side static artwork, visible Explore/Open button, or treating ExternalLink as an Edit action.
- Consequences: Standard Grid Card minimum height is 168px; no decorative media asset or new data field is required; collection Cards still launch from the whole non-Star surface; editing remains in Manage/Edit Tool.
- Evidence/Links: `design.md` `DD-038`, `C-006`, `C-017`, `C-019`, and Spacing and Grid.

### D-076: Stop mockup iteration and use the design specification as authority

- Status: Active
- Date: 2026-07-18
- Context: After reviewing multiple generated visual directions, the Owner chose to stop refining raster mockups and evaluate the final look later in the working product.
- Decision/Finding: Do not generate more pre-development mockups. Treat existing generated images as non-binding visual references; `design.md` remains the implementation authority.
- Why: Generated mockups were no longer improving confidence efficiently, while the confirmed written design already defines the required layout, material, interaction, responsive, and accessibility behavior.
- Alternatives: Continue generating visual variants or adopt the latest raster mockup as a pixel-accurate target.
- Consequences: The Design Quality Gate passes without making any generated image authoritative. Later visual refinements require an explicit design change and cannot silently expand frozen product scope.
- Evidence/Links: `design.md` `DD-039` and Design Status and UI Freeze.

### D-077: Freeze UI before defining implementation

- Status: Active
- Date: 2026-07-19
- Context: The Owner explicitly authorized `Freeze UI` and asked whether Claude Design and Google Stitch code export should happen before Development Definition.
- Decision/Finding: Freeze `design.md` at `5.8-freeze` and advance to Development Definition. Design tools may be used for non-binding visual exploration, but generated or exported code must not be adopted as the implementation baseline until `development.md` defines the stack, architecture, security, data, tests, and implementation workflow.
- Why: Defining engineering constraints first prevents generated UI code from silently choosing incompatible frameworks, authentication patterns, data access, component boundaries, or accessibility behavior.
- Alternatives: Generate and adopt Stitch code before technical definition, or skip design-tool prototypes entirely.
- Consequences: `development.md` is the next authority to create. After Implementation Ready, Claude, Stitch, Codex, or other tools may generate code only within the frozen Product, frozen UI, and confirmed Development Definition. UI changes require explicit reopening.
- Evidence/Links: `project.md` `4.1-freeze`; `design.md` `5.8-freeze`.

### D-078: Reopen UI Freeze for the Arctic Navy HTML style

- Status: Active
- Date: 2026-07-19
- Context: The Owner asked to revise the design UI styling according to the local `phil-toolkit-dark-desktop.html` after freezing `design.md` at `5.8-freeze`.
- Decision/Finding: Reopen UI Freeze and create `design.md` `5.9-draft`. Adopt the HTML's Arctic Navy shell, blue/indigo/cyan/teal glass depth, compact spacing, radius hierarchy, border highlights, and shadow language as the Dark visual reference.
- Why: The local HTML provides a concrete visual source that better represents the desired polished glass UI than the earlier generated raster mockups.
- Alternatives: Keep `5.8-freeze` unchanged, adopt the HTML wholesale including its product behavior, or modify the HTML implementation directly.
- Consequences: Development Definition pauses until the Owner reviews and re-freezes UI. Product scope and behavior remain frozen; `Activity`, Notification, Frequent, usage ranking, email/password/registration, and visible `Open` text from the HTML remain excluded. The HTML is a style reference, not implementation authorization.
- Evidence/Links: `phil-toolkit-dark-desktop.html`; `design.md` `DD-040` and `5.9-draft`; `project.md` `4.1-freeze`.

### D-079: Make the Dashboard composition and utility controls unambiguous

- Status: Active
- Date: 2026-07-19
- Context: Claude Design produced an unsatisfactory result because the documents did not state the desired Theme control, Sidebar Workspace footer, and Favs/All/Recent spatial relationship strongly enough.
- Decision/Finding: Reopen the product presentation specification as `4.2-draft` and revise design to `5.10-draft`. Use one Theme pill containing Icon, destination label, and switch indicator with Settings immediately to its right; add `Make it yours` above an Owner Profile labeled `Personal workspace`; and use a default wide two-column Dashboard with Favs/All stacked left and one nested Recent parent Card right.
- Why: Explicit structural and acceptance language reduces interpretation drift when external design tools generate screens from the Markdown specifications.
- Alternatives: Rely only on screenshots, keep the old Favs/Recent/All sequence, place Recent rows directly on the page background, or add a Notification control from the reference.
- Consequences: No new Feature ID is added, but Product and UI Freeze both require renewed authorization. The default/reset layout changes; saved customization remains supported. Notification, Frequent, usage analytics, visible `Open`, and a second Theme button remain excluded.
- Supersedes: The default Dashboard composition portions of `D-006`, `D-017`, `D-043`, `D-044`, and `D-061`; their remaining decisions stay active.
- Evidence/Links: `project.md` `FR-050`, `FR-121` through `FR-124`, `AC-100` through `AC-103`; `design.md` `DD-041`, `C-010`, `C-017` through `C-019`, and `C-033`.

### D-080: Bound Dashboard height and restore strong nested-glass hierarchy

- Status: Active
- Date: 2026-07-19
- Context: The latest generated design made all Card gradients similarly pale, allowed Dashboard content to extend past the intended frame, and did not provide the requested fixed Favs/All/right-rail overflow behavior.
- Decision/Finding: Advance to `project.md` `4.3-draft` and `design.md` `5.11-draft`. Use exact HTML-derived strong Welcome/parent gradients with darker nested items; keep wide Dashboard content inside a viewport-height Shell aligned to the Sidebar bottom; make Favs and Dashboard Grid single-row horizontal rails; make Dashboard All default to a vertically scrolling List; and stack fixed-height Quick Access above remaining-height Recent on the right. Hide visual scrollbars without disabling scrolling. Quick Access shows three complete items at once; its selection source was resolved by `D-081`.
- Why: Explicit height ownership, overflow direction, and distinct material levels prevent external design generators from producing pale uniform Cards, uncontrolled page growth, or ambiguous nested panels.
- Alternatives: Let the page grow vertically, wrap Favs/Grid into additional rows, show platform scrollbars, keep Recent as the only right panel, apply one universal Card gradient, or invent a Frequent/ranking algorithm for Quick Access.
- Consequences: Product and UI Freeze remain reopened. Quick Access is a fixed utility outside the three-section layout editor for MVP. Wide screens use internal scrolling and bottom alignment; below `1200px` the fixed two-column height relationship is released into a vertical flow. Tool selection follows `D-081`.
- Supersedes: The Dashboard item-cap/density portions of `D-044` and the right-column composition portion of `D-079`; their remaining decisions stay active.
- Evidence/Links: `project.md` `FR-125` through `FR-131` and `AC-104` through `AC-109`; `design.md` `DD-042`, `C-016` through `C-019`, `C-034`, Shared Dashboard Collection Rules, and Responsive Behavior; `phil-toolkit-dark-desktop.html`.

### D-081: Populate Quick Access only through manual Pinning

- Status: Active
- Date: 2026-07-19
- Context: `D-080` fixed Quick Access layout and capacity but deliberately left its tool-selection source unresolved.
- Decision/Finding: Quick Access contains only tools the Owner manually enables with `Pin to Quick Access` in Add Tool, Edit Tool, or Manage. Sort most recently pinned first; unpin/re-pin moves a tool to the front. Sync Pin state/time across devices. Hidden tools retain Pin state but do not display until visible again.
- Why: Manual Pinning gives the Owner direct control, avoids duplicating Recent/Favs logic, and does not introduce rejected Frequent or usage-ranking analytics.
- Alternatives: Automatic Recent duplication, Favorites mirroring, frequently-used ranking, AI recommendations, or an additional drag-order editor.
- Consequences: Pin controls must not trigger external launch, failed saves roll back with Retry, Quick Access shows three complete items before internal scrolling, and the exact empty state is `No pinned tools.` / `Pin tools from Add, Edit, or Manage.` Product and UI drafts advance to `4.4-draft` and `5.12-draft`.
- Evidence/Links: `project.md` `FR-128`, `FR-132` through `FR-134`, and `AC-110` through `AC-112`; `design.md` `C-034` and `5.12-draft`.

### D-082: Use one Main glass Card and width-aware All List columns

- Status: Active
- Date: 2026-07-19
- Context: The tablet-sized reference did not fully express how the Dashboard should scale on longer/wider screens, and external design output could misread Navbar as another Card or leave Main without a containing glass frame.
- Decision/Finding: Make the entire region beside Sidebar one large glass Main Card. Render Navbar as an unboxed transparent row inside it while keeping Search as a control and giving Theme/Settings pronounced dark shadows. Render the signed-in Google identity as a transparent glass Owner Account Card. Align All and Recent bottoms to that Account Card bottom. Make Dashboard All List use 1/2/3 columns according to actual All-container width, and add exact single-line supporting copy below Quick Access and Recent headings.
- Why: One enclosing Main material creates a coherent shell; container-aware columns prevent overlong List items on ultra-wide displays; a shared baseline makes the composition feel deliberately fitted rather than uneven.
- Alternatives: Bare Main canvas, a separate Navbar Card, full-width single-column List items at every desktop width, fixed device-name breakpoints, opaque Owner identity tile, or wrapped panel descriptions.
- Consequences: Product and UI drafts advance to `4.5-draft` and `5.13-draft`. All List uses `<720px` one column, `720–1119px` two, and `1120px+` three based on its container. Supporting copy is `Pinned tools, ready when you need them.` and `Jump back into tools you opened.`
- Supersedes: The generic Sidebar-bottom alignment wording in `D-080`; the exact anchor is now the Owner Account Card bottom edge. Remaining `D-080` rules stay active.
- Evidence/Links: `project.md` `FR-135` through `FR-139` and `AC-113` through `AC-117`; `design.md` `DD-043`, `C-002`, `C-007`, `C-010`, `C-018`, `C-019`, and `C-034`.

### D-083: Show only complete nested items and scale Dashboard density with width

- Status: Active
- Date: 2026-07-19
- Context: The latest design matched the desired visual direction but exposed partial Cards at collection edges, collapsed All when switching to Grid, stopped increasing content capacity on wider screens, omitted Favorite Stars from All, and left Quick Access lower than necessary.
- Decision/Finding: Advance to `project.md` `4.7-draft` and `design.md` `5.15-draft`. Every repeated child viewport must start and settle on complete Card/row boundaries. All Grid becomes a stable two-row, column-flowing horizontal rail; All List/Grid both expose isolated Favorite Stars. Main width remains fluid. Favs and All Grid reveal 2/3/4/5 complete columns as their actual container grows, while All List retains 1/2/3 columns. Add `All` as the leading non-persisted filter. Raise Quick Access to the top of the collection rail with exactly three complete rows so Recent receives the remaining height.
- Why: Integer child units prevent accidental half-card composition; fixed two-row Grid geometry prevents View-switch collapse; container-aware density uses wide monitors without creating visually overlong Cards; moving Quick Access upward improves the fixed first-screen balance.
- Alternatives: Show partial Cards as an overflow cue, keep a one-row Grid, cap Main at the mockup width, stretch Cards to fill extra width, omit Favorite from All, treat `All` as a real Tag, or leave unused space above Quick Access.
- Consequences: Product and UI Freeze remain reopened. Internal rails need explicit child sizes, complete-boundary scroll alignment, hidden scrollbar chrome, and stable focus behavior. The two-row Grid portion supersedes the single-row Grid portion of `D-080`; its bounded-height, manual-Pin, material, and overflow-ownership decisions remain active.
- Evidence/Links: `project.md` `FR-143` through `FR-148` and `AC-121` through `AC-126`; `design.md` `DD-045`, `C-017`, `C-018`, `C-019`, and `C-034`.

### D-084: Add a luminous Widget rail with internal Calendar and To-Do

- Status: Active
- Date: 2026-07-19
- Context: The Owner preferred a new reference that expands the Dashboard beyond tool launching into a personal daily workspace, with a brighter Arctic-glass atmosphere and dedicated Calendar and To-Do panels.
- Decision/Finding: Advance to `project.md` `4.8-draft` and `design.md` `5.16-draft`. Add `F-019 Calendar Widget` and `F-020 To-Do Widget`. On ultra-wide screens use tools, access, and Widget zones; Welcome spans tools + access, while Calendar/To-Do stack at right. Adopt deep navy atmosphere with cyan lower-left/upper-right light and indigo-violet center/lower bloom. Calendar and To-Do use Phil's studio data only and sync across Owner devices.
- Why: The Widget rail adds useful planning context without weakening the primary tool hub, and the brighter positional light fields match the newly selected visual direction while retaining glass hierarchy and first-screen containment.
- Alternatives: Keep the prior two-zone Dashboard, make Calendar/To-Do decorative only, connect Google/Apple/Outlook immediately, add reminders/recurrence/collaboration, or use one identical gradient on every panel.
- Consequences: Product scope now includes two new Feature IDs and a full Tasks destination. Product and UI Freeze remain reopened. Development Definition must later cover task persistence, date/time-zone handling, authorization, synchronization, and responsive Widget layout. Third-party calendar/task integrations remain out of scope unless separately authorized.
- Supersedes: The two-column-only wide composition in `D-079` through `D-083` and the visually bounded Main-card interpretation in `D-082`; their tool behavior, complete-item, manual-Pin, bottom-baseline, and accessibility decisions remain active where compatible.
- Evidence/Links: `project.md` `F-019`, `F-020`, `FR-149` through `FR-160`, and `AC-127` through `AC-138`; `design.md` `DD-046`, `C-035`, `C-036`, and `S-011`.

### D-085: Separate the Dashboard atmosphere from individual Card colors

- Status: Active
- Date: 2026-07-19
- Context: The layout matched the new reference, but its color implementation did not reproduce the visible environmental lighting. The Owner began a surface-by-surface correction pass starting with the Dashboard background.
- Decision/Finding: Keep product behavior unchanged and advance only `design.md` to `5.17-draft`. The Dashboard environment uses a deep-blue base, a bright diffused cyan source with three to five asymmetrical fading branches, a softer upper-right cyan source, and several Violet-center emitters that radiate outward through Indigo before disappearing into blue. This environment remains behind Cards and is not copied into every Card gradient.
- Why: Separating atmosphere from Card materials preserves translucency and lets cyan/violet light appear through layout gaps without making every panel share the same incorrect gradient.
- Alternatives: Flat blue background, isolated circular cyan blobs, sharp symmetrical rays, Violet outside with Indigo at the center, baking the entire atmosphere into each Card, or continuous animated glow.
- Consequences: Per-Card colors remain intentionally unfinished and must be reviewed individually. Static atmosphere layers need responsive repositioning and contrast checks. `project.md` remains `4.8-draft` because no behavior or scope changed.
- Evidence/Links: `design.md` `DD-047`, `C-002`, and `5.17-draft`.

### D-086: Compose Welcome from local blue/indigo light and global Cyan bleed

- Status: Active
- Date: 2026-07-19
- Context: The Owner continued the surface-by-surface color pass by identifying Welcome's upper-left blue radials, below-right Violet/Indigo radiation, and Cyan-influenced right edge.
- Decision/Finding: Advance only `design.md` to `5.18-draft`. Welcome uses overlapping slightly lighter and deeper blue radials at upper-left. A compact Violet center below and right of center radiates through Indigo and blue. The right Cyan appearance comes primarily from the `DD-047` environment passing through Welcome's lower-opacity glass and backdrop blur, with only a very weak local cyan veil permitted for browser consistency.
- Why: Local blue/Violet emitters give Welcome its own composition, while true environmental Cyan bleed preserves the spatial relationship between the Card and Dashboard background.
- Alternatives: Flat horizontal gradient, two visibly circular blue spots, Indigo core with Violet outside, an opaque Cyan block owned by Welcome, or merging the Add Tool glow into the Card emitter.
- Consequences: Welcome remains static, translucent, rounded, and contrast-safe. Other Card colors remain unfinished. Product stays `4.8-draft` because no behavior changed.
- Evidence/Links: `design.md` `DD-048`, `C-016`, and `5.18-draft`.

### D-087: Make Favs uniformly pale-blue glass with positional Cyan bleed

- Status: Active
- Date: 2026-07-19
- Context: The Owner specified that the first visible Favs Card should show slight blurred Cyan influence from the background while the other Cards remain semi-transparent, faintly pale-blue glass.
- Decision/Finding: Advance only `design.md` to `5.19-draft`. All Dashboard Favs Cards share the same pale-blue translucent glass material. Cyan belongs to the left viewport/environment position rather than the first Favorite record or `:first-child`; its blurred center sits near the first visible Card's right-middle/lower-right edge, radiates leftward/outward, and fades before materially coloring the second Card.
- Why: Positional bleed reproduces physical glass over environmental light and remains correct when the horizontal rail scrolls or Favorite order changes.
- Alternatives: Permanently style the first Favorite, give every Card Cyan, use opaque navy Cards, randomize per-card gradients, or move the light together with a Card.
- Consequences: The rail remains unboxed, complete-item scrolling stays active, Icons retain individual colors, and hover cannot replace the glass base with a Cyan fill. Other Card materials remain pending. Product stays `4.8-draft`.
- Evidence/Links: `design.md` `DD-049`, `C-017`, and `5.19-draft`.

### D-088: Give All left Cyan exposure and right Violet-to-Navy radiation

- Status: Active
- Date: 2026-07-19
- Context: The Owner identified four material regions on the Dashboard All parent Card: blurred Cyan exposure at upper-left and left/lower-left, plus Violet radial regions at upper-right and across a large lower-right area.
- Decision/Finding: Advance only `design.md` to `5.20-draft`. All uses a Navy translucent base connecting two environment-owned Cyan exposures on the left with a smaller upper-right Violet-to-Indigo radial and a dominant lower-right Violet-to-Indigo-to-Navy radial. Nested rows remain quieter pale-blue/lavender glass and do not move the parent light fields during scrolling.
- Why: Separate local and environmental emitters reproduce the annotated composition while retaining a calm Navy reading surface and visible glass depth.
- Alternatives: One diagonal gradient, Cyan at right, Violet at left, opaque nested rows, one purple fill over the entire panel, or moving the parent gradient with List/Grid content.
- Consequences: All keeps fixed height, complete-item scrolling, stable List/Grid controls, and contrast-safe child rows. Other Cards remain pending. Product stays `4.8-draft`.
- Evidence/Links: `design.md` `DD-050`, `C-019`, and `5.20-draft`.

### D-089: Separate Quick Access Indigo/Cyan from Recent single-corner Cyan

- Status: Active
- Date: 2026-07-19
- Context: The Owner identified different color structures for the adjacent access panels. Quick Access has faint Indigo at upper-left and background-influenced Cyan at lower-right; Recent has only one Cyan diffusion entering from upper-right, with the remainder quiet translucent Navy.
- Decision/Finding: Advance only `design.md` to `5.21-draft`. Quick Access uses faint upper-left Indigo, Navy center, and lower-right Cyan environmental radial. Recent uses a stronger light-Navy glass scrim with exactly one upper-right Cyan environmental radial expanding toward the center. Both retain quieter nested rows and fixed parent fields during scrolling.
- Why: Separate emitter placement keeps the vertically stacked panels visually related without flattening them into one repeated gradient.
- Alternatives: Reuse one gradient, keep Recent's former lower-left teal and multi-edge glow, add Violet to Recent, make Quick Access uniformly teal, or allow child rows to carry independent large radials.
- Consequences: The Recent-specific lower-left teal radiation and left/bottom/right Cyan glow from `D-080`/`DD-044` are superseded. Layout, manual Pin, Recent behavior, internal scrolling, and shadows remain unchanged. Product stays `4.8-draft`.
- Evidence/Links: `design.md` `DD-051`, `C-018`, `C-034`, and `5.21-draft`.

### D-090: Connect Calendar's dual Cyan and Indigo emitters through solid Navy

- Status: Active
- Date: 2026-07-19
- Context: The Owner identified a dominant Cyan diffusion covering nearly all of Calendar's upper area, a second Cyan source at lower-left, an Indigo source at lower-right, and a pure non-transparent Navy field connecting all three.
- Decision/Finding: Advance only `design.md` to `5.22-draft`. Calendar uses a very broad upper-left Cyan radial, a smaller lower-left Cyan radial, a clipped lower-right Indigo radial, and a near-opaque pure Navy base. Every emitter transitions through blue into Navy; Cyan and Indigo do not connect directly without a Navy interval.
- Why: A solid Navy connection maintains readable calendar geometry and prevents the three large color regions from becoming a muddy teal-purple blend.
- Alternatives: Fully transparent Calendar glass, one diagonal gradient, direct Cyan-to-Indigo mixing, Violet parent emitter, equal-size Cyan sources, or allowing the background to control Calendar color placement.
- Consequences: Calendar is visually more solid than other Dashboard Cards while retaining glass border/depth. Its selected date keeps a separate blue-Violet highlight. The final date row now requires at least `26px` desktop bottom clearance, preferably `28–32px`, without increasing Dashboard height or clipping task dots/shadows. To-Do remains pending. Product stays `4.8-draft`.
- Evidence/Links: `design.md` `DD-052`, `C-035`, and `5.22-draft`.

### D-091: Give To-Do three unequal emitters and airy refined task density

- Status: Active
- Date: 2026-07-19
- Context: The Owner specified visible Cyan at To-Do upper-left, a high-intensity Indigo radial at upper-right, a very faint blurred Cyan haze at lower-right, Navy transition space, more bottom padding, and smaller better-spaced task controls/text.
- Decision/Finding: Advance only `design.md` to `5.23-draft`. To-Do uses strongest upper-right Indigo, clearly visible upper-left Cyan, very faint lower-right Cyan, and Navy intervals between them. Task checkbox visuals shrink to `16–18px` while retaining `40×40px` targets; titles, metadata, dots, rows, groups, Footer, and bottom padding receive explicit compact-but-airy dimensions.
- Why: Unequal emitter strengths match the annotated reference, while smaller visual controls plus deliberate spacing improve clarity and breathing room without harming accessibility.
- Alternatives: Equal-strength emitters, continuous Cyan-Indigo top band, strong lower-right Cyan, dense rows, small hit targets, or using the bottom edge to display a partial extra task.
- Consequences: To-Do may show one fewer complete task in exchange for `18–22px` pre-Footer space and at least `26px` bottom clearance. Internal scrolling remains available; Dashboard height remains fixed. Product stays `4.8-draft`.
- Evidence/Links: `design.md` `DD-053`, `C-036`, and `5.23-draft`.

### D-092: Make four auxiliary panels draggable and collapse empty columns

- Status: Active
- Date: 2026-07-20
- Context: The Owner wants Quick Access, Recent, Calendar, and To-Do to reorder vertically, move across the two auxiliary columns, and combine into one auxiliary column so the Dashboard can become a wider two-column composition.
- Decision/Finding: Advance to `project.md` `4.9-draft` and `design.md` `5.24-draft`. Keep Welcome/Favs/All anchored as the primary zone. Give each auxiliary panel a dedicated drag handle plus Move up/down/left/right alternatives. Empty auxiliary columns collapse and can be restored through an edge Drop zone. The expanded primary zone makes Welcome wider only, while Favs and All reveal more complete items/columns.
- Why: Panel-level reconfiguration supports changing work modes without destabilizing core tool navigation, and automatic primary-zone expansion uses released screen width productively.
- Alternatives: Drag every Dashboard surface, keep Quick Access fixed, support reorder only in Settings, leave empty tracks visible, stretch existing Cards, cap Favs at five, or compress all four auxiliary panels into one screen without column scrolling.
- Consequences: A combined four-panel auxiliary column scrolls internally by complete parent-panel boundaries. All List can reach four columns; Favs and All Grid no longer have a fixed five-Card visible cap. Layout persistence now stores stable panel IDs, column IDs, order, collapse state, and visibility. Product/UI Freeze remain reopened.
- Supersedes: The fixed Quick Access boundary in `D-081`, the three-section-only layout editor in `D-068`, and the five-visible-Card cap interpretation in `D-083`; manual Pin behavior, panel content, complete-item scrolling, and material decisions remain active.
- Evidence/Links: `project.md` `FR-161` through `FR-170` and `AC-139` through `AC-147`; `design.md` `DD-054`, `C-014`, `C-037`, Responsive Behavior, and `5.24-draft`.

### D-093: Replace the Mobile Sidebar with one Navbar Drawer entry

- Status: Active
- Date: 2026-07-20
- Context: The Owner clarified that Mobile View must not show a full, collapsed, or space-reserving Sidebar. Navigation should be reduced to one Icon in the Mobile Navbar that opens the Sidebar as a side Drawer.
- Decision/Finding: Advance to `project.md` `4.10-draft` and `design.md` `5.25-draft`. Below `900px`, remove the fixed Sidebar and its track completely. Put one accessible Menu Icon at the left of the Navbar and use it to open the existing glass navigation as a left overlay Drawer containing full navigation and Owner controls.
- Why: A single Navbar entry preserves limited phone width for Dashboard content while keeping navigation discoverable and consistent in mobile browser and installed PWA modes.
- Alternatives: Keep a `72px` icon rail, display the full Sidebar above Main, resize Main while the Drawer opens, add a floating second menu button, or use device-name detection.
- Consequences: The Drawer starts closed, overlays rather than reflows Main, locks background interaction, respects iPhone/Android safe areas, supports backdrop/selection/`Esc`/swipe dismissal, and restores focus to the invoking Navbar Icon. Desktop Sidebar expansion behavior remains unchanged.
- Evidence/Links: `project.md` `FR-171`, `FR-172`, `AC-148`, and `AC-149`; `design.md` `DD-055`, `DD-009`, `C-010`, Responsive Behavior, and `5.25-draft`.

### D-094: Stack the Mobile Welcome action below its supporting copy

- Status: Active
- Date: 2026-07-20
- Context: The reference layout kept `Add Tool` beside the greeting on Mobile, reducing responsive flexibility and compressing the text/action region.
- Decision/Finding: Advance to `project.md` `4.11-draft` and `design.md` `5.26-draft`. Below `900px`, stack the greeting, exact copy `Your tools, one place.`, and `Add Tool` vertically with one left edge. Keep the button compact rather than full width. Desktop retains the action on the right.
- Why: A vertical content flow gives the Mobile Welcome predictable room for text and touch interaction without squeezing the greeting or creating a visually dominant full-width button.
- Alternatives: Keep the button right-aligned beside the greeting, center it, stretch it full width, or move it outside Welcome.
- Consequences: Mobile Welcome becomes content-height; the button keeps a minimum touch target and may grow for enlarged text, while breakpoint changes restore the desktop split layout without animation.
- Evidence/Links: `project.md` `FR-173` and `AC-150`; `design.md` `DD-056`, `DD-032`, `C-016`, and `5.26-draft`.

### D-095: Hide scrollbar chrome globally without disabling scrolling

- Status: Active
- Date: 2026-07-20
- Context: Scrollbar tracks and gutters can consume responsive width, alter Card gaps, and make otherwise aligned desktop and Mobile layouts shift when content begins to overflow.
- Decision/Finding: Advance to `project.md` `4.12-draft` and `design.md` `5.27-draft`. Hide horizontal and vertical scrollbar chrome on every application-owned page and nested scroller, with no reserved gutter, while retaining native pointer, touch, keyboard, focus, and assistive scrolling.
- Why: Stable content boxes and gaps preserve the confirmed responsive composition across Chrome, Edge, Safari, Firefox, browser mode, and installed PWA mode.
- Alternatives: Hide only Dashboard scrollbars, reserve stable gutters, show thin custom scrollbars, disable overflow, or replace every scroller with pagination.
- Consequences: Every overflow surface needs cross-browser invisible-scrollbar styling and non-intrusive overflow discoverability where needed. QA must verify full content access without relying on dragging a scrollbar thumb.
- Evidence/Links: `project.md` `FR-174` and `AC-151`; `design.md` `DD-057` and `5.27-draft`.

### D-096: Extend the Dashboard atmosphere to every viewport edge

- Status: Active
- Date: 2026-07-20
- Context: The generated Dashboard exposed a pure-black layer around the top, bottom, and right edges, making the workspace look letterboxed and visually separating the confirmed environmental lighting from the viewport.
- Decision/Finding: Advance to `project.md` `4.13-draft` and `design.md` `5.28-draft`. Remove the ordinary Dashboard black matte and make its Navy/Cyan/Indigo/Violet environment the root edge-to-edge canvas. Preserve spacing as internal padding over that environment.
- Why: Continuous background coverage keeps the Dashboard immersive and prevents black exterior bands from weakening the glass-light composition or appearing as accidental responsive gaps.
- Alternatives: Retain the black capture frame, replace it with a uniform black Body, remove all shell padding, stretch every Card to the edge, or apply a permanent full-page dim overlay.
- Consequences: Body/root margin and fallback backgrounds must match the atmosphere, safe areas and overscroll cannot expose black, and local Card shadows must not combine into an opaque edge band. The Mobile Drawer backdrop remains the only temporary full-screen dim layer.
- Evidence/Links: `project.md` `FR-175` and `AC-152`; `design.md` `DD-058`, `DD-047`, and `5.28-draft`.

### D-097: Remove fixed Calendar width on Mobile

- Status: Active
- Date: 2026-07-20
- Context: The Mobile Calendar retained its desktop Widget width, producing a narrow Card with a large unused area to its right while adjacent Mobile panels correctly filled the column.
- Decision/Finding: Advance to `project.md` `4.14-draft` and `design.md` `5.29-draft`. Below `900px`, remove Calendar's fixed/minimum Widget width and make it fill Mobile Main. Build its seven weekday/date tracks from the Calendar's actual inner width and adapt padding/control wrapping.
- Why: Container-fluid sizing aligns Calendar with To-Do and uses narrow-screen space efficiently without sacrificing the seven-day structure.
- Alternatives: Center the narrow fixed Card, stretch only its background, horizontally scroll the date grid, hide weekend columns, or scale the Calendar as an image.
- Consequences: Calendar needs explicit `min-width: 0`, full available inline size, equal responsive grid tracks, adaptive padding, and narrow-text wrapping tests. Desktop auxiliary-column sizing stays unchanged.
- Evidence/Links: `project.md` `FR-176` and `AC-153`; `design.md` `DD-059`, `C-035`, Responsive Behavior, and `5.29-draft`.

### D-098: Keep every Calendar date inside its parent at all widths

- Status: Active
- Date: 2026-07-20
- Context: At some intermediate widths, Calendar became wider but retained an incompatible fixed height. Later date rows, dots, and selected states rendered beyond the rounded parent border.
- Decision/Finding: Advance to `project.md` `4.15-draft` and `design.md` `5.30-draft`. Calendar parent height must include its Header, navigation, weekday labels, six controlled date rows, state effects, gaps, and bottom padding. Below `1200px` it uses content-defined height; constrained desktop auxiliary columns scroll rather than permitting child overflow.
- Why: Width responsiveness is incomplete unless height is recomputed from the six-week grid. Explicit normal-flow row geometry prevents stale fixed measurements and improper display after resizing.
- Alternatives: Clip the final rows, allow visible overflow, reduce to five weeks, shrink text indefinitely, remove bottom padding, or keep a stale `height: 100%` Widget rule.
- Consequences: Calendar needs six explicit responsive row tracks, bounded selected-date geometry, correct parent sizing, resize/orientation/font remeasurement, and containment QA at intermediate widths and zoom levels.
- Evidence/Links: `project.md` `FR-177` and `AC-154`; `design.md` `DD-060`, `DD-052`, `C-035`, Responsive Behavior, and `5.30-draft`.

### D-099: Cancel old Card and background visual recipes pending new HTML

- Status: Active
- Date: 2026-07-20
- Context: The Owner will use Claude Design to generate a better-looking interface and later provide its exported HTML for reconstruction. Existing Product/Design documents contained extensive Arctic Navy gradients, exact colors, radial light sources, and per-Card transition directions that would constrain or distort that new design.
- Decision/Finding: Advance to `project.md` `4.16-draft` and `design.md` `5.31-draft`. Cancel all prescribed Card and large-background gradients, exact colors, emitter maps, glow colors, gradient directions, and old HTML-derived visual materials. Keep layout, content, interaction, hierarchy, responsive, overflow, state, and accessibility rules active. Visual appearance is `TBD` until the new HTML is approved and imported.
- Why: The future exported HTML should be reconstructed from its actual DOM/CSS/assets rather than blended with obsolete visual recipes or forced into the prior Arctic Navy palette.
- Alternatives: Keep the old gradients as mandatory, guess a new palette now, require flat colors, merge old and new styles automatically, or discard non-visual product/design rules together with the visual rules.
- Consequences: Claude Design has freedom over appearance but not product behavior or responsive correctness. Current visual reviews cannot require the old Navy/Cyan/Indigo/Violet look. After HTML delivery, create a new accepted visual-source decision before UI Freeze or implementation.
- Supersedes: Visual portions of `D-080`, `D-082`, `D-085` through `D-091`, `DD-034`, `DD-040`, `DD-042` through `DD-044`, `DD-046` through `DD-053`, and `DD-058`. Their non-visual layout, spacing, interaction, overflow, and accessibility decisions remain active.
- Evidence/Links: `project.md` `FR-131`, `FR-142`, `FR-151`, `FR-175`, `AC-109`, `AC-120`, `AC-129`, and `AC-152`; `design.md` `DD-061` and `5.31-draft`.

### D-100: Trial a very-light blue-Indigo veil on Cards only

- Status: Active
- Date: 2026-07-20
- Context: After cancelling the complex old gradients, the Owner wants to test a restrained common Card treatment: a very light transparent Indigo tint biased toward blue, with appropriate Card highlights.
- Decision/Finding: Advance to `project.md` `4.17-draft` and `design.md` `5.32-draft`. Apply one non-gradient blue-Indigo translucent veil to Card surfaces only, use weaker strength for nested Cards, and add subtle top/left inset and edge highlights. Keep page/Dashboard large backgrounds visually TBD and keep all old gradients/radial emitters cancelled.
- Why: A shared low-intensity veil can unify Cards and restore depth without constraining the future Claude Design with the former complex material maps.
- Alternatives: Restore the old per-Card gradients, use an opaque Indigo fill, tint the entire Dashboard background, add neon outlines, randomize Card colors, or leave every Card completely unstyled.
- Consequences: Dark/Light Themes need separate low-opacity ranges, parent/child hierarchy needs controlled strength, and contrast/fallback checks remain mandatory. This is reversible and may be replaced when the future HTML is approved.
- Supersedes: `D-099` only where it left Card base color/highlight fully TBD. `D-099` remains active for large backgrounds and for cancellation of all old gradients, radial emitters, exact material maps, and HTML-derived recipes.
- Evidence/Links: `project.md` `FR-178` and `AC-155`; `design.md` `DD-062` and `5.32-draft`.

### D-101: Make the desktop Sidebar shell colorless and fully transparent

- Status: Active
- Date: 2026-07-20
- Context: The Owner wants the final Dashboard large-background color and detail to remain clearer beneath the Sidebar instead of being faded by a tinted, frosted, or semi-opaque Sidebar panel.
- Decision/Finding: Advance to `project.md` `4.18-draft` and `design.md` `5.33-draft`. Treat the expanded desktop Sidebar and collapsed rail outer shell as a colorless fully transparent layout container. Do not use shell fill, tint, gradient, whole-shell opacity, backdrop blur/saturation, outer border, inset shell highlight, or full-height shadow. Preserve readable local navigation states and keep Workspace helper/Owner Account as independent `DD-062` Cards. Keep the Mobile Drawer as a separate modal surface.
- Why: An uninterrupted background preserves the intended page artwork and makes its color clearer while retaining Sidebar structure and interaction without introducing another competing material layer.
- Alternatives: Keep a blue-Indigo glass veil, use low whole-shell opacity, blur the backdrop, add a faint full-height border/shadow, make all child content float without local readable states, or also make the Mobile Drawer transparent.
- Consequences: Background contrast must be tested behind Sidebar content and corrected only through foreground/local row states. Future background HTML can change without requiring a Sidebar material redesign. Mobile Drawer remains visually separated for overlay readability.
- Supersedes: Any remaining Sidebar-shell visual `TBD` from `D-099`. It does not supersede `D-100` for independent Sidebar helper/account Cards or other Cards.
- Evidence/Links: `project.md` `FR-179` and `AC-156`; `design.md` `DD-063` and `5.33-draft`.

### D-102: Preserve the current WebGL background as V1

- Status: Superseded by `D-108`
- Date: 2026-07-21
- Context: The Owner explicitly named the current animated WebGL background `V1` and wants the phrase `return the background to V1` to restore this exact background state in future work.
- Decision/Finding: Treat the 2026-07-21 contents of `src/components/dashboard/SilkBackground.tsx` as the WebGL background V1 baseline. V1 uses SHA-256 `09DC38BC5E9B2DBC71E3312AC1E3E518C457F7665B296B266E5A34221D66CCD0`; palette entries `#0B0A2E` repeated three times, `#312E81` repeated three times, `#4F46E5`, and `#818CF8`; scene time multiplier `0.35`; shape values `(1.28, 0.47, 0.5, 0.0)`; surface values `(2.4, 0.98, 0.0, 1.0)`; finish values `(0.0, 0.0, 0.0, 0.01)`; transform seed `707.0`; no space offset; and cursor configuration `(0.0, 2.0, 0.65, 0.46)`. Preserve the current resize debounce, WebGL context-loss recovery, isolated stacking context, and GPU-layer safeguards as part of V1 implementation stability.
- Why: A named, traceable visual baseline allows experimentation with later WebGL backgrounds without losing the Owner-approved current appearance or confusing background restoration with unrelated UI rollback.
- Alternatives: Rely only on screenshots or an informal verbal description, call the entire application state V1, or roll back all UI changes together with the background.
- Consequences: When the Owner says `return to V1`, restore only the WebGL background implementation and its rendering safeguards to this baseline. Do not revert Cards, Sidebar, responsive layout, typography, controls, or other UI changes unless separately requested. Any later approved background baseline must receive a new version name rather than silently replacing V1.
- Evidence/Links: `src/components/dashboard/SilkBackground.tsx`; Owner instruction on 2026-07-21; verified file SHA-256 above.

### D-103: Preserve the current Warp background as V2

- Status: Superseded by `D-108`
- Date: 2026-07-21
- Context: After comparing several experimental backgrounds, the Owner approved the current Warp water effect with the V1 palette as a second named restoration baseline.
- Decision/Finding: Treat `src/components/dashboard/SkillBackround1.tsx` with SHA-256 `C61DE7DEA12C72FA2DBD223606616080905FBAADD294012B976B67E5D099D5A4` as background V2. V2 uses `@paper-design/shaders-react` `Warp` with proportion `0.45`, softness `1`, distortion `0.25`, swirl `0.8`, ten swirl iterations, `checks` shape, shape scale `0.1`, scale `1`, rotation `0`, speed `1`, and colors `#0B0A2E`, `#312E81`, `#4F46E5`, and `#818CF8`.
- Why: V2 preserves the approved liquid Warp appearance and V1-aligned palette while allowing further experiments in separate background components.
- Alternatives: Replace V1, continue changing `SkillBackround1.tsx` without a stable checkpoint, or identify V2 only through a screenshot.
- Consequences: When the Owner says `restore to V2`, restore the background imports to `SkillBackround1` and restore that file to the fingerprinted parameters above. Do not revert unrelated UI. V1 remains the independent `SilkBackground.tsx` baseline.
- Evidence/Links: `src/components/dashboard/SkillBackround1.tsx`; Owner instruction on 2026-07-21; verified file SHA-256 above.

### D-105: Preserve the preferred Warp background as V0

- Status: Superseded by `D-108`
- Date: 2026-07-21
- Context: After iterative Warp palette, highlight, visibility, and localized contrast tuning, the Owner identified the current background color state as the preferred restoration baseline and named it V0.
- Decision/Finding: Treat `src/components/dashboard/SkillBackground3.tsx` with SHA-256 `7440E68A7298D5E1A08A2538256348E29F79917446ECF7DD1FE626D3AF29C1C6` as background V0.
- Why: V0 preserves the Owner's preferred current background colors independently from later card, authentication, layout, and experimental-background changes.
- Alternatives: Replace V1, V2, or V3; identify the baseline only through screenshots; or include unrelated UI changes in a V0 rollback.
- Consequences: When the Owner says `return to V0`, restore Dashboard and secondary-page background imports to this exact V0 component state. Do not revert card styling, authentication, responsive behavior, or unrelated UI. V1, V2, and V3 remain separate baselines.
- Evidence/Links: `src/components/dashboard/SkillBackground3.tsx`; Owner instruction on 2026-07-21; verified file SHA-256 above.

### D-106: Implement Google OAuth with a server-enforced Owner allowlist

- Status: Active
- Date: 2026-07-21
- Context: The existing sign-in UI used a client-writable mock cookie and did not authenticate with Google or protect routes at a trusted boundary.
- Decision/Finding: Use Auth.js 5 with the Google provider, encrypted JWT sessions, a server-side `AUTH_OWNER_EMAIL` allowlist, Auth.js Route Handlers, and the Next.js 16 `src/proxy.ts` convention for protected application routes. Keep all credentials and the exact Owner email in ignored environment configuration.
- Why: This implements confirmed decision `D-004` without a database, removes the forgeable mock session, and ensures non-Owner Google accounts cannot establish an authorized application session.
- Alternatives: Retain the mock cookie, build custom OAuth/session cryptography, use client-only route checks, or add a database-backed multi-user account system.
- Consequences: Local and deployed environments require `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_OWNER_EMAIL`, and the correct `AUTH_URL`. Google OAuth clients must register the exact Auth.js callback URI. The standalone sign-in page supports Google only; fake email/password and account-creation controls are removed.
- Evidence/Links: `src/auth.ts`, `src/proxy.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/lib/auth/actions.ts`, `.env.example`; successful lint and production build on 2026-07-21.

### D-107: Preserve the complete visual state as layout 1

- Status: Active
- Date: 2026-07-22
- Context: After selecting the new blue/Indigo Warp palette, increasing deep-blue presence across the left-middle and lower regions, and adding the React Bits Splash Cursor, the Owner requested a complete rollback point before further display experiments.
- Decision/Finding: Treat the Git commit with subject `initial layout 1` and tag `layout-1` as the complete Layout 1 baseline. It includes `SkillBackground5.tsx` (SHA-256 `80AB42101FC0437E141242317729C1703C296D32DEA5121CA5B0809A70E5C8C3`), the React Bits `SplashCursor.jsx` integration (SHA-256 `51BCFDB67FA98077675882F8FE7D8C183C145A5607D5573416D789CC12DDC21E`), `WorkspaceSplashCursor.jsx` settings (SHA-256 `951C81AABDCB1DADA4BFF63F2E84C12E7CD227DAFF2CFA2AB7910C941B4D34CA`), shadcn registry configuration, and the Dashboard plus secondary-page component references.
- Why: Layout 1 must restore the entire approved display state rather than only a named background component.
- Alternatives: Reuse V0/V1/V2/V3, save only the background palette, or rely on screenshots without a Git checkpoint.
- Consequences: When the Owner requests `return to layout 1` or `rollback to layout 1`, restore the complete tracked project state represented by Git tag `layout-1`. Do not interpret this as a background-only rollback. Later changes remain separate unless the Owner explicitly redefines the baseline.
- Evidence/Links: `src/components/dashboard/SkillBackground5.tsx`, `src/components/SplashCursor.jsx`, `src/components/dashboard/WorkspaceSplashCursor.jsx`, `components.json`, `src/app/dashboard/page.tsx`, and `src/components/dashboard/SecondaryPageShell.tsx`.

### D-108: Normalize the five background-only restoration versions

- Status: Active
- Date: 2026-07-23
- Context: The Owner wants one simple and sequential `V1` through `V5` background vocabulary based on the five background component files currently retained in the project. Earlier experimental names included `V0`, an obsolete `SkillBackround1.tsx` V2, and a different V3 mapping, which would make future rollback instructions ambiguous.
- Decision/Finding: The only active background-version mapping is:
  - `V1` = `src/components/dashboard/SilkBackground.tsx` (SHA-256 `09DC38BC5E9B2DBC71E3312AC1E3E518C457F7665B296B266E5A34221D66CCD0`)
  - `V2` = `src/components/dashboard/SkillBackground2.tsx` (SHA-256 `73284AF1F9861F6921EDA6BC2A35F4CF62FF8C0F6A1CE7D4E21CE95739B799F6`)
  - `V3` = `src/components/dashboard/SkillBackground3.tsx` (SHA-256 `7440E68A7298D5E1A08A2538256348E29F79917446ECF7DD1FE626D3AF29C1C6`)
  - `V4` = `src/components/dashboard/SkillBackground4.tsx` (SHA-256 `6C9DEF5BCAA01C5D3D8E69E6D282218F0F8C6BFD49A619D34C36DEBD50A08595`)
  - `V5` = `src/components/dashboard/SkillBackground5.tsx` (SHA-256 `DB4E22746FD09176C7D46FC9C52A740ACA28F0551091D6E224856F498E1BC39C`) and is the current active background.
- Why: Sequential names make restoration requests predictable while preserving each accepted visual implementation independently.
- Alternatives: Retain the historical V0/V1/V2/V3 vocabulary, rename or duplicate the component files, or treat a background request as a complete layout rollback.
- Consequences: When the Owner says `回滚到 V1`, `回滚到 V2`, `回滚到 V3`, `回滚到 V4`, or `回滚到 V5`, change only the Dashboard and secondary-page background component import/render target to the corresponding file. Do not use Git reset and do not revert or modify Cards, Sidebar, layout, content, authentication, Splash Cursor, responsive behavior, animations outside the selected background component, or any other project changes. Background-version rollback and `Layout 1` rollback remain different operations: `Layout 1` continues to mean the complete tagged layout under `D-107`.
- Evidence/Links: The five component files listed above; `src/app/dashboard/page.tsx`; `src/components/dashboard/SecondaryPageShell.tsx`; explicit Owner instruction on 2026-07-23.

## Superseded Decisions

- `D-102` through `D-105` used the earlier experimental background vocabulary. Their historical component fingerprints remain useful evidence, but all old V0/V1/V2/V3 naming and restoration semantics are superseded by the sequential mapping in `D-108`.

## Rejected Alternatives

### API orchestration and automation control center

- Status: Rejected
- Date: 2026-07-18
- Context: This was previously presented as a possible product depth.
- Finding: The user does not need API calls because every tool is independent and accessible by link.
- Why: Integration complexity would not solve the primary organization and retrieval problem.
- Consequences: Do not reintroduce API integration unless the user later changes the scope.

### P-003 Backup, import, and export

- Status: Rejected
- Date: 2026-07-18
- Context: Portable backup and restore was proposed for the tool directory.
- Finding: The user does not want file backup, import, or export.
- Why: Every App is independently deployed and already has its own access link; the hub only needs to open the appropriate App.
- Consequences: Do not re-propose backup, import, or export unless the user later changes the scope.

### P-009 Private owner access

- Status: Superseded by `D-004` and `F-008`
- Date: 2026-07-18
- Context: Owner-only sign-in was proposed to protect the personal hub, links, recent activity, and management functions.
- Finding: The user initially chose not to include authentication, then explicitly corrected that decision.
- Why: The corrected requirement is to allow only the user's configured Google account.
- Consequences: Preserve this history, but follow active decision `D-004` and product feature `F-008`.

### P-012 Usage Insights

- Status: Rejected
- Date: 2026-07-18
- Context: The proposal would record tool open counts and show `Most Used` across time ranges.
- Finding: The user chose to skip this feature.
- Why: No additional reason was provided.
- Consequences: Do not add open-count analytics, `Most Used`, time-range usage reports, or related statistics unless the user later changes scope. Existing `Recent` behavior remains unchanged.

## Known Issues

None.

## Technical Debt

None.

## Lessons Learned

None.

## Important Changes

- 2026-07-18: Initialized the AI Product workflow memory for an empty project directory.
- 2026-07-18: Established English-only user-facing website content as an active project preference (`PREF-001`).
- 2026-07-18: Established concise tag and compact-label wording as an active project preference (`PREF-002`).
- 2026-07-18: Accepted Proposal P-001 as `F-001` and created the initial `project.md` product draft.
- 2026-07-18: Accepted Proposal P-002 as `F-002` with safe hide-and-restore behavior instead of permanent deletion.
- 2026-07-18: Rejected Proposal P-003 and excluded backup, import, and export from scope.
- 2026-07-18: Accepted Proposal P-004 as `F-003` with up to 6 recent tools and no target-App data access.
- 2026-07-18: Accepted revised Proposal P-005 as `F-004`, retaining click search and adding `Ctrl + K` to the same search experience.
- 2026-07-18: Accepted Proposal P-006 as `F-005` with drag, `Up/Down`, and category-specific custom ordering.
- 2026-07-18: Accepted Proposal P-007 as `F-006` with `Light`, `Dark`, and system-following `Auto` themes.
- 2026-07-18: Accepted Proposal P-008 as `F-007` with shared-data `Grid` and `List` views.
- 2026-07-18: Rejected Proposal P-009; authentication is excluded and the deployment/storage security boundary is now open.
- 2026-07-18: Superseded the P-009 rejection and confirmed single-Owner Google OAuth as `D-004` and `F-008`.
- 2026-07-18: Added a standalone English sign-in page to confirmed feature `F-008`; detailed visual definition remains for the Design Definition stage.
- 2026-07-18: Confirmed direct post-login Dashboard navigation and the collapsible left Sidebar plus large right Main layout (`D-005`).
- 2026-07-18: Accepted the Dashboard navigation/home proposal and corrected the taxonomy semantics, adding `Work` as a category (`D-006`).
- 2026-07-18: Renamed `Home` to `Dashboard` and moved `Settings` and `Log out` into the Sidebar footer Google account menu (`D-007`).
- 2026-07-18: Superseded the four-category set with eight selectable Tag tabs and confirmed Settings renders in Main (`D-008`).
- 2026-07-18: Confirmed multi-Tag use for `StudyMate` and replaced the visible `Open` button with whole-item launch behavior plus an optional external-link arrow (`D-009`).
- 2026-07-18: Accepted `P-010` as the online-only, computer-and-mobile `F-009 Installable PWA` (`D-010`).
- 2026-07-18: Accepted `P-011` as `F-010 Tool Icons`, including automatic detection, manual replacement, and initials fallback (`D-011`).
- 2026-07-18: Accepted `P-013` as `F-011 Manage Tags` (`D-012`) and moved Search, theme switching, and Settings into the shared top Navbar (`D-013`).
- 2026-07-18: Accepted `P-014` as `F-012 Cross-device Sync` for Owner-protected hub data and preferences (`D-014`).
- 2026-07-18: Accepted `P-015` as `F-013 Command Palette`, extending Search and `Ctrl + K` with safe internal Commands (`D-015`).
- 2026-07-18: Accepted `P-016` as `F-014 Link Check` with manual, cautious, synchronized, and non-destructive status handling (`D-016`).
- 2026-07-18: Accepted `P-017` as `F-015 Customize Dashboard`, preserving fixed global navigation while allowing section order and visibility changes (`D-017`).
- 2026-07-18: Revised `F-010` to a Codex-assisted static icon registry with official, matching, and Monogram priorities (`D-018`).
- 2026-07-18: Accepted `P-018` as `F-016 Quick Add Tool` with reviewed metadata and static Icon registry suggestions (`D-019`).
- 2026-07-18: Accepted `P-019` as `F-017 Search Aliases`, including editable Aliases for every preloaded and Owner-added tool (`D-020`).
- 2026-07-18: Accepted revised `P-020` as `F-018 Duplicate Tool Warning`, excluding Aliases from duplicate checks (`D-021`).
- 2026-07-18: Closed open-ended feature discovery at the Owner's request; current MVP feature scope is `F-001` through `F-018`.
- 2026-07-18: Confirmed the six personal-use success metrics for Product Definition (`D-022`).
- 2026-07-18: Confirmed the actual Windows, Mac Studio, iPhone, and Android device families for support (`D-023`).
- 2026-07-18: Expanded `D-023` to require Safari and Chrome on both Mac Studio M4 and iPhone.
- 2026-07-18: Confirmed an Owner-only private cloud database as the authoritative cross-device data source (`D-024`).
- 2026-07-18: Confirmed the hub availability, sync freshness, save integrity, failure, session, and durability targets (`D-025`).
- 2026-07-18: Confirmed Vercel deployment and the personal maintenance budget (`D-026`).
- 2026-07-18: Confirmed global product access with Canada-preferred and United-States-fallback database residency (`D-027`).
- 2026-07-18: Confirmed the rolling browser and OS support policy (`D-028`).
- 2026-07-18: Excluded dedicated iPad and Android Tablet support from MVP (`D-029`).
- 2026-07-18: Confirmed the keyboard-first accessibility baseline (`D-030`).
- 2026-07-18: Confirmed the interaction and loading performance targets (`D-031`).
- 2026-07-18: Clarified `Online PS` as an Owner-built online Photoshop-style image editor (`D-032`).
- 2026-07-18: Confirmed the editable initial Tag mapping for all known tools (`D-033`).
- 2026-07-18: Product Definition Gate passed with implementation-provider/configuration WARNs deferred to Development Definition; Product Freeze remains unauthorized.
- 2026-07-18: Owner explicitly authorized Product Freeze; froze `project.md` as `4.1-freeze` and advanced to Design Definition (`D-034`).
- 2026-07-18: Confirmed `Phil's studio` as the official product display name (`D-035`).
- 2026-07-18: Confirmed the blue-green glass visual direction and accessible hover-light behavior (`D-036`).
- 2026-07-18: Confirmed the Emil-guided restrained hover and Command Palette motion rules (`D-037`).
- 2026-07-18: Confirmed the Sidebar dimensions and restrained interruptible transition (`D-038`).
- 2026-07-18: Confirmed local per-browser/device Sidebar persistence and viewport defaults (`D-039`).
- 2026-07-18: Confirmed the Emil-guided mobile glass Drawer and gesture/focus behavior (`D-040`).
- 2026-07-18: Confirmed the four-section Settings information architecture (`D-041`).
- 2026-07-18: Confirmed the Sign-in visual structure, English copy, auth states, privacy, and restrained motion (`D-042`).
- 2026-07-18: Confirmed the personalized Dashboard welcome area and frozen-scope exclusions (`D-043`).
- 2026-07-18: Confirmed the 4/6/8 Dashboard collection previews and shared launch treatment (`D-044`).
- 2026-07-18: Confirmed full All/Favs/Recent layouts, pagination, empty states, and restrained motion (`D-045`).
- 2026-07-18: Confirmed Manage as an editing workspace with distinct external launch, accessible ordering, responsive Edit Tool surfaces, and restrained motion (`D-046`).
- 2026-07-18: Confirmed the single-surface Add Tool sequence, exact feedback copy, non-blocking suggestions, save-time duplicate handling, and content preservation (`D-047`).
- 2026-07-18: Confirmed viewport-based responsive breakpoints, Sidebar defaults, fluid Main padding, compact Navbar behavior, and immediate structure changes (`D-048`).
- 2026-07-18: Confirmed Geist typography families, compact hierarchy, fallbacks, product-name treatment, and font-loading safeguards (`D-049`).
- 2026-07-18: Confirmed exact Dark/Light blue-green colors, glass material values, radii, responsive blur, shadows, contrast priority, and Safari fallback (`D-050`).
- 2026-07-18: Confirmed the single-letter P identity, gradient rounded-square treatment, tagline, placements, PWA/Apple/Maskable assets, and static behavior (`D-051`).
- 2026-07-18: Confirmed Lucide UI mappings and tokens plus the official/Simple Icons/semantic/Monogram tool Icon priority (`D-052`).
- 2026-07-18: Confirmed the 4px spacing system, shell/control/card/row sizes, touch minimums, responsive gaps, and All Tools Grid columns (`D-053`).
- 2026-07-18: Confirmed WCAG 2.2 AA contrast/focus, equivalent inputs, error/live-region behavior, modal focus, zoom/text spacing, reduced motion, and link labels (`D-054`).
- 2026-07-18: Confirmed shell-first loading, delayed static Skeletons, local busy states, data/scroll preservation, error/empty rules, and exact offline copy (`D-055`).
- 2026-07-18: Confirmed Toast placement, limits, timing, Undo/Retry, exclusions, accessible behavior, confirmation boundaries, and no notification center (`D-056`).
- 2026-07-18: Confirmed Navbar/Settings Theme behavior, per-device Auto resolution, restrained Theme crossfade, and synchronized context-preserving Grid/List controls (`D-057`).
- 2026-07-18: Confirmed Tag row structure, naming validation, reserved names, safe hidden associations, synchronized ordering, accessible movement, and inline feedback (`D-058`).
- 2026-07-18: Confirmed Command Palette dimensions, default content, matching, result rows, keyboard/focus behavior, empty copy, ephemeral queries, and no animation (`D-059`).
- 2026-07-18: Confirmed manual Link Check states, Icons, colors, timestamps, progress, partial-failure behavior, non-blocking access, and reduced motion (`D-060`).
- 2026-07-18: Confirmed Dashboard layout controls, one-visible rule, immediate result, Sidebar independence, inline sync, exact Reset dialog, defaults, and restrained motion (`D-061`).
- 2026-07-18: Confirmed capability-aware App Install/Sync/Support groups, statuses, guidance, exclusions, local loading, and browser/PWA parity (`D-062`).
- 2026-07-18: Confirmed exact private-auth messages, retry/loading, non-Owner denial, session expiry, direct Dashboard success, immediate Logout, and privacy boundary (`D-063`).
- 2026-07-18: Confirmed Add/Edit field limits, HTTPS safety, Tag/Alias/Source/Icon rules, validation timing and focus, normalization, preservation, and accessible inline errors (`D-064`).
- 2026-07-18: Confirmed Duplicate Warning copy, match summary, action outcomes and hierarchy, focus, exact/same-domain continuation, Alias exclusion, and non-destructive motion (`D-065`).
- 2026-07-18: Confirmed Grid/List composition and stable dimensions plus a separate direct Favorite control with isolated launch, rollback, accessibility, and Hidden-tool behavior (`D-066`).
- 2026-07-18: Confirmed the reviewed static Icon selector, previews, groups, suggestions, Monogram presets, source labels, explicit save, fallback, keyboard behavior, and runtime boundary (`D-067`).
- 2026-07-18: Confirmed final compact dimensions and responsive edge behavior for Sign-in, Welcome, Owner Menu, Navbar Search, virtual keyboard, safe areas, landscape, and zoom (`D-068`).
- 2026-07-18: Authorized the five-frame visual mockup review pack while retaining Design Definition and no UI Freeze (`D-069`).
- 2026-07-18: Confirmed stronger layered glass Cards, multi-stop blue-green gradients, material hierarchy, restrained hover light, and the Google-only Sign-in reference boundary (`D-070`).
- 2026-07-18: Retained the approved Card material and changed the Navbar to one opposite-Theme action while keeping Auto in Settings (`D-071`).
- 2026-07-18: Adopted the Owner-referenced compact glass pill Theme control with one-button semantics and blue-green styling (`D-072`).
- 2026-07-18: Replaced mixed Tool Icon treatments with one tinted single-color line-Glyph and translucent-container system (`D-073`).
- 2026-07-18: Adopted the large editorial split Card layout with responsive columns, right-side static visuals, and preserved launch/Favorite rules (`D-074`).
- 2026-07-18: Superseded the editorial split interpretation and confirmed vertical Card content order with existing Grid density, small Icon, bottom Tags, Star, and ExternalLink (`D-075`).
- 2026-07-18: Rejected `P-012 Usage Insights`; retained `Recent` without adding open-count analytics or `Most Used`.

## Current Risks and Blockers

- Product and UI specifications are reopened as `project.md` `4.5-draft` and `design.md` `5.13-draft`; Development Definition resumes only after explicit Product Freeze and UI Freeze re-authorization.
- OAuth provider configuration, secure Owner allowlisting, session security, and protected data access remain unverified until development definition and implementation.
- `D:\Phil studio` is nested under a broader Git worktree rooted outside the project directory; Git writes must remain disabled until repository scope is intentionally established.

## Open Questions

- Which devices and environments must it support?
- How often will it be used, and what measurable time saving would count as success?
- Where should the tool list and favorites be stored?

## Memory Update Log

- 2026-07-18: Created the minimal workflow state and recorded initial blockers.
- 2026-07-18: Confirmed Personal Use mode and activated its discovery branch (`D-001`).
- 2026-07-18: Recorded the unified personal app and tool hub direction (`D-002`).
- 2026-07-18: Excluded API integration and recorded the initial independent-tool inventory (`D-003`).
- 2026-07-18: Captured the English-only website content preference (`PREF-001`).
- 2026-07-18: Captured the concise tag and compact-label preference (`PREF-002`) and aligned the `PREF-001` example.
- 2026-07-18: Converted accepted Proposal P-001 into confirmed feature `F-001` in `project.md` and advanced to Proposal P-002.
- 2026-07-18: Converted accepted Proposal P-002 into confirmed feature `F-002` in `project.md` and advanced to Proposal P-003.
- 2026-07-18: Recorded rejection of Proposal P-003 and advanced to a non-backup proposal direction.
- 2026-07-18: Converted accepted Proposal P-004 into confirmed feature `F-003` in `project.md` and advanced to Proposal P-005.
- 2026-07-18: Converted revised Proposal P-005 into confirmed feature `F-004` in `project.md` and advanced to Proposal P-006.
- 2026-07-18: Converted accepted Proposal P-006 into confirmed feature `F-005` in `project.md` and advanced to Proposal P-007.
- 2026-07-18: Converted accepted Proposal P-007 into confirmed feature `F-006` in `project.md` and advanced to Proposal P-008.
- 2026-07-18: Converted accepted Proposal P-008 into confirmed feature `F-007` in `project.md` and advanced to Proposal P-009.
- 2026-07-18: Recorded rejection of Proposal P-009 and paused new feature proposals to resolve the no-auth deployment and persistence boundary.
- 2026-07-18: Reopened authentication after the user's correction, activated `D-004`, confirmed `F-008`, and intentionally omitted the exact Owner email from memory.
- 2026-07-18: Extended `F-008` with a standalone sign-in page and deferred layout and state design to `/design`.
- 2026-07-18: Paused unconfirmed Proposal P-010, updated `project.md`, created `design.md` 0.1-draft, and recorded Dashboard decision `D-005` without advancing or freezing the workflow stage.
- 2026-07-18: Recorded accepted Dashboard navigation and Main composition, then separated category tags, collection views, search, and open action in `project.md` and `design.md` (`D-006`).
- 2026-07-18: Updated authenticated Sidebar navigation and recorded the Owner account footer/menu behavior (`D-007`).
- 2026-07-18: Recorded the revised Tag tabs and in-shell Settings behavior, superseding the old category-set portion of `D-006` (`D-008`).
- 2026-07-18: Corrected the `Open` interpretation and recorded whole-item launch behavior with the external-link visual cue (`D-009`).
- 2026-07-18: Converted accepted `P-010` into `F-009`, documented PWA install, online, authentication, and fallback behavior, and recorded `D-010`.
- 2026-07-18: Converted accepted `P-011` into `F-010`, documented icon sources, fallback, validation, and View behavior, and recorded `D-011`.
- 2026-07-18: Recorded rejection of `P-012 Usage Insights` and excluded tool-open analytics from current scope.
- 2026-07-18: Converted accepted `P-013` into `F-011`, updated the Tag model, and recorded the screenshot-guided Navbar placement without adding unrequested notification or Activity features.
- 2026-07-18: Converted accepted `P-014` into `F-012`, defined online cross-device scope and failure behavior, and recorded `D-014`.
- 2026-07-18: Converted accepted `P-015` into `F-013`, documented grouped results, keyboard behavior, safe Commands, and ephemeral queries, and recorded `D-015`.
- 2026-07-18: Converted accepted `P-016` into `F-014`, documented safe manual checks, status semantics, network boundaries, and recorded `D-016`.
- 2026-07-18: Converted accepted `P-017` into `F-015`, documented Dashboard layout controls, reset, sync, mobile behavior, and recorded `D-017`.
- 2026-07-18: Superseded the favicon/upload icon approach and recorded the static unified icon registry plus Codex/API usage boundary (`D-018`).
- 2026-07-18: Converted accepted `P-018` into `F-016`, documented Quick Add suggestions, explicit review, manual fallback, and safe URL handling (`D-019`).
- 2026-07-18: Converted accepted `P-019` into `F-017`, documented Alias search, Add/Edit entry points, preloaded-tool editing, sync, and sensitive-data guidance (`D-020`).
- 2026-07-18: Converted revised `P-020` into `F-018`, documented duplicate signals, decision actions, same-domain paths, and repeated Aliases (`D-021`).
- 2026-07-18: Recorded “enough” as the end of open-ended feature proposals and advanced to the remaining Product Definition interview.
- 2026-07-18: Recorded confirmed usage, speed, centralization, Quick Add, sync, and reliability success metrics (`D-022`).
- 2026-07-18: Recorded the confirmed device/browser scope and remaining Mac/minimum-version TBDs (`D-023`).
- 2026-07-18: Updated the device matrix with both Safari and Chrome for Mac Studio M4 and iPhone.
- 2026-07-18: Recorded the private cloud persistence boundary and minimal non-authoritative local state (`D-024`).
- 2026-07-18: Recorded the confirmed reliability targets and independent-application outage boundary (`D-025`).
- 2026-07-18: Recorded Vercel hosting, monthly maintenance, security response, managed-service preference, and documentation requirements (`D-026`).
- 2026-07-18: Recorded the separation between global accessibility and North American database residency (`D-027`).
- 2026-07-18: Recorded vendor-supported OS and rolling browser-version coverage (`D-028`).
- 2026-07-18: Recorded tablet access as best effort and outside formal MVP support (`D-029`).
- 2026-07-18: Recorded the confirmed focus, tooltip, contrast, motion, status, and form-error accessibility requirements (`D-030`).
- 2026-07-18: Recorded the confirmed loading, search, launch, save-feedback, Icon, and mobile-resource performance limits (`D-031`).
- 2026-07-18: Recorded the resolved `Online PS` meaning and Tagging implication (`D-032`).
- 2026-07-18: Recorded the confirmed initial inventory mapping and its editable status (`D-033`).
- 2026-07-18: Advanced workflow state to Product Freeze awaiting explicit authorization after Discovery and Product Definition Gates passed.
- 2026-07-18: Recorded Product Freeze authorization, frozen scope/change process, and Design Definition as the current stage (`D-034`).
- 2026-07-18: Recorded the confirmed product name and identity placements (`D-035`).
- 2026-07-18: Recorded the confirmed Light/Dark glass surfaces, colorful Icon containers, reflection sweep, corner edge lights, and motion safeguards (`D-036`).
- 2026-07-18: Recorded the confirmed one-shot card motion, input gating, static focus/reduced-motion, and no-animation Command Palette (`D-037`).
- 2026-07-18: Recorded the confirmed computer Sidebar widths, label/icon behavior, interruption, reduced-motion, and mobile exception (`D-038`).
- 2026-07-18: Recorded local Sidebar state, closed mobile entry, sign-out privacy, and flash prevention (`D-039`).
- 2026-07-18: Recorded mobile Drawer sizing, asymmetric motion, velocity dismissal, reduced motion, and focus requirements (`D-040`).
- 2026-07-18: Recorded Settings sections, computer/phone layouts, immediate switching, and logout separation (`D-041`).
- 2026-07-18: Recorded the confirmed Sign-in identity, copy, error states, security boundary, and Emil-guided press feedback (`D-042`).
- 2026-07-18: Recorded the confirmed greeting, Google display-name/fallback behavior, Add Tool action, mobile treatment, and exclusion of usage panels (`D-043`).
- 2026-07-18: Recorded Dashboard section limits, layouts, View-all links, Tag caps, and Sidebar-access persistence (`D-044`).
- 2026-07-18: Recorded shared collection headers, 24-item loading, Favs/Recent states, mobile Tags, and immediate filtering (`D-045`).
- 2026-07-18: Recorded Manage table/mobile-row behavior, row-versus-launch semantics, Edit Tool fields and persistence, and Emil-guided panel/sheet motion (`D-046`).
- 2026-07-18: Recorded the single-surface Add Tool flow, editable suggestion states, exact English feedback, duplicate timing, and restrained motion (`D-047`).
- 2026-07-18: Recorded the three responsive width ranges, Sidebar defaults, page padding, compact Navbar Search, browser/PWA parity, and no-layout-animation rule (`D-048`).
- 2026-07-18: Recorded the Geist Sans/Mono system, exact type hierarchy, fallbacks, line-height, product-name styling, and loading requirements (`D-049`).
- 2026-07-18: Recorded exact blue-green theme colors, glass opacity and borders, radii, responsive blur, shadows, static backgrounds, Icon accents, and fallback behavior (`D-050`).
- 2026-07-18: Recorded the P product mark, Online PS naming distinction, identity placements, exact asset sizes, Maskable safe-area requirement, opaque icon background, and no-looping-motion rule (`D-051`).
- 2026-07-18: Recorded Lucide mappings, Icon sizes and stroke, tool Icon source priority, two-letter Monograms, brand-color handling, accessibility labels, and license review (`D-052`).
- 2026-07-18: Recorded spacing tokens, Navbar/Sidebar/control/input/card/row sizes, touch minimums, responsive padding/gaps, Grid columns, and content-growth safeguards (`D-053`).
- 2026-07-18: Recorded accessibility targets, focus ring, semantic structure, input equivalence, field/form errors, announcements, focus return, zoom/text spacing, reduced motion, and contextual launch labels (`D-054`).
- 2026-07-18: Recorded shell-first loading, 250ms Skeleton delay, no-Shimmer behavior, refresh and pagination preservation, local errors and retries, empty-state timing, and online-required screen copy (`D-055`).
- 2026-07-18: Recorded Toast purpose, position, stack/duration, copy, Undo/Retry, silent events, motion, focus/announcement behavior, confirmation use, and notification exclusion (`D-056`).
- 2026-07-18: Recorded direct Navbar Theme override, Settings Auto, per-device resolution, transition boundary, Grid/List scope, phone support, synchronization, and context preservation (`D-057`).
- 2026-07-18: Recorded Tag limits and characters, normalization, duplicate/reserved validation, rename/hide semantics, hidden assignment behavior, ordering, responsive controls, styling, and feedback (`D-058`).
- 2026-07-18: Recorded Command Palette responsive layout, focus, Recent/Commands default, searchable fields, highlight and row content, empty copy, keyboard behavior, focus return, and query privacy (`D-059`).
- 2026-07-18: Recorded Link Check state meanings and Icons, text/color treatment, relative/exact time, actions and batch progress, continuation, non-destructive behavior, manual execution, and reduced motion (`D-060`).
- 2026-07-18: Recorded Dashboard customization rows, accessible ordering, visibility constraint and copy, immediate updates, Sidebar independence, save/retry behavior, exact Reset confirmation, defaults, and motion boundary (`D-061`).
- 2026-07-18: Recorded App Install/Sync/Support structure, capability states and guidance, online copy, retry/status behavior, supported-device summary, excluded stores/backup/notifications, and PWA parity (`D-062`).
- 2026-07-18: Recorded final auth/session copy, duplicate-click prevention, retry, denial, expiry cleanup, Dashboard redirect, Logout, inline error treatment, and allowlist secrecy (`D-063`).
- 2026-07-18: Recorded Add/Edit requirements and limits, URL scheme and normalization, Alias scoping/deduplication, Source/Icon behavior, validation timing, focus, content preservation, and accessible fields (`D-064`).
- 2026-07-18: Recorded duplicate headings/copy, existing-tool fields, Edit/Continue/Cancel semantics, focus and visual priority, exact URL and same-domain behavior, Alias exclusion, preservation, and Dialog motion (`D-065`).
- 2026-07-18: Recorded the corrected direct Favorite requirement, launch/event separation, Card/List dimensions and content, Tag overflow, focus/targets, save rollback, centralized management, motion restraint, and Hidden exclusion (`D-066`).
- 2026-07-18: Recorded Icon selector previews and groups, recommendation count, Lucide search, Monogram limits/colors, source labels, save timing, Codex boundary, fallback/reselect, keyboard support, motion restraint, and asset review (`D-067`).
- 2026-07-18: Recorded final component sizing, Sign-in/Welcome flow, account-menu content, Search range, Navbar gap, phone landscape, virtual keyboard, safe-area, and 200% zoom behavior (`D-068`).
- 2026-07-18: Recorded authorization for five English-only mockup frames, confirmed design-system use, frozen-scope exclusions, review-only status, and pre-Freeze refinement boundary (`D-069`).
- 2026-07-18: Recorded the accepted layered-glass refinement, Card gradient depth, material hierarchy, motion safeguards, and Sign-in reference boundary (`D-070`).
- 2026-07-18: Recorded the single opposite-Theme Navbar action, action-oriented labels, and Settings-only Auto behavior (`D-071`).
- 2026-07-18: Recorded the compact Theme pill dimensions, decorative switch indicator, unified target, and accessibility behavior (`D-072`).
- 2026-07-18: Recorded the normalized Tool Icon grammar, sizing, stroke, accent, fallback, selector, and cross-Theme rules (`D-073`).
- 2026-07-18: Recorded the editorial Grid Card composition, responsive columns, decorative-art fallback, accessibility boundary, and interaction preservation (`D-074`).
- 2026-07-18: Recorded the corrected Card interpretation, restored columns, removed artwork, smaller Icon, content order, and ExternalLink-versus-Edit distinction (`D-075`).
- 2026-07-18: Stopped further pre-development mockup iteration, made `design.md` authoritative over raster references, and passed the Design Quality Gate while retaining explicit UI Freeze as a separate authorization (`D-076`).
- 2026-07-19: Recorded Owner-authorized UI Freeze at `design.md` `5.8-freeze`, advanced to Development Definition, and prohibited adopting generated code before the technical definition and Implementation Ready gates (`D-077`).
- 2026-07-19: Reopened UI Freeze for the Owner-requested Arctic Navy HTML style, created `design.md` `5.9-draft`, preserved frozen product behavior, and paused Development Definition until re-freeze (`D-078`).
- 2026-07-19: Reopened the product presentation specification and clarified Theme/Settings, Workspace footer, Favs/All-left plus nested-Recent-right layout, responsive fallback, and acceptance criteria in `project.md` `4.2-draft` and `design.md` `5.10-draft` (`D-079`).
- 2026-07-19: Strengthened HTML-derived gradients, bounded the Dashboard to the Sidebar bottom, defined internal hidden-scrollbar rails, added fixed Quick Access above Recent, and advanced the drafts to `project.md` `4.3-draft` and `design.md` `5.11-draft` (`D-080`).
- 2026-07-19: Resolved Quick Access as Owner-only manual Pinning with Add/Edit/Manage controls, ordering, sync, hidden-tool, rollback, and empty-state rules; advanced drafts to `4.4-draft` and `5.12-draft` (`D-081`).
- 2026-07-19: Defined the large Main glass Card, unboxed Navbar, shadowed Theme/Settings, transparent Owner Account Card, 1/2/3-column All List, shared bottom baseline, and one-line right-rail copy; advanced drafts to `4.5-draft` and `5.13-draft` (`D-082`).
- 2026-07-19: Required complete nested-item boundaries, fluid 2/3/4/5-card wide-screen capacity, stable two-row All Grid, Favorite Stars in All, the leading `All` filter, and a raised Quick Access/taller Recent rail; advanced drafts to `4.7-draft` and `5.15-draft` (`D-083`).
- 2026-07-19: Added Calendar and To-Do as internal synced Widgets, changed ultra-wide Dashboard to three zones, adopted the brighter blue-indigo-violet-cyan atmospheric glass reference, and advanced drafts to `4.8-draft` and `5.16-draft` (`D-084`).
- 2026-07-19: Began the Owner-directed surface color pass with a separate deep-blue Dashboard atmosphere, branching cyan light, and Violet-center-to-Indigo emitters; kept Product at `4.8-draft` and advanced Design to `5.17-draft` (`D-085`).
- 2026-07-19: Defined Welcome with overlapping upper-left blue radials, a below-right Violet-to-Indigo emitter, and blurred Cyan environmental bleed through its translucent right edge; advanced Design to `5.18-draft` (`D-086`).
- 2026-07-19: Defined Dashboard Favs as uniform pale-blue translucent Cards with subtle Cyan bleed owned by the left viewport position rather than the first Favorite record; advanced Design to `5.19-draft` (`D-087`).
- 2026-07-19: Defined All with two left-side Cyan environmental exposures, Navy center, smaller upper-right Violet radiation, dominant lower-right Violet-to-Indigo-to-Navy radiation, and translucent nested rows; advanced Design to `5.20-draft` (`D-088`).
- 2026-07-19: Defined Quick Access with faint upper-left Indigo and lower-right Cyan, and Recent as quiet light-Navy glass with only one upper-right Cyan diffusion; advanced Design to `5.21-draft` (`D-089`).
- 2026-07-19: Defined Calendar with a dominant upper-left Cyan radial, smaller lower-left Cyan radial, lower-right Indigo radial, and near-opaque pure Navy connection field; advanced Design to `5.22-draft` (`D-090`).
- 2026-07-19: Defined To-Do with unequal Cyan/Indigo emitters, Navy breathing intervals, smaller refined task visuals with full targets, explicit row/group spacing, and generous Footer/bottom padding; advanced Design to `5.23-draft` (`D-091`).
- 2026-07-20: Made Quick Access, Recent, Calendar, and To-Do directly draggable across two auxiliary columns; added empty-column collapse/restore, two-column primary auto-fill, combined-column scrolling, accessible movement, and synchronized persistence; advanced Product to `4.9-draft` and Design to `5.24-draft` (`D-092`).
- 2026-07-20: Replaced every Mobile fixed/collapsed Sidebar presentation with a single Navbar Menu Icon opening an overlay glass Drawer; added safe-area, focus, dismissal, background-lock, and responsive requirements; advanced Product to `4.10-draft` and Design to `5.25-draft` (`D-093`).
- 2026-07-20: Moved Mobile Welcome `Add Tool` below `Your tools, one place.` in a shared left-aligned stack, replaced full-width sizing with compact intrinsic sizing, and retained desktop right alignment; advanced Product to `4.11-draft` and Design to `5.26-draft` (`D-094`).
- 2026-07-20: Applied invisible scrollbar chrome to every application-owned page and nested scroller without reserved gutters or loss of wheel, touch, keyboard, focus, or assistive scrolling; advanced Product to `4.12-draft` and Design to `5.27-draft` (`D-095`).
- 2026-07-20: Removed the Dashboard outer black matte/letterbox and extended the Navy/Cyan/Indigo/Violet atmosphere through the viewport and safe areas while retaining internal shell spacing; advanced Product to `4.13-draft` and Design to `5.28-draft` (`D-096`).
- 2026-07-20: Removed fixed/minimum desktop width inheritance from Mobile Calendar, made it fill Main, and converted its seven date columns to container-relative tracks with adaptive padding and no horizontal overflow; advanced Product to `4.14-draft` and Design to `5.29-draft` (`D-097`).
- 2026-07-20: Required Calendar to contain all six date rows and state effects at every breakpoint, use content-defined height below 1200px, and delegate insufficient rail space to auxiliary-column scrolling instead of child overflow; advanced Product to `4.15-draft` and Design to `5.30-draft` (`D-098`).
- 2026-07-20: Cancelled all prescribed Card/background gradients, exact colors, emitter maps, and old HTML-derived visual recipes while retaining product structure and behavior; deferred visual authority to a future Owner-approved Claude Design HTML export; advanced Product to `4.16-draft` and Design to `5.31-draft` (`D-099`).
- 2026-07-20: Added a reversible Card-only very-light transparent blue-Indigo veil with weaker nested strength and restrained top/left highlights; kept all complex gradients/radials cancelled and large backgrounds TBD; advanced Product to `4.17-draft` and Design to `5.32-draft` (`D-100`).
- 2026-07-20: Made the expanded desktop Sidebar and collapsed rail shell colorless and fully transparent without tint, blur, border, or shell shadow, allowing the future Dashboard background to remain clear beneath it; retained local navigation states, independent helper/account Cards, and the separate Mobile Drawer; advanced Product to `4.18-draft` and Design to `5.33-draft` (`D-101`).
- 2026-07-21: Named and fingerprinted the current `SilkBackground.tsx` WebGL background as V1, recorded its palette and rendering parameters, and scoped future `return to V1` requests to background-only restoration (`D-102`).
- 2026-07-21: Named and fingerprinted the current `SkillBackround1.tsx` Warp background as V2, recorded its exact Warp parameters and V1-aligned palette, and kept V1 as a separate baseline (`D-103`).
- 2026-07-21: Named and fingerprinted `SkillBackground2.tsx` as the V3 background baseline (SHA256 `73284AF1F9861F6921EDA6BC2A35F4CF62FF8C0F6A1CE7D4E21CE95739B799F6`); future `return to V3` requests restore dashboard and secondary-page background imports to this component without changing V1, V2, or unrelated UI (`D-104`).
- 2026-07-21: Named and fingerprinted the current `SkillBackground3.tsx` background as V0 (SHA256 `7440E68A7298D5E1A08A2538256348E29F79917446ECF7DD1FE626D3AF29C1C6`) because it is the Owner's preferred background color state; future `return to V0` requests restore dashboard and secondary-page background imports to this exact component state without changing card styling or unrelated UI (`D-105`).
- 2026-07-21: Replaced the forgeable mock session with Auth.js Google OAuth, encrypted JWT sessions, protected-route Proxy checks, and a server-enforced Owner email allowlist; kept all secrets and the exact Owner email out of project memory and source (`D-106`).
- 2026-07-22: Preserved the complete current display state as Layout 1, anchored by commit subject `initial layout 1` and Git tag `layout-1`; future Layout 1 rollback requests restore the full tracked state rather than only a background (`D-107`).
- 2026-07-23: Replaced the earlier experimental V0/V1/V2/V3 background vocabulary with the canonical five-file mapping `V1 = SilkBackground`, `V2 = SkillBackground2`, `V3 = SkillBackground3`, `V4 = SkillBackground4`, and `V5 = SkillBackground5`; confirmed V5 as current and made every V1-V5 rollback background-only (`D-108`).
