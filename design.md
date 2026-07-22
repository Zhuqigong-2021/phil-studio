# Design

## Design Status and UI Freeze

- Status: Design Definition reopened; structural decisions remain active through `DD-060`, `DD-061` cancels old visual recipes, `DD-062` defines the limited blue-Indigo Card veil/highlight trial, and `DD-063` makes the desktop Sidebar shell colorless and transparent while leaving large backgrounds unspecified.
- UI Freeze: Reopened on 2026-07-19.
- Previous Frozen Version: `5.8-freeze` (historical baseline; no longer the active UI authority).
- Current Draft Version: `5.33-draft`.
- Last Updated: 2026-07-20.
- Confirmed scope: active product features `F-001` through `F-020` mapped to the documented screens, components, responsive rules, visual tokens, motion, loading, and accessibility states; historical Freeze remains `F-001` through `F-018`.
- Design Quality Gate: `PASS` for the current Product-to-Design mapping; final Owner review and a new UI Freeze remain required.
- Change boundary: Layout, sizing, interaction, responsive, content, state, and accessibility rules remain active. `DD-061` continues to cancel older gradients/material recipes; `DD-062` is the only current Card-color exception; `DD-063` defines only the transparent desktop Sidebar shell. Neither decision defines the Dashboard/page background itself.

## Design Principles

- Dashboard first: successful Owner sign-in leads directly to the product home dashboard.
- Fast scanning: icons and concise English labels support quick recognition.
- Content priority: the right Main area receives most of the available width.
- Progressive navigation: the Sidebar can show context when expanded and remain compact when collapsed.
- English only: all user-visible website content is English.

## References and Links

- No external Figma/Google Stitch link has been provided.
- Owner-provided Dashboard and Sign-in screenshots remain historical layout/detail references only. Their gradients, colors, lighting, and material recipes are no longer active visual requirements.
- First visual mockup pack authorized for generation: Desktop Dark Dashboard, Desktop Light Dashboard, Mobile Dark Dashboard, standalone Sign-in, and Desktop Manage with Edit Tool Panel.
- Historical visual source: `phil-toolkit-dark-desktop.html`. It is no longer the active source for colors, gradients, backgrounds, lighting, borders, or shadows. A future Owner-approved HTML export from Claude Design will replace it as the visual reconstruction source; until then, visual styling is intentionally unspecified.
- Owner screenshot references dated 2026-07-19 define the exact Navbar Theme/Settings grouping, Sidebar Workspace helper, and default Dashboard Favs/All/Recent spatial relationship. They do not authorize Notification/bell, Frequent, usage analytics, or visible `Open` controls.

### DD-033: First Visual Mockup Review Pack

- Status: Confirmed for generation and review; not UI-frozen.
- Produce five English-only review frames: Desktop Dark Dashboard, Desktop Light Dashboard, Mobile Dark Dashboard, standalone Sign-in, and Desktop Manage with Edit Tool Panel.
- Apply confirmed identity, typography, spacing, Icons, responsive, Favorite, Search, Sidebar, Navbar, Settings, motion, and accessibility decisions. Do not apply the historical blue-green/Arctic visual recipes cancelled by `DD-061`.
- Do not introduce Notification, Activity, Frequent, usage analytics, visible `Open` buttons, runtime AI generation, or any other unfrozen feature.
- The raster mockups are review evidence, not implementation artifacts. Owner feedback may refine `design.md` before UI Freeze.

### DD-039: Treat Mockups as Non-binding Visual References

- Status: Confirmed.
- Stop further pre-development mockup iteration at the Owner's request.
- Generated raster mockups remain review evidence only; they do not override confirmed component, interaction, responsive, or accessibility rules. Visual tokens are currently `TBD` under `DD-061` until a new HTML source is approved.
- Implementation must follow `design.md`. Visual refinements discovered when reviewing the working product require an explicit design change and must not silently alter frozen behavior or product scope.

### DD-040: Historical Arctic Navy HTML Visual Style

- Status: Superseded for all visual styling by `DD-061`. Retain only historical context and non-color layout facts independently confirmed elsewhere.
- Source: `phil-toolkit-dark-desktop.html`, especially `Dark Dashboard Desktop — Arctic Navy` and its shared Sidebar, Main, Navbar, Hero, panel, row, Icon-container, and action materials.
- Adopt a deep Arctic Navy canvas with blue, indigo, cyan, and teal depth. Use indigo only as a restrained bridge/accent; cyan and blue-green remain the luminous edge and focus family.
- At wide desktop, use approximately `14px` internal app padding and `14px` shell gap. Sidebar and Main remain separate rounded glass regions, but the padding reveals the continuous `DD-047` environment—not a black outer canvas or letterbox.
- Sidebar: preserve the confirmed `248px / 72px` behavior while applying the reference's `24px` shell radius, `20px` blur, layered navy-to-teal surface, fine gradient border, top inset highlight, deep shadow, and faint cyan environmental glow.
- Main shell: use a `24px` radius, quiet translucent Arctic Navy surface, fine pale-cyan border, restrained inset highlight, and `28px 36px` wide-desktop padding. Content uses `24px` major gaps. Existing responsive padding rules still take priority below wide desktop.
- Navbar Search: use the reference's compact `44px` height, `12px` radius, `14px` horizontal padding, translucent navy gradient, subtle cyan border, and deep soft shadow. Preserve the confirmed responsive width and `Ctrl + K` behavior.
- Active navigation: use a restrained blue-to-indigo-to-cyan translucent gradient, `13px` radius, subtle inset highlight, and low blue shadow. Inactive destinations remain quiet and readable without filled heavy tiles.
- Welcome/Hero panel: use the reference's strongest large-panel glass, `20px` radius, gradient border, cyan environmental shadow, and `28px 32px` wide-desktop padding. Use `190px` only as a visual minimum at wide desktop; content and accessibility may increase height.
- Panels use a clear radius hierarchy: `24px` shell, `20px` Hero, `18px` primary content panel, `16px` secondary panel/card, `12px` controls, and `10px` compact rows. Existing Tool Card radius may remain `18px` where required by its vertical Grid composition.
- Primary actions use a blue-to-indigo gradient with white text and controlled blue glow; secondary actions use quiet translucent white/navy glass. Avoid purple-dominant surfaces or neon saturation.
- Use Geist for headings and Inter/system fallback for body text as demonstrated by the reference. Personalized Dashboard greeting may use `32px / 400`; formal page titles retain the confirmed `32px / 700` hierarchy.
- Preserve the unified tinted line-Glyph Icon system from `DD-037`. The HTML's mixed logo treatments are not adopted where they conflict with the confirmed Icon grammar.
- Explicitly exclude reference-only `Activity`, Notification/bell, `Frequent`, usage ranking, email/password fields, registration, account creation, visible per-row `Open` text, and any extra action not present in frozen `project.md`.
- Embedded raster textures in the HTML are reference evidence, not required production assets. Implementation should recreate the visual with maintainable gradients, translucent layers, borders, shadows, and optional lightweight static texture only if performance and contrast checks pass.

### DD-041: Exact Theme, Workspace, and Dashboard Composition

- Status: Confirmed by direct Owner instruction; pending re-freeze as part of `5.10-draft`.
- Navbar right-side sequence is exactly one Theme switch action followed by one Settings Icon button, separated by `8px`. Do not render Notification/bell or a second standalone Theme Icon.
- Theme action is one rounded glass pill. Left to right: destination Theme Icon, destination label (`Dark` in Light Theme or `Light` in Dark Theme), and decorative switch track/thumb. All three elements belong to one semantic button and update together.
- Expanded Sidebar footer contains a small Workspace helper above the Owner Profile. Exact English helper copy: heading `Make it yours`; supporting text `Add a tool or pin a favorite.`
- Owner Profile shows Avatar, Google display name, and exact supporting label `Personal workspace`. The existing account trigger/menu and `Log out` behavior remain unchanged.
- Default ultra-wide Dashboard follows `DD-046`: tools, access, and Widget zones with `24px` gaps. Favs/All occupy tools, Quick Access/Recent occupy access, Calendar/To-Do occupy Widgets, and Welcome spans tools + access.
- `Recent` is a large rounded gradient-glass parent Card with its own heading and `Clear` action. Inside it, up to six compact Recent item Cards/rows are stacked vertically with consistent inner gap. Items must not float directly on the page background.
- Each Recent item shows unified Icon container, Name, relative time, and northeast `ExternalLink` cue; the whole non-cue row remains the launch surface. No visible `Open` text, open count, `Frequent` tab, or usage ranking.
- Favs and All retain their confirmed Tool Card structures, Favorite Star separation, Tags, and `View all` navigation. This decision changes spatial grouping, not tool-card behavior.
- Below `1200px`, remove the side-by-side relationship and stack sections vertically in the default order `Favs`, `All`, `Quick Access`, `Recent`. Do not squeeze either right-rail parent Card into an unusably narrow rail.
- Dashboard customization remains available. The initial state and `Reset Layout` use this exact default template; a saved Owner customization may override section ordering/visibility without moving Navbar, Welcome, Sidebar, Theme, or Settings.

### DD-042: Bounded Dashboard Rails with Historical Surface Styling

- Status: Layout, height, and overflow rules remain Active; material, color, gradient, glow, border-color, and shadow clauses are Superseded by `DD-061`.
- Wide computer Dashboard is a bounded `100dvh` shell. After outer padding, Navbar, Welcome, Tags, and defined gaps are subtracted, the collection region consumes the remaining height with `min-height: 0`; page content must not extend below the expanded Sidebar footer. Overflow belongs to the relevant internal region, not the page body.
- Do not apply one universal pale gradient to every Card. Use three visually distinct material levels: strong Welcome/hero; strong parent panels; dark quiet nested items. The color difference must remain visible without hover.
- The earlier attempt to reuse the Sidebar gradient for Welcome is superseded. Welcome uses the separately sampled and Owner-confirmed material in `DD-044`.
- The earlier universal strong parent-panel base is superseded for Dashboard Welcome, Quick Access, All, and Recent. Each uses its own confirmed direction and color centers from `DD-044`; the generic parent material may remain only on unrelated surfaces where it does not flatten the Dashboard hierarchy.
- Nested Quick Access/Recent items use a quieter deep surface such as `#FFFFFF08` over the parent with `1px solid #FFFFFF14`, or an equivalent result no lighter than the reference. Tool Cards may use a deeper navy surface such as `#071426` plus the approved gradient edge and inset highlight; they must not inherit the bright parent fill.
- Favs is a fixed single-row horizontal rail. Cards never wrap; overflow uses horizontal scrolling aligned to complete Card boundaries.
- All defaults to List on first use/reset. List fills the left-column remainder and scrolls vertically. Grid uses a stable two-row horizontal collection and scrolls by complete Card columns; it never stretches one row of Cards to the full parent height.
- In the reset/default template, the access column stacks `Quick Access` above `Recent`. `DD-054` supersedes the fixed-column relationship: both may reorder or move to the Widget column while retaining their own height and internal-scroll rules.
- In the reset/default template, All and Recent align to the expanded Sidebar Owner Account Card bottom. After customization, the active primary and auxiliary column containers retain that bottom baseline; panels inside a combined scrolling column keep complete boundaries rather than forcing every individual panel bottom to align.
- Hide visual scrollbars in Chromium, WebKit/Safari, and Firefox while retaining wheel, trackpad, touch, Page Up/Down, arrow-key, and keyboard-focus scrolling. A subtle clipped-edge/fade cue may indicate more content but must not reduce text contrast.
- `Quick Access` contains only tools the Owner explicitly enables with `Pin to Quick Access` in Add Tool, Edit Tool, or Manage. Never auto-pin or infer tools from opens, Recent, Favorites, frequency, ranking, or usage counts.

### DD-043: Main Frame, Responsive List Columns, and Shared Bottom Baseline

- Status: Layout, responsive columns, control grouping, and baseline rules remain Active; prescribed visual materials are Superseded by `DD-061`.
- Treat the complete region beside Sidebar as one continuous semantic glass workspace, not disconnected page fragments. Under `DD-046`, its visual atmosphere merges softly with the page instead of requiring a prominent enclosing Card outline; keep `overflow: clip`/equivalent containment so Navbar, Welcome, Widgets, collection rails, and light fields remain inside Main.
- Navbar is not a Card inside that Main Card. It has no independent filled panel, border, rounded outer shell, backdrop blur, or Navbar-level shadow. Its children are arranged directly in a `72px` transparent row with Search left and Theme/Settings right. Search remains a glass input/control.
- Theme pill and Settings button retain their own glass surfaces and use visibly dark depth shadow: `0 12px 30px rgba(2, 6, 23, 0.72), 0 2px 8px rgba(2, 6, 23, 0.52)`, plus the approved subtle cyan edge. The shadow belongs to the controls, not Navbar.
- Owner Account at Sidebar bottom is a distinct transparent glass Card containing Google Avatar, display name, and `Personal workspace`. Use `background: rgba(255,255,255,0.045)`, `1px` pale-cyan translucent border, `12px` blur where supported, inset top highlight, and a restrained dark shadow. It must read as transparent glass rather than an opaque navigation tile.
- On wide Dashboard, establish one bottom-baseline anchor at the Owner Account Card bottom edge. The All panel/list viewport and Recent parent Card end on this same horizontal line. Main/Card padding is included in the calculation; none may visually end above or below the anchor.
- Dashboard All List uses actual container width, not device name: below `720px` use 1 column; `720–1119px` use 2; `1120–1479px` use 3; `1480px+` may use 4 after `DD-054` expands the primary zone. Use row-major order, equal tracks, `12px` gaps, and compact items without excessive stretching.
- Column changes do not alter scroll ownership: All retains one internally vertical-scrolling viewport and hidden visual scrollbar. They do not alter data order, launch, Favorite, Tags, or ExternalLink behavior.
- Quick Access supporting line is exactly `Pinned tools, ready when you need them.` Recent supporting line is exactly `Jump back into tools you opened.` Both use the compact metadata style, remain one line, and use truncation/ellipsis rather than wrapping when space is constrained.

### DD-044: First-screen Overflow and Historical Surface Materials

- Status: First-screen and overflow rules remain Active; every surface color, gradient, glow, border-color, and shadow recipe is Superseded by `DD-061`.
- At `1200px+`, normal zoom, and CSS viewport height `720px+`, Dashboard is a first-screen composition inside the Main Card. Body and Main do not vertically scroll to reveal Dashboard sections. Use a height-bounded grid with `min-height: 0`; collection count may only activate the designated internal scrollers. At mobile widths, 200% Zoom, enlarged text, or viewport height below `720px`, release this restriction and allow accessible page scrolling.
- Overflow ownership is exact: Favs and Dashboard All Grid use internal `overflow-x: auto; overflow-y: hidden`; Dashboard All List, Quick Access body, and Recent body use internal `overflow-y: auto; overflow-x: hidden`. Parent Cards never grow because of item count. Visual scrollbars remain hidden while input and keyboard scrolling remain enabled.
- Sidebar material is the HTML-exact diagonal `linear-gradient(-170.032deg, #102A46C7 9.561%, #111E3EB8 51.618%, #073A49AD 90.439%)`: gray-blue upper right, deep royal/navy middle, deep teal lower/left. Retain its HTML gradient border and faint cyan environmental shadow.
- Main Card uses two layers: `radial-gradient(ellipse at 100% 100%, rgba(14,116,144,.28) 0%, rgba(8,51,68,.18) 38%, transparent 68%)` over `linear-gradient(90deg, #061220 0%, #0D1B3A 48%, #08293C 100%)`. This produces very deep blue left, royal blue middle, dark teal upper right, and brighter teal lower right.
- Welcome uses three layers: `radial-gradient(ellipse 62% 120% at 46% 108%, #1A1946 0%, #15214E 32%, rgba(18,34,71,.60) 58%, transparent 78%)`, then `radial-gradient(ellipse 55% 100% at 100% 100%, #093E50 0%, #082F41 48%, transparent 78%)`, over `linear-gradient(105deg, #0D233E 0%, #122247 38%, #10234B 68%, #082F41 100%)`. It reads as gray-blue upper left, bottom-centered royal-blue radiation, dark teal right, and brighter teal lower right. Use `20px` radius and `overflow: hidden`.
- Quick Access uses `radial-gradient(circle 85% at 100% 72%, #0D4255 0%, rgba(8,49,67,.90) 30%, rgba(7,48,66,.45) 52%, transparent 74%)` over `linear-gradient(105deg, #0F2745 0%, #12264A 28%, #14244C 54%, #0B2D49 78%, #073042 100%)`: gray-blue upper left, royal blue middle, cyan radial center on the right. Its directional depth shadow is `10px 14px 30px rgba(2,6,23,.62), 4px 6px 14px rgba(2,6,23,.42)`.
- All parent Card uses `radial-gradient(ellipse 72% 105% at 0% 100%, #0E1931 0%, #121A39 28%, rgba(26,27,71,.78) 56%, transparent 80%)`, then `radial-gradient(ellipse 58% 90% at 100% 0%, #0E3A4D 0%, #0C2E43 30%, rgba(17,41,73,.68) 55%, transparent 78%)`, over `linear-gradient(110deg, #0D213C 0%, #112246 30%, #14234E 52%, #16224B 72%, #0B2C4A 100%)`: gray-blue upper left, very deep blue lower-left radiation, royal-blue middle, slightly lighter cyan upper-right radiation.
- Recent parent Card uses `radial-gradient(ellipse 70% 95% at 0% 100%, #0B4052 0%, #093146 32%, rgba(14,44,74,.66) 58%, transparent 80%)`, then `radial-gradient(ellipse 68% 90% at 100% 0%, #193857 0%, #173055 34%, rgba(21,37,81,.56) 60%, transparent 80%)`, over `linear-gradient(115deg, #0E2C4A 0%, #172B53 30%, #202F5A 54%, #182D55 76%, #142951 100%)`: teal lower-left radiation, royal-blue middle, gray-blue upper-right radiation.
- Card outlines use a subtle cyan edge, never a neon ring: default `1px solid rgba(103,232,249,.20)` with inset `0 1px 0 rgba(224,242,254,.14)`. Recent additionally glows only on left, bottom, and right: `-7px 0 22px rgba(14,165,233,.10), 0 12px 28px rgba(6,182,212,.13), 7px 0 22px rgba(34,211,238,.09)`, over `8px 16px 32px rgba(2,6,23,.56)`. Its top edge has only the fine outline.
- Navbar Search uses the HTML-exact surface `linear-gradient(-92.184deg, #1E3A5F80 3.134%, #17255470 54.687%, #08334466 96.866%)`, `1px solid #BAE6FD2C`, `12px` radius, `11px` blur, and deep shadow `0 14px 34px #00000066`. Search has no visible cyan outer glow.
- Tool Cards and nested Quick Access/Recent rows remain darker and quieter than their parent: use established `#071426`, `#10213AB8`, `#FFFFFF08`, and `#FFFFFF07` surfaces as applicable. They must not inherit any parent gradient.

### DD-045: Complete-item Viewports and Fluid Wide-screen Density

- Status: Confirmed by direct Owner instruction; pending re-freeze as part of `5.15-draft`.
- The complete-item rule applies to every Dashboard parent Card containing repeated child Cards/rows: Favs, All List, All Grid, Quick Access, and Recent. At initial render and after scrolling settles, the viewport edge must never expose a clipped partial child. A child that cannot fit completely stays outside the visible viewport; do not use a half Card as a “more” affordance.
- Give each repeated child an explicit stable block/inline size and gap. Size each collection viewport from an integer number of child units. Use `scroll-snap-type` on the active axis with `scroll-snap-align: start`, preserve wheel/trackpad/touch/keyboard access, and hide only the scrollbar chrome. Programmatic navigation and View switching must restore a complete-item-aligned position. With Reduced Motion, disable smooth interpolation but preserve positional alignment.
- Main uses the available width with `width: 100%; max-width: none; min-width: 0`. Do not freeze the post-Sidebar content at a tablet/mockup width. Preserve outer padding, the right-rail width range, and sensible Card-width caps; consume extra width by exposing more complete items or columns rather than stretching individual Cards.
- For Favs and All Grid, calculate visible columns from the actual primary-zone container width. The earlier `2/3/4/5` thresholds remain a baseline at ordinary widths, but `DD-054` supersedes the five-Card cap when column collapse expands the primary zone: continue adding complete columns while Cards remain within their confirmed minimum/maximum widths. If constrained accessibility layout cannot fit the minimum readable width, fall back to one complete Card rather than clipping.
- All List uses container-aware columns: below `720px` one, `720–1119px` two, `1120–1479px` three, and `1480px+` up to four when the expanded primary zone permits. Each vertical viewport row must stop at a complete row boundary. Maintain row-major data order across column changes.
- All Grid uses exactly two equal visual rows. Implement a column-flowing grid such as `grid-auto-flow: column` with two explicit row tracks; clamp normal Card height to approximately `120–148px` within the first-screen allocation. Horizontal scrolling advances by complete two-Card columns. The List/Grid switch changes only the child layout and active overflow axis; the All parent Card height, header, bottom baseline, and Main height remain invariant.
- All List items and Grid Cards include an isolated Favorite Star with at least a `40×40px` pointer target and accessible name containing the tool name. Star activation stops launch propagation. The remaining non-independent Card/row surface retains whole-item external launch and the northeast ExternalLink cue.
- The top filter sequence is `All`, `AI`, `Design`, `ServiceNow`, `Automation`, `Productivity`, `Developer`, `Work`, `Learn`. `All` is a selected-state filter command meaning no Tag restriction; it is never shown in Add/Edit Tag choices and is not persisted in a tool’s Tag array.
- In the reset/default layout, Quick Access starts at the top of the access column and Recent follows below. `DD-054` permits both panels to reorder or move across auxiliary columns. Quick Access always retains a body height equal to exactly three complete item rows plus two gaps; fewer items leave quiet empty parent space and never render placeholders.
- When more content exists, use a subtle end fade, directional cue, or focus/scroll response outside the child geometry; these cues must not resemble a partial Card, show a scrollbar, reduce text contrast, or create an extra launch target.

### DD-046: Three-zone Widget Dashboard with Historical Visual Styling

- Status: Three-zone composition remains Active; Arctic Glass colors, gradients, lighting, and material styling are Superseded by `DD-061`.
- Overall composition uses a full-bleed deep-navy environment rather than placing every element inside one visibly bounded Main rectangle. Preserve shell containment semantically, but let the visual Main background merge with the page through layered light fields. Sidebar remains a distinct tall glass slab with approximately `20px` radius, fine blue border, inset top highlight, and deep shadow.
- Environment background: start with `#020B24`/`#06143A`; add a large cyan radial light from the lower left (`rgba(0,194,255,.24)` fading by 42%), a blue-cyan radial light from the upper-right (`rgba(0,174,239,.20)` fading by 48%), and a broad indigo-violet radial light centered near the lower middle (`rgba(91,33,182,.24)` fading by 52%). Use these as positional atmosphere, not uniform Card fills.
- Glass grammar for parent panels: `background` composed from `rgba(12,34,83,.62)` plus local blue/indigo/cyan gradients; `backdrop-filter: blur(18px) saturate(135%)`; `1px solid rgba(125,190,255,.22)`; inset highlight `0 1px 0 rgba(255,255,255,.10)`; deep shadow `0 18px 42px rgba(0,4,20,.42)`. Parent radii are `18–22px`; nested rows use `12–14px` and quieter `rgba(255,255,255,.045–.075)` fills.
- Welcome is a luminous horizontal hero spanning the tool and access columns. Use a left-to-right base `linear-gradient(105deg, #102F64 0%, #173A86 38%, #3D2495 70%, #075F9D 100%)`, softened by a violet radial bloom near 70%/100% and cyan edge light on the right. Text stays left; `Add Tool` is right aligned in a bright blue-to-violet pill with a restrained blue shadow.
- Favs remains visually unboxed at section level: heading and `View all` sit directly on the atmospheric Main surface, while individual tool Cards use compact blue glass tiles. Selected/filter pills use brighter blue-indigo fill; inactive pills are darker translucent capsules with no hard black borders.
- All uses a large rounded parent panel with gray-blue upper-left, deep blue center, violet lower-right bloom, and faint cyan left/bottom environmental light. List rows are translucent blue-lavender glass strips; do not flatten them into opaque navy. Quick Access and Recent use narrower cyan-to-blue parent panels with brighter cyan on their upper/right side and quiet nested rows.
- Calendar uses a tall upper-right glass panel: bright cyan/teal upper-left and upper-middle illumination, deep royal-blue center, and violet lower-right bloom. To-Do below it uses blue upper-left, indigo center, violet upper-right/lower-middle, and a cleaner cyan-blue lower edge. Both retain readable white text and subdued blue-gray metadata.
- Desktop geometry at the reference ratio is approximately: Sidebar `210–230px`; content gap `24px`; tools column `minmax(520px, 1fr)`; access column `276–300px`; Widget column `350–390px`. Welcome spans tools + access. Calendar and To-Do stack in the Widget column. Favs/All stack in tools; Quick Access/Recent stack in access. All, Recent, and To-Do bottoms share the Sidebar Account bottom baseline.
- Navbar is an unboxed row over the atmosphere. Search is a `500px`-class dark-blue glass field with rounded `14px` corners and inset highlight. Theme and Settings float at top-right with independent dark shadows. Keep the exact `Light`/`Dark` target label behavior and no notification button.
- Maintain `DD-045` complete-item rules. The new Calendar grid is not a scrolling child rail; To-Do follows complete-row internal scrolling. Decorative background bloom must never reduce text contrast, create a false focus state, or animate continuously.
- Light Theme uses the same spatial light-source mapping with pale ice-blue/lavender translucent panels, not plain white Cards. The Theme switch shows only the target theme label and Icon.

### DD-047: Historical Dashboard Environmental Background

- Status: Superseded in full by `DD-061`; do not use these background colors, gradients, branches, or emitters in new generation.
- Layer ownership is strict. This material belongs to the full Dashboard environment behind Welcome, Favs, All, Quick Access, Recent, Calendar, and To-Do. It must remain visible through gaps and translucent glass, but it must not be baked into every Card background or move with an internally scrolling panel.
- Base field uses a deep blue progression rather than flat navy: `linear-gradient(118deg, #02091F 0%, #06153B 34%, #082454 67%, #052B57 100%)`. Keep the upper-left and extreme edges dark enough to frame content.
- Primary cyan emitter sits near the lower-left/left-center of Main, approximately `16% 70%`. Start with a small brighter core around `rgba(34,211,238,.40)`, transition through `rgba(6,182,212,.27)` and `rgba(14,165,233,.16)`, then fade fully to transparent by roughly 46–54% of its elliptical radius. The source must look luminous but diffused, never like a solid cyan circle.
- Cyan does not remain a single radial blob. From the primary emitter, render approximately three to five broad, soft branches aimed diagonally toward the center, upper-middle, and lower-middle. Use an atmosphere-only pseudo-element with a blurred, masked conic/linear composition, for example narrow cyan sectors separated by transparent sectors, `filter: blur(30–44px)`, opacity around `.45–.68`, and a radial mask centered on the emitter so every branch dissolves before reaching the far edge. Branch widths and opacity must differ slightly; they must not form symmetrical sun rays, sharp beams, lightning, or visible stripes.
- A secondary cyan-blue atmospheric source enters from the upper-right/top-center, approximately `74% -8%`, using `rgba(0,194,255,.24)` at its strongest point and fading through blue-cyan into the base by approximately 48%. It may cast one or two much softer downward branches behind Calendar and the top-right gap, without becoming a Calendar Card gradient.
- Add multiple Violet emitter points at the circled background positions: around `43% 48%` behind the All-header/gap region, `47% 104%` rising from the lower center, `82% 54%` near the Calendar/To-Do separation, and `98% 56%` entering from the far-right edge. Each has a compact Violet center such as `rgba(139,92,246,.28–.36)`, expands through Indigo such as `rgba(79,70,229,.18–.26)`, then fades into transparent blue. The center is Violet; the surrounding radiation is Indigo. Do not reverse this order.
- Violet emitters use different ellipse sizes and intensities. The lower-center and far-right emitters may be strongest; the All-header emitter must remain subtle enough that All text and its List/Grid control do not appear selected merely because of the background light.
- Composite order from front to back: subtle grain/noise if used, Violet-to-Indigo emitters, cyan branch layer, cyan radial emitters, deep-blue base field. Grain is optional, static, under `1.5%` effective opacity, and may not create compression-like artifacts.
- Background light is static. No continuous pulsing, drifting, rotating rays, animated gradient positions, or pointer-following glow. Theme changes may cross-fade the entire atmosphere using the existing restrained Theme transition; Reduced Motion changes it immediately.
- Enforce contrast after compositing through translucent Cards: normal text at least `4.5:1`, essential icons/controls at least `3:1`. If a bloom reduces contrast, lower that local atmosphere opacity or strengthen the Card's quiet scrim; do not replace the confirmed light color with black.
- Responsive mapping preserves the visual idea rather than fixed desktop pixels. On narrower layouts, keep one cyan emitter and one Violet-to-Indigo emitter visible, reposition them behind non-text gaps, reduce branch count, and prevent any bright core from sitting directly behind long text or form controls.

### DD-048: Historical Welcome Card Material

- Status: Visual styling Superseded by `DD-061`; Welcome layout, content, radius geometry, and responsive behavior remain defined elsewhere.
- Welcome remains a translucent glass surface over `DD-047`, not an opaque four-color banner. Use `backdrop-filter: blur(20–24px) saturate(135–145%)`, a fine blue-cyan translucent outline, inset top highlight, and a restrained deep shadow. Preserve the confirmed `20px` radius and clipped layers.
- Base/scrim uses a transparent deep-blue progression such as `linear-gradient(100deg, rgba(10,31,72,.78) 0%, rgba(15,38,91,.70) 52%, rgba(5,48,91,.54) 100%)`. The decreasing opacity toward the right is intentional so the environmental Cyan behind the Card can influence that edge.
- Upper-left contains two overlapping blue radial fields. The first has a slightly lighter blue center near `3% 0%`, for example `rgba(59,130,246,.30)`, spreading through royal blue and fading by roughly 55–68%. The second begins slightly inward near `16% 12%` with a deeper blue center such as `rgba(30,64,175,.30)`, expands more broadly, and disappears into the base around 68–78%. Their boundaries must overlap smoothly; they must not read as two circles or as diagonal stripes.
- The primary colored emitter sits to the right of center and slightly below the Card, approximately `68% 108%`. Its compact center is Violet, approximately `rgba(139,92,246,.36–.44)`. It radiates upward and outward through Indigo, approximately `rgba(79,70,229,.26–.34)`, then royal/deep blue before becoming transparent. Use a wide ellipse around `48–56%` of Card width and `125–150%` of Card height so only the upper portion of the radiation is visible. The order is `Violet core → Indigo → blue → transparent`; do not reverse it.
- The right Cyan is environmental bleed, not a second opaque Card-owned radial. Allow the `DD-047` upper-right Cyan source and branch haze to pass through the lower-opacity right side, then blur it with the Card backdrop. A very light local cyan veil up to approximately `rgba(6,182,212,.08–.12)` may stabilize the result across browsers, but it must remain subordinate to the real background and have no visible center inside Welcome.
- Recommended layer order from front to back: optional restrained right-edge cyan veil; upper-left light-blue radial; upper-left deeper-blue radial; bottom/right Violet-to-Indigo radial; translucent deep-blue scrim; blurred Dashboard environment. Keep text and `Add Tool` above every color layer.
- The left heading region must remain calmer than the emitter area. If the lighter blue radial lowers text contrast, reduce its opacity locally rather than darkening the entire Card. The Violet core must remain below/right of the copy and must not appear as a selected-state halo around `Add Tool`.
- `Add Tool` keeps its separate bright blue-to-violet action gradient and shadow. Its colors are not sampled from or merged into the Welcome emitter; maintain a visible boundary between action and background.
- Welcome has no hover reflection, moving bloom, pointer-following light, continuous gradient animation, or flowing edge. Theme switching may cross-fade the whole material; Reduced Motion updates immediately.
- On narrow screens, reposition the Violet emitter toward the lower-right and reduce its radius/opacity so it does not sit behind wrapped copy or the full-width action. Preserve a subtle left blue radial and right Cyan bleed rather than collapsing to a flat fill.

### DD-049: Historical Favs Card Material

- Status: Visual styling Superseded by `DD-061`; Favs structure, complete-item scrolling, and interaction remain Active.
- Favs has no enclosing filled parent panel. The heading, star Icon, `View all`, and horizontal Card rail sit directly over the `DD-047` atmosphere. Do not add a large background Card behind the section.
- Every Favs tool Card uses the same base glass material. Start with a pale deep-blue translucent fill such as `linear-gradient(145deg, rgba(24,52,108,.42) 0%, rgba(17,39,84,.34) 58%, rgba(21,43,91,.30) 100%)`; use `backdrop-filter: blur(16–20px) saturate(125–135%)`, `1px solid rgba(125,190,255,.14–.18)`, inset top highlight `0 1px 0 rgba(255,255,255,.07)`, and a quiet shadow `0 10px 24px rgba(0,5,24,.25)`. The result is slightly pale blue, not opaque navy and not gray-white frosting.
- Cyan is positional environmental influence, not a permanent style on a specific Favorite record and not a `:first-child` rule. The left side of the Favs viewport overlaps a soft cyan source from `DD-047`, approximately centered just outside/below the first visible Card position. Whichever complete Card occupies that visual position receives the Cyan bleed through its transparency and backdrop blur.
- The left-position Cyan appearance should match the annotated reference: place its blurred center near the first complete visible Card's right side, approximately `88–102% 58–72%` in that Card-position coordinate space. The strongest tint appears along the right-middle/lower-right interior and edge, then radiates leftward and outward through blue before disappearing. Use the real atmosphere where possible, with a viewport-level stabilizing radial no stronger than approximately `rgba(6,182,212,.10–.16)`. It must fade to near-zero before the second Card's inner content region, so the second Card reads as ordinary pale-blue glass. Do not create a bright cyan Card, hard spot, selection state, or unique data identity.
- Cards farther from the Cyan source retain the uniform pale-blue glass base and reveal only very faint underlying Indigo/blue variation. They must not receive copied Cyan centers, alternating gradients, or per-card random colors. Their differences come from background position and Icon color only.
- Keep Icon containers more saturated than the Card glass so AP/PS/SM/Notion remain easy to scan. Card title stays white; description/Tags use cool blue-gray. The northeast ExternalLink cue remains cyan-blue but must not be mistaken for the environmental tint.
- Preserve existing Card hover behavior and glass hierarchy, but hover may only slightly increase outline/highlight and lift. It must not add a new full-card Cyan fill or move the environmental light. Reduced Motion removes lift/reflection movement while retaining the static hover outline.
- The rail's clipping and `DD-045` complete-item scrolling remain unchanged. Because the Cyan source belongs to the viewport/background, horizontally scrolling Cards move across it naturally; the cyan tint does not travel with the original first Favorite.
- On narrow screens, keep the left-position Cyan source smaller and softer so it affects no more than the first complete visible Card. If contrast becomes insufficient, strengthen that Card's blue scrim locally while retaining environmental tint.

### DD-050: Historical All Parent Card Material

- Status: Visual styling Superseded by `DD-061`; All layout, List/Grid behavior, Favorite actions, and overflow remain Active.
- All is one translucent glass parent panel over `DD-047`, using `backdrop-filter: blur(18–22px) saturate(130–140%)`, `18–20px` radius, fine blue-cyan outline, restrained inset top highlight, and deep shadow. Preserve its fixed first-screen height and internal List/Grid overflow rules.
- Base/scrim remains Navy rather than purple: use a semi-transparent progression such as `linear-gradient(120deg, rgba(8,27,65,.78) 0%, rgba(16,31,79,.72) 48%, rgba(19,29,72,.62) 100%)`. This Navy layer connects every emitter and prevents visible color bands.
- Cyan at upper-left is environmental bleed. Place a broad soft source approximately `10–18% -8–4%`, with a restrained cyan-blue core around `rgba(6,182,212,.12–.18)` that expands through royal/deep blue and disappears by roughly 38–48% of panel width. It should be visible behind the `All` heading area without creating a bright cyan header strip.
- Cyan at left/lower-left is a second environmental exposure approximately `-6–4% 58–72%`. It may be slightly brighter, around `rgba(34,211,238,.16–.22)` at the clipped edge, then blur through blue and fade before the panel center. The source can enter from outside the Card so only a partial soft region is visible; it must not appear as a complete circle.
- Upper-right contains a smaller Card-local Violet radial approximately `76–84% -6–8%`. Use a Violet center such as `rgba(139,92,246,.22–.30)`, transition through Indigo `rgba(79,70,229,.18–.24)`, then merge into Navy. Keep it shallow enough that the List/Grid segmented control remains visually distinct and does not appear surrounded by a focus halo.
- Right/lower-right contains the dominant large Violet radial. Place its center partially outside the Card near `100–108% 94–106%`; use `rgba(139,92,246,.28–.38)` at the clipped Violet core, radiating through Indigo `rgba(79,70,229,.22–.30)`, royal blue, and finally Navy. Use an ellipse approximately `75–95%` of Card width and `80–110%` of Card height so the lower-right quarter is visibly Violet/Indigo while the transition reaches smoothly toward center without turning the whole panel purple.
- Required color direction is: upper-left Cyan bleed and lower-left Cyan bleed; Navy connection through the center; smaller Violet-to-Indigo radiation at upper-right; larger Violet-to-Indigo-to-Navy radiation at lower-right. Do not swap Cyan and Violet positions, reverse Violet/Indigo order, or use one diagonal linear gradient as a shortcut.
- Recommended layer order from front to back: upper-right Violet radial; lower-right Violet radial; optional weak cyan stabilization at upper-left/lower-left; translucent Navy scrim; blurred `DD-047` environment. Cyan remains primarily environment-owned; Violet radials are Card-local but must still allow subtle underlying atmosphere variation.
- Nested List rows and Grid Cards use quieter semi-transparent pale-blue/lavender glass, approximately `rgba(255,255,255,.045–.075)` over the parent, with their own fine outline. They must not be opaque enough to erase the parent's Cyan/Violet regions, nor transparent enough to compromise text contrast. Every row uses the same base; do not map row color to its vertical position.
- Header, List/Grid control, rows, Favorite Star, and ExternalLink stay above the material layers. Hover may lift/highlight an individual child row but may not alter the parent radial positions or wash the entire All panel with Cyan/Violet.
- All material is static. Internal vertical/horizontal scrolling moves only child content; parent Cyan/Violet fields remain fixed. Reduced Motion removes child lift/reflection movement but leaves the color composition unchanged.
- On narrow layouts, retain both left Cyan and lower-right Violet identities, reduce or remove the smaller upper-right Violet radial if it competes with controls, and keep the Navy center large enough for readable content.

### DD-051: Historical Quick Access and Recent Materials

- Status: Visual styling Superseded by `DD-061`; panel content, hierarchy, pinning, order, height, and scrolling remain Active.
- Both parents keep translucent glass fundamentals: `backdrop-filter: blur(18–22px) saturate(125–140%)`, `18px` radius, fine blue-cyan outline, subtle inset top highlight, and deep but restrained shadow. Their nested rows use a quieter semi-transparent blue surface and must not erase the parent fields.

#### Quick Access material

- Base is a lightened translucent Navy glass such as `linear-gradient(145deg, rgba(17,38,83,.70) 0%, rgba(14,36,80,.62) 55%, rgba(8,49,76,.52) 100%)`.
- Upper-left contains only a faint local Indigo wash, approximately centered `4–12% -6–4%`. Use an Indigo core around `rgba(79,70,229,.14–.20)` that expands through royal/deep blue and fades before the panel midpoint. It must remain subtle and must not become a visible Violet circle or purple header strip.
- Lower-right contains a blurred Cyan environmental radial influenced by `DD-047`, with its center near or just outside `96–108% 92–108%`. Use Cyan around `rgba(34,211,238,.16–.24)` at the clipped core, transition through blue-cyan and deep blue, and fade toward the center/upper-left. The lower-right should be the brightest color region while still reading through glass.
- Required direction is `faint Indigo upper-left → calm Navy center → Cyan environmental glow lower-right`. Do not add Violet at lower-right, Cyan at upper-left, or a uniform teal fill.
- Recommended layer order: optional weak upper-left Indigo radial; optional weak lower-right Cyan stabilization; translucent Navy scrim; blurred `DD-047` environment. Cyan remains primarily background-owned and fixed while nested rows scroll.

#### Recent material

- Most of Recent is a quiet, softly blurred, semi-transparent light Navy glass. Use a uniform base such as `linear-gradient(160deg, rgba(20,43,88,.68) 0%, rgba(14,36,75,.60) 55%, rgba(13,32,69,.58) 100%)`; variation across the left, bottom, and lower-right must remain slight.
- Recent has exactly one significant color emitter: a Cyan environmental radial entering from the upper-right corner, centered approximately `96–106% -6–6%`. Begin with `rgba(34,211,238,.16–.22)` at the clipped corner, expand through blue-cyan `rgba(14,165,233,.12–.18)`, then dissolve into the Navy base by approximately the middle of the panel (`48–58%` width/height influence).
- The Cyan glow must visibly extend from the right-top corner toward the central region, but its edge remains soft and blurred. It must not create a hard arc, header spotlight, selected `Clear` state, or full-width cyan band.
- Outside that single upper-right diffusion, Recent has no additional Violet, Indigo, teal, or lower-edge emitter. The previous multi-edge Cyan glow and lower-left teal radiation from `DD-044` are superseded for Recent. Retain only the fine outline, inset highlight, and dark depth shadow around the remaining quiet Navy glass.
- Recommended Recent layer order: optional very weak upper-right Cyan stabilization; translucent light-Navy scrim; blurred `DD-047` background. The scrim may be slightly stronger than Quick Access so background Violet does not create an unintended second colored region.

#### Shared child and interaction rules

- Quick Access and Recent nested rows use one quiet blue-glass base such as `rgba(255,255,255,.04–.065)` with a fine outline. Rows may reveal a small amount of the parent color but cannot introduce their own large Indigo/Cyan radials.
- Headers, descriptions, `Clear`, Icons, and ExternalLink cues remain above all material layers. `Clear` uses normal action styling and receives no glow from a specially positioned Card layer.
- Parent color fields remain fixed during internal vertical scrolling. Hover affects only the active child row with restrained outline/lift and never moves or intensifies the parent emitter.
- On narrow layouts, preserve Quick Access's upper-left Indigo/lower-right Cyan relationship. For Recent, preserve only the upper-right Cyan diffusion and quiet Navy remainder; reduce emitter radius rather than adding another source.

### DD-052: Historical Calendar Material and Active Spacing Rules

- Status: Color, gradient, lighting, and material styling Superseded by `DD-061`; Calendar spacing, state distinction, bottom padding, and non-animated behavior remain Active.
- Calendar retains the glass outline, inset highlight, rounded `20px` clipping, and deep shadow, but its internal base is intentionally more solid than the surrounding transparent Cards. Use only restrained backdrop influence; the date grid sits over a near-opaque pure Navy connection layer so external background colors do not unpredictably alter the calendar.
- The connecting base is a clean Navy field such as `#071A3F` to `#0A204A`, or an equivalent `rgba(...,.90–.96)` result. It is not gray-blue, teal, or purple. Navy must remain visible through the center and form the transition destination for all three colored emitters.
- Upper-left contains the dominant Cyan radial. Place its center near or just outside `0–8% 0–6%`. Use a clear Cyan/teal core such as `rgba(6,182,212,.38–.48)`, expand through blue-cyan `rgba(14,165,233,.24–.34)`, then royal/deep blue before joining Navy. Use a very broad ellipse approximately `115–145%` of panel width and `60–82%` of panel height so its diffusion reaches across almost the entire upper portion, as shown in the reference.
- The upper-left Cyan must be visibly stronger and larger than the lower-left source. Its upper zone may illuminate the `Calendar` heading and month-navigation background, but a Navy scrim must preserve text/control contrast. It must not become a flat teal top half or a hard semicircle.
- Lower-left contains a second, clearly visible Cyan radial approximately centered `-6–4% 68–82%`. Use `rgba(34,211,238,.24–.34)` at the clipped core, transition through blue-cyan and royal blue, then merge into Navy before the horizontal center. Its ellipse is smaller than the upper source, approximately `55–75%` width and `52–72%` height.
- Lower-right contains an Indigo radial approximately centered `98–108% 96–106%`. Use Indigo such as `rgba(79,70,229,.32–.42)` at the clipped core, transition through royal blue `rgba(37,99,235,.18–.26)`, then join the same pure Navy field. A limited Violet hint may appear only in the selected-date control; the parent Card emitter itself reads Indigo rather than Violet.
- Required composition is three independent emitters connected by Navy: very large Cyan upper-left, smaller Cyan lower-left, and Indigo lower-right. Navy transitions inward from and between all three regions, remaining clearly visible through the middle/right-center date grid. Do not connect Cyan directly to Indigo without a Navy interval.
- Recommended layer order from front to back: upper-left Cyan radial; lower-left Cyan radial; lower-right Indigo radial; near-opaque Navy connection base. Unlike `DD-048`/`DD-049`, these Calendar colors are primarily Card-owned and should not rely on environmental bleed for their placement.
- Date numerals, weekday labels, month title, chevrons, `Today`, task dots, and selected date remain above every material layer. Use a subtle local Navy text scrim when necessary; never darken the entire upper Cyan region solely to solve one label.
- The selected date keeps its separate bright blue-to-Violet pill and soft shadow. Its local highlight must remain distinguishable from the lower-right Indigo parent field and may not shift the parent radial center.
- Reserve a deliberate bottom comfort zone below the sixth/final visible date row. On wide desktop use at least `26px` clear space from the lowest date cell/task dot/selected-date shadow to the inner bottom edge; target `28–32px` when the allocated Calendar height permits. This space is part of the Calendar layout and may not be consumed by the lower-right Indigo artwork.
- Do not solve bottom spacing by increasing the full Dashboard or Widget rail height. Rebalance Calendar's internal row gaps, header-to-grid spacing, or the Calendar/To-Do height allocation while preserving readable date targets and the shared first-screen bottom baseline. Never crop a selected-date shadow or task dot to preserve the panel height.
- Calendar material is static. Month navigation changes only calendar content; no emitter slides, pulses, or follows the selected date. Reduced Motion removes content cross-fade but retains the static composition.
- On narrow screens, keep the upper-left Cyan broad across the top, reduce the lower-left Cyan radius, and retain a clipped lower-right Indigo corner with a sufficiently large Navy center for the seven-column grid.

### DD-053: Historical To-Do Material and Active Airy Task Layout

- Status: Color, gradient, lighting, and material styling Superseded by `DD-061`; task density, spacing, footer padding, and interaction remain Active.
- To-Do keeps a translucent glass parent with `20px` radius, fine blue-cyan outline, inset top highlight, deep shadow, and restrained `18–22px` backdrop blur. It is more transparent than Calendar but uses a stable Navy scrim so the three emitter regions remain controlled.
- Base/scrim is a calm Navy such as `linear-gradient(155deg, rgba(8,29,68,.82) 0%, rgba(14,32,76,.74) 54%, rgba(11,35,73,.66) 100%)`. Navy must occupy clear space between every emitter and remain the primary task-reading field.
- Upper-left contains a clearly visible Cyan radial, approximately centered `-4–5% -4–6%`. Use Cyan around `rgba(6,182,212,.30–.40)` at the clipped core, transition through blue-cyan `rgba(14,165,233,.20–.28)` and royal blue, then join Navy. Its ellipse should cover roughly `65–82%` of panel width and `38–52%` of panel height, making it broad and obvious without turning the complete header/task area teal.
- Upper-right contains the strongest saturated emitter: a high-intensity Indigo radial approximately centered `96–106% -6–6%`. Use Indigo around `rgba(79,70,229,.38–.50)` at the clipped core, radiate through royal blue `rgba(37,99,235,.22–.32)`, then fade into Navy. Use an ellipse around `72–92%` width and `45–62%` height. Its radiation may occupy much of the upper-right quadrant, but must finish early enough to leave a clearly visible Navy interval through the center/lower-middle.
- Lower-right contains a separate Cyan radial that is intentionally very faint and smaller than the upper-left source. Center it near `100–108% 96–106%`, use only `rgba(34,211,238,.07–.12)` at the clipped core and `rgba(14,165,233,.05–.09)` through the blur, and fade it within approximately `38–52%` width/height. It should be perceived as a soft cool haze, not a third strong color block.
- Required intensity order is `upper-right Indigo strongest`, `upper-left Cyan clearly visible`, `lower-right Cyan very faint`. Required spatial sequence is Cyan upper-left and Indigo upper-right separated/connected by Navy, with an additional quiet Cyan haze at lower-right. Do not join the two upper emitters directly into a continuous bright band; preserve Navy breathing space.
- Recommended layer order from front to back: upper-left Cyan radial; upper-right Indigo radial; lower-right faint Cyan radial; translucent Navy scrim; restrained blurred `DD-047` environment. Local stabilization layers own the visual placement; background bleed remains secondary.
- Keep title, `Add Task`, group labels, task rows, and Footer above all material layers. The upper-right Indigo must not make `Add Task` appear selected or merge with its border; retain a local Navy separation around the button when necessary.

#### Airy task density and bottom padding

- Task presentation is small and refined, not dense or miniature. Use a visual checkbox diameter of `16–18px` with a minimum `40×40px` invisible interactive target. The small circle must have a fine `1–1.5px` cool-blue outline and clear checked/focus states.
- Task title uses approximately `12.5–13.5px / 1.35–1.45` with medium weight; time/date uses `10.5–11.5px`; Accent dot uses `6–7px`. Preserve at least `10–12px` between the visual checkbox and title, `12px` between title and metadata, and `8px` between metadata and Accent dot.
- Each complete task row targets `34–40px` visual height, excluding the larger invisible checkbox hit area, and uses at least `8–10px` clear vertical space before the next row/divider. Rows must never overlap interactive targets despite the smaller visible controls.
- Each group label/count sits on one line with `12–14px` space before its first task. Keep `16–20px` breathing space between the final task of one group and the next group heading. A thin divider may occupy the midpoint of this gap but may not touch text or checkbox circles.
- Reserve generous space below the final visible task group and Footer. Keep at least `18–22px` between the last task/divider and `View all tasks →`, then at least `26px` clear space from the Footer text/focus ring to the inner bottom edge; target `28–32px` on wide desktop when height permits. On phones retain at least `20–24px` bottom clearance.
- Do not enlarge the full Dashboard to obtain this spacing. Rebalance the To-Do internal body height, number of simultaneously visible complete rows, and Calendar/To-Do height allocation. It is preferable to show one fewer complete task and use internal scrolling than to compress groups or remove bottom padding.
- Header and Footer remain fixed; only the grouped task body scrolls. Complete-row snapping from `DD-045` applies. Neither the parent color fields nor group headings outside the scrolling body move unless the full group content is intentionally inside that body.
- To-Do material is static. Hover/focus may clarify one row or checkbox but cannot intensify or move the three parent emitters. Reduced Motion removes lift/fade movement while retaining static state contrast.
- On narrow screens, retain the upper-left Cyan and upper-right Indigo identities, reduce the faint lower-right Cyan first if space is limited, and preserve the small visual controls with full accessible targets and bottom clearance.

### DD-054: Draggable Auxiliary Panels and Dynamic Two/Three-column Dashboard

- Status: Confirmed by direct Owner instruction; retained in `project.md 4.10-draft` and `design.md 5.25-draft` pending Product/UI re-freeze.
- Layout ownership is explicit. `Welcome`, Tags, `Favs`, and `All` form the anchored primary zone; Welcome/Favs/All keep their vertical order and are not cross-column draggable. `Quick Access`, `Recent`, `Calendar`, and `To-Do` are four draggable auxiliary panels distributed across at most two ordered auxiliary columns.
- Default desktop distribution remains access column `[Quick Access, Recent]` and Widget column `[Calendar, To-Do]`. Valid saved distributions include `2+2`, `1+3`, `3+1`, `4+0`, and `0+4`. Every auxiliary panel has one stable ID, belongs to exactly one column, and appears exactly once.
- Each auxiliary panel Header includes a dedicated `C-037 Panel Drag Handle`. The handle, not the entire Card, starts drag. Calendar dates, To-Do tasks, links, scrolling bodies, `Clear`, `Add Task`, and other controls retain normal interaction and never initiate layout movement.
- During drag, keep a same-size placeholder in the origin position so surrounding content does not jump. Show a lightweight lifted preview no larger than the source panel, reduce it to approximately `.92–.96` opacity, and preserve readable title only; do not render a fully interactive duplicate.
- Valid targets show a fine Cyan/Indigo insertion line plus a softly filled destination area. Each auxiliary column accepts before, between, and after positions. Invalid regions show no insertion line and cannot accept Drop. Avoid large pulsing glows or continuously animated dashed borders.
- When an auxiliary column becomes empty after a successful Drop, collapse that track and its gap immediately after the short placement transition. Dashboard becomes two columns: expanded primary zone plus one combined auxiliary column. Preserve a narrow discoverable edge Drop zone at the collapsed side with Tooltip/accessible label such as `Create right panel column` or `Create middle panel column`.
- Dropping a panel into the collapsed-column edge zone restores the third track and places the panel at the indicated start/end position. Restoration must not duplicate the dragged panel or reset the order of the remaining column.
- The expanded primary zone consumes all released track width with `min-width: 0`. Welcome changes inline size only: its height, copy, action, padding, emitter positions relative to its own box, and information density remain unchanged. Never add extra Welcome content because width increased.
- Favs and All consume expanded width by revealing additional complete items/columns. Use a container-based integer calculation from minimum/maximum item widths rather than a fixed five-Card cap. Favs and All Grid continue their one-row/two-row structures and show as many complete columns as fit. All List may increase to a maximum of four columns when its container is sufficiently wide; preserve row-major order.
- Suggested adaptive item sizing: Favs/Grid Card inline size stays within approximately `150–210px`; All List column target remains approximately `260–340px`. Use `floor((availableWidth + gap) / (targetMin + gap))` or equivalent container-query tracks, then distribute remaining space within the maximum width. Do not stretch a Card beyond its cap merely to eliminate leftover pixels.
- If all four auxiliary panels occupy one column, preserve each panel's established minimum usable height and internal layout. The combined auxiliary column becomes its own vertical scroll container with hidden scrollbar, keyboard/touch/wheel access, and panel-level `scroll-snap-align: start`. At rest, the viewport edge shows complete parent panels only; do not compress Calendar rows, To-Do spacing, or Quick Access/Recent bodies to force all four into the first screen.
- In the combined column, a panel's own internal scroller must receive wheel/touch input while the pointer/focus is over its scrollable body until it reaches an edge; subsequent scroll may chain to the auxiliary-column scroller. Use `overscroll-behavior` deliberately to avoid trapping input or accidentally moving the page Body.
- Successful Drop uses a restrained `160–220ms` transform/size transition for neighboring panels. The dragged preview follows the pointer without spring overshoot. Reduced Motion removes reflow animation and applies the final placement immediately while retaining placeholder, insertion line, and announcements.
- After Drop, return keyboard focus to the moved panel handle and announce its new column and position through a polite live region, for example `Recent moved to widgets column, position 2 of 3.` Save state locally immediately; show scoped `Saving…` then `Saved`. On failure, preserve a clearly marked unsynced local arrangement with `Retry`, or restore the original layout if persistence cannot safely retain it.
- Keyboard/assistive actions mirror drag: `Move up`, `Move down`, `Move left`, `Move right`. Disable impossible actions. Moving to another column appends at the nearest logical position unless the UI exposes a specific insertion choice; announce the result and retain focus.
- Phone/narrow layout has no visible desktop columns or drag-across-column gesture. Linearize auxiliary panels by saved left-column order followed by saved right-column order. Settings and panel action menus expose the same Move controls; do not require touch drag for any layout task.

## Product Identity

### DD-004: Product Name

- Status: Confirmed.
- Official display name: `Phil's studio`.
- Use the exact confirmed capitalization in user-visible product identity.
- Required placements: standalone Sign-in page, Sidebar brand area, browser title, PWA install name, and accessible product-name references.
- Confirmed tagline: `Your tools, one place.`

### DD-015: Single-letter Product Mark

- Status: Confirmed.
- Product mark: a white uppercase `P` inside a rounded-square blue-to-teal diagonal gradient.
- Use `P`, not `PS`, to avoid confusion with the existing `Online PS` tool.
- The rounded-square corner radius is approximately `26%` of the rendered mark size.
- Expanded Sidebar: mark plus `Phil's studio`; collapsed Sidebar: mark only.
- Sign-in: larger mark followed by the product name and confirmed tagline.
- Browser favicon uses the simplified `P` mark.
- PWA and Apple icons use an opaque background to avoid unintended transparent edges on different operating systems.
- Provide standard and Maskable PWA assets; the Maskable version keeps the `P` and essential gradient within the central safe area.
- Required source/output sizes: `512×512` master, `192×192` PWA, `180×180` Apple Touch Icon, and `32×32` favicon.
- The product mark remains static; do not add looping glow, rotation, floating, or breathing animation.

## Theme

- Confirmed product modes: `Light`, `Dark`, and `Auto` from `project.md` `F-006`.
- Light/Dark/Auto behavior remains confirmed. Large-background visual language is `TBD` under `DD-061`; Cards currently use the limited `DD-062` veil/highlight trial. Colorful unified Tool Icons and the existing product mark remain separate identity decisions unless the future HTML revises them.
- `Auto` selects Light or Dark from the system preference; it does not introduce a third visual style.
- Navbar provides one direct opposite-Theme action; Settings Appearance provides the complete `Light / Dark / Auto` choice.

### DD-021: Immediate Theme and View Controls

- Status: Confirmed.
- Navbar never shows `Light` and `Dark` simultaneously. In Light Theme it shows only `Dark`; in Dark Theme it shows only `Light`. The label and Icon describe the Theme that activation will switch to, not the current Theme.
- When Theme is `Auto`, Navbar uses the currently resolved system Theme to determine the opposite action. Activating it exits `Auto` and explicitly chooses that opposite `Light` or `Dark` value.
- The `Auto` preference synchronizes across devices, while each device resolves it from its own current system preference.
- Theme changes apply without reload. Color and surface values may crossfade for `150ms`; do not animate layout, blur amount, or shadow geometry. Reduced motion changes Theme immediately.
- `Grid / List` uses an Icon-plus-text two-option segmented control.
- The selected View is shared by All, Favs, and Dashboard All Preview and synchronizes across Owner devices.
- Phone retains both View choices; it is not forced to List.
- Switching View preserves the active Tag filter and relevant scroll context.
- View changes do not show Toasts, stagger tool entries, or replay card hover decoration.

### DD-035: Single Opposite-Theme Navbar Action

- Status: Confirmed.
- Use one compact pill-shaped Theme action in the Navbar instead of a two-option Light/Dark segmented control.
- Light Theme displays moon Icon plus `Dark`; Dark Theme displays sun Icon plus `Light`.
- The accessible name is action-oriented: `Switch to Dark theme` or `Switch to Light theme`.
- Activating the action applies the target Theme immediately, updates the Icon and label, persists the explicit preference, and preserves page, filter, view, focus context, and scroll position.
- `Auto` remains available only in Settings Appearance. While Auto is active, the Navbar action is calculated from the resolved Theme and selecting it replaces Auto with the opposite explicit Theme.
- The control keeps the existing `40px` minimum target and restrained `150ms` surface/color transition; it does not animate layout.
- The Theme action is immediately followed by the separate Settings Icon button. Settings is not part of the Theme pill, and no Notification/bell or second Theme Icon button may appear between them.

### DD-036: Compact Theme Toggle Visual

- Status: Confirmed.
- Match the Owner-provided compact control style: a rounded glass pill containing the destination Theme Icon, bold destination label, and a small switch-shaped indicator aligned on one row.
- Target computer size is approximately `104px × 40px`; preserve a minimum `44px` touch target on phone. Use `12px` pill radius, `12px` horizontal padding, and `8px` internal gap.
- The switch-shaped indicator is approximately `36px × 22px` with an `18px` circular thumb. It is decorative feedback inside a single semantic button, not a separately focusable nested switch.
- Use the confirmed blue-green primary/highlight colors for the indicator and focus treatment rather than copying the reference's purple accent.
- The entire pill is one click/tap target. Hover may brighten its glass border; press uses the confirmed subtle `scale(0.97)` feedback. Keyboard focus surrounds the full pill.
- The Icon, label, and thumb update together after activation. Reduced motion changes them immediately; otherwise use only the existing short color/opacity transition.
- The visual rule does not change `DD-035`: Light shows only `Dark`, Dark shows only `Light`, and Auto remains in Settings.
- Required internal order is Icon → destination label → switch indicator. Do not replace this with a label-only button plus a separate Sun/Moon button.

### C-027: Appearance Segmented Control

- Theme variant in Settings: `Light`, `Dark`, `Auto`; View variant: `Grid`, `List`.
- Navbar Theme remains the compact direct switch rather than duplicating the three-option Settings control.
- Selected, hover, focus, and disabled states remain clear in both Themes and do not rely on color alone.
- Each option is keyboard reachable using standard segmented/radio-group behavior and exposes its selected state to assistive technology.

## Color

- Dark background: `#06101D`; static Arctic Navy progression: `#06101D` → `#0B1830` → `#073A49`.
- Light background: `#EEF9F7`; static gradient end: `#EAF2FF`.
- Dark primary: `#3B82F6`; Dark supporting accent: `#06B6D4`; Light primary: `#0F766E`.
- Dark highlight: `#67E8F9`; Dark indigo bridge: `#635BFF`; Light highlight: `#0891B2`.
- Dark primary text: `#F5F7FF`; Dark secondary text: `#A9B2C3`.
- Light primary text: `#102A32`; Light secondary text: `#526970`.
- Dark glass surface: `rgba(16, 33, 58, 0.72)`; Dark glass border: `rgba(186, 230, 253, 0.17)`.
- Light glass surface: `rgba(255, 255, 255, 0.68)`; Light glass border: `rgba(15, 118, 110, 0.18)`.
- Text, icon, focus, hover, selected, error, and disabled states must remain distinguishable in all themes.

### DD-014: Historical Glass Material Tokens and Active Geometry

- Status: Radius, blur-performance, and geometry rules remain Active where non-visual; all palette, gradient, border-color, and shadow tokens are Superseded by `DD-061`.
- Card radius is `18px`; Icon container radius is `12px`.
- Glass blur is `18px` on computer and `12px` below `900px`.
- Standard glass border is `1px`; eligible card hover edge-light is also `1px`.
- Dark shell shadow: `0 16px 42px rgba(2, 6, 23, 0.48)` with optional low-opacity cyan environmental glow up to `0 0 38px rgba(14, 165, 233, 0.16)`.
- Dark content-panel shadow: `0 16px 38px rgba(2, 6, 23, 0.40)` plus a restrained `0 0 32px rgba(14, 165, 233, 0.10)` glow where hierarchy requires it.
- Light shadow: `0 16px 40px rgba(30, 80, 90, 0.14)`.
- Background gradients are static; do not add continuous gradient movement or ambient looping animation.
- Tool Icons may use varied accent colors, while Icon container size, opacity, radius, and alignment remain unified.
- If transparency reduces readability, increase surface opacity before weakening text contrast.
- On Safari or resource-constrained devices, blur may be reduced or disabled while border, shadow, surface opacity, and hierarchy remain intact.

### DD-034: Historical Layered Card Visuals

- Status: Visual styling Superseded by `DD-061`; only independently confirmed hierarchy, layout, interaction, and accessibility outcomes remain Active.
- Tool Cards use the strongest glass treatment; larger functional panels use a quieter version; Navbar and Sidebar remain the most restrained so content hierarchy stays clear.
- Dark Tool Cards use a translucent multi-stop Arctic Navy gradient with approximately `64%–76%` effective surface opacity. The gradient moves from deep blue/navy at the top-left through a restrained indigo bridge toward teal at the bottom-right; cyan is reserved for fine borders, focus, and edge illumination.
- Light Tool Cards use translucent warm-white glass with a subtle pale-blue-to-pale-teal transition, a fine gray-blue/teal border, and a softer themed shadow. Light mode must retain visible glass depth without reducing text contrast.
- Eligible cards include a subtle top/upper-left inset highlight, a `1px` translucent border, the confirmed environmental shadow, and a very low-opacity themed glow. These layers express glass thickness without producing a neon panel.
- Use the existing `18px` computer and `12px` compact blur targets. If blur is unavailable or harms performance, increase surface opacity and preserve gradient, border, inset highlight, and shadow hierarchy.
- On hover-capable fine pointers, the card may play one reflection sweep and illuminate thin bottom-left and top-right edge segments. The effect plays once per hover entry, does not loop, does not move layout, and does not cover the Favorite Star or external-link cue.
- Colorful tool Icons remain visually saturated inside consistent translucent rounded containers; the card material must not wash out brand or Monogram recognition.
- Static keyboard focus uses the accessible focus ring plus a restrained highlighted border/shadow. Touch and reduced-motion modes omit reflection and flowing edge movement.
- Sign-in references contribute only gradient balance, whitespace, and material depth. The actual Sign-in screen retains `Phil's studio`, the confirmed English copy, and Google OAuth only; it must not add email, password, registration, or account-recovery UI.

## Typography

- Primary family: `Geist Sans`, with `Inter`, `system-ui`, and `sans-serif` fallbacks.
- Monospace family: `Geist Mono`, reserved for keyboard shortcuts and limited technical information.
- Page title: `32px`, weight `700`; phone page title: `26px`, weight `700`.
- Section title: `20px`, weight `650`.
- Tool/card name: `15px`, weight `600`.
- Body: `14px`, weight `400`, approximately `1.5` line height.
- Tags, statuses, and supporting text: `12px`, weight `500`.
- Buttons and navigation: `14px`, weight `600`.
- Do not use all-uppercase labels or ultra-light font weights.
- `Phil's studio` uses the same family at weight `700`; do not introduce a decorative display font.
- Compact controls and Sidebar labels must use short English wording without sacrificing clarity.

### DD-013: Unified Modern Type System

- Status: Confirmed.
- Use Geist Sans as the product typeface with Inter and native system fallbacks for resilient rendering across supported devices.
- Use Geist Mono only where monospace improves recognition, primarily keyboard shortcuts such as `Ctrl + K`.
- Keep the hierarchy compact and readable; typography supports the glass surfaces rather than competing with them.
- Font loading must not hide usable text. Fallback metrics should minimize layout shift while Geist loads.

## Spacing and Grid

- Dashboard uses a two-region shell: fixed left Sidebar region plus flexible right Main region.
- Confirmed Sidebar widths: `248px` expanded and `72px` collapsed on supported computer layouts.
- Base spacing tokens: `4px`, `8px`, `12px`, `16px`, `20px`, `24px`, `32px`, `40px`, and `48px`.
- Navbar height: `72px`; Sidebar brand region: `88px`.
- Standard button: `40px` high; Icon-only button: `40×40px`; form input: `44px` high.
- Primary touch targets below `900px` are at least `44×44px`.
- Standard Grid Tool Card minimum height: `168px`; Dashboard Favs Card may use the same Grid composition or an approximately `80px` compact List presentation; Recent/List Row: `56px`; Manage Table Row: `64px`.
- Card padding: `20px` on computer and `16px` below `900px`.
- Section spacing: `32px` on computer and `24px` below `900px`.
- Grid gap: `16px` on computer and `12px` below `900px`.
- All Tools Grid: up to four columns at `1440px+`, three at `1200–1439px`, two at `900–1199px`, and one below `900px`.

### DD-017: Four-pixel Spacing and Density System

- Status: Confirmed.
- Use the defined `4px`-based spacing scale for component padding, gaps, and section rhythm.
- Density stays compact but never reduces text below confirmed Typography tokens or interactive targets below their confirmed minimum sizes.
- Fixed heights are minimum interaction/layout targets; content may grow vertically for localization-safe wrapping, zoom, validation, or accessibility needs.
- Grid column changes follow viewport width and available Main space without animating layout.

### DD-032: Final Compact Component Sizing

- Status: Confirmed.
- Sign-in panel: maximum `440px` on computer with `32px` padding; below `900px`, width `calc(100% - 32px)` with `24px` padding.
- Sign-in product mark: `56×56px`; `Continue with Google` uses full panel width and `44px` height.
- Welcome Area padding: `32px` on computer and `20px` below `900px`; use content-defined height rather than a fixed height.
- Welcome Area uses horizontal greeting/action composition when space permits; below `900px`, stack the greeting, `Your tools, one place.`, and `Add Tool` vertically with a shared left edge. Keep `Add Tool` at compact intrinsic width rather than full width.
- Owner Account Menu width: `220px`; anchor it to the Avatar trigger and use the shared glass surface. Show Google display name and `Log out` only—never email or duplicate Settings.
- Navbar Search width at wide layouts: `min(480px, 45vw)`; preserve at least `280px` on computer while space allows. Below `900px`, collapse to the Search Icon when necessary.
- Navbar action gap: `8px`.
- Phone landscape continues to use the Drawer layout.
- When a virtual keyboard opens, keep Command Palette input visible and reduce the scrollable result region rather than moving the input offscreen.
- Apply safe-area insets to Drawer, Toast, Edit Sheet, and App/Install status on iPhone-class devices.
- At `200%` zoom, allow wrapping and stacking without horizontal clipping.

## Icons and Imagery

- Collapsed Sidebar navigation is icon-only.
- Expanded Sidebar navigation displays the same icons with short English labels beside them.
- Every icon-only interactive control requires an accessible name and tooltip.
- Tool Icons use semi-transparent rounded containers that remain visibly glass-like in Light and Dark Themes.
- Every visible Tool Icon follows one shared visual grammar: a single-color line Glyph inside the shared tinted glass container. Individual tools may use different accent colors, while Glyph size, line weight, optical scale, container dimensions, alignment, opacity, and radius remain unified.
- Icon colors must remain distinguishable from the container and must not be the only indication of tool identity.
- Product identity assets follow `DD-015`.
- UI and navigation Icons use Lucide; tool brands follow the source priority in `DD-016`.

### DD-016: Unified UI and Tool Icon System

- Status: Confirmed.
- UI controls and navigation use Lucide at stroke width `1.75`.
- Sidebar mapping: `LayoutDashboard` for Dashboard, `LayoutGrid` for All, `Star` for Favs, `Clock3` for Recent, and `SlidersHorizontal` for Manage.
- Shared actions: `Settings` for Settings, `Search` for Search, `PanelLeftOpen` / `PanelLeftClose` for Sidebar state, `ExternalLink` for external launch, and `Sun` / `Moon` for Theme.
- UI Icon sizes: `20px` in Sidebar, `18px` in Navbar controls, and `16px` in compact rows and statuses.
- Tool Icon source priority: a reviewed line-style brand Glyph that conforms to this system, then the closest semantic Lucide-style Glyph, then a unified line-weight Monogram.
- Monograms use at most two uppercase characters, such as `SM` for StudyMate.
- Brand identity may inform Glyph geometry and accent choice, but production cards do not mix full-color logos, filled app tiles, gradients, 3D illustrations, Emoji, or photographic marks with the line-icon system.
- Do not use Emoji as production Icons.
- Every Icon-only action requires a concise English accessible name and Tooltip.
- Review applicable trademark and asset-license requirements before adopting a third-party brand Icon in production.

### DD-037: Unified Tinted Line-Glyph Tool Icons

- Status: Confirmed.
- Match the Owner-provided reference: each Tool Icon is a crisp line Glyph centered inside a translucent rounded-square container tinted from the same accent color.
- Grid and List both use a compact `36×36px` container with a `16–18px` Glyph unless a denser row requires a smaller optical rendering. Default Tool Glyph stroke is visually equivalent to Lucide `1.75`, with optical correction allowed for brand shapes.
- Container radius remains `12px` at Grid size and scales proportionally in List. Use a subtle same-hue border and low-opacity same-hue fill; do not add a second internal tile.
- Each tool receives one approved accent from a restrained palette such as teal, cyan, blue, violet, pink, orange, or neutral slate. Accent differences aid recognition, but tool name and accessible label remain authoritative.
- Official brand geometry may be simplified into a single-color line-compatible Glyph when recognizable and legally permitted. If it cannot fit this grammar cleanly, use a semantically close line Glyph or the unified Monogram instead of inserting the original full-color logo.
- Monograms use one or two uppercase characters, the same optical box, the same container treatment, and a weight that visually matches the line Glyphs.
- Icon hover does not animate, rotate, bounce, or independently glow. Card hover material may affect the surrounding container uniformly without changing Glyph geometry.
- Dark and Light Themes keep the same Glyph identity and accent assignment; only container opacity, border, and contrast adapt to the Theme.

## Animation and Motion

- Sidebar, Drawer, sheet, card, Theme, Toast, and reduced-motion behavior follow the confirmed motion decisions and tokens in this document.
- Motion must not block navigation and must respect reduced-motion preferences.
- Hover-capable cards use a brief glass-reflection sweep across the surface.
- Hover card edges use thin moving light accents concentrated at the bottom-left and top-right corners.
- Edge light uses a brighter, lighter transition of the active blue-green theme color rather than an unrelated hue.
- Reflection and edge motion must remain subtle, must not change layout, must not intercept pointer events, and must stop when hover/focus leaves.
- Keyboard focus receives an equivalent clear static or restrained animated treatment without requiring pointer hover.
- Reduced-motion mode removes sweeping and flowing movement and uses a static highlighted border/shadow state.
- Touch devices use the stable glass surface and pressed/focus feedback without depending on hover animation.

## Layout

### DD-001: Authenticated Dashboard Shell

- Status: Confirmed.
- Related Features: `F-001`, `F-008`.
- Structure: left Sidebar plus large right Main area.
- Sidebar supports expanded and collapsed states.
- Expanded: navigation icon with a short English text label beside it.
- Collapsed: navigation icon only.
- Main: occupies the remaining horizontal space and renders the active product screen.
- Header, utility placement, sizes, and Main hierarchy follow `C-010`, `DD-012`, `DD-017`, and the confirmed screen compositions.

### DD-002: Dashboard Navigation and Home Composition

- Status: Confirmed.
- Related Features: `F-001`, `F-003`, `F-004`, `F-008`.
- Primary Sidebar destinations: `Dashboard`, `All`, `Favs`, `Recent`, `Manage`.
- Sidebar footer: `Make it yours` Workspace helper above the signed-in Google identity; identity supporting label is `Personal workspace`, with account action `Log out`.
- Top Navbar: Search on the left; `Light/Dark` switch and `Settings` on the right.
- Default wide Dashboard Main below Welcome: left column stacks `Favs` then `All`; right column is one large `Recent` parent Card containing compact Recent item Cards/rows.
- Selectable Tag tabs: `AI`, `Design`, `ServiceNow`, `Automation`, `Productivity`, `Developer`, `Work`, `Learn`.
- `All`, `Favs`, and `Recent` are views, not category tags.
- `Search` is an independent function; `Open` is a tool-card action. Neither is a category tag.

### DD-003: Installable Online PWA

- Status: Confirmed.
- Related Features: `F-008`, `F-009`.
- The product can be installed from supported computer and mobile browsers and launched in standalone display mode.
- Installed and browser modes share the same sign-in, Dashboard, navigation, responsive behavior, and English content.
- The installed experience requires a network connection and does not expose cached protected tool data while offline.
- Offline state: show a concise English connection message with a retry action; do not imitate a usable offline Dashboard.
- App name/Icon identity follows `DD-004` and `DD-015`; launch background and theme colors follow `DD-014`; install entry and guidance live in Settings App according to `DD-026`.

### DD-005: Historical Blue-green Visual System

- Status: Superseded in full for colors and materials by `DD-061`; retained only as historical rationale.
- Related Features: all authenticated screens and both Sign-in themes where applicable.
- Dark Theme: deep blue-green background family, translucent glass cards, layered shadow, subtle background transition, and luminous blue-green hover treatment.
- Light Theme: retains glass translucency, shadow, gradient separation, and readable cool-toned edges on a bright background.
- Cards: translucent surface, visible depth shadow, background gradient transition, and sufficient opacity/contrast for readable content.
- Hover: glass reflection sweep plus thin flowing edge light at bottom-left and top-right using a brighter theme-color transition.
- Icons: colorful per-tool Icon artwork inside consistent semi-transparent rounded glass containers.
- Visual hierarchy remains Sidebar, shared Navbar, then Main content; modern typography and restrained rounded geometry from the earlier proposal are accepted.
- Exact opacity, blur, shadow, gradient, radius, animation duration, easing, and highlight intensity are intentionally adjustable during mockup review.

### DD-006: Restrained Card Hover Motion

- Status: Confirmed.
- Related Component: `C-006 Tool Card`.
- Purpose: communicate that the glass card is interactive and externally launchable without creating continuous decorative motion.
- Frequency decision: card hover is a high-frequency interaction, so reflection and edge light play once per hover entry and never loop continuously.
- Timing: target `180–220ms` with a strong custom ease-out curve; exact value remains adjustable during motion review.
- Sequence: one glass-reflection sweep plus one thin edge-light pass at bottom-left and top-right, followed by a stable static highlighted edge while hover remains.
- Interruptibility: pointer exit or rapid movement between cards immediately retargets or ends the effect without restarting from an unrelated initial state.
- Input gating: enable moving hover treatment only under `(hover: hover) and (pointer: fine)`.
- Keyboard: focus uses a clear static edge/focus treatment and does not play the reflection sweep.
- Touch: no hover motion; use stable glass and pressed/focus feedback.
- Reduced motion: no sweep or flowing edge; preserve static border, shadow, and color feedback.
- Performance: animate only compositor-friendly visual properties where possible, avoid layout-changing animation, and keep decorative layers from intercepting pointer events.
- Command Palette exception: keyboard-triggered open and close are immediate with no entrance or exit animation.

### DD-007: Sidebar Size and Motion

- Status: Confirmed.
- Related Components: `C-001 Sidebar`, `C-003 Sidebar Toggle`, `C-002 Main`.
- Computer widths: `248px` expanded and `72px` collapsed.
- Transition: target `180–220ms`; Sidebar spatial change uses a crisp custom ease-in-out.
- Labels: enter or leave with opacity plus no more than `8px` horizontal movement.
- Icons: keep stable scale, orientation, and visual alignment; do not rotate or shrink during the transition.
- Main: adjusts with the Sidebar shell but receives no additional fade or staged content animation.
- Interruptibility: rapid repeated toggle input reverses or retargets from the current visual state instead of restarting.
- Reduced motion: width/state changes immediately; Label visibility may use a brief opacity-only transition.
- Performance: because Sidebar sizing affects layout, implementation must keep the animated shell small, avoid unrelated layout work, and verify smoothness on every supported computer browser.
- Mobile exception: use the separate glass Drawer behavior; do not reuse computer widths or layout-resize motion.

### DD-008: Per-device Sidebar State

- Status: Confirmed.
- The expanded/collapsed Sidebar preference is local UI state scoped to the current browser/device profile, not Cross-device Sync data.
- Chrome, Edge, and Safari may retain different Sidebar choices on the same or different computers.
- First-use default: expanded on wide computer windows and collapsed on narrower supported computer windows; the exact breakpoint is confirmed later with responsive layout tokens.
- Mobile Drawer always starts closed on page entry and never inherits a computer Sidebar state.
- Signing out may retain the non-sensitive Sidebar preference but must remove protected session access and data.
- Hydration/initial render must apply the resolved state before visible layout presentation to prevent expanded-to-collapsed flashing.
- If local UI preference is unavailable or invalid, use the viewport-based default safely.

### DD-009: Mobile Glass Drawer

- Status: Confirmed.
- Width: `min(86vw, 320px)`.
- Layout: overlays Main from the left; opening the Drawer does not resize Main.
- Backdrop: translucent dark overlay that visually separates the Drawer and provides a dismissal target.
- Motion: open around `240ms`; close around `180ms`; use `cubic-bezier(0.32, 0.72, 0, 1)` as the Drawer curve.
- Performance: animate Drawer `transform` and backdrop `opacity` only.
- Dismissal: select a navigation destination, click/tap the backdrop, press `Esc`, or swipe left.
- Gesture: dragging is interruptible and reversible; a sufficiently fast flick may dismiss based on velocity without requiring the full distance threshold.
- Content: complete primary navigation plus Google avatar, username, and `Log out` account action.
- Reduced motion: present/remove the Drawer without positional movement; a brief backdrop opacity change may remain.
- Focus: opening moves focus into the Drawer and traps it appropriately; closing returns focus to the invoking menu control.
- Touch safety: pointer capture, boundary damping, and multi-touch protection must be addressed during implementation and real-device testing.

### DD-055: Mobile Navbar Menu and Sidebar Replacement

- Status: Confirmed.
- Below `900px`, remove `C-001 Sidebar` from layout entirely, including its collapsed rail and reserved grid width. Mobile Main must consume the full viewport width minus safe-area-aware page padding.
- Place one compact menu Icon button at the far left of `C-010 Top Navbar`, before Search. Use a familiar three-line Menu Icon from the shared Lucide family, a `40×40px` minimum target, the same restrained glass-control treatment as Settings, and the English accessible name `Open navigation`.
- The control opens `DD-009 Mobile Glass Drawer` from the left as an overlay. It is the only Mobile Sidebar entry; do not show a second floating toggle, desktop collapse control, persistent icon rail, or duplicate navigation button.
- Drawer content preserves the desktop information order: Phil's studio brand, `Dashboard`, `All`, `Favs`, `Recent`, `Manage`, optional Workspace helper when height permits, and the Owner Profile/account actions at the bottom. The Drawer may scroll internally if safe-area or landscape height cannot show every complete item.
- Opening does not resize, translate, or dim individual Main Cards. Only the Drawer translates and one full-viewport backdrop fades in. Lock background scrolling and mark background content non-interactive while open.
- Close through destination selection, backdrop press, `Esc`, or the confirmed left-swipe gesture. After close, return focus to the same Navbar menu button and change no Dashboard scroll/filter state.
- Respect `env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`, and the browser/PWA viewport. Keep the first navigation control and Owner account action clear of the notch, Dynamic Island, home indicator, and Android gesture area.
- In Reduced Motion, reveal/remove the Drawer without translation; retain only a brief opacity change for the backdrop. The menu Icon does not morph, rotate, or play a decorative animation.

### DD-056: Mobile Welcome Action Flow

- Status: Confirmed.
- At widths below `900px`, change `C-016 Welcome Area` from the desktop split row into a left-aligned vertical content stack: greeting first, exact supporting copy `Your tools, one place.` second, and `Add Tool` third.
- All three elements share the same left content edge. Place `Add Tool` approximately `16px` below the supporting copy; keep the greeting-to-copy gap around `6–8px` so the text reads as one group and the action remains visually distinct.
- `Add Tool` uses its existing blue-to-violet pill, minimum `44px` touch height, and compact intrinsic width with approximately `18–22px` horizontal padding. It must not become full width, float right, sit beside the greeting, or overlap the Violet emitter.
- Mobile Welcome uses content-defined height and enough bottom padding to contain the action comfortably. Do not preserve desktop height by clipping or reducing the action target.
- At `900px+`, restore the confirmed desktop composition: greeting/copy at left and `Add Tool` aligned at the right of the same Welcome Card. Breakpoint changes are immediate structural reflow without decorative motion.
- If enlarged text causes the button label to wrap, allow the button to grow within the Card while retaining the shared left edge and minimum target. Never horizontally scroll the Welcome Card.

### DD-057: Global Invisible Scrollbar Policy

- Status: Confirmed.
- Hide scrollbar chrome for every application-owned scrolling surface in both axes: document/Main fallback scrolling, Mobile Drawer, Settings, Manage, Add/Edit surfaces, Command Palette results, Favs, All List/Grid, Quick Access, Recent, combined auxiliary columns, Calendar/To-Do bodies, Tasks, modal/sheet content, and any future scroll container.
- Hidden means no visible thumb, track, corner, arrow, or reserved scrollbar gutter. The container's content box, responsive track calculation, Card width, alignment, and gaps must remain identical whether content overflows or not; scrollbar appearance must never cause layout shift.
- Preserve native scroll mechanics and complete content access through mouse wheel, trackpad, touch/pan, keyboard arrows, Page Up/Down, Home/End, focus movement, and assistive technology. Never use `overflow: hidden` merely to remove scrollbar chrome when content still needs to scroll.
- Apply interoperable invisible-scrollbar styling for Chromium/Edge, Safari/WebKit, and Firefox while retaining the defined `overflow-x: auto` or `overflow-y: auto` ownership. Browser/PWA modes must match.
- Because the scrollbar cannot communicate overflow, use restrained non-interactive cues only where discovery is otherwise unclear: clipped-edge fade, complete-item snap response, chevron, or content cutoff gradient. Cues must not consume Card gap, resemble a partial item, reduce contrast, or become an extra control.
- On touch devices, preserve momentum scrolling and safe-area padding. On keyboard focus, automatically reveal the focused item within its owning scroller without exposing scrollbar chrome or scrolling an unrelated parent.
- Do not replace native scrollbars with custom visual scrollbars, draggable tracks, permanent scroll indicators, or always-visible pagination solely to represent overflow.

### DD-058: Edge-to-edge Dashboard Atmosphere without Black Matte

- Status: Edge-to-edge coverage remains Active; background color, gradient, and emitter styling are Superseded by `DD-061`.
- The authenticated Dashboard background is the root visual canvas and covers `100vw` by at least `100dvh`, including browser/PWA safe-area extensions. Its final appearance will come from the future Owner-approved HTML and must reach every visible viewport edge.
- Remove every plain-black outer layer: no `#000`/near-black Body strip, capture frame, letterbox, full-page dark scrim, root pseudo-element, or transparent Shell region revealing black above, below, left, or right of the Dashboard.
- Reset default document spacing so no browser Body margin creates an exposed frame. The application root, Dashboard route, safe areas, and overscroll exposure use the same final HTML-defined page background rather than an unrelated fallback.
- Keep the confirmed wide-screen breathing room, Sidebar/Main separation, rounded corners, and shell gaps as internal padding over the environment. Do not solve the black-frame problem by stretching Cards to the viewport edges or removing useful gaps.
- Main and Sidebar shadows may remain local depth effects, but their dark shadows must feather into the blue environment and may not merge into a continuous opaque black band at the viewport boundary.
- The only full-viewport dark overlay allowed on Dashboard is the temporary interactive Mobile Drawer backdrop from `DD-009`/`DD-055`. It appears only while the Drawer is open and must disappear completely after dismissal; ordinary Dashboard presentation has no global dimming layer.
- At browser zoom, orientation change, short viewport height, and installed PWA safe areas, extend/reposition the atmosphere rather than revealing fallback black. Verify all four edges at desktop and phone dimensions.

### DD-059: Fluid Mobile Calendar Width

- Status: Confirmed.
- Below `900px`, `C-035 Dashboard Calendar Widget` participates as a normal full-width item in the single-column Main flow. Set its used inline size to the full available content width with `min-width: 0`, `max-width: none`, and border-box sizing; remove desktop Widget-track width, fixed inline size, and minimum-width inheritance.
- Calendar must align to the same left/right content boundaries as To-Do and other full-width Mobile parent Cards. Do not preserve a narrow desktop Calendar width inside a wider Mobile column, center a fixed panel, or leave an unused block on its right.
- Build weekday headings and dates as seven equal responsive columns using container-relative tracks equivalent to `repeat(7, minmax(0, 1fr))`. The grid consumes the Calendar inner width; no cell, selected-date highlight, or task dot establishes a wider intrinsic track.
- Mobile Calendar horizontal padding adapts from approximately `20px` to `14–16px` on narrow phones. Column gaps reduce before typography; weekday/date labels may use the confirmed compact type floor, but selected dates and navigation retain adequate invisible touch targets without expanding the grid track.
- Header/navigation uses a responsive layout: title and `Today` remain on the first row when they fit; month navigation fills the row below. At very narrow or enlarged-text widths, allow clean row wrapping inside the Card rather than enforcing a desktop one-line minimum width.
- Preserve all seven columns, bottom comfort padding, and distinguishable date states. Final Calendar colors are deferred under `DD-061`. Never solve width pressure with horizontal page/Card scrolling, clipping the Sunday column, scaling the entire Card as an image, or shrinking text below accessible limits.
- At `900px+`, return Calendar to the active auxiliary/Widget column sizing from `DD-046`/`DD-054`; desktop width changes remain driven by the Dashboard column layout.

### DD-060: Calendar Height and Content Containment

- Status: Confirmed.
- Calendar parent owns and contains every visual descendant. Its computed block size must include Card padding, Header, month navigation, weekday header, all six date rows, row gaps, task dots, selected-date shadow, and the confirmed bottom comfort zone. Use border-box sizing with `min-height: 0` only on grid ancestors—not as permission to collapse the Calendar below its content minimum.
- The date grid is normal-flow layout, never an absolutely positioned overlay. Use six explicit equal row tracks with a controlled responsive row height, approximately `40–52px` on desktop/medium widths and `38–46px` on narrow phones, plus explicit row gaps. Do not derive row height directly from the full Card width or stretch rows with unrestricted `1fr` against a stale fixed parent height.
- Date cells use `min-width: 0` and remain centered within their tracks. The selected-date visual stays within a bounded approximately `40–46px` square/pill; its shadow and task dot are included in cell overflow allowance and may not increase grid track width or paint beyond the parent clip.
- Below `1200px` and in single-column Mobile flow, Calendar uses content-defined/auto height with a calculated minimum sufficient for the complete six-week grid. It must not inherit a desktop fixed block size, `height: 100%`, or Widget-rail fractional height.
- At first-screen desktop where the Widget rail is height-bounded, allocate Calendar at least its full content minimum. If Calendar plus To-Do cannot fit, reduce only permitted internal gaps within their confirmed floors; after that, the owning auxiliary column scrolls by complete parent panels under `DD-054`. Never allow Calendar descendants to escape to preserve the first-screen illusion.
- Keep parent `overflow: clip`/`hidden` only as a final visual containment boundary after correct sizing; it must not conceal valid sixth-row dates. A clipped or missing row is a layout failure, not an acceptable overflow strategy.
- Recalculate containment after viewport resize, orientation change, Sidebar transition, panel drag/drop, browser zoom, font loading, month change, and text-size changes. No stale measured height may persist across these states.

### DD-061: Cancel Prescribed Card and Background Colors Pending New HTML

- Status: Confirmed by direct Owner instruction; highest-precedence visual-source rule.
- Cancel every previously prescribed Card and large-background gradient, exact color value, radial/linear field, emitter position, glow color, gradient direction, background transition, and HTML-sampled material recipe. This cancellation applies across Dashboard, Sidebar, Main, Welcome, Favs, All, Quick Access, Recent, Calendar, To-Do, Sign-in, Settings, Manage, sheets, dialogs, controls, and nested rows.
- `DD-034`, the visual portions of `DD-040`, `DD-042` through `DD-044`, `DD-046` through `DD-053`, `DD-058`, and any component text that says to use those materials exactly are historical and non-operative. If an older clause conflicts with this decision, ignore the older visual clause.
- Do not replace the cancelled recipes with a new guessed palette, a flat-color mandate, generic Arctic Navy, automatic blue/teal defaults, or a newly invented gradient system. Color and surface appearance are intentionally `TBD` until a new source is supplied.
- Continue enforcing non-visual facts: information architecture, component boundaries, content, actions, nesting hierarchy, dimensions, radius geometry where used for layout/hit areas, spacing, responsive rules, overflow, dragging, focus, contrast outcomes, Reduced Motion, and accessibility.
- Claude Design may freely create a more attractive visual direction while respecting those non-visual constraints. Its generated appearance remains review material, not the implementation authority, until the Owner provides and approves the exported HTML.
- When the new HTML is imported, inspect its real DOM/CSS/assets and create a new visual-source decision documenting only the accepted implementation. Do not automatically merge old Arctic Navy recipes back into it.
- Until that import, design review must not fail because a surface lacks the former Navy/Cyan/Indigo/Violet gradients or emitter placement. It may fail only for active structure, usability, responsiveness, state clarity, or accessibility requirements.

### DD-062: Very-light Blue-Indigo Card Veil and Restrained Highlights

- Status: Confirmed as the current reversible Card-material trial.
- Scope is Card surfaces only: Welcome, Tool Cards, parent panels, nested rows/cards, Quick Access, Recent, All, Calendar, To-Do, Sidebar helper/account Cards, Settings Cards, form Cards, dialogs/sheets, and equivalent contained surfaces. It does not style the Sidebar shell, Body, Dashboard environment, Main background, page background, or Drawer backdrop.
- Use one uniform, non-gradient, blue-biased Indigo translucent veil. Dark Theme target: approximately `rgba(72, 92, 190, .10–.14)` over the eventual underlying surface. Light Theme target: approximately `rgba(76, 92, 190, .045–.075)`. Tune within these ranges for contrast; do not turn the Card into an opaque blue/purple tile.
- Parent Cards use the upper part of the permitted opacity range. Nested rows/cards use approximately `55–70%` of the parent's veil strength so the parent remains legible as the containing surface. Equivalent Cards use the same base strength; do not randomize tint by data item or position.
- Do not use a color transition, multi-stop gradient, radial light, emitter, bloom, colored image, or animated hue to create this veil. It is a single translucent color layer with stable placement.
- Create highlight through restrained geometry rather than a gradient: a fine low-opacity cool border, plus inset top and left highlight lines such as `inset 0 1px 0 rgba(225,232,255,.12–.18)` and `inset 1px 0 0 rgba(205,218,255,.06–.10)` in Dark Theme. Light Theme uses lower opacity. The opposite edges remain quieter so the surface has depth without a glowing frame.
- A soft neutral/blue-black depth shadow may separate a floating Card from the page, but it must remain subordinate to the translucent veil and may not create a black band or neon halo. Nested rows use little or no outer shadow.
- Hover may raise veil/border/highlight strength by no more than roughly `15–20%` and use the already confirmed restrained lift/reflection timing. Focus uses the accessible focus indicator independently. Selected/active state may add a separate clear indicator but cannot rely only on a stronger Indigo fill.
- Text, Icons, dates, Tags, and controls remain above the veil. Verify at least `4.5:1` normal-text contrast and `3:1` essential non-text contrast in both Themes. Reduce veil/highlight opacity before changing semantic content colors.
- Backdrop blur may remain where supported, but the appearance must still work without it in Safari fallback, Reduced Transparency, low-power, or unsupported environments. The single-color veil and border must provide sufficient containment by themselves.
- This decision partially supersedes `DD-061` only for the Card veil and Card highlights described here. All old gradients, radial maps, background colors, emitter positions, and large-background styling remain cancelled/TBD.

### DD-063: Colorless Transparent Desktop Sidebar Shell

- Status: Confirmed.
- Scope: the desktop `C-001 Sidebar` outer shell in both expanded and collapsed rail states. The below-`900px` `DD-009 Mobile Glass Drawer` remains a separate modal surface and is not made transparent by this decision.
- The Sidebar shell is a layout container, not a Card or glass panel. Use `background: transparent` with no background image, fill, Indigo/Cyan tint, gradient, pseudo-element color layer, blend layer, or whole-shell opacity.
- Do not apply `backdrop-filter`, blur, saturation, brightness, contrast, or equivalent backdrop processing to the Sidebar shell. The final page/Dashboard background beneath it must retain the same hue, saturation, luminance, sharpness, and visible detail as the adjacent uncovered background.
- Remove the outer Sidebar shell border, inset highlight, full-height outline, and shell shadow. Rounded layout geometry and padding may remain, but they must not draw a visible panel silhouette.
- Never lower `opacity` on `C-001 Sidebar`; doing so would fade its content. Keep labels, Icons, and controls at their normal semantic opacity.
- Idle navigation rows may remain transparent. Hover, Focus, Pressed, and Active states may use small local control surfaces, outlines, or state fills confined to the individual row. These local states must not rebuild a full-height Sidebar background.
- `C-033 Workspace Helper` and `C-007 Owner Account` remain independent Cards and continue to use `DD-062`; their Card surfaces do not change the transparency of the surrounding Sidebar shell.
- If the future page background reduces text contrast, solve it locally on the affected navigation label/control using accessible foreground or individual state treatment. Do not add a full Sidebar scrim or blur as a contrast shortcut.
- Expanded/collapsed transition changes only width, label visibility, and Main allocation under `DD-007`; the transparent shell does not fade, tint, or animate a background.

## Navigation

### C-001: Sidebar

- Status: Confirmed structure and destination inventory.
- Primary destinations: `Dashboard`, `All`, `Favs`, `Recent`, `Manage`.
- Footer: `C-007 Owner Account` anchored at the bottom of the Sidebar.
- Sidebar outer shell follows `DD-063`: colorless, fully transparent, and free of backdrop blur, tint, border, or shell shadow so the final page background remains clear beneath it. Contained helper/account Cards use `DD-062`. Retain Sidebar structure, dimensions, states, and navigation hierarchy.
- Expanded state: icon plus concise English label for each item.
- Collapsed state: icon only, with tooltip and accessible name.
- The expand/collapse control must be available in both states.
- Active destination must remain visually identifiable in both states.
- Keyboard focus must not be lost when the state changes.
- Sidebar state persists per browser/device according to `DD-008`; it is not cloud-synchronized.
- Computer dimensions and transition follow `DD-007`.

## Screens and User Flows

### S-001: Sign-in

- Related Feature: `F-008`.
- Purpose: authenticate the single configured Owner through Google OAuth.
- Entry: any unauthenticated request to the protected product.
- Sign-in page background remains visually `TBD` under `DD-061`; its centered authentication Card uses `DD-062`. Retain the standalone composition, Light/Dark support, content, and accessibility behavior.
- Product name: `Phil's studio`.
- Tagline: `Your tools, one place.`
- Primary action: `Continue with Google`.
- Supporting copy: `Private access for the owner.`
- Loading action copy: `Signing in…`; prevent duplicate activation during OAuth redirect.
- General OAuth error: `We couldn’t sign you in. Try again.`
- Non-Owner error: `This account doesn’t have access.`
- Network error: `Check your connection and try again.`
- Expired-session message: `Your session has expired. Sign in again.`
- Error states retain an available Google sign-in retry action.
- States: default, redirecting/loading, OAuth error, non-Owner denied, expired session, and retry.
- Security content rule: never display or imply the allowed Owner email.
- Non-Owner denial never enters Dashboard or reads protected tool data.
- Session expiry removes the protected interface and returns to this screen.
- Success transition: direct redirect to `S-002 Dashboard` with no extra confirmation step.
- Sign-in and authentication errors remain inside the panel and do not create Toasts.
- Motion: no continuous background or glass-edge animation; the primary button uses a subtle `scale(0.97)` press response around `120–160ms`.
- Reduced motion: retain color/opacity feedback without positional or scale motion.
- Logo, typography, spacing, and panel dimensions follow `DD-015`, `DD-013`, `DD-017`, and `DD-032`.

### S-002: Dashboard

- Related Features: `F-001` through `F-008`, `F-019`, and `F-020` as applicable.
- Purpose: serve as the authenticated product home and main shell.
- Entry: successful Owner authentication, authenticated visit, or selection of the dashboard destination.
- Confirmed layout: `C-001 Sidebar` on the left and a large `C-002 Main` region on the right.
- Below `C-010 Top Navbar`, use the `DD-046` three-zone composition. `C-016 Welcome Area` spans the tools and access columns; Favs/All stack in the tools column, Quick Access/Recent stack in the access column, and Calendar/To-Do stack in the Widget column. Internal scrolling prevents page-height growth.
- States: loading shell, normal, empty tool inventory, content error, expired session, and permission failure.
- Responsive fallback follows `DD-046`: three zones on ultra-wide screens, two zones on standard desktop/tablet landscape, then a single accessible vertical flow on narrow screens.

## Components

### C-002: Main

- Status: Confirmed glass Card region and screen composition.
- Occupies all available space to the right of the Sidebar.
- Is one continuous semantic Main region using the `DD-046` atmospheric glass environment. Its outer visual boundary may merge softly into the page rather than reading as a second opaque Card, while Navbar and all active content remain contained and do not paint outside the shell.
- Clips/contains visual materials and internal scrolling within its rounded boundary; child surfaces may not paint beyond it.
- Dashboard/Main background remains visually `TBD` under `DD-061`; Card surfaces use the limited `DD-062` veil/highlight trial. Main must still contain its content and support the confirmed layout and states.
- Must support `Grid` and `List` tool views from `F-007`.

### C-003: Sidebar Toggle

- Status: Confirmed behavior, Icon mapping, size family, states, and motion.
- Action: switch `C-001 Sidebar` between expanded and collapsed states.
- States: default, hover, focus, pressed, and disabled if applicable.
- Must expose a clear English accessible label such as `Collapse` or `Expand`.
- Uses the interruptible `180–220ms` shell transition from `DD-007`; the control itself does not rotate or perform a decorative animation.

### C-004: Google Sign-in Action

- Related Feature: `F-008`.
- Status: Confirmed function, states, content, and interaction treatment.
- States: default, hover, focus, pressed, loading, error, and disabled while redirecting.
- Loading prevents duplicate activation; failure restores the actionable default state for retry.
- Must clearly identify Google as the sign-in provider without exposing the Owner email.
- Uses the confirmed `Continue with Google` and `Signing in…` copy from `S-001`.
- Press feedback is subtle and immediate; it must not delay OAuth navigation.

### C-005: Search

- Status: Confirmed function, placement, responsive behavior, and Command Palette integration.
- Appears on the left side of the top Navbar immediately to the right of the Sidebar and shows the `Ctrl + K` shortcut hint.
- Clicking the field and pressing `Ctrl + K` must open or focus the same search experience.
- Search is not rendered as a category tag.
- Placeholder: `Search tools or run a command…`.
- Opens `C-012 Command Palette` rather than a separate search-only surface.
- Search color, surface, border, and shadow are visually `TBD` under `DD-061`; preserve dimensions, placement, focus visibility, shortcut hint, and Command Palette behavior.

### C-006: Tool Card

- Status: Confirmed Grid/List composition, launch semantics, Favorite action, and visual states.
- May display one or more Tags from `AI`, `Design`, `ServiceNow`, `Automation`, `Productivity`, `Developer`, `Work`, or `Learn`.
- The main item surface is the launch target in both `Grid` and `List` Views and opens the independent tool in a new tab.
- `Open` names this behavior only; no separate `Open` text button is displayed.
- A compact northeast external-link arrow may appear in the lower-right or another reserved edge slot as the visual launch cue, following the selected Card composition without overlapping artwork, text, or Favorite.
- The arrow is part of the same item interaction and must not create a second competing action.
- A separate Star control toggles Favorite without launching the tool. Its event and focus target are isolated from the launch surface.
- Star accessible names use `Add {tool name} to favorites` and `Remove {tool name} from favorites`.
- Star target is at least `40×40px` on computer and `44×44px` below `900px`.
- Keyboard users must be able to focus the tool item and open it with `Enter`.
- Keyboard order reaches the launch surface before the Favorite control.
- `Open` is an action concept, not a category Tag or visible button label.
- Grid uses the vertical Card composition in `DD-038`: a smaller unified Icon at top-left, prominent Name below it, up to three Description lines, and up to two Tags plus `+N` along the bottom. Favorite and ExternalLink retain isolated reserved slots.
- List uses a `36×36px` Icon container, Name, up to two Tags plus `+N`, optional one-line Description on wider screens, right-aligned ExternalLink cue, and at least `56px` height. Hide Description when width is insufficient.
- If no valid icon is available, show a consistent initials-based fallback without changing the item layout.
- A long Name never pushes Star/ExternalLink controls away or changes the standard item height.
- Favorite updates Favs immediately. Save failure restores the previous state and displays `Couldn’t update favorite. Try again.`
- Successful Favorite change uses a static filled/unfilled Star state without Toast, particles, flight, or celebration animation.
- Favorite remains editable in Manage and Edit Tool for centralized maintenance.
- Hover follows `DD-006`; keyboard focus uses static highlight; Touch uses press feedback without simulated Hover.
- Hidden tools do not appear in Dashboard, All, Favs, or Recent and remain available only in Manage `Hidden` / `All`.

### DD-038: Vertical Content Tool Card Layout

- Status: Confirmed; corrected after the Owner clarified that the reference applies to content order, not column count or a right-side artwork region.
- Preserve the existing responsive Grid density. Do not force a three-column layout and do not add a right-side image, screenshot, illustration, or decorative media field.
- Card content follows one vertical stack: small unified line Icon at the top-left; Tool Name below the Icon; concise Description below the Name; Tags anchored along the bottom.
- Grid Icon container is `36×36px` with a `16–18px` Glyph, smaller than the earlier `44×44px` proposal while retaining `DD-037` stroke, color, radius, and optical-alignment rules.
- The Tool Name uses the confirmed `15px/600` token and may wrap to two lines only when necessary. Description uses up to three lines and truncates without pushing the bottom action row outside the Card.
- The bottom row contains up to two Tags plus `+N` on the left. The Favorite Star and `ExternalLink` northeast-arrow cue remain in reserved positions on the right and never overlap Tags.
- The northeast-arrow Icon is not Edit. It communicates that activating the Card launch surface opens the independent tool in a new tab; it is part of the Card launch interaction and not separately focusable.
- Favorite remains a separate independently focusable control and never launches the tool. No Edit action appears on collection Cards; editing remains available through Manage/Edit Tool.
- Do not copy the reference's `Explore ...` button. The whole non-Star Card surface remains the single launch target.
- Compact Recent rows and explicit List View remain unchanged. Dashboard Grid sections reuse this same internal ordering within their existing column rules.
- Hover uses the confirmed glass reflection and corner edge light on the Card shell only; Icon, text, Tags, Star, and ExternalLink do not shift.

### DD-030: Direct Favorite with Stable Launch Surface

- Status: Confirmed.
- Tool launch remains the dominant Card/List action, while Favorite is a clearly separated secondary control available at the point of use.
- ExternalLink remains a visual cue within the launch surface rather than a third competing action.
- Icon, text, Tags, Favorite, and launch cue retain fixed layout slots so loading, long names, and state changes do not shift geometry.

### C-031: Favorite Star

- States: not favorite, favorite, hover, focus, pressed, saving, and save error.
- Uses Lucide `Star`; favorite state may fill the shape while retaining sufficient contrast and an accessible selected state.
- During save, prevent repeated activation of this control only; do not block Card launch or other page actions.
- Error feedback is associated with the affected item and announced once without removing the tool.

### C-007: Owner Account

- Related Feature: `F-008`.
- Status: Confirmed behavior, content, accessibility, and placement; final compact menu dimensions remain in the last component-sizing review.
- Placement: anchored at the bottom of `C-001 Sidebar`, below `C-033 Workspace Helper` and separate from primary navigation.
- Expanded Sidebar: displays the signed-in Google avatar, username, and supporting label `Personal workspace`.
- Expanded presentation is one transparent glass Account Card using `DD-043`; Avatar and text sit inside the Card rather than directly on Sidebar background. Its bottom edge defines the wide-Dashboard alignment baseline.
- Collapsed Sidebar: displays the Google avatar as the account-menu trigger, with an accessible name and tooltip.
- Click action: opens an account menu containing `Log out`.
- `Log out` ends the session immediately and returns to `S-001 Sign-in` without a confirmation dialog.
- The menu must support pointer and keyboard operation, visible focus, outside-click dismissal, and `Esc` dismissal.
- The UI must not display the configured Owner allowlist email; only authenticated Google profile presentation approved for the session may be shown.
- Menu width and content follow `DD-032`.

### C-033: Workspace Helper

- Related Features: `F-002`, `F-008`.
- Placement: expanded Sidebar footer, directly above `C-007 Owner Account`.
- Workspace helper Card uses `DD-062` at nested/secondary strength and remains visually secondary to active navigation and Owner Profile through hierarchy and spacing.
- Exact English copy: `Make it yours` and `Add a tool or pin a favorite.`
- The helper introduces no new data model. It communicates the existing Add Tool and Favorite capabilities; implementations may make the existing actions discoverable without creating a new modal or workflow.
- Collapsed Sidebar hides the helper Card completely to preserve icon-only width. Mobile Drawer may show it only when vertical space permits without pushing Owner Profile or `Log out` offscreen.
- Do not animate, auto-dismiss, or rotate helper messages.

### DD-027: Private Authentication and Session Feedback

- Status: Confirmed.
- Authentication feedback is concise, safe, and located on the Sign-in panel; it never reveals allowlist values, matching logic, server configuration, or account-security implementation details.
- Redirecting disables duplicate sign-in activation. Failure restores retry without requiring a page reload.
- Non-Owner denial provides no protected shell or data access.
- Session expiry clears protected presentation and returns to Sign-in; successful reauthentication follows the frozen direct-to-Dashboard rule.
- Logout is immediate, requires no confirmation, and returns to Sign-in.
- Do not add success celebration, authentication Toast, or extra post-login confirmation screen.

### C-008: Tag Tabs

- Related Feature: `F-001`.
- Status: Confirmed content, filter, order, hidden-state, responsive, and accessible behavior; surfaces use the shared glass tokens.
- Options: `AI`, `Design`, `ServiceNow`, `Automation`, `Productivity`, `Developer`, `Work`, `Learn`.
- Selecting a tab filters the current tool collection to tools containing that Tag.
- Tag tabs are separate from the `All`, `Favs`, and `Recent` collection views.
- Active, hover, focus, and empty-result states must be visually clear.
- Confirmed example: `StudyMate` uses both `ServiceNow` and `Learn`.
- Hidden Tags do not appear in collection filter Tabs, but existing tool associations remain intact.
- Visible Tabs follow the single Owner-defined order from Settings.

### C-009: Tool Icon Field

- Related Feature: `F-010`.
- Status: Confirmed unified icon system, selector structure, preview, source labels, and fallback behavior.
- Appears in Add/Edit as an Icon registry selector and preview, not as a runtime AI-generation control.
- Source priority: reviewed line-style brand Glyph, semantically matching line-library Glyph, then unified Monogram.
- Monograms use short uppercase letters derived from the tool name, such as `SM` for `StudyMate`.
- Codex may assist asset curation or generation during development/maintenance; only finalized static assets appear in the product.
- States: brand Glyph, semantic Glyph, Monogram, missing-asset fallback, preview, and saved.
- The icon preview must reflect both larger `Grid` and compact `List` presentation.
- All icon types share container size, radius, stroke-weight, alignment, and a restrained accent-color system matching the supplied visual reference.
- Third-party brand Glyphs preserve recognizable geometry only when they can be normalized to the shared single-color line treatment and licensing rules.
- Show the current Icon in both Grid-size and List-size previews.
- Selector groups: `Suggested`, `Brands`, `Icons`, and `Monogram`.
- Suggested shows 3–6 static normalized options. Brands contains reviewed line-compatible brand Glyphs rather than original full-color app tiles. Icons uses Lucide with name search. Monogram accepts 1–2 uppercase characters.
- Monogram uses a limited set of approved accent presets rather than an unrestricted color picker.
- Candidate source labels: `Brand`, `Icon`, and `Monogram`.
- Selecting a candidate updates Preview only; the Icon is not persisted until the enclosing Tool form is saved.
- No runtime AI Generate action appears and the selector never reads Codex credentials, quota, or conversation state.
- If no candidate fits, derive a Monogram from the tool name. If an asset fails to load, display Monogram fallback without removing the reselect entry.
- Candidate navigation supports keyboard arrow movement and `Enter` selection.
- Selection changes do not rotate, bounce, or stagger candidate entry.
- A third-party brand asset enters the selectable registry only after applicable license and trademark review.

### DD-031: Reviewed Static Icon Selector

- Status: Confirmed.
- Icon selection is an Owner-reviewed static asset choice within Add/Edit, not a runtime AI-generation workflow.
- Suggestions narrow the choice but never override the saved Icon or persist without explicit Tool Save.
- Source visibility helps distinguish official identity, third-party brand assets, generic functional Icons, and generated Monograms.

### C-032: Icon Candidate

- Shows the Icon/Monogram, accessible name, source label, selected state, and optional accent preview.
- Uses a single-select grid/list pattern with visible focus and selected state that does not rely on color alone.
- Failed candidate assets fall back visually without becoming the saved selection unless explicitly chosen and saved.
- Light and Dark card surfaces use the confirmed glass treatment with theme-appropriate opacity, layered shadow, and background transition.
- On hover-capable devices, the card uses the confirmed reflection sweep and bottom-left/top-right flowing edge highlights.
- Hover decoration is visual only; the whole card remains the single stable click target.
- Hover motion follows `DD-006`: one `180–220ms` reflection/edge pass, then a static highlighted state, with no looping.

### S-003: Settings

- Related Features: `F-006`, `F-007`, `F-008` as applicable.
- Entry: select the `Settings` icon on the right side of `C-010 Top Navbar`.
- Placement: renders inside `C-002 Main`; the Dashboard Sidebar remains visible and unchanged.
- Exit: selecting any primary Sidebar destination replaces Settings in Main without leaving the authenticated Dashboard Shell.
- Confirmed sections: `Appearance`, `Dashboard`, `Tags`, and `App`.
- `Appearance`: `Light / Dark / Auto`, `Grid / List`, and a compact preview of the active Theme/View.
- `Dashboard`: manage visibility for Dashboard sections; reorder and move `Quick Access / Recent / Calendar / To-Do` between the two auxiliary columns; provide `Reset Layout`.
- `Tags`: add, rename, reorder, and hide Tags; show associated tool count; prevent direct deletion of in-use Tags.
- `App`: PWA install status/entry, Cross-device Sync status, `Last synced`, and supported device/browser guidance.
- Computer layout: compact secondary navigation on the left with the active settings content on the right.
- Phone layout: four sections in one vertical flow; do not introduce a second nested Drawer.
- Section changes are immediate and do not use page-transition animation.
- `Log out` remains exclusively in `C-007 Owner Account` and is not duplicated in Settings.
- Tag management behavior follows `DD-022` and `C-028`.
- App settings behavior follows `DD-026` and `C-029`.
- Controls and spacing follow the shared glass, typography, spacing, focus, and responsive tokens.

### DD-022: Safe Compact Tag Management

- Status: Confirmed.
- Settings Tags uses a compact management list showing Tag name, associated tool count, visibility, and reorder handle.
- `Add tag` creates a new Tag; selecting the name or Edit starts inline rename.
- Tag names are at most `18` characters and may use concise English letters, numbers, spaces, and hyphens.
- Trim leading and trailing spaces before validation and save.
- Duplicate checks are case-insensitive, so `Learn` and `learn` conflict.
- Reserved names: `All`, `Favs`, `Recent`, `Search`, and `Open`.
- An in-use Tag cannot be deleted; it may be renamed or hidden.
- Hidden Tags disappear from filter Tabs but retain existing tool associations. Add/Edit Tool shows an assigned hidden Tag with the label `Hidden`.
- Tag order controls the same filter order across destinations and synchronizes across Owner devices.
- Computer supports drag reordering; keyboard and phone provide `Move up` and `Move down`.
- Tags use one unified glass style rather than random per-Tag colors.
- Successful rename, visibility, and reorder changes use concise inline status and do not create a Toast for every change.

### C-028: Tag Management Row

- Shows drag handle, editable Tag name, tool count, visibility control, and accessible reorder actions.
- Inline editing preserves the previous saved name until the new value passes validation and saves successfully.
- Validation appears beside the Tag name and never clears the attempted value.
- Visibility and order controls expose current state and destination to assistive technology.
- On phone, controls may wrap into a second row while preserving the `44×44px` touch-target requirement.

### DD-026: Capability-aware App and Install Settings

- Status: Confirmed.
- Settings App contains three groups: `Install`, `Sync`, and `Support`.
- Install states: `Installed`, `Available`, and `Browser setup required`.
- Show `Install app` only when the current browser exposes a compatible direct-install capability. When already installed, show `Installed` without a duplicate install action.
- When direct installation is unavailable, show concise device/browser-appropriate setup guidance rather than a non-working button.
- Do not show App Store, Google Play, or Microsoft Store download actions.
- Install group states `An internet connection is required.`
- Sync states: `Synced`, `Syncing…`, and `Sync issue`; show `Last synced` and provide `Retry` on failure.
- App settings do not provide Backup, Import, Export, or a notification bell.
- Support lists Windows Chrome/Edge, Mac Safari/Chrome, iPhone Safari/Chrome, Android Chrome, and `Best effort` for Tablets, without dense technical version strings.
- Install and Retry use local loading only. Successful installation updates the state to `Installed` without celebration animation.
- Browser and installed PWA share the same Owner sign-in, hub data, Theme, and View behavior.

### C-029: App Status Group

- Uses compact glass sections with heading, current text status, supporting context, and at most one primary action.
- Status uses text and Icon rather than color alone.
- Setup guidance is progressive: show only instructions relevant to the current detected capability and platform context.
- Sync failure preserves the last known timestamp and current form/data state while offering `Retry`.
- Status changes use concise inline feedback and do not create redundant Toasts.

### C-010: Top Navbar

- Status: Confirmed composition, `72px` height, transparent unboxed row, responsive actions, and compact Search behavior.
- Placement: fixed to the top of the Main region, immediately to the right of the Sidebar, and shared across authenticated Main screens.
- Left: `C-005 Search` with the visible `Ctrl + K` hint.
- Right: exactly one compact Theme switch pill followed by the separate `Settings` Icon button with an `8px` gap.
- Navbar itself has no filled Card background, border, radius, backdrop blur, or independent shadow. It uses normal alignment directly inside the large Main glass Card.
- Theme pill and Settings retain independent glass surfaces and the pronounced dark control shadow from `DD-043`; Search retains its own input surface.
- `Auto` remains available inside Settings; the Navbar control is the direct `Light/Dark` switch requested by the user.
- Theme pill internal order: destination Theme Icon, `Light`/`Dark` destination label, decorative switch indicator. The entire pill is one semantic button.
- The provided screenshots guide placement and density, not unconfirmed features; no Notification/bell, second standalone Theme button, or Activity navigation is added.
- Below `900px`, place the single `DD-055` Drawer menu trigger at the far left, then the compact Search entry; preserve Theme plus Settings actions on the right. Never retain a fixed or collapsed Sidebar beside this Navbar.
- When horizontal space cannot fit the full Search field, replace it with an accessible Search icon that opens the same `C-012 Command Palette`.
- Search width and action spacing follow `DD-032`.

### C-011: Sync Status

- Related Feature: `F-012`.
- Status: Confirmed feedback behavior and placement near the affected surface plus Settings App summary.
- Normal successful background synchronization should not add persistent visual noise.
- Saving state may use concise English feedback such as `Saving…` and `Saved` near the edited surface.
- Failure state must show a concise English message and `Retry` without clearing the current form.
- Offline state reuses the confirmed online-required PWA messaging and must not imply that edits will sync later.
- No notification bell is required for synchronization.

### C-012: Command Palette

- Related Features: `F-004`, `F-013`.
- Status: Confirmed content, dimensions, responsive layout, and keyboard behavior.
- Entry: click `C-005 Search` or press `Ctrl + K` from an authenticated product screen.
- Desktop: top-centered glass panel, maximum width `640px`, approximately `10vh` from the viewport top, and maximum height `70vh`; results scroll inside the panel.
- Phone: near-full-width top Sheet respecting safe-area insets.
- Focus the Search input immediately after opening.
- Result groups: `Tools` and `Commands` with clear English headings.
- With no query, show up to 4 Recent Tools followed by commonly used Commands.
- Tool matching uses Name, Description, Tags, and Aliases.
- Highlight matched text subtly without changing row height.
- Each result row shows Icon, name, and supporting information; tool results also show the external-link arrow.
- Confirmed Commands: `Dashboard`, `All`, `Favs`, `Recent`, `Manage`, `Settings`, `Add Tool`, `Grid`, `List`, `Light`, `Dark`, `Log out`.
- Keyboard: arrow keys move through results, `Enter` executes, and `Esc` closes and restores focus to the invoking control when applicable.
- Tool results use the confirmed whole-item external launch behavior; internal Commands update the current Dashboard Shell.
- `Log out` is visually distinguishable as a session action; no permanent-delete Command is available.
- No-match heading: `No results found.` Supporting copy: `Try another name, tag, or alias.`
- Loading and command-unavailable states use concise English.
- Query text is ephemeral and is cleared when appropriate; it is not stored or synchronized.
- Open and close immediately without animation because this is a high-frequency keyboard interaction.

### DD-023: Keyboard-first Command Palette Layout

- Status: Confirmed.
- Search, recent launch, and safe internal Commands share one focused surface across computer and phone.
- Close returns focus to Navbar Search when opened by click, or to the previously focused element when opened by keyboard shortcut.
- Result selection changes immediately without animated scrolling or delayed highlight.
- The panel never stores query history or exposes destructive tool-management actions.

### C-013: Link Check Status

- Related Feature: `F-014`.
- Status: Confirmed content, Icons, progress, color roles, and behavior.
- `Manage` provides `Check link` for one tool and `Check links` for the visible tool collection.
- `Working` uses `CircleCheck` and a green role; `Check` uses `TriangleAlert` and an amber role; `Unknown` uses `CircleHelp` and a neutral gray role; `Checking…` uses `LoaderCircle` plus status text.
- `Unknown` means not yet checked or no usable result. `Check` includes login redirects, access restrictions, timeouts, and other ambiguous results requiring manual review.
- Show relative `Last checked` time in the row; Hover or focus exposes the exact date and time.
- Status must use text plus visual treatment and must not rely on color alone.
- Bulk progress uses concise copy such as `Checking 3 of 12` and does not block Add, Edit, filtering, or external launch.
- Ambiguous, restricted, or timed-out results use cautious wording and never imply that a tool was deleted or disabled.
- A single failure does not stop the remaining batch.
- The external-link action remains available regardless of status.
- Results and errors use concise English; unsafe URL targets show a safe refusal message.
- Completion uses the confirmed Toast `Link check complete`.
- Under reduced motion, `Checking…` uses a static Icon and text rather than rotation.
- Checks run only from explicit Owner action; do not schedule automatic periodic checks.

### DD-024: Manual Non-destructive Link Status

- Status: Confirmed.
- Link Check communicates confidence rather than declaring a tool valid or invalid from ambiguous network behavior.
- Status never automatically changes favorite, visibility, ordering, URL, or tool availability.
- Manual launch remains the Owner's final verification path for `Check` results.

### C-014: Dashboard Layout Settings

- Related Feature: `F-015`.
- Status: Confirmed controls, validation, feedback, Reset copy, and behavior.
- Default template follows `DD-054`: anchored primary zone `Welcome`/Tags/`Favs`/`All`, access column `Quick Access`/`Recent`, and Widget column `Calendar`/`To-Do`.
- Layout Settings manages column membership and order for `Quick Access`, `Recent`, `Calendar`, and `To-Do`. The former rule that Quick Access is fixed and not reorderable is superseded. Welcome, Favs, and All stay anchored; their widths respond automatically and are not represented as cross-column drag rows.
- Show one management row for each auxiliary panel with drag handle, name, current column label, position, concise description, Visible switch where allowed, and `Move up`/`Move down`/`Move left`/`Move right` actions.
- Computer supports drag ordering both directly on Dashboard and in Settings. Keyboard and phone always provide the four Move actions; phone does not require drag.
- Owner can reorder auxiliary panels, move them across columns, toggle allowed visibility, and select `Reset Layout`; Dashboard updates immediately and column collapse/restore follows `DD-054`.
- The last visible section cannot be hidden. Validation copy: `Keep at least one section visible.`
- Navbar and Sidebar are outside the customizable region and remain fixed.
- Hiding a Dashboard section never removes its All, Favs, or Recent Sidebar destination.
- Mobile preserves chosen section order in a vertical flow.
- Saved order and visibility synchronize across Owner devices.
- Saving feedback is concise inline `Saving…` / `Saved`; ordinary reorder does not produce a Toast.
- `Reset Layout` opens `C-026 Confirmation Dialog` with heading `Reset dashboard layout?`, copy `This restores the default section order and visibility.`, and actions `Reset` / `Cancel`.
- Reset restores the `DD-042` wide/narrow default template with all three customizable sections visible and the fixed Quick Access utility present.
- Order and visibility changes do not use flying, bouncing, or large reflow animations.

### DD-025: Immediate Safe Dashboard Customization

- Status: Confirmed.
- Settings remains the complete editing surface, while Dashboard additionally supports direct movement through dedicated panel handles. Dashboard is still the immediate result and does not enter a separate full-screen layout-builder mode.
- Preserve fixed global navigation and all collection destinations while customizing only Dashboard section composition.
- Cross-device save failure keeps the current controls and clearly offers retry instead of silently reverting the visible local choice.

### S-004: Add Tool

- Related Features: `F-002`, `F-010`, `F-013`, `F-016`.
- Entry: `Manage` Add action or Command Palette `Add Tool`; both open the same experience in Main.
- Uses one continuous page/surface rather than a multi-step wizard.
- First action: paste or enter the tool URL in `Tool URL`, then select `Get details`.
- Suggested fields: tool name, normalized domain, and Icon registry option.
- Editable fields before save: name, URL, concise description, one or more Tags, zero or more Aliases, source type, and Icon selection.
- Icon suggestion uses normalized line-style Brand, semantic Icon, or Monogram static registry options and never shows a runtime AI-generation control.
- After suggestions return, every field remains reviewable and editable on the same surface.
- Primary save action: `Save tool`.
- States: empty, suggesting, suggestion ready, partial suggestion, unsafe URL, suggestion error, manual entry, validation error, saving, and saved.
- Suggestion failure preserves every Owner-entered value and keeps manual completion available.
- Save remains explicit; suggestions never create a tool automatically.
- Confirmed status copy: `Getting details…`, `Details ready`, `Some details need your review.`, `Couldn’t get details. You can enter them manually.`, `Saving…`, `Tool saved`, and `Couldn’t save. Your changes are still here.`
- Getting details does not lock unrelated editable fields; the Owner may continue reviewing or entering available information.

### S-005: Edit Tool

- Related Features: `F-002`, `F-010`, `F-017`.
- Entry: select Edit for any tool in `Manage`, including every preloaded tool.
- Uses the same core editable fields as Add Tool, including Aliases.
- Alias input supports adding, reviewing, and removing multiple short English terms.
- Alias helper text explains that Aliases improve Search, do not appear as Tags, and must not contain passwords, Tokens, API Keys, or sensitive information.
- Preloaded and Owner-added tools share the same editable treatment; source type must not disable Alias editing.
- States: loading, editing, validation error, unsaved changes, saving, save error, and saved.

### DD-028: Clear Preserving Add/Edit Validation

- Status: Confirmed.
- `Name` is required with a maximum of `60` characters.
- `URL` is required and must be an absolute `https://` address. Trim outer spaces before validation and normalization.
- Reject unsafe or unsupported schemes including `javascript:`, `data:`, and `file:`.
- `Description` is optional with a maximum of `160` characters.
- At least one Tag is required.
- Aliases are optional; each is at most `32` characters and a tool may contain at most 10. Trim outer spaces and do not save empty values.
- Aliases may repeat across different tools. Within one tool, save a repeated Alias only once to avoid duplicate Chips.
- `Source` is required with `Owned` and `Third-party` options. Source is descriptive only and never changes external launch behavior.
- Icon always resolves to a value; when no selected/registry Icon is available, use the generated static Monogram fallback.
- Validate a field on blur or after Save is attempted rather than showing continuous errors during typing.
- Save remains operable so validation can explain problems; after a failed Save attempt, move focus to the first invalid field.
- Normalize URL before `C-015 Duplicate Warning` runs.
- Validation, network failure, and Duplicate Warning preserve every entered value.
- Error copy is concise English and does not expose validator, database, or server implementation details.

### C-030: Validated Tool Field

- States: default, focused, suggested, valid, invalid, disabled when truly unavailable, and saving where applicable.
- Error text appears directly below its field and is programmatically associated with the input.
- Required, character-limit, and format guidance is available before failure where it materially helps completion.
- Alias values render as removable Chips with keyboard-accessible removal; duplicate Chips within the same tool collapse to one normalized saved Alias.
- Tags expose hidden assigned values with the confirmed `Hidden` label.

### C-015: Duplicate Warning

- Related Feature: `F-018`.
- Status: Confirmed content, decisions, placement, visual priority, and focus behavior.
- Appears before save for exact normalized-URL matches or possible name/domain matches.
- Exact URL heading: `This tool already exists.` Copy: `A tool with this URL is already in your library.`
- Name/domain heading: `Possible duplicate`. Copy: `A tool with a similar name or domain already exists.`
- Show the existing tool's Icon, Name, URL, and at most two Tags without exposing sensitive data.
- Actions: `Edit existing`, `Continue anyway`, `Cancel`.
- `Edit existing` closes the current Add surface and opens the matched existing tool in Edit Tool.
- `Continue anyway` preserves current content and saves a separate tool.
- `Cancel` closes the Dialog and returns to the current form.
- Initial focus is `Cancel`; `Edit existing` is the recommended primary action. `Continue anyway` uses a secondary warning treatment rather than danger red.
- For exact URL matches, `Continue anyway` remains available at the lowest visual priority.
- Aliases never trigger this component.
- Same-domain, different-path tools can be saved through `Continue anyway`.
- No action automatically merges, overwrites, hides, or deletes a tool.
- Uses a compact confirmation dialog above the Add/Edit surface; focus is contained and returns to `Save tool` or the equivalent Edit save action when cancelled or closed.
- Opening may use a short opacity-only change; reduced motion presents it immediately.

### DD-029: Non-destructive Duplicate Choice

- Status: Confirmed.
- Duplicate Warning provides context and choice rather than enforcing automatic merge or blocking legitimate same-domain/path variants.
- Existing-tool identity is sufficient for recognition but does not disclose aliases or unrelated metadata.
- Dialog decisions never discard the current form unless the Owner explicitly chooses `Edit existing` after reviewing the match.

### C-016: Welcome Area

- Related Screen: `S-002 Dashboard`.
- Status: Confirmed content, behavior, visual treatment, padding, and responsive composition.
- Placement: compact glass panel immediately below the shared Navbar and above Dashboard collection sections.
- Greeting uses local time: `Good morning, {name}`, `Good afternoon, {name}`, or `Good evening, {name}`.
- Name source: authenticated Google Profile display name only; never show the Owner allowlist email.
- Fallback when display name is unavailable: `Welcome back`.
- Supporting copy: `Your tools are ready when you are.`
- Single primary action: `Add Tool`, opening `S-004 Add Tool`.
- Do not add `Launch a tool`; Navbar Search and Command Palette already provide launch behavior.
- Do not add `Frequent`, Activity, usage counts, or Most Used because Usage Insights was rejected.
- Welcome uses the parent-Card strength of `DD-062`. Preserve its span, content hierarchy, `20px` geometry, clipped containment, responsive flow, and action placement; do not restore the historical radial material.
- `Add Tool` uses subtle immediate press feedback and must not delay navigation.
- Phone: follow `DD-056`; place `Add Tool` below the exact supporting copy `Your tools, one place.`, left aligned with the text, using compact intrinsic width. Let Welcome height grow to contain the stack rather than keeping the desktop split row.
- Exact padding, flow, and content-defined height follow `DD-032`.

### C-017: Dashboard Favs Section

- Status: Confirmed.
- Shows Favorite tools in one fixed-height row; the viewport displays as many complete Cards as fit rather than enforcing a four-item data cap.
- On wide Dashboard, Cards use `DD-038` vertical content in one non-wrapping rail. Apply `DD-045` plus `DD-054`: ordinary widths expose 2, 3, 4, then 5 complete Cards; a primary zone enlarged by auxiliary-column collapse continues exposing additional complete Cards without a fixed count cap or excessive Card width. Overflow scrolls horizontally by complete Card boundaries with the visual scrollbar hidden. Phone retains the responsive compact treatment and horizontal touch scrolling.
- At the first-screen desktop condition from `DD-044`, Favs owns horizontal overflow only and never increases its allocated height.
- Favs Cards use `DD-062` with equal base strength for equivalent Cards. Preserve complete-item geometry, readable hierarchy, and state clarity; do not attach arbitrary styling to a data item's position.
- Each Grid item shows Icon, tool name, concise description, and at most 2 Tags; List keeps the compact content rule.
- `View all` navigates to the complete `Favs` destination.
- Do not render placeholder slots when fewer than 4 favorites exist.
- In the default wide Dashboard template, this section occupies the top of the left collection column above `C-019 Dashboard All Preview`.

### C-018: Dashboard Recent Section

- Status: Confirmed.
- Retains the existing Recent data rule and displays as many complete rows as fit within its fixed viewport.
- In the default wide Dashboard template, the section occupies the lower access rail beneath `C-034 Quick Access` and consumes the remaining height down to the Owner Account Card bottom baseline defined by `DD-043`. After customization, it follows the saved auxiliary column and position from `DD-054` and retains its minimum usable height.
- Recent parent uses `DD-062` parent strength and its rows use nested strength. Use one large `18px` parent Card with internal heading/`Clear`, padding, and an `8px` inner gap; do not restore historical radial/glow maps.
- Directly below the title row, show the exact one-line supporting text `Jump back into tools you opened.`; it never wraps and truncates with ellipsis if necessary.
- Recent item Cards/rows use a quieter nested-glass surface than the parent and must remain visually distinct from the parent background.
- Each row shows Icon, tool name, relative time such as `11 min ago`, and the external-link arrow.
- Keep the parent Header and `Clear` fixed; only the nested item body scrolls vertically and settles on complete row boundaries under `DD-045`. Hide the visual scrollbar while retaining keyboard, wheel, trackpad, and touch access.
- At the first-screen desktop condition, use internal `overflow-y` only; item count never increases Recent, Main, or page height.
- Do not show open counts, `Frequent`, or other usage analytics.

### C-019: Dashboard All Preview

- Status: Confirmed.
- Defaults to `List` on first use and after `Reset Layout`; a later Owner choice may continue to follow the confirmed saved View preference.
- `List`: compact items using the same tool data and row-major order. Every item includes an isolated Favorite Star before the ExternalLink cue. The section fills the remaining primary-zone height and its item body scrolls vertically by complete row boundaries without increasing Dashboard height. Apply the revised `DD-045`/`DD-054` container rules: 1 column below `720px`, 2 at `720–1119px`, 3 at `1120–1479px`, and up to 4 at `1480px+`.
- `Grid`: use `DD-038` with small Icon, name, concise description, at most 2 Tags, isolated Favorite Star, and ExternalLink cue; no decorative right-side visual field. Dashboard Grid uses exactly two equal rows and the `DD-045` responsive 2/3/4/5 visible-column rules. It scrolls horizontally by complete two-Card columns for overflow and never stretches Cards to the full parent height.
- All parent uses `DD-062` parent strength and nested rows/Grid Cards use nested strength. Parent/child hierarchy must remain readable. List owns only internal `overflow-y`; Grid owns only internal `overflow-x`; neither may increase the allocated parent height.
- `View all tools` navigates to the complete `All` destination.
- Do not render placeholder slots when fewer than 8 tools exist.
- In the default wide Dashboard template, this section occupies the lower part of the left collection column below `C-017 Dashboard Favs Section`.

### C-034: Dashboard Quick Access

- Related Screen: `S-002 Dashboard`; related Feature: `F-003`.
- Status: Confirmed layout, manual Pin source, states, and interaction.
- Default placement: top of the access auxiliary column, aligned with the upper edge of the Tags/filter-and-collection region and above `C-018 Dashboard Recent Section`. After customization, it follows the saved auxiliary column and position from `DD-054`; the former above-Recent relationship is a reset-template default, not a permanent constraint.
- Structure: one parent Card with heading `Quick Access` and a nested vertical item body. Apply `DD-062` parent/nested strengths, retain clear hierarchy, and do not add historical radial materials or `Recent / Frequent` tabs.
- Directly below the heading, show exact one-line supporting text `Pinned tools, ready when you need them.`; it never wraps and truncates with ellipsis if necessary.
- Viewport height is sized to exactly three complete compact tool items plus their two gaps. When more items exist, only the nested body scrolls vertically and settles at complete item boundaries; parent height and header remain fixed.
- Each nested item uses the quiet deep material from `DD-042` and shows unified Icon, tool name, concise supporting text when available, and northeast ExternalLink cue. The whole non-cue row remains the launch surface.
- Hide the visual scrollbar while preserving keyboard, wheel, trackpad, and touch scrolling. Do not show usage count, popularity, ranking, or visible `Open` text.
- At the first-screen desktop condition, the nested body owns internal `overflow-y` only; item count never changes the fixed parent height.
- Content includes only visible tools with `Pin to Quick Access` enabled. Sort by most recently pinned first; unpinning and pinning again moves the tool to the first position.
- Manual Pin entry points: Add Tool and Edit Tool use one labeled switch/checkbox `Pin to Quick Access`; Manage exposes the same state as an accessible row action/control without making the external-launch surface ambiguous.
- The Pin control never opens the tool. It uses isolated pointer and keyboard events, an English accessible name containing the tool name where needed, and concise inline `Saving…` / `Saved` feedback.
- On save failure, restore the previous Pin state and show `Couldn’t update Quick Access. Try again.` with `Retry`. Do not use celebration animation or a success Toast.
- Hidden pinned tools remain pinned in data but are omitted from the panel. When made visible again, they return according to their original Pin time.
- Empty heading: `No pinned tools.` Supporting copy: `Pin tools from Add, Edit, or Manage.` Do not render placeholder Cards.

### Shared Dashboard Collection Rules

- The whole tool item is the one launch target; no visible `Open` button.
- Tool items use the confirmed one-shot glass reflection and dual-corner edge behavior from `DD-006` on eligible pointer devices.
- Hiding a Dashboard section changes Dashboard composition only; its Sidebar destination remains available.
- Initial load and `Reset Layout` restore the `DD-042` default: wide left `Favs`/`All` stack plus right `Quick Access`/`Recent` stack; below `1200px`, `Favs`/`All`/`Quick Access`/`Recent` vertical order.
- All four Dashboard collection surfaces use internal overflow rules from `DD-042`; visual scrollbars remain hidden without disabling scrolling or keyboard access.

### S-006: All Tools

- Related Features: `F-001`, `F-004`, `F-007`, `F-011`.
- Uses the shared collection header with title, visible result count, and `Grid / List`; do not duplicate Navbar Search.
- Shows horizontally scrollable Tag tabs with `All` selected by default.
- Shows up to 24 tools initially; additional tools use explicit `Load more` rather than infinite scrolling.
- `Load more` appends tools without moving existing items or blocking interaction.

### S-007: Favs

- Related Features: `F-001`, `F-007`.
- Uses the shared collection header and shows favorite tools only.
- Supports the same Tag tabs to filter the favorite subset.
- Empty heading: `No favorites yet.`
- Empty supporting copy: `Mark tools as favorites to find them here.`

### S-008: Recent

- Related Feature: `F-003`.
- Uses the shared collection header and shows at most 6 tools ordered by most recent open time.
- Provides `Clear` with a concise confirmation before removal.
- Empty heading: `No recent tools.`
- Empty supporting copy: `Tools you open will appear here.`

### C-020: Shared Collection Header

- Displays page title, current visible result count, and `Grid / List` control where applicable.
- Navbar Search remains the only Search input.
- Tag and View changes are immediate with no page-transition animation.
- Do not use large stagger animations when results change.
- Newly appended `Load more` results may use a very subtle opacity-only transition that never delays interaction.
- Phone Tag tabs scroll horizontally in one row rather than wrapping into dense multi-line controls.
- Every tool item preserves whole-item launch and the external-link arrow.

### DD-010: Manage Workspace and Edit Surface

- Related Features: `F-002`, `F-005`, `F-010`, `F-014`, `F-017`.
- Status: Confirmed.
- `Manage` is an editing workspace rather than another tool-launch collection.
- Selecting a management row opens that tool in `S-005 Edit Tool`; it does not launch the external App.
- The northeast external-link arrow is the only control in a management row that opens the App in a new tab.
- Computer Edit Tool uses a right-side glass panel; phone uses a near-full-screen Edit Sheet.
- The surface enters from the right in `220ms` with a strong ease-out and closes in `180ms`; animate only transform and backdrop opacity.
- Open and close transitions must be interruptible. Under reduced motion, show or hide the surface immediately without positional movement.
- Reordering and status updates do not animate the full table; use only a brief static highlight to confirm the changed row.

### DD-011: Single-surface Quick Add

- Related Features: `F-010`, `F-016`, `F-018`.
- Status: Confirmed.
- Add Tool is a single continuous surface: enter `Tool URL`, request `Get details`, review or edit every field, then select `Save tool`.
- Metadata and Icon suggestions are assistive only; they never advance a step, lock the form, or save automatically.
- Suggestion and save failures preserve all Owner-entered content and keep manual completion available.
- Duplicate detection runs only when saving and uses `C-015 Duplicate Warning` without replacing the current form.
- Suggestion results appear immediately or with a very short opacity-only transition. Do not use wizard transitions, field staggering, bounce, or a blocking full-surface loader.
- Pressable actions use subtle immediate scale feedback around `0.97` for `120–160ms`; feedback must never delay the action.

### DD-012: Responsive Layout Breakpoints

- Status: Confirmed.
- Breakpoints use viewport width rather than device names, browser brands, or PWA installation state.
- At `1200px` and wider, use the computer shell with the Sidebar defaulting to expanded at `248px`.
- From `900px` through `1199px`, use the computer shell with the Sidebar defaulting to collapsed at `72px`; the Owner may still expand it.
- Below `900px`, remove the fixed Sidebar and use `DD-009 Mobile Glass Drawer`.
- Main remains fluid rather than being constrained to a fixed narrow column.
- Main page padding is `32px` at `1200px+`, `24px` at `900–1199px`, and `16px` below `900px`.
- Navbar remains visible at the top of Main. Compact widths preserve menu, Search entry, Theme, and Settings; full Search may collapse to an icon that opens the same Command Palette.
- iPhone landscape remains in the Drawer layout whenever its CSS viewport is below `900px`.
- Browser and installed PWA modes use identical responsive rules.
- Crossing a breakpoint changes structure immediately; do not animate the full page, Sidebar insertion/removal, Main width, or page padding.

### C-023: Tool Detail Suggestions

- Trigger: `Get details` beside or below `Tool URL`, depending on available width.
- While loading, the action displays `Getting details…` and communicates busy state without disabling the rest of the form.
- Success fills only available suggested values and displays `Details ready`.
- Partial success displays `Some details need your review.` and visually identifies fields that still need input without treating them as errors until save.
- Failure displays `Couldn’t get details. You can enter them manually.` and leaves every existing value unchanged.
- Suggested values must be visually distinguishable as editable suggestions, not verified facts.
- The Owner may rerun `Get details` after changing the URL; replacing already edited values requires confirmation rather than silent overwrite.

### S-009: Manage

- Related Features: `F-002`, `F-005`, `F-014`.
- Entry: select `Manage` in the Sidebar.
- Header actions: `Add Tool` and `Check Links`.
- Filters: `Visible`, `Hidden`, and `All`.
- Navbar Search remains the only Search input; do not add a second Search field to this screen.
- Computer uses a management table with drag handle, Icon, name, Tags, link status, favorite, visibility, Edit action, and northeast external-link arrow.
- Drag-and-drop reorders tools; keyboard-accessible `Up` and `Down` actions provide the equivalent operation.
- The screen provides hide and restore behavior only; it does not provide permanent deletion.
- States: loading, populated, no matching tools, checking links, link-check partial failure, reordering, save success, and save failure.
- Link checking must not block Add, Edit, filtering, or other unrelated management actions.

### C-021: Manage Tool Row

- The whole row selects `S-005 Edit Tool`; it never launches the external App.
- The external-link arrow is a separate, clearly labelled action that opens the tool in a new tab without opening Edit Tool.
- Favorite and visibility controls expose their current state to assistive technology and have concise English accessible names.
- Dragging requires a visible handle and must not start from other interactive controls.
- Keyboard `Up` and `Down` controls are available from the row action menu or equivalent accessible control.
- Link status uses both text and icon treatment; color alone never communicates `Working`, `Check`, or `Unknown`.
- A successful edit, visibility change, favorite change, or reorder may briefly highlight the affected row without moving surrounding content.

### C-022: Edit Tool Surface

- Computer variant: right-side glass panel that preserves visible Manage context.
- Phone variant: near-full-screen Edit Sheet with a clear close action and safe-area spacing.
- Fields: `Name`, `URL`, `Description`, `Tags`, `Aliases`, `Source`, and `Icon`.
- Save is explicit. A save failure preserves all entered content and provides a retry path.
- Closing with unsaved changes requires confirmation; closing an unchanged form does not.
- Focus moves into the surface on open, remains contained while open, and returns to the invoking row or Add action on close.
- Motion follows `DD-010`; no scale-from-zero, bounce, field stagger, or decorative glass-reflection animation is used.

## Interaction and State Rules

- Successful Google OAuth plus Owner authorization navigates directly from `S-001` to `S-002`.
- Failed authorization remains on `S-001` and shows a concise English error without revealing the allowed account.
- Expired authenticated sessions return to `S-001`.
- Sidebar expand/collapse changes navigation density only; it must not change the current Main destination.
- Expanded and collapsed navigation must expose the same destinations.
- `Settings` is accessed from `C-010 Top Navbar`, not from the primary navigation or Owner account menu.
- Selecting `Settings` renders `S-003 Settings` in the right Main area without navigating away from the Dashboard Shell.
- Settings secondary-navigation changes are immediate with no entrance/exit animation.
- Selecting `Log out` ends the protected session and returns the user to `S-001 Sign-in`.
- `All`, `Favs`, and `Recent` select tool collection views; they never assign or represent a category.
- Tag controls use only `AI`, `Design`, `ServiceNow`, `Automation`, `Productivity`, `Developer`, `Work`, and `Learn`.
- Clicking anywhere on a tool item opens its linked application in a new tab; the optional northeast arrow only communicates this behavior.
- Theme and View interactions follow `DD-021`; remaining detailed component states continue through the Design Definition interview.

## Responsive Behavior

- Computer and mobile support is confirmed for both browser and installed PWA modes.
- `1440px+`: expanded-by-default Sidebar plus the dynamic `DD-054` Main. Default uses primary `minmax(520px, 1fr)`, access `minmax(276px, 300px)`, and Widget `minmax(350px, 390px)` tracks. Auxiliary panels may move between the latter tracks. If either auxiliary track empties, collapse it and let the primary zone consume the released width while the remaining auxiliary column keeps a readable bounded width.
- `1200–1439px`: use a two-zone Dashboard. Tools remain the wider left track. Access panels and Widgets form the right track in a height-bounded arrangement; Calendar stays above To-Do, while Quick Access/Recent may sit below the Welcome or use a compact two-column subgrid when height permits. Never shrink Calendar below a readable seven-day grid or To-Do below the minimum complete-row viewport.
- All List column count is controlled by its own available container width per revised `DD-043`/`DD-054`, allowing 1, 2, 3, or at most 4 columns without stretching rows. Do not infer column count from OS, browser brand, or named hardware.
- Below `1200px`: release the fixed viewport-height rail relationship and use one vertical flow in the order Welcome, Tags, Favs, All, Quick Access, Recent, Calendar, To-Do. Parent Cards remain intact; Favs/Grid retain horizontal scrolling while All List, Quick Access, Recent, and To-Do use bounded internal vertical scrolling appropriate to the available viewport.
- `900–1199px`: collapsed-by-default `72px` Sidebar plus fluid Main with `24px` page padding.
- Below `900px`: no fixed Sidebar, collapsed rail, or reserved Sidebar track; use the `DD-055` Navbar menu entry plus `DD-009 Mobile Glass Drawer` and safe-area-aware `16px` page padding.
- Mobile navigation always starts with the Drawer closed. The menu Icon remains in the sticky/top Navbar while the page scrolls, and opening the Drawer overlays rather than reflows Main.
- Compact Navbar Search may become an icon but must open the same Command Palette with the same keyboard and accessibility behavior.
- Responsive structure is identical in browser and standalone PWA modes and is never selected by user-agent or device-name detection.
- Saved auxiliary-column membership is a desktop composition preference, not a fixed phone grid. Below the column breakpoint, linearize left auxiliary column then right auxiliary column; preserve panel order and visibility while hiding desktop-only insertion rails.
- Calendar follows `DD-059`: it fills Mobile Main width, removes desktop width constraints, and maintains seven equal container-relative columns by adapting padding and gaps within accessible limits; it never introduces horizontal page scrolling. To-Do metadata may stack below the title on narrow phones, but the checkbox, title, and state remain visible.
- Calendar height and its six-week date grid follow `DD-060` at every breakpoint; all dates remain inside the rounded parent, and an insufficient combined auxiliary height scrolls the owning column rather than exposing Calendar descendants.
- Breakpoint changes are immediate with no whole-layout animation.
- `S-009 Manage` uses a table on computer. On phone, each management record becomes a compact stacked row while preserving Edit, external launch, favorite, visibility, link status, and accessible reorder actions.
- `C-022 Edit Tool Surface` uses the confirmed right panel on computer and near-full-screen Edit Sheet on phone.
- Main must remain the primary usable region at every supported width.

## Accessibility

- Target WCAG 2.2 Level AA.
- Normal text contrast is at least `4.5:1`; large text and essential non-text UI graphics are at least `3:1`.
- Visible focus uses a `2px` theme-highlight ring with `2px` offset and remains clear in `Light`, `Dark`, and `Auto`.
- All core tasks work with keyboard, pointer, and touch; no task depends solely on Hover or drag.
- Icon-only controls require concise English accessible names and visible Tooltips.
- Field errors appear beside the affected field; save failure also provides a short form-level summary.
- Error, success, selection, and link status use text/icon support and never rely on color alone.
- Important asynchronous states such as loading completion, `Saved`, and errors use appropriately scoped live regions without announcing routine visual noise.
- Dialog, Drawer, Command Palette, and Edit Sheet move focus inside, contain it while modal, and return it to the invoking control on close.
- Expanding or collapsing the Sidebar must not unexpectedly move focus.
- Google sign-in and authentication status must be announced appropriately to assistive technology.
- Essential content and actions remain available at `200%` browser zoom without clipping or loss of function.
- Layout tolerates user text-spacing changes and font fallback without overlapping controls.
- Under `prefers-reduced-motion`, remove reflection sweeps, flowing edges, and positional transitions; retain useful static focus, border, color, and status feedback.
- External launch controls use contextual accessible names such as `Open StudyMate in a new tab`.

### DD-018: Equivalent Accessible Interaction States

- Status: Confirmed.
- Accessibility requirements are acceptance criteria for every component state rather than an optional visual pass.
- Use semantic `header`, `nav`, `main`, and form landmarks with one clear page heading per destination.
- Keyboard alternatives must exist for drag reordering, swipe dismissal, Hover discovery, and Icon-only actions.
- Announcements must be concise and avoid repeating unchanged state on every render.

### DD-019: Non-blocking Loading and Skeleton States

- Status: Confirmed.
- Render the authenticated Sidebar and Navbar before tool data; data loading must not withhold the stable shell.
- If data resolves within `250ms`, show no Skeleton. After `250ms`, show static glass placeholders matching the final card or row dimensions.
- Do not use moving Shimmer. A very subtle opacity change is allowed only when motion is not reduced; reduced-motion Skeletons are fully static.
- Background refresh preserves existing data instead of replacing the current screen with Skeletons.
- Action loading is local to the invoking button or affected region and does not block unrelated page controls.
- `Load more` preserves existing cards and scroll position while its own action reports loading.
- Region failure shows concise English context and `Retry` without removing the surrounding shell or valid existing data.
- Empty states appear only after a successful response confirms that the result is empty.
- Do not impose an artificial minimum loading duration; completed results appear immediately.

### C-024: Loading Placeholder

- Variants: Tool Card, compact row, management row, and form-region placeholder.
- Uses the same radius, spacing, and approximate final dimensions as its content to minimize layout shift.
- Placeholder blocks are decorative and hidden from assistive technology; the containing region communicates loading once through status semantics.
- Never place keyboard focus on a Skeleton or announce each placeholder separately.

### S-010: Online-required State

- Related Feature: `F-009`.
- Appears when the protected product cannot load because the device is offline.
- Heading: `You’re offline.`
- Supporting copy: `Phil's studio needs an internet connection.`
- Action: `Try again`.
- Keep product identity visible, but do not show stale data as if it were current or imply that offline edits will sync later.

### DD-020: Restrained Toast and Confirmation Feedback

- Status: Confirmed.
- Toasts report completed global results that do not require immediate form correction; they never replace inline validation or save errors.
- Desktop placement: bottom-right. Phone placement: above the bottom safe area. Show at most three Toasts at once.
- Success dismisses after `3s`; ordinary information after `4s`; Error or `Retry` Toasts remain until resolved or dismissed.
- Hide Tool feedback: `Tool hidden` with `Undo`. Restore feedback: `Tool restored`. Link Check completion: `Link check complete`.
- Theme, Grid/List, Tag filtering, Search, and external tool launch do not produce Toasts.
- Enter duration is `180ms`; exit is `140ms`, using strong ease-out and transform plus opacity only. Reduced motion uses a short opacity-only change.
- Toasts are dismissible and keyboard operable but never automatically receive or steal focus.
- Toasts do not create a notification system, notification bell, or history center.
- Use confirmation dialogs for consequential actions already defined in scope, including Clear Recent, Reset Layout, unsaved-form close, and duplicate-save decisions. Hide Tool uses Undo rather than a blocking confirmation.

### C-025: Toast

- Variants: success, information, warning/error, Undo action, and Retry action.
- Uses a compact glass surface with readable text, status Icon, optional single action, and close control.
- New Toasts stack without covering primary mobile navigation or the active form action.
- Pauses automatic dismissal while hovered, keyboard-focused, or while the document is hidden.
- Announce concise content once through an appropriate status or alert role; do not repeat the same message for visual and screen-reader-only copies.

### C-026: Confirmation Dialog

- Uses a centered modal treatment with a clear heading, concise consequence, primary decision, and `Cancel`.
- Initial focus goes to the safest non-destructive action when practical; `Esc` cancels and returns focus to the invoking control.
- Confirmation dialogs do not use scale-from-zero or bounce. Reduced motion removes positional/scale motion.

## Content and Voice

- All website content is English.
- Tags, navigation labels, buttons, and compact controls use short wording.
- Official product and tool names retain their official form.
- Authentication errors are concise and do not expose configuration details.

### C-037: Auxiliary Panel Drag Handle

- Related Feature: `F-015`; used by Quick Access, Recent, Calendar, and To-Do on Dashboard.
- Place a compact six-dot/grip Icon in a consistent Header position that does not displace the title or collide with existing actions. When an action occupies the right side, place the handle immediately before it with at least `8px` separation.
- Visual Icon may be `16–18px`, but the pointer/touch target is at least `40×40px`. Cursor is `grab` at rest and `grabbing` during active pointer drag. Provide contextual accessible names such as `Move Calendar panel`.
- Focus reveals a concise action menu or keyboard instructions containing Move up/down/left/right. `Space`/`Enter` may enter a keyboard move mode; `Esc` cancels and restores the original position; a second `Space`/`Enter` confirms when using explicit placement mode.
- The handle is visually quiet at rest, clearer on panel hover/focus-within, and always discoverable on touch layouts where direct drag is supported. It cannot open, clear, complete, select, or launch panel content.
- Drag preview, placeholder, insertion indicator, announcements, save status, failure recovery, and Reduced Motion follow `DD-054`.

### C-035: Dashboard Calendar Widget

- Related Features: `F-019`, `F-020`; related Screen: `S-002 Dashboard`.
- Calendar Card uses `DD-062` parent strength while its semantic date states remain independently distinguishable. Retain `20px` radius, responsive padding, content containment, and complete date-grid geometry; do not restore historical emitters.
- Responsive width follows `DD-059`: desktop uses the active auxiliary/Widget track; below `900px`, the parent becomes `100%` of Mobile Main's content width with no inherited fixed/minimum Widget width, and padding reduces responsively without changing the seven-column data structure.
- Header row: left-aligned `Calendar` at `20/650`. The navigation row below contains isolated previous/next chevrons, centered month/year such as `July 2026`, and a right-aligned `Today` pill. Each control has at least a `40×40px` target and an English accessible name.
- Weekday header uses `Mon Tue Wed Thu Fri Sat Sun`. The date body is a seven-column, six-row grid with equal cells and stable height; weekday labels and dates align vertically without table borders.
- The six-row grid and parent height follow `DD-060`: rows use controlled responsive heights in normal flow, the Calendar grows to contain them below `1200px`, and no date cell may paint outside the Card at intermediate widths.
- Keep `28–32px` preferred desktop padding below the final date row, with `26px` as the minimum clear distance measured from any date glyph, task dot, or selected-date shadow to the inner bottom edge. On narrow phones, retain at least `20–24px`. The last row must not visually sit on the rounded border.
- Adjacent-month dates use reduced opacity but remain readable. Today uses a small cyan dot unless also selected. Selected date uses a rounded blue-to-violet filled cell with white text and soft violet shadow. Dates with unfinished tasks use a small cyan/blue dot below the numeral; multiple task colors are not rendered as multiple dots in the compact month view.
- Selecting a date updates To-Do context without navigating away. Month navigation uses immediate content replacement with a restrained `120–160ms` opacity transition only; no calendar slide animation. Reduced Motion uses no transition.
- Loading preserves the panel and uses static date-cell placeholders after the established delay. Error keeps navigation visible and shows concise English `Couldn’t load calendar.` / `Retry` without exposing configuration.

### C-036: Dashboard To-Do Widget

- Related Feature: `F-020`; related Screen: `S-002 Dashboard`.
- To-Do parent uses `DD-062` parent strength and task rows use nested strength. Retain `20px` radius, airy spacing, and a Header with `To-Do` left plus compact `+ Add Task` right; do not restore historical emitters.
- Task body groups only non-empty periods in order: `Today`, `Tomorrow`, `This Week`, `Later`. Group label uses bright ice-blue, except near-term emphasis may use warm amber; the count follows on the same line. Thin translucent dividers separate groups.
- Each task follows the refined `DD-053` density: `16–18px` visual checkbox inside a `40×40px` target, `12.5–13.5px` one-line title, smaller optional time/date, and `6–7px` Accent dot. Use explicit horizontal spacing, `34–40px` visual row height, `8–10px` row clearance, and `16–20px` inter-group breathing space so no partial or crowded row appears.
- Checkbox activation never opens Edit. Selecting the title/row opens Edit Task. Completion uses a short opacity/color response and retains accessible checked text; deletion requires confirmation or an Undo affordance. Save failure restores the prior row and shows scoped Retry feedback.
- Keep the Header and Footer fixed. Only the grouped task body scrolls vertically with hidden scrollbar and complete-row snapping. Footer action is exact `View all tasks →`, centered, and opens `S-011 Tasks`.
- Keep at least `18–22px` between the final task content and Footer, then at least `26px` from Footer text/focus ring to the inner bottom edge; prefer `28–32px` on wide desktop. Show fewer complete rows and scroll internally rather than compressing this padding.
- Empty state: `No tasks here.` / `Add a task when something needs your attention.` with `Add Task`; do not render placeholder rows.

### S-011: Tasks

- Related Feature: `F-020`.
- Purpose: provide the complete task list and task maintenance surface reached from `View all tasks →`.
- Supports the same groups, date selection, Add, Edit, complete/reopen, and recoverable Delete behavior as the Dashboard Widget without introducing Kanban, collaboration, reminders, recurring tasks, or third-party sync.
- On computer, use a single readable list column with Calendar/date filtering available beside or above it. On phone, use one full-width list and a modal/sheet for Add/Edit Task.

## Design Tokens

- Confirmed typography tokens: page `32/700`, phone-page `26/700`, section `20/650`, tool `15/600`, body `14/400`, meta `12/500`, action `14/600`.
- Confirmed Sidebar and breakpoint tokens are defined in `DD-007` and `DD-012`.
- Confirmed color, glass, radius, blur, border, and shadow tokens are defined in `DD-014`.
- Large-background visuals and complex material recipes remain `TBD` under `DD-061`; current Card veil/highlight tokens come only from `DD-062`, while `DD-034` remains historical.
- Confirmed spacing, control, card/row, and Grid density tokens are defined in `DD-017`.
- Confirmed card, shell, Drawer, sheet, Toast, and reduced-motion timing rules are defined across `DD-006`, `DD-007`, `DD-009`, `DD-010`, and `DD-020`.

## Open Questions and TBD

- Review the direct-drag handle placement and two/three-column transitions defined by `DD-054` in the next generated design.
- Owner review of the blue-Indigo Card veil trial and Claude Design output; then review the future exported HTML before explicit re-authorization of `Freeze UI`.

## Version History

| Version | Date | Change |
|---|---|---|
| 0.1-draft | 2026-07-18 | Captured standalone sign-in, direct post-auth Dashboard transition, two-region Dashboard shell, and expanded/collapsed Sidebar states. |
| 0.2-draft | 2026-07-18 | Confirmed Sidebar destinations and Dashboard home order; separated category tags, collection views, search function, and open action. |
| 0.3-draft | 2026-07-18 | Renamed `Home` to `Dashboard` and moved `Settings` plus `Log out` into the Google Owner account menu at the bottom of the Sidebar. |
| 0.4-draft | 2026-07-18 | Confirmed Settings in the right Main area and replaced the previous category set with eight selectable Tag tabs. |
| 0.5-draft | 2026-07-18 | Defined whole-item launch behavior for Grid and List Views, removed the visible `Open` button, and adopted an optional northeast external-link cue. |
| 0.6-draft | 2026-07-18 | Confirmed installable online-only PWA behavior across supported computers and phones, including shared authentication and a protected offline state. |
| 0.7-draft | 2026-07-18 | Added automatic and custom tool-icon states, initials fallback, and responsive icon presentation across Grid and List Views. |
| 0.8-draft | 2026-07-18 | Confirmed the shared top Navbar with Search on the left and Light/Dark plus Settings on the right; removed Settings from the Owner account menu. |
| 0.9-draft | 2026-07-18 | Added quiet cross-device save/sync feedback, retry behavior, and explicit online-only messaging without adding a notification control. |
| 1.0-draft | 2026-07-18 | Expanded Navbar Search into a keyboard-accessible Command Palette with separate Tools and Commands results and no destructive actions. |
| 1.1-draft | 2026-07-18 | Added manual Link Check controls, accessible status labels, last-checked context, cautious ambiguous states, and non-destructive behavior. |
| 1.2-draft | 2026-07-18 | Added Dashboard section ordering, visibility controls, reset behavior, fixed global navigation, and mobile vertical adaptation. |
| 1.3-draft | 2026-07-18 | Replaced automatic favicon/upload behavior with a Codex-assisted static icon registry using official, matching, and unified Monogram sources. |
| 1.4-draft | 2026-07-18 | Added a shared Add Tool experience with URL-based metadata suggestions, static registry Icon recommendations, explicit Owner review, and safe manual fallback. |
| 1.5-draft | 2026-07-18 | Added Search Aliases to Add Tool and a common Edit Tool window for both preloaded and Owner-added tools. |
| 1.6-draft | 2026-07-18 | Added non-destructive duplicate warnings for URL, name, and domain while explicitly allowing repeated Aliases and same-domain paths. |
| 1.7-draft | 2026-07-18 | Confirmed the official product display name `Phil's studio` and its required identity placements. |
| 1.8-draft | 2026-07-18 | Confirmed the blue-green glass visual system across Light and Dark Themes, colorful glass-container Icons, reflection hover, and corner-flow edge lighting with accessibility safeguards. |
| 1.9-draft | 2026-07-18 | Applied Emil design-engineering guidance to confirm one-shot 180–220ms card reflection/edge motion, pointer gating, static keyboard focus, reduced-motion behavior, and an animation-free Command Palette. |
| 2.0-draft | 2026-07-18 | Confirmed 248px/72px computer Sidebar widths and an Emil-guided short, stable, interruptible transition with reduced-motion and mobile exceptions. |
| 2.1-draft | 2026-07-18 | Confirmed per-browser/device Sidebar persistence, viewport-based defaults, closed mobile entry, sign-out privacy, and flash-free initial rendering. |
| 2.2-draft | 2026-07-18 | Confirmed the Emil-guided mobile glass Drawer width, asymmetric timing, transform/opacity motion, velocity dismissal, focus management, and reduced-motion behavior. |
| 2.3-draft | 2026-07-18 | Confirmed Settings information architecture for Appearance, Dashboard, Tags, and App across computer and phone layouts, with no duplicate logout or page-transition animation. |
| 2.4-draft | 2026-07-18 | Confirmed the standalone blue-green glass Sign-in page, final English copy, safe auth states, restrained button feedback, and no continuous decorative motion. |
| 2.5-draft | 2026-07-18 | Confirmed the compact Dashboard welcome panel, time-aware Google-name greeting, Add Tool action, mobile treatment, and exclusion of duplicate launch/usage features. |
| 2.6-draft | 2026-07-18 | Confirmed Dashboard Favs/Recent/All density, 4/6/8 preview limits, View-all navigation, Grid/List content, and shared whole-item launch behavior. |
| 2.7-draft | 2026-07-18 | Confirmed shared collection headers, All pagination, Favs filters/empty state, Recent clear/empty state, horizontal phone Tags, and restrained result motion. |
| 2.8-draft | 2026-07-18 | Confirmed the Manage editing workspace, management table and mobile rows, row-versus-external-launch behavior, accessible reordering, and Emil-guided Edit Tool panel/sheet motion. |
| 2.9-draft | 2026-07-18 | Confirmed the single-surface Add Tool flow, exact English feedback copy, non-blocking editable suggestions, save-time duplicate dialog, content preservation, and restrained motion. |
| 3.0-draft | 2026-07-18 | Confirmed 1200px and 900px responsive breakpoints, Sidebar defaults, fluid Main padding, compact Navbar Search behavior, browser/PWA parity, and immediate structural changes. |
| 3.1-draft | 2026-07-18 | Confirmed Geist Sans/Mono usage, cross-platform fallbacks, compact type sizes and weights, readable line height, product-name treatment, and font-loading behavior. |
| 3.2-draft | 2026-07-18 | Confirmed Dark/Light blue-green colors, glass surfaces and borders, radii, responsive blur, shadows, static gradients, varied Icon accents, contrast priority, and Safari fallback. |
| 3.3-draft | 2026-07-18 | Confirmed the single-letter P product mark, blue-to-teal rounded-square treatment, identity placements, tagline, favicon/PWA/Apple/Maskable requirements, and static motion rule. |
| 3.4-draft | 2026-07-18 | Confirmed Lucide UI Icons and mappings, size/stroke tokens, official/Simple Icons/semantic/Monogram tool priority, varied brand colors, accessibility labels, and license review. |
| 3.5-draft | 2026-07-18 | Confirmed the 4px spacing scale, shell/control/card/row dimensions, minimum touch targets, responsive padding and gaps, four-to-one-column tool Grid, and no density-based accessibility reduction. |
| 3.6-draft | 2026-07-18 | Confirmed WCAG 2.2 AA targets, contrast and focus tokens, equivalent keyboard/pointer/touch tasks, field and form errors, live regions, modal focus, zoom/text-spacing support, reduced motion, and contextual external-link labels. |
| 3.7-draft | 2026-07-18 | Confirmed shell-first rendering, 250ms-delayed static Skeletons, no Shimmer, background-data preservation, local action loading, Load-more stability, retry/empty-state rules, no artificial delay, and exact online-required copy. |
| 3.8-draft | 2026-07-18 | Confirmed Toast boundaries, placement, stack limit, timing, Undo/Retry behavior, excluded events, accessible focus/announcements, confirmation-dialog use, and no notification center. |
| 3.9-draft | 2026-07-18 | Confirmed Navbar Light/Dark override behavior, Settings Light/Dark/Auto, per-device Auto resolution, 150ms color-only Theme transition, synchronized Grid/List control, phone availability, and preserved filter/scroll context. |
| 4.0-draft | 2026-07-18 | Confirmed compact Tag management rows, inline Add/Rename, 18-character and character rules, case-insensitive duplicates, reserved names, safe Hide semantics, synchronized ordering, accessible reorder, unified styling, and inline feedback. |
| 4.1-draft | 2026-07-18 | Confirmed Command Palette computer/phone dimensions, immediate focus, default Recent/Commands, searchable fields, stable match highlighting, result content, exact empty copy, keyboard execution/focus return, ephemeral queries, and no animation. |
| 4.2-draft | 2026-07-18 | Confirmed four Link Check states and Icons, text-plus-color roles, relative/exact timestamps, single and batch actions, progress, partial-failure continuation, non-blocking launch/editing, reduced-motion status, completion feedback, and manual-only execution. |
| 4.3-draft | 2026-07-18 | Confirmed Dashboard layout rows, drag and Move actions, immediate preview, one-visible minimum and copy, Sidebar independence, inline save state, exact Reset confirmation, default restoration, sync-failure preservation, and no large reflow motion. |
| 4.4-draft | 2026-07-18 | Confirmed Install/Sync/Support App settings, capability-aware installation states and guidance, online requirement, sync states and Retry, supported-device copy, excluded backup/stores/notifications, local loading, and shared browser/PWA behavior. |
| 4.5-draft | 2026-07-18 | Confirmed exact OAuth, non-Owner, network, and expired-session copy; retry and duplicate-click behavior; protected-data denial; session cleanup; direct Dashboard return; immediate Logout; inline errors; and no auth celebration. |
| 4.6-draft | 2026-07-18 | Confirmed Add/Edit requirements and limits, HTTPS and unsafe-scheme handling, Tag/Alias/Source/Icon rules, blur/save validation timing, first-error focus, URL normalization before duplicate checks, content preservation, inline errors, and accessible Chips. |
| 4.7-draft | 2026-07-18 | Confirmed exact URL and possible-duplicate copy, existing-tool summary, Edit/Continue/Cancel outcomes and priorities, exact-URL continuation, focus return, non-destructive behavior, Alias exclusion, same-domain paths, and opacity-only Dialog entry. |
| 4.8-draft | 2026-07-18 | Confirmed Grid/List Icon and text composition, Tag overflow, stable dimensions, direct launch surface, separate accessible Favorite Star, event/focus order, immediate Favs update and failure rollback, Manage/Edit availability, input-specific visual states, and Hidden-tool exclusion. |
| 4.9-draft | 2026-07-18 | Confirmed Icon Grid/List previews, Suggested/Brands/Icons/Monogram groups, recommendation count, Lucide search, Monogram limits/presets, source labels, preview-before-save, runtime-AI boundary, fallback/reselect, keyboard selection, restrained motion, and asset review. |
| 5.0-draft | 2026-07-18 | Confirmed Sign-in, Welcome, Owner Menu, Navbar Search, and action dimensions; content-driven height; desktop/mobile flow; virtual-keyboard handling; iPhone safe areas; landscape Drawer; and 200% zoom wrapping. |
| 5.1-draft | 2026-07-18 | Authorized a five-frame English-only visual mockup review pack covering Dark/Light Dashboard, mobile Dashboard, Sign-in, and Manage/Edit while preserving frozen scope and excluding unconfirmed features. |
| 5.2-draft | 2026-07-18 | Strengthened Tool Cards with layered blue-green glass gradients, inset highlights, themed depth, restrained one-shot hover reflection and corner edge light, Light-theme material parity, and a strict Google-only Sign-in reference boundary. |
| 5.3-draft | 2026-07-18 | Retained the approved layered Card gradients and replaced the simultaneous Light/Dark Navbar choices with one action showing only the opposite Theme; Auto remains in Settings. |
| 5.4-draft | 2026-07-18 | Styled the single opposite-Theme action as a compact glass pill with Icon, destination label, and decorative switch indicator while retaining blue-green tokens and one-button accessibility semantics. |
| 5.5-draft | 2026-07-18 | Unified all Tool Icons as single-color line Glyphs in consistently sized same-hue translucent rounded containers, replacing mixed full-color logos, filled tiles, 3D art, and unrelated Icon styles. |
| 5.6-draft | 2026-07-18 | Replaced compact Grid cards with a three/two/one-column editorial split layout: left-side Icon/text/Tags, right-side faded static visual field, whole-card launch, isolated Favorite, and no visible Explore/Open button. |
| 5.7-draft | 2026-07-18 | Corrected the Card reference interpretation: restored existing Grid columns, removed right-side artwork, reduced Icon size, stacked Name and Description beneath it, anchored Tags at the bottom, and retained Star plus the non-Edit ExternalLink cue. |
| 5.8-draft | 2026-07-18 | Stopped further pre-development mockup iteration, retained raster mockups as non-binding references, and passed the Design Quality Gate while awaiting explicit UI Freeze authorization. |
| 5.8-freeze | 2026-07-19 | Owner authorized UI Freeze. Frozen the confirmed screens, components, states, responsive behavior, accessibility, visual tokens, and change-control boundary for Development Definition. |
| 5.9-draft | 2026-07-19 | Reopened UI styling and adopted the local Arctic Navy HTML as the Dark visual reference: framed glass shell, navy/blue/indigo/cyan depth, revised surface tokens, radius hierarchy, compact spacing, and reference exclusions without changing product behavior. |
| 5.10-draft | 2026-07-19 | Clarified the exact Theme pill plus adjacent Settings control, added the Sidebar Workspace helper and `Personal workspace` label, and replaced ambiguous Dashboard ordering with a wide left Favs/All stack plus right nested Recent parent Card and a defined narrow-screen fallback. |
| 5.11-draft | 2026-07-19 | Strengthened Welcome and parent-panel gradients with exact HTML-derived values; bounded the wide Dashboard to the Sidebar bottom; defined single-row horizontal Favs/Grid, default vertical All List, hidden-but-operable scrollbars, and a right Quick Access-over-Recent rail with fixed internal overflow. Quick Access selection remains TBD. |
| 5.12-draft | 2026-07-19 | Resolved Quick Access as Owner-only manual Pinning; added Add/Edit/Manage controls, most-recently-pinned ordering, sync and hidden-tool behavior, isolated interaction, rollback feedback, and exact English empty state. |
| 5.13-draft | 2026-07-19 | Defined the complete Main as one large glass Card, made Navbar an unboxed transparent row, strengthened Theme/Settings control shadows, made Owner Account a transparent glass Card, added 1/2/3-column All List container rules, aligned All/Recent to the Account Card baseline, and fixed one-line Quick Access/Recent supporting copy. |
| 5.14-draft | 2026-07-19 | Required first-screen desktop Dashboard presentation with no Body/Main vertical scroll, assigned x/y overflow to fixed-height internal Card bodies, and recorded six distinct confirmed Dark materials for Sidebar, Main, Welcome, Quick Access, All, and Recent plus cyan Card-edge and deep Search-shadow rules. |
| 5.15-draft | 2026-07-19 | Required complete-child boundaries for every nested collection; added responsive 2/3/4/5-card Favs/Grid capacity, stable two-row All Grid, List/Grid Favorite Stars, fluid wide Main width, the leading `All` filter, and a higher three-item Quick Access with taller Recent. |
| 5.16-draft | 2026-07-19 | Reframed the Dashboard as a luminous three-zone workspace, added Calendar and To-Do Widget specifications plus full Tasks destination, defined the blue/indigo/violet/cyan atmospheric glass system, and added ultra-wide, standard desktop, tablet, and phone compositions. |
| 5.17-draft | 2026-07-19 | Refined only the Dashboard environmental background: deep-blue base, diffused cyan emitters with several fading branches, multiple Violet-center-to-Indigo radial sources at the confirmed positions, strict layer ownership, static motion boundary, responsive remapping, and contrast safeguards. |
| 5.18-draft | 2026-07-19 | Refined only Welcome: overlapping light/deep blue radials at upper-left, a below-right Violet core radiating through Indigo and blue, true blurred Cyan environmental bleed at the translucent right edge, exact layer ownership, responsive mapping, and non-animated glass constraints. |
| 5.19-draft | 2026-07-19 | Refined only Dashboard Favs: one pale-blue semi-transparent glass base for every Card, subtle positional Cyan bleed affecting the left visible Card, viewport-owned rather than data-owned tint, stable Icon contrast, complete-item scrolling, and restrained hover behavior. |
| 5.20-draft | 2026-07-19 | Refined only the Dashboard All parent Card: upper-left and lower-left Cyan environmental bleed, Navy center connection, smaller upper-right Violet-to-Indigo radial, dominant lower-right Violet-to-Indigo-to-Navy radiation, translucent nested rows, and fixed parent color fields during internal scrolling. |
| 5.21-draft | 2026-07-19 | Refined Quick Access with faint upper-left Indigo and lower-right Cyan environmental radiation; refined Recent as quiet translucent light-Navy glass with exactly one upper-right Cyan diffusion reaching the center; superseded Recent's former lower-left teal and multi-edge glow. |
| 5.22-draft | 2026-07-19 | Refined Calendar with a dominant upper-left Cyan radial spanning almost the full top, a smaller lower-left Cyan radial, a lower-right Indigo radial, and a near-opaque pure Navy connection field separating and blending all three while preserving date-grid contrast. |
| 5.23-draft | 2026-07-19 | Refined To-Do with visible upper-left Cyan, strongest upper-right Indigo, very faint lower-right Cyan, Navy breathing intervals, generous Footer/bottom padding, smaller refined task controls/type, explicit row/group spacing, and accessible invisible targets. |
| 5.24-draft | 2026-07-20 | Added direct drag handles for Quick Access, Recent, Calendar, and To-Do; cross-column ordering; empty-column collapse and edge-zone restoration; dynamic two/three-column layout; primary-zone auto-fill; uncapped complete Favs/Grid columns; four-column All List; combined auxiliary-column scrolling; keyboard alternatives; persistence and failure states. |
| 5.25-draft | 2026-07-20 | Made the Mobile Navbar menu Icon the sole navigation entry below 900px; removed every fixed Sidebar rail and reserved track; specified overlay Drawer content, safe areas, backdrop/background lock, dismissal, focus return, internal overflow, and Reduced Motion behavior. |
| 5.26-draft | 2026-07-20 | Moved Mobile Welcome `Add Tool` below `Your tools, one place.` in a shared left-aligned vertical stack; replaced the former full-width action rule with compact intrinsic sizing while retaining desktop right-side placement. |
| 5.27-draft | 2026-07-20 | Extended invisible scrollbar chrome to every application-owned page and nested scroller; prohibited reserved gutters and layout shift while retaining wheel, trackpad, touch, keyboard, focus, momentum, and assistive scrolling across Chromium, WebKit, and Firefox. |
| 5.28-draft | 2026-07-20 | Removed the Dashboard's outer black matte/letterbox; made the Navy/Cyan/Indigo/Violet atmosphere cover the entire viewport and safe areas while retaining rounded Sidebar/Main surfaces and internal breathing gaps. |
| 5.29-draft | 2026-07-20 | Removed desktop fixed/minimum width inheritance from Mobile Calendar; made the parent fill Mobile Main and its seven weekday/date columns use equal container-relative tracks with adaptive padding, wrapping controls, and no horizontal overflow. |
| 5.30-draft | 2026-07-20 | Added Calendar content containment at every breakpoint: six controlled date rows remain in normal flow, parent height includes all controls/states/bottom padding, Mobile uses auto height, and constrained auxiliary columns scroll instead of allowing dates to escape the Card. |
| 5.31-draft | 2026-07-20 | Cancelled all prescribed Card and large-background gradients, exact colors, radial emitters, lighting directions, and prior HTML-derived material recipes. Retained structure, behavior, responsive, hierarchy, and accessibility rules while deferring visual styling to a future Owner-approved Claude Design HTML export. |
| 5.32-draft | 2026-07-20 | Added a reversible Card-only material trial: one very-light transparent blue-Indigo veil, weaker nested-Card strength, restrained top/left inset and edge highlights, subtle depth, and accessible state rules. Large backgrounds and all former gradients/radial emitters remain unspecified or cancelled. |
| 5.33-draft | 2026-07-20 | Defined the desktop Sidebar shell as a colorless fully transparent layout container with no tint, fill, gradient, backdrop processing, border, or shell shadow. The final page background must remain visually unchanged beneath it; local navigation states and independent helper/account Cards retain accessible surfaces, while Mobile Drawer remains separate. |
