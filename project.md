# Product

## Document Status

- Status: Product specification reopened for draggable auxiliary panels and dynamic Dashboard columns; active feature scope is `F-001` through `F-020`.
- Product Mode: Personal Use
- Current Stage: Design Definition (UI Freeze reopened for style revision)
- Last Updated: 2026-07-20
- Product Freeze: Reopened on 2026-07-20 for `4.18-draft`; prior complex visual recipes remain cancelled, Cards retain the limited blue-Indigo veil/highlight trial, and the desktop Sidebar shell is explicitly colorless and transparent.
- Previous Frozen Version: `4.1-freeze` (historical feature-scope baseline).

## Vision

创建一个个人数字工作台，把分散的 App、个人网站和第三方工具集中到一个易于查找、分类和访问的入口，以减少寻找链接的时间并提升日常工作与个人发展效率。

## Problem

用户拥有多个相互独立的 App、个人网站和工具，但缺少统一入口与分类。链接分散，工具用途不易回忆，导致经常找不到入口并增加日常管理成本。

## Target Users

- 主要用户：工具所有者本人。
- 其他用户：不在当前范围内。

## Goals and Success Metrics

- Goal: 在一个入口找到并打开所有已登记工具。
- Goal: 通过简短分类、搜索和收藏减少查找摩擦。
- Success Metric: 每周至少 5 天通过产品打开工具。
- Success Metric: 从进入 Dashboard 到打开目标工具通常不超过 10 秒。
- Success Metric: 至少 90% 的工具查找不再依赖浏览器书签、Notion 或其他外部链接记录。
- Success Metric: 使用 Quick Add 新增一个工具通常不超过 1 分钟。
- Success Metric: 电脑和手机成功保存的数据在重新加载后保持一致。
- Success Metric: 连续使用 30 天，不因产品故障丢失工具资料、Tags、Aliases 或设置。

## Non-Goals

- 不调用各工具的 API。
- 不控制或合并各工具的内部功能。
- 不在当前阶段提供跨工具自动化编排。
- 不在 MVP 中永久删除工具记录。
- 不备份、导入或导出各独立 App 的数据，也不提供工具目录文件备份。
- 不提供公开注册、多用户账号或密码登录。
- 不处理定价、付费、获客或商业转化。

## Product Scope

### Current MVP

- `F-001`：统一工具入口与分类。
- `F-002`：在网站内管理工具资料。
- `F-003`：快速访问最近打开的工具。
- `F-004`：通过点击或 `Ctrl + K` 快速搜索并打开工具。
- `F-005`：在分类内自定义工具顺序。
- `F-006`：选择浅色、深色或跟随系统的主题。
- `F-007`：在网格与列表视图之间切换。
- `F-008`：仅允许配置的 Owner Google 账号登录并访问中心网站。
- `F-009`：作为必须联网使用的 PWA 安装到支持的电脑和手机。
- `F-010`：为工具入口自动获取或手动配置易识别的图标。
- `F-011`：在 Settings 中新增、重命名、排序和隐藏 Tags。
- `F-012`：在 Owner 登录的电脑和手机之间同步工具目录与偏好。
- `F-013`：通过 Navbar Search 或 `Ctrl + K` 搜索工具并执行安全的站内 Commands。
- `F-014`：在 Manage 中人工检查工具链接并记录非破坏性状态。
- `F-015`：在 Settings 中排序、隐藏和重置 Dashboard 内容区域。
- `F-016`：粘贴工具 URL 后生成可审核的基础资料与统一 Icon 建议。
- `F-017`：为所有工具维护只用于搜索的 Aliases。
- `F-018`：保存前提示可能重复的 URL、名称或域名，同时允许明确继续。

### Known Initial Inventory

- Arts Portfolio
- Online CV
- Online PS（Owner 使用 Claude Code 开发的在线 Photoshop 类图片编辑器）
- Online PDF Editor
- Animation Maker（火柴人动画工具；网站显示名称待确认）
- Mindmap
- StudyMate（ServiceNow CSA、CAD、ITSM 等专题模拟考试）
- Notion（第三方服务）
- AI Agent Learning Notes

### Confirmed Initial Tag Mapping

| Tool | Initial Tags |
|---|---|
| Arts Portfolio | `Design`, `Work` |
| Online CV | `Work` |
| Online PS | `Design`, `Productivity` |
| Online PDF Editor | `Productivity`, `Work` |
| Animation Maker | `Design` |
| Mindmap | `Productivity`, `Learn` |
| StudyMate | `ServiceNow`, `Learn` |
| Notion | `Productivity`, `Work` |
| AI Agent Learning Notes | `AI`, `Learn` |

This mapping is initial data, not frozen taxonomy. The Owner can edit it later through `Manage`.

## Features

| ID | Feature | Priority | Status | User Value |
|---|---|---|---|---|
| F-001 | Unified Tool Hub | Must | Confirmed | 集中查看、查找、分类并打开独立工具，减少寻找链接的时间。 |
| F-002 | Manage Tools | Must | Confirmed | 无需修改代码即可添加、更新、收藏或隐藏工具入口。 |
| F-003 | Recent & Quick Access | Should | Confirmed | 通过 Recent 与由 Owner 手动 Pin 的紧凑 Quick Access 区域快速返回工具，减少重复搜索。 |
| F-004 | Quick Launch | Should | Confirmed | 同时支持鼠标和键盘快速搜索，并复用一致的搜索结果。 |
| F-005 | Arrange Tools | Could | Confirmed | 按个人习惯排列分类内工具，同时保留可访问的非拖动操作。 |
| F-006 | Theme | Could | Confirmed | 在不同光线和系统环境中保持舒适、清晰的中心网站体验。 |
| F-007 | View Mode | Could | Confirmed | 在视觉识别与紧凑扫描之间切换，而不改变工具结果。 |
| F-008 | Owner Sign-in | Must | Confirmed | 通过 Google OAuth 将整个中心网站及管理数据限制为单一 Owner 使用。 |
| F-009 | Installable PWA | Should | Confirmed | 从电脑或手机主屏幕独立启动工具中心，同时保留在线登录和完整 Web App 行为。 |
| F-010 | Tool Icons | Should | Confirmed | 通过稳定且可自定义的工具图标提升 `Grid` 与 `List` View 的扫描和识别速度。 |
| F-011 | Manage Tags | Should | Confirmed | 在不修改代码的情况下维护简短英文 Tags，并安全同步已关联工具。 |
| F-012 | Cross-device Sync | Must | Confirmed | 让电脑浏览器、手机浏览器与已安装 PWA 使用相同的中心网站数据和偏好。 |
| F-013 | Command Palette | Should | Confirmed | 从一个键盘友好的入口快速打开工具、导航页面和执行常用安全操作。 |
| F-014 | Link Check | Should | Confirmed | 发现可能失效或需要人工确认的入口，同时避免错误隐藏或删除工具。 |
| F-015 | Customize Dashboard | Could | Confirmed | 按个人工作习惯调整 Dashboard 内容，同时保持全局导航稳定。 |
| F-016 | Quick Add Tool | Should | Confirmed | 减少新增工具时的重复填写，同时保留 Owner 对名称、Tags 和 Icon 的最终控制。 |
| F-017 | Search Aliases | Should | Confirmed | 使用缩写、旧名称和任务关键词找到工具，而不增加可见 Tag tabs。 |
| F-018 | Duplicate Tool Warning | Should | Confirmed | 减少重复入口，同时允许同一网站的不同路径或 Owner 明确需要的重复记录。 |
| F-019 | Calendar Widget | Should | Confirmed | 在 Dashboard 首屏查看月份、今天和选定日期，为个人工作提供轻量时间背景。 |
| F-020 | To-Do Widget | Should | Confirmed | 在 Dashboard 内创建、完成和浏览轻量个人任务，减少切换到其他任务清单的需要。 |

### F-001 Scope

- 工具按当前 `Grid` 或 `List` View 显示为卡片式或紧凑图标/列表式项目。
- 点击整个工具项目后，在新标签页打开工具现有访问链接；`Open` 是该交互行为的名称，不显示额外 `Open` 按钮。
- 工具项目右上角可以显示简洁的右上箭头外部链接图标，提示点击后将打开独立应用。
- 使用可选择的英文 Tag tabs：`AI`、`Design`、`ServiceNow`、`Automation`、`Productivity`、`Developer`、`Work`、`Learn`。
- 一个工具可以使用一个或多个上述 Tags，点击 Tag tab 后筛选匹配工具。
- `All`、`Favs` 和 `Recent` 是工具集合视图，不是分类标签。
- `Search` 是独立搜索功能，`Open` 是工具卡片操作；两者都不是分类标签。
- 支持为一个工具选择一个或多个已定义 Tags。
- 支持按名称、用途或标签搜索。
- 支持收藏工具，并通过 `Favs` 快速筛选。
- 区分自有工具与第三方工具。
- 所有网站内用户可见内容使用英文。

### F-002 Scope

- 通过 `Manage` 入口维护工具资料。
- 使用 `Add` 新增名称、URL、简介、Tags 和来源类型。
- 使用 `Edit` 修改已有工具资料。
- 使用 `Fav` 或同等简短操作切换收藏状态。
- 使用 `Hide` 隐藏暂时不用的工具。
- MVP 不提供永久删除。

### F-003 Scope

- 工具从中心网站打开后，在 `Recent` 中记录。
- `Recent` 最多显示 6 个最近打开的工具，并按最近打开时间排序。
- Dashboard 默认宽屏右栏中，`Quick Access` 位于 `Recent` 上方；两者分别使用独立父容器，并在容器内纵向显示紧凑工具小卡片/rows。最终视觉样式等待新的 HTML 设计来源。
- `Quick Access` 只显示 Owner 手动 Pin 的工具；同时最多显示 3 个完整条目，更多条目在其内部纵向滚动。不得自动加入工具，也不得实现 Frequent、usage ranking 或 open-count analytics。
- Owner 可在 Add Tool、Edit Tool 和 Manage 中设置或取消 `Pin to Quick Access`。Pin 状态跨设备同步；隐藏工具不显示在 Quick Access，但保留其 Pin 状态以便重新显示后恢复。
- Quick Access 按最近 Pin 的工具在前排序；取消后重新 Pin 会把该工具移到最前。MVP 不增加独立拖动排序界面。
- 工具始终在新标签页打开。
- 使用 `Clear` 清除最近记录。
- 仅记录中心网站中的工具标识和打开时间，不读取目标 App 的内容、账号或活动。

### F-004 Scope

- 保留页面中可点击的 `Search` 输入框。
- 按 `Ctrl + K` 打开或聚焦同一个搜索功能。
- 鼠标与键盘入口共享相同的名称、用途和标签搜索结果。
- 支持方向键选择、`Enter` 在新标签页打开、`Esc` 关闭或移除焦点。
- 快捷键不得在用户正在编辑表单字段时意外覆盖输入。

### F-005 Scope

- 在 `Manage` 中拖动工具调整分类内顺序。
- 同时提供 `Up` 和 `Down`，不依赖拖动也能调整顺序。
- 新工具默认放在所属分类末尾。
- 普通分类使用自定义顺序；`Favs` 和 `Recent` 保持各自既有排序规则。

### F-006 Scope

- 提供 `Light`、`Dark` 和 `Auto` 三种主题选择。
- 默认使用 `Auto` 并跟随系统主题。
- 手动选择 `Light` 或 `Dark` 后记住选择，直到用户再次更改。
- 三种主题均须保持清晰的文字、图标、焦点和交互状态对比度。
- 主题仅影响中心网站，不改变独立 App 的显示方式。
- Navbar 使用一个完整的 Theme switch action：目标主题 Icon、目标主题文字和装饰性 switch indicator 必须位于同一按钮内；其右侧紧邻独立 `Settings` Icon 按钮。
- Navbar 不得为 Theme 再提供第二个独立 Icon 按钮，也不得在 Theme 与 Settings 之间加入 Notification 按钮。

### F-007 Scope

- 提供 `Grid` 和 `List` 两种视图。
- `Grid` 显示图标、名称、简介和 Tags；`List` 紧凑显示名称和 Tags。两种 View 的整个工具项目均可点击打开链接，并可在右上角显示外部链接箭头。
- 两种视图共享相同的数据、搜索、筛选和排序结果。
- 记住用户最后选择的视图。
- 两种视图在支持的小屏幕上均须保持可用。

### F-008 Scope

- 整个中心网站必须在登录后才能访问。
- 未登录用户必须进入独立登录页面，不得在受保护主页上使用临时弹窗代替。
- 仅支持 Google OAuth，不提供密码登录或公开注册。
- 仅允许一个由部署环境配置的 Owner 邮箱；用户已提供具体地址，但不得硬编码进源码、文档或日志。
- Google 返回的邮箱必须已验证，并与配置的 Owner 邮箱规范化后完全匹配。
- 非 Owner Google 账号必须被拒绝，且不得读取或修改任何工具、收藏、最近记录或设置。
- 提供 `Sign in`、`Sign out` 和安全会话过期处理。
- 独立登录页面使用全英文简短文案，包含产品标识、简短说明、Google 登录操作及安全的错误状态，但不得显示允许登录的 Owner 邮箱。
- Google OAuth 成功且 Owner 授权通过后，必须直接跳转产品 Dashboard 首页。
- 登录后的产品采用 Dashboard Shell：左侧为可展开/收缩 Sidebar，右侧为主要内容区域。
- Sidebar 底部在 Owner Profile 上方显示个人 Workspace helper，使用英文标题 `Make it yours` 和说明 `Add a tool or pin a favorite.`；Owner Profile 使用英文辅助文字 `Personal workspace`。

### F-009 Scope

- 将中心网站实现为可安装的 Progressive Web App。
- 支持通过兼容的电脑和手机浏览器安装，并从桌面、开始菜单或手机主屏幕启动。
- 安装后以独立应用窗口或 standalone 显示模式运行，同时保留响应式 Web App 体验。
- 必须联网才能登录、加载和使用产品；MVP 不提供离线工具清单、离线编辑或离线打开应用。
- 安装版本继续使用 `F-008` 的 Google OAuth、单一 Owner 授权和安全会话规则。
- 不支持安装的浏览器仍可正常通过网站 URL 使用产品。
- MVP 不要求通过 App Store、Google Play 或 Microsoft Store 发布。

### F-010 Scope

- 使用统一管理的静态 Icon assets，不在网站运行时调用 AI 服务。
- 图标选择优先级：现成官方/市场图标、统一 Icon library 中语义相近的图标、统一规格 Monogram。
- `StudyMate` 等没有合适现成图标的工具使用统一规格字母图标，例如 `SM`。
- Codex 可以在开发或维护阶段协助判断图标、选择相近图标或生成缺失的统一资源；最终结果作为静态资源进入产品。
- 网站不得尝试读取或复用 Owner 的 Codex/ChatGPT 登录凭据、使用额度或会话来运行时生成图标。
- 若未来要求网站内实时 AI 生成，必须作为独立的新提案评估 OpenAI API、单独计费、密钥安全和成本控制；不属于当前范围。
- `Grid` View 显示较大的工具图标，`List` View 显示紧凑图标。
- 图标资源加载失败不得阻止工具显示、搜索或通过整个工具项目打开链接，并回退到统一 Monogram。
- 图标管理只服务于中心网站的工具入口，不读取独立应用内部数据，也不构成文件备份功能。

### F-011 Scope

- 在 `Settings` 页面管理 Tags。
- 默认 Tags：`AI`、`Design`、`ServiceNow`、`Automation`、`Productivity`、`Developer`、`Work`、`Learn`。
- 支持新增、重命名、调整顺序和隐藏 Tags。
- 已被工具使用的 Tag 不允许直接删除；Owner 必须先重新分配关联工具，或使用非破坏性的隐藏操作。
- Tag 重命名后，所有关联工具自动使用新名称。
- Tag 名称必须是简短英文，且不得与 `All`、`Favs`、`Recent`、`Search` 或 `Open` 等保留 UI 词冲突。

### F-012 Scope

- Owner 登录后，在电脑、手机、浏览器模式和已安装 PWA 之间同步中心网站数据。
- 同步工具名称、URL、说明、图标引用、Tags、Tag 顺序、收藏状态、Recent、工具显示顺序、主题和 View 偏好。
- 只同步中心网站自身的数据，不读取或同步独立应用的内部数据、账号内容或文件。
- 产品保持必须联网使用；不增加离线编辑队列。
- 多设备修改同一记录时，MVP 使用最新成功保存的变更作为当前版本。
- 同步失败必须显示简短英文状态，并保留当前未提交的表单内容供 Owner 重试。
- Cross-device Sync 是产品运行时持久化行为，不提供文件备份、导入或导出。

### F-013 Scope

- 扩展 Navbar Search，使点击搜索框或按 `Ctrl + K` 打开同一个 Command Palette。
- 工具搜索结果与站内 Commands 分区显示。
- 支持打开工具，以及 `Dashboard`、`All`、`Favs`、`Recent`、`Manage`、`Settings`、`Add Tool`、`Grid`、`List`、`Light`、`Dark` 和 `Log out` Commands。
- 支持方向键选择、`Enter` 执行和 `Esc` 关闭。
- 工具结果在新标签页打开；站内导航和设置操作在当前 Dashboard Shell 内执行。
- 不在 Command Palette 中提供永久删除或其他高风险操作。
- 不保存搜索查询内容。
- 用户可见英文 placeholder 使用 `Search tools or run a command…`。

### F-014 Scope

- 在 `Manage` 页面提供 `Check Links`，支持检查单个工具或全部工具。
- 链接状态使用 `Working`、`Check` 和 `Unknown`。
- 显示每个工具的 `Last checked` 时间。
- 登录跳转、访问限制或无法可靠判断的响应标记为 `Check`，不得直接判定为失效。
- 尚未检查或没有有效结果时使用 `Unknown`。
- 检查失败不得隐藏、删除或阻止 Owner 点击工具项目尝试打开链接。
- 不读取独立应用的内部内容、账号或业务数据。
- MVP 不进行频繁后台自动检查，只由 Owner 人工触发。
- 检查状态和时间通过 `F-012 Cross-device Sync` 在 Owner 设备间保持一致。

### F-015 Scope

- 默认超宽 Dashboard Main body 使用三段模板：左侧工具区依次为单行 `Favs` 与占用剩余高度的 `All`，中间访问区依次为 `Quick Access` 与 `Recent`，右侧 Widget 区依次为 `Calendar` 与 `To-Do`；Welcome 横跨前两段，三个下部区域底边与 Sidebar Account Card 底边对齐。
- 默认窄屏顺序为 `Favs`、`All`、`Quick Access`、`Recent`、`Calendar`、`To-Do`。
- `Welcome`、`Favs`、`All` 构成固定主工具区并保持该顺序；它们不参与跨列拖拽。
- `Quick Access`、`Recent`、`Calendar`、`To-Do` 是四个可拖拽辅助面板。Owner 可在 Dashboard 直接通过拖拽手柄调整同列上下顺序，或在两条辅助列之间移动。
- 当一条辅助列被拖空时，该列自动收起，Dashboard 从三列变为两列；将面板拖回其边缘 Drop zone 时重新建立第三列。
- 两列结构下，Welcome、Favs、All 自动使用释放的宽度。Welcome 只改变横向长度；Favs 与 All 根据新增宽度显示更多完整 Cards/items，而不是只拉宽现有项目。
- Owner 可以在 Settings 中使用等价的 Move up/down/left/right 控件管理辅助面板，作为拖拽的键盘、触摸和可访问替代方式。
- Owner 可以隐藏或重新显示 Dashboard 区域，但必须保留主工具区和至少一个可见辅助面板。
- 提供 `Reset Layout` 恢复上述宽屏/窄屏默认模板和全部可见状态。
- Navbar、Search、主题切换、Settings 和 Sidebar 不参与 Dashboard 内容排序或隐藏。
- Dashboard 布局通过 `F-012 Cross-device Sync` 在 Owner 设备间同步。
- 手机端使用适合窄屏的纵向区域布局，不要求复制电脑端列宽。

### F-016 Scope

- `Add Tool` 首先允许 Owner 粘贴应用 URL。
- 系统尝试建议网站名称和规范化域名。
- 系统根据统一静态 Icon registry 建议官方 Icon、语义相近 Icon 或 Monogram，不抓取 favicon，也不运行时调用 AI。
- Owner 必须在保存前审核并可修改名称、URL、说明、一个或多个 Tags 和 Icon 建议。
- 无法读取公开基础资料时仍可完全手动添加工具。
- 不读取登录后的页面内容，不保存目标页面正文。
- 自动建议使用与 Link Check 相同的安全 URL scheme 和网络目标限制。
- 建议失败不得清除 Owner 已填写的 URL、Tags 或其他表单内容。
- `Add Tool` 可从 `Manage` 或 Command Palette 的 `Add Tool` Command 打开。

### F-017 Scope

- 每个工具可以保存多个简短英文 Aliases，仅用于搜索匹配。
- Aliases 不显示为 Tag tabs，不改变工具正式名称，也不作为卡片上的可见分类。
- Navbar Search 和 Command Palette 的 Tools 结果必须匹配 Aliases。
- Owner 可以在 `Add Tool` 中添加 Aliases，也可以在 `Manage` 的 Edit Tool 窗口中新增、修改或移除 Aliases。
- 网站预置的所有工具与 Owner 后续添加的工具使用相同的 Manage 可编辑窗口；预置工具不得因来源而锁定 Alias 编辑。
- Aliases 通过 Cross-device Sync 在 Owner 设备间同步。
- Alias 不得包含密码、Token、API Key 或其他敏感信息；界面必须提供简短英文提示。
- 示例：`StudyMate` 可使用 `CSA`、`CAD`、`ITSM`、`exam`；`Online CV` 可使用 `resume`、`career`。

### F-018 Scope

- `Add Tool` 和修改关键识别字段时，在保存前检查规范化 URL、工具名称和域名。
- 完全相同的规范化 URL 显示明确重复警告。
- 相同或高度相似的工具名称显示 `Possible duplicate`。
- 相同域名显示 `Possible duplicate`，但允许同一网站的不同 URL path 作为独立工具保存。
- Aliases 允许重复，不参与重复判断或警告。
- 警告提供 `Edit existing`、`Continue anyway` 和 `Cancel`。
- 系统不得自动合并、覆盖或删除任何工具。
- 网站预置工具和 Owner 新增工具都参与 URL、名称和域名检查。
- 重复检查只使用中心网站已保存的工具资料，不读取目标应用内部数据。

### F-019 Scope

- Dashboard 提供独立 `Calendar` Widget，默认显示 Owner 当前本地月份。
- 支持上一月、下一月、`Today` 和选择某一天；今天、选中日期及包含未完成任务的日期必须视觉可区分。
- 月历使用 Monday-first 七列布局，并显示相邻月份的必要日期以保持完整周结构。
- Calendar 只读取 Phil's studio 内部 To-Do 的日期数据；当前 MVP 不连接 Google Calendar、Apple Calendar、Outlook Calendar 或其他第三方日历。
- Calendar 选择日期后，To-Do 可聚焦或筛选该日期的任务；清除选择后恢复默认分组。
- Calendar 状态和 Owner 当前选中日期不得改变工具集合、Tags 或 Recent 数据。

### F-020 Scope

- Dashboard 提供独立 `To-Do` Widget，支持 `Add Task`、完成/重新打开、编辑和删除任务。
- 每项任务至少包含英文标题、日期；时间和颜色 Accent 为可选字段。任务标题为空时不得保存。
- 默认按 `Today`、`Tomorrow`、`This Week` 和 `Later` 分组；空分组不显示，组标题显示未完成任务数量。
- Widget 首屏只显示完整任务 rows；超出固定高度时仅在内部垂直滚动，并提供 `View all tasks` 进入完整任务视图。
- 完成任务使用明确的 checkbox 状态；删除必须可恢复或经过确认，失败时保留原任务并显示简短英文 Retry feedback。
- Calendar 与 To-Do 数据属于 Phil's studio 自身数据，通过 Cross-device Sync 在 Owner 设备间保持一致；产品仍要求联网使用。
- 当前 MVP 不提供重复任务、提醒通知、协作、附件、自然语言解析或第三方任务服务同步。

## User Stories

| ID | Feature | User Story |
|---|---|---|
| US-001 | F-001 | 作为工具所有者，我希望在一个页面看到所有工具，以便不用在不同位置寻找链接。 |
| US-002 | F-001 | 作为工具所有者，我希望通过分类、标签和搜索找到工具，以便快速进入当前任务所需的工具。 |
| US-003 | F-001 | 作为工具所有者，我希望收藏常用工具，以便更快访问高频入口。 |
| US-004 | F-002 | 作为工具所有者，我希望直接在网站中添加和编辑工具，以便日后管理时无需修改代码。 |
| US-005 | F-002 | 作为工具所有者，我希望隐藏暂时不用的工具而不永久删除资料，以便降低误操作风险。 |
| US-006 | F-003 | 作为工具所有者，我希望看到最近打开的工具，以便快速回到当前工作上下文。 |
| US-007 | F-004 | 作为工具所有者，我希望既能点击搜索框，也能使用 `Ctrl + K` 快速搜索，以便按当前操作习惯打开工具。 |
| US-008 | F-005 | 作为工具所有者，我希望按个人优先级排列分类内工具，以便重要工具出现在更显眼的位置。 |
| US-009 | F-006 | 作为工具所有者，我希望选择适合当前环境的主题，以便长时间使用中心网站时保持舒适和清晰。 |
| US-010 | F-007 | 作为工具所有者，我希望在网格和列表之间切换，以便按工具数量和当前任务选择合适的浏览密度。 |
| US-011 | F-008 | 作为唯一 Owner，我希望使用指定 Google 账号登录，以便只有我能查看和管理个人工具中心。 |
| US-012 | F-009 | 作为工具所有者，我希望把中心网站安装到电脑和手机主屏幕，以便像独立 App 一样快速启动，同时继续联网安全登录。 |
| US-013 | F-010 | 作为工具所有者，我希望每个工具显示容易识别且可更换的图标，以便在不同 View 中更快找到需要的应用。 |
| US-014 | F-011 | 作为工具所有者，我希望在 Settings 中维护 Tags，以便分类体系可以随工具变化而调整且无需修改代码。 |
| US-015 | F-012 | 作为唯一 Owner，我希望电脑和手机显示相同的工具资料与偏好，以便在不同设备启动 PWA 时保持一致工作环境。 |
| US-016 | F-013 | 作为工具所有者，我希望从 Search 或 `Ctrl + K` 搜索工具并运行常用 Commands，以便减少鼠标移动和页面切换。 |
| US-017 | F-014 | 作为工具所有者，我希望人工检查已保存链接并看到谨慎的状态，以便发现需要维护的入口而不因误判丢失工具。 |
| US-018 | F-015 | 作为工具所有者，我希望调整 Dashboard 区域的顺序和可见性，以便优先看到最符合当前习惯的工具集合。 |
| US-019 | F-016 | 作为工具所有者，我希望粘贴 URL 后获得可修改的工具资料和统一 Icon 建议，以便更快添加新入口而不放弃审核控制。 |
| US-020 | F-017 | 作为工具所有者，我希望为预置和新增工具添加搜索别名，以便通过缩写、旧名称或任务关键词快速找到应用。 |
| US-021 | F-018 | 作为工具所有者，我希望保存前看到可靠的重复提示，以便避免误加相同入口，同时仍能保留同站点的不同工具路径。 |

| US-022 | F-019 | 作为唯一 Owner，我希望在 Dashboard 首屏查看当前月份并选择日期，以便快速建立当天和近期工作的时间背景。 |
| US-023 | F-020 | 作为唯一 Owner，我希望直接在 Dashboard 新增、完成和查看轻量任务，以便把工具入口与近期行动放在同一个工作台。 |

## User Flows

1. 用户打开工作台。
2. 用户浏览 `All`、选择 Tag tab 或切换到 `Favs`。
3. 用户也可在 `Search` 中输入工具名称、用途或标签。
4. 用户点击卡片、图标或列表中的整个工具项目。
5. 系统在新标签页打开该工具的现有链接。

### Manage Flow

1. 用户打开 `Manage`。
2. 用户选择 `Add`，或对已有工具选择 `Edit`、`Fav` 或 `Hide`。
3. 系统校验必填资料和 URL。
4. 用户保存变更。
5. 工具列表、分类、搜索和 `Favs` 同步反映变更。

### Recent Flow

1. 用户从中心网站打开一个工具。
2. 系统在新标签页打开该工具，并更新 `Recent`。
3. 用户可从 `Recent` 再次打开工具，或选择 `Clear` 清除最近记录。

### Quick Launch Flow

1. 用户点击 `Search`，或按 `Ctrl + K` 打开或聚焦搜索。
2. 用户输入工具名称、用途或标签。
3. 用户点击结果，或使用方向键选择并按 `Enter`。
4. 系统在新标签页打开工具；用户也可按 `Esc` 退出搜索。

### Arrange Flow

1. 用户打开 `Manage` 并进入一个分类。
2. 用户拖动工具，或使用 `Up`、`Down` 调整位置。
3. 系统保存新顺序并在普通分类视图中同步显示。

### Theme Flow

1. 用户打开主题设置。
2. 用户选择 `Light`、`Dark` 或 `Auto`。
3. 系统立即应用并记住选择；`Auto` 随系统主题变化。

### View Flow

1. 用户选择 `Grid` 或 `List`。
2. 系统以选定布局显示当前相同的工具结果。
3. 系统记住选择并在下次打开时恢复。

### Sign-in Flow

1. 未登录用户被引导到独立的英文登录页面。
2. 登录页面显示产品标识、简短说明和 Google `Sign in` 操作，不显示 Owner 邮箱。
3. 用户通过 Google OAuth 完成身份验证。
4. 系统验证 Google 邮箱已验证，并与环境中配置的 Owner 邮箱匹配。
5. 匹配时创建安全会话并直接跳转 Dashboard 首页；不匹配时在独立登录页面显示安全错误。
6. 用户可 `Sign out`；会话到期后必须返回独立登录页面重新登录。

### Install Flow

1. Owner 在兼容的电脑或手机浏览器中打开中心网站。
2. 浏览器提供 `Install App`、`Add to Home Screen` 或系统等效安装入口。
3. Owner 完成安装并从桌面、开始菜单或手机主屏幕启动应用。
4. PWA 以独立窗口打开；若没有有效会话，则显示独立登录页面。
5. 设备联网且 Google OAuth 与 Owner 授权成功后，进入 Dashboard。
6. 设备离线时显示简短英文联网提示，不提供受保护数据或离线操作。

### Calendar and To-Do Flow

1. Owner 在 Dashboard Calendar 浏览月份、选择日期或返回 `Today`。
2. To-Do 根据所选日期聚焦相关任务，同时保留默认时间分组入口。
3. Owner 选择 `Add Task`，填写英文标题、日期，以及可选时间和 Accent。
4. 保存成功后 Calendar 对应日期显示任务指示点，To-Do 立即显示完整任务 row。
5. Owner 可完成、重新打开、编辑或删除任务；所有成功变更通过 Cross-device Sync 保持一致。

## Functional Requirements

| ID | Feature | Requirement |
|---|---|---|
| FR-001 | F-001 | 系统必须显示所有已登记工具的卡片。 |
| FR-002 | F-001 | 每个工具项目必须包含英文名称、用途、Tags、链接状态和可识别的打开交互；不得要求额外的 `Open` 文字按钮。 |
| FR-003 | F-001 | 系统必须按名称、用途和标签执行不区分大小写的搜索。 |
| FR-004 | F-001 | 系统初始必须提供 `AI`、`Design`、`ServiceNow`、`Automation`、`Productivity`、`Developer`、`Work` 和 `Learn` 八个可选择的默认 Tag tabs。 |
| FR-005 | F-001 | 系统必须允许用户标记或取消收藏工具。 |
| FR-006 | F-001 | 系统必须标识工具属于自有工具还是第三方工具。 |
| FR-007 | F-001 | 系统不得依赖工具 API 才能显示或打开工具入口。 |
| FR-008 | F-002 | 系统必须允许用户在网站内新增工具资料。 |
| FR-009 | F-002 | 系统必须允许用户编辑工具名称、URL、简介、一个或多个 Tags 和来源类型。 |
| FR-010 | F-002 | 系统必须在保存前校验必填资料和 URL 格式，并显示简短英文错误信息。 |
| FR-011 | F-002 | 系统必须允许用户隐藏和恢复工具，且隐藏不得永久删除记录。 |
| FR-012 | F-002 | 新增、编辑、收藏或隐藏后，系统必须同步更新列表、搜索、分类和收藏结果。 |
| FR-013 | F-003 | 系统必须在用户从中心网站打开工具时更新该工具的最近打开时间。 |
| FR-014 | F-003 | 系统必须在 `Recent` 中按最近打开时间显示最多 6 个工具。 |
| FR-015 | F-003 | 系统必须允许用户使用 `Clear` 清除所有最近记录。 |
| FR-016 | F-003 | 系统只能记录中心网站中的工具标识和打开时间，不得读取目标 App 内部数据。 |
| FR-017 | F-001, F-003 | 用户点击 `Grid` 或 `List` View 中的整个工具项目时，系统必须在新标签页打开对应工具链接。 |
| FR-018 | F-004 | 系统必须保留可点击和可聚焦的页面搜索框。 |
| FR-019 | F-004 | 系统必须使用 `Ctrl + K` 打开或聚焦与页面搜索框相同的搜索功能。 |
| FR-020 | F-004 | 鼠标和快捷键入口必须共享相同的查询状态、搜索规则和结果集合。 |
| FR-021 | F-004 | 系统必须支持方向键选择、`Enter` 打开和 `Esc` 退出搜索。 |
| FR-022 | F-004 | 当用户正在编辑其他表单字段时，快捷键处理不得破坏现有输入。 |
| FR-023 | F-005 | 系统必须允许用户在 `Manage` 中通过拖动调整分类内工具顺序。 |
| FR-024 | F-005 | 系统必须提供 `Up` 和 `Down` 作为不依赖拖动的排序方式。 |
| FR-025 | F-005 | 系统必须将新工具默认放在所属分类末尾。 |
| FR-026 | F-005 | 自定义顺序仅控制普通分类视图，不得覆盖 `Favs` 和 `Recent` 的既有排序规则。 |
| FR-027 | F-006 | 系统必须提供 `Light`、`Dark` 和 `Auto` 三种主题选项。 |
| FR-028 | F-006 | 系统首次使用时必须默认选择 `Auto` 并跟随系统主题。 |
| FR-029 | F-006 | 系统必须记住用户手动选择的主题，直到用户再次更改。 |
| FR-030 | F-006 | 所有主题必须为文字、图标、焦点和交互状态提供清晰且可访问的对比度。 |
| FR-031 | F-006 | 主题设置只能影响中心网站，不得尝试改变独立 App 的主题。 |
| FR-032 | F-007 | 系统必须提供 `Grid` 和 `List` 两种视图。 |
| FR-033 | F-007 | 两种视图必须共享相同的工具数据、搜索、筛选和排序结果。 |
| FR-034 | F-007 | 系统必须记住用户最后选择的视图。 |
| FR-035 | F-007 | `Grid` 和 `List` 必须在支持的小屏幕宽度下保持可操作和可读。 |
| FR-036 | F-008 | 系统必须使用 Google OAuth 进行身份验证，且不得提供公开注册或密码登录。 |
| FR-037 | F-008 | 系统必须在受信任的服务端边界校验 Google 邮箱已验证，并与配置的单一 Owner 邮箱匹配。 |
| FR-038 | F-008 | Owner 邮箱和 OAuth 凭据必须通过安全环境配置提供，不得硬编码或写入客户端、日志和公开文档。 |
| FR-039 | F-008 | 未登录用户和非 Owner Google 账号不得读取或修改工具、链接、收藏、最近记录、排序和设置。 |
| FR-040 | F-008 | 系统必须提供 `Sign in`、`Sign out`、安全会话和会话过期后的重新验证。 |
| FR-041 | F-008 | 身份验证或授权失败必须显示简短英文错误，不得泄露 Owner 邮箱或内部配置。 |
| FR-042 | F-008 | 系统必须提供独立登录页面，未登录访问不得呈现受保护主页内容或以主页弹窗代替。 |
| FR-043 | F-008 | 独立登录页面必须使用英文，包含产品标识、简短说明、Google 登录操作以及加载、错误和拒绝访问状态。 |
| FR-044 | F-008 | 独立登录页面及其错误状态不得显示或暗示允许登录的 Owner 邮箱。 |
| FR-045 | F-008 | Google OAuth 和 Owner 授权成功后，系统必须直接跳转产品 Dashboard 首页；已登录 Owner 访问登录页时也必须跳转 Dashboard。 |
| FR-046 | F-001, F-008 | 登录后的产品必须采用 Dashboard Shell，包含左侧可展开/收缩 Sidebar 和右侧主要内容区域。 |
| FR-047 | F-001, F-003 | `All`、`Favs` 和 `Recent` 必须作为工具集合视图，不得作为工具分类标签。 |
| FR-048 | F-001, F-004 | `Search` 必须作为独立功能，`Open` 必须作为工具卡片操作；两者不得出现在分类标签列表中。 |
| FR-049 | F-001, F-008 | Dashboard Sidebar 的主要导航必须包含 `Dashboard`、`All`、`Favs`、`Recent` 和 `Manage`；`Settings` 不得作为主要导航项。 |
| FR-050 | F-001, F-003, F-019, F-020 | Dashboard 首页 Navbar 下方的默认超宽 Main body 必须使用三段模板：左侧 `Favs`/`All`，中间 `Quick Access`/`Recent`，右侧 `Calendar`/`To-Do`；Welcome 横跨前两段。三个下部区域底边必须与展开 Sidebar Account Card 底边对齐，并保持在 Dashboard Shell 内。Search 由共享 Navbar 提供。 |
| FR-051 | F-008 | 登录后 Sidebar 底部必须显示 Owner 的 Google 头像和用户名；点击该身份区域必须打开包含 `Log out` 的账户菜单。 |
| FR-052 | F-008 | Sidebar 展开时必须显示 Google 头像和用户名；收缩时必须至少保留可识别且可访问的账户图标入口。 |
| FR-053 | F-008 | 用户从顶部 Navbar 右侧选择 `Settings` 后，系统必须在右侧 Main 区域打开设置页面，并保持 Dashboard Sidebar、Navbar 和当前登录会话。 |
| FR-054 | F-001 | 每个工具必须能够关联一个或多个已定义 Tags；选择 Tag tab 后，系统必须显示包含该 Tag 的工具。 |
| FR-055 | F-001, F-007 | 工具项目右上角可以显示右上方向的外部链接箭头作为视觉提示，但不得同时显示额外 `Open` 文字按钮。 |
| FR-056 | F-009 | 系统必须提供有效的 PWA manifest、应用名称、图标、启动 URL 和 standalone 显示配置，使兼容浏览器能够安装产品。 |
| FR-057 | F-009 | 安装后的 PWA 必须能够从支持的电脑桌面、开始菜单或手机主屏幕启动，并显示响应式的独立应用窗口。 |
| FR-058 | F-008, F-009 | 安装版本必须执行与浏览器版本相同的 Google OAuth、单一 Owner 授权、会话过期和退出登录规则。 |
| FR-059 | F-009 | 产品必须要求联网才能登录和使用；离线时不得显示过期的受保护工具数据或允许离线修改。 |
| FR-060 | F-009 | 不支持 PWA 安装的浏览器必须仍能通过普通网站模式访问产品。 |
| FR-061 | F-010 | 系统必须从统一静态 Icon registry 为每个工具分配图标，优先使用许可允许的官方/市场图标。 |
| FR-062 | F-010 | 没有合适官方图标时，系统必须允许分配统一 Icon library 中语义最接近的图标。 |
| FR-063 | F-010 | 没有合适官方或相近图标时，系统必须显示统一规格的 Monogram；例如 `StudyMate` 使用 `SM`。 |
| FR-064 | F-007, F-010 | `Grid` View 必须显示较大的工具图标，`List` View 必须显示紧凑图标，同时保持相同工具数据和打开行为。 |
| FR-065 | F-001, F-010 | 图标资源缺失或渲染失败不得阻止工具项目显示、搜索、筛选或在新标签页打开链接，并必须回退到 Monogram。 |
| FR-066 | F-010 | 所有图标必须遵循统一的尺寸、容器、圆角、线条粗细和有限强调色规则；使用第三方图标时必须满足许可与品牌使用要求。 |
| FR-098 | F-010 | Codex-assisted 图标选择或生成只在开发/维护工作流中执行，最终图标必须保存为产品静态资源。 |
| FR-099 | F-010 | 产品运行时不得使用 Owner 的 Codex/ChatGPT 凭据、会话或使用额度生成图标，也不得因此要求 OpenAI API Key。 |
| FR-100 | F-016 | `Add Tool` 必须允许 Owner 先粘贴 URL，并尝试建议网站名称与规范化域名。 |
| FR-101 | F-010, F-016 | Quick Add 必须从静态 Icon registry 建议 official、matching 或 monogram Icon，不得抓取 favicon 或运行时调用 AI。 |
| FR-102 | F-016 | 保存前必须允许 Owner 审核和修改名称、URL、说明、Tags 与 Icon 建议。 |
| FR-103 | F-016 | 无法获取公开基础资料时，系统必须保留完整手动添加流程并不得清除已填写字段。 |
| FR-104 | F-014, F-016 | Quick Add 的 URL 处理必须复用 Link Check 的安全 scheme 与本地、私有、保留网络目标限制。 |
| FR-105 | F-016 | Quick Add 不得读取登录后页面、保存目标页面正文或自动提交未经 Owner 确认的工具。 |
| FR-106 | F-002, F-013, F-016 | `Add Tool` 必须可从 `Manage` 和 Command Palette 打开，并进入同一个 Add Tool 流程。 |
| FR-107 | F-017 | 每个工具必须支持零个或多个简短英文 Aliases，且 Aliases 只能用于搜索匹配。 |
| FR-108 | F-004, F-013, F-017 | Navbar Search 和 Command Palette 的 Tools 结果必须对工具 Aliases 执行不区分大小写的匹配。 |
| FR-109 | F-016, F-017 | `Add Tool` 表单必须允许 Owner 添加、修改和移除 Aliases。 |
| FR-110 | F-002, F-017 | `Manage` 必须为每个工具提供 Edit Tool 窗口，并允许维护 Aliases；此要求同样适用于网站预置工具。 |
| FR-111 | F-017 | Aliases 不得显示为 Tag tabs、可见分类或工具正式名称，也不得改变 Tags 关联。 |
| FR-112 | F-012, F-017 | Aliases 必须作为中心网站工具资料跨 Owner 设备同步。 |
| FR-113 | F-017 | Alias 编辑界面必须提示不得输入密码、Token、API Key 或其他敏感信息。 |
| FR-114 | F-018 | 系统必须在 Add Tool 保存前对规范化 URL、工具名称和域名执行重复检查。 |
| FR-115 | F-018 | 完全相同的规范化 URL 必须显示明确重复警告；相同或高度相似名称、相同域名必须显示 `Possible duplicate`。 |
| FR-116 | F-017, F-018 | Aliases 可以重复，且不得参与重复检测、相似度判断或警告。 |
| FR-117 | F-018 | 重复警告必须提供 `Edit existing`、`Continue anyway` 和 `Cancel`，不得自动合并、覆盖或删除记录。 |
| FR-118 | F-002, F-018 | 网站预置工具和 Owner 新增工具必须使用相同的 URL、名称和域名重复检查规则。 |
| FR-119 | F-018 | 相同域名下的不同 URL path 必须允许在 Owner 选择 `Continue anyway` 后分别保存。 |
| FR-120 | F-018 | 重复检查只能使用中心网站已保存资料，不得请求或读取目标应用内部数据。 |
| FR-067 | F-004, F-008 | 登录后每个 Main 页面顶部必须显示位于 Sidebar 右侧的 Navbar；`Search` 位于 Navbar 左侧并继续支持点击和 `Ctrl + K`。 |
| FR-068 | F-006, F-008 | Navbar 右侧必须并列提供 `Light/Dark` 快速切换和 `Settings` 图标；`Auto` 主题选项继续在 Settings 页面提供。 |
| FR-069 | F-011 | Settings 必须允许 Owner 新增、重命名、调整顺序和隐藏 Tags。 |
| FR-070 | F-011 | Tag 重命名必须同步更新所有关联工具；已关联工具的 Tag 不得被直接永久删除。 |
| FR-071 | F-011 | Tag 名称必须为简短英文，并拒绝空值、重复值以及 `All`、`Favs`、`Recent`、`Search` 和 `Open` 等保留词。 |
| FR-072 | F-008, F-012 | 系统必须只在已授权 Owner 会话中读取和写入可跨设备同步的数据。 |
| FR-073 | F-012 | 系统必须同步工具资料、图标引用、Tags、Tag 顺序、收藏、Recent、工具顺序、主题和 View 偏好。 |
| FR-074 | F-012 | 同步范围不得包含独立应用的内部数据、账号内容或文件，也不得提供文件备份、导入或导出。 |
| FR-075 | F-012 | 多设备对同一记录产生变更时，MVP 必须以服务端最新成功保存的变更作为当前版本。 |
| FR-076 | F-012 | 保存或同步失败时，系统必须显示简短英文状态、保留当前未提交表单内容，并允许 Owner 重试。 |
| FR-077 | F-009, F-012 | 系统不得提供离线修改或延迟同步队列；没有网络连接时必须使用已确认的在线提示状态。 |
| FR-078 | F-004, F-013 | 点击 Navbar Search 或按 `Ctrl + K` 必须打开或聚焦同一个 Command Palette，并显示 `Search tools or run a command…`。 |
| FR-079 | F-013 | Command Palette 必须将工具结果与 Commands 分区，并支持方向键、`Enter` 和 `Esc` 操作。 |
| FR-080 | F-013 | Commands 必须包括 `Dashboard`、`All`、`Favs`、`Recent`、`Manage`、`Settings`、`Add Tool`、`Grid`、`List`、`Light`、`Dark` 和 `Log out`。 |
| FR-081 | F-001, F-013 | 执行工具结果必须在新标签页打开对应工具；执行站内导航或设置 Command 必须保留当前 Dashboard Shell。 |
| FR-082 | F-013 | Command Palette 不得提供永久删除等高风险操作，也不得保存用户的搜索查询文字。 |
| FR-083 | F-013 | `Log out` Command 必须结束受保护会话并返回独立登录页面；执行前不得与普通导航 Command 混淆。 |
| FR-084 | F-014 | `Manage` 必须允许 Owner 对单个工具或全部可见工具执行 `Check Links`。 |
| FR-085 | F-014 | 每个检查结果必须使用 `Working`、`Check` 或 `Unknown`，并保存 `Last checked` 时间。 |
| FR-086 | F-014 | 登录跳转、访问限制、超时或无法可靠判断的响应必须使用 `Check` 或 `Unknown`，不得自动标记为永久失效。 |
| FR-087 | F-001, F-014 | 链接检查结果不得隐藏、删除或禁用工具项目的正常点击打开行为。 |
| FR-088 | F-014 | 链接检查不得读取、解析或存储独立应用的内部页面内容、账号或业务数据，除判断基础可达性所需的最小响应信息外。 |
| FR-089 | F-014 | MVP 链接检查必须由 Owner 人工触发，不得运行频繁后台自动检查。 |
| FR-090 | F-012, F-014 | 链接状态和 `Last checked` 必须作为中心网站数据跨 Owner 设备同步。 |
| FR-091 | F-014 | Development Definition 必须限制可检查的 URL scheme 和网络目标，防止检查功能访问不安全的本地、私有或保留网络地址。 |
| FR-092 | F-015, F-019, F-020 | Dashboard 与 Settings 必须允许 Owner 调整 `Quick Access`、`Recent`、`Calendar`、`To-Do` 的同列上下顺序及两条辅助列归属；`Welcome`、`Favs`、`All` 保持主工具区固定顺序。 |
| FR-093 | F-015 | Settings 必须允许隐藏和重新显示 Dashboard 区域，但系统必须保留主工具区并阻止隐藏最后一个可见辅助面板。 |
| FR-094 | F-015, F-019, F-020 | `Reset Layout` 必须恢复默认三列模板：主工具区 `Welcome`/`Favs`/`All`，访问列 `Quick Access`/`Recent`，Widget 列 `Calendar`/`To-Do`；窄屏恢复 `Welcome`、Tags、`Favs`、`All`、`Quick Access`、`Recent`、`Calendar`、`To-Do` 的纵向顺序。 |
| FR-095 | F-008, F-015 | Dashboard 自定义不得移动或隐藏 Navbar、Search、主题切换、Settings 或 Sidebar。 |
| FR-096 | F-012, F-015 | Dashboard 辅助面板的列归属、同列顺序、两列/三列状态和可见性必须跨 Owner 设备同步。 |
| FR-097 | F-015 | 手机布局必须以窄屏可用的纵向区域顺序呈现，不得强制使用桌面列宽。 |
| FR-121 | F-006 | Navbar Theme control 必须是一个语义按钮，并在同一胶囊内依次包含目标主题 Icon、目标主题文字和装饰性 switch indicator；独立 Settings Icon 按钮必须紧邻其右侧。 |
| FR-122 | F-006, F-008 | Navbar 不得在 Theme 与 Settings 之间显示 Notification/bell，也不得把目标主题 Icon 拆成第二个独立 Theme 按钮。 |
| FR-123 | F-001, F-003, F-015 | Dashboard 默认宽屏 `Recent` 必须是一个独立的大容器，内部纵向容纳最多 6 个独立紧凑 Recent rows/cards；不得把每个 Recent item 直接散放在页面背景上。最终颜色与材质由后续导入 HTML 定义。 |
| FR-124 | F-002, F-008 | 展开 Sidebar 底部必须在 Owner Profile 上方显示 `Make it yours` Workspace helper 与 `Add a tool or pin a favorite.`，并在 Owner 名称下显示 `Personal workspace`；收缩 Sidebar 可隐藏这些文字。 |
| FR-125 | F-001, F-003 | 支持宽屏 Dashboard 时，内容必须填满可用 Shell 高度而不得越过 Sidebar 底边或造成整页内容溢出；超过区域容量的工具必须在对应区域内部滚动。 |
| FR-126 | F-003 | Dashboard `Favs` 必须保持单行固定高度；超过横向可见容量的 Favorite Cards 必须通过该区域内部水平滚动查看，且不得换成第二行。 |
| FR-127 | F-003, F-007 | Dashboard `All` 必须默认使用 `List` View，并占用左列从 Favs 下方到 Sidebar 底边的剩余高度；List 超出容量时内部垂直滚动。切换为 `Grid` 后使用稳定的两行 Card 视口，超出容量时内部水平滚动，不得把 Card 拉伸至父区域全高或破坏 Dashboard 布局。 |
| FR-128 | F-003, F-015 | 默认模板中 `Quick Access` 位于 `Recent` 上方；Owner 自定义后，两者必须按保存的辅助列归属和顺序显示。两者均为具有清晰层级的父 Card，并在内部包含视觉层级较低的小 Cards/rows；Quick Access 只包含 Owner 手动 Pin 的可见工具，同时可见最多 3 项，更多项目在其父 Card 内垂直滚动。 |
| FR-129 | F-003, F-015 | 默认模板中 Dashboard `Recent` 使用访问列在 Quick Access 下方的剩余高度；自定义布局中使用其定义的最小高度并随所在辅助列滚动。Recent 条目超出自身可视高度时仅在父 Card 内垂直滚动，不得增加整个 Dashboard 或 Body 高度。 |
| FR-130 | F-001, F-003, F-007 | Dashboard Favs、All、Quick Access 和 Recent 的内部滚动必须保持鼠标滚轮、触控板、触摸和键盘可操作，但视觉上隐藏 scrollbar，不得用隐藏 scrollbar 的方式禁用滚动。 |
| FR-131 | F-001, F-003 | Welcome、主要父 Cards 和内部条目必须保持清晰的嵌套层级与足够对比。除 `FR-178` 的统一极浅蓝 Indigo Card 色罩试验外，Product 不规定其他渐变、光源方向或复杂表面配方；最终视觉仍可由 Owner 后续提供的 HTML 设计替换。 |
| FR-132 | F-003, F-005 | Add Tool、Edit Tool 和 Manage 必须提供 `Pin to Quick Access` 控件。Owner 启用或关闭该控件后，Quick Access 必须立即加入或移除对应工具；操作失败时必须回滚视觉状态并提供简短英文 Retry feedback。 |
| FR-133 | F-003, F-012 | Quick Access Pin 状态和 Pin 时间必须跨 Owner 设备同步。Quick Access 必须按最近 Pin 时间倒序显示；取消后重新 Pin 必须把工具移到最前。 |
| FR-134 | F-002, F-003 | 系统不得自动 Pin 工具。隐藏工具不得显示在 Quick Access，但必须保留 Pin 状态；重新显示后按原 Pin 时间恢复。Quick Access 无项目时必须显示英文空状态且不得显示占位 Card。 |
| FR-135 | F-001, F-008 | Sidebar 右侧的完整 Main 必须是一个连续、受约束的玻璃工作区并包含 Navbar、Welcome 与 Dashboard 内容。其视觉环境可与页面深海军蓝背景柔和融合，不要求显示成第二个明显的大 Card 边框，但所有内容和环境光必须留在 Main 边界内。 |
| FR-136 | F-004, F-006, F-008 | Main 顶部 Navbar 必须在大型 Main 玻璃容器内使用无独立 Card 背景的正常横向排列。Search 可保留自身输入框表面；Theme switch 与 Settings 仍是独立控件，并必须使用明显深色阴影增强与 Main 背景的层次。 |
| FR-137 | F-008 | Sidebar 底部登录成功后的 Google Avatar、Owner 名称和 `Personal workspace` 必须位于一个独立透明玻璃 Account Card 内，并作为宽屏 Dashboard 内容底部对齐的基准。 |
| FR-138 | F-001, F-003, F-007, F-015 | Dashboard `All` 的 List View 必须根据实际容器宽度自动使用 1、2、3 或最多 4 列紧凑 List items；第 4 列仅在动态两列布局释放足够主工具区宽度时出现。列数变化不得改变工具顺序或项目操作。 |
| FR-139 | F-001, F-003, F-015, F-019, F-020 | 默认宽屏 Dashboard 中 All、Recent 与 To-Do 父 Card 的底边必须共同对齐 Sidebar Owner Account Card 的底边。自定义布局后，主工具区和辅助列容器继续对齐该底线；合并滚动列中的单个面板不要求各自触底。Quick Access 与 Recent 标题下必须各显示一行不换行的简短英文说明。 |
| FR-140 | F-001, F-003, F-008, F-019, F-020 | 在正常缩放、受支持的宽屏电脑 Dashboard 中，Navbar、Welcome、Favs、All、Quick Access、Recent、Calendar 和 To-Do 必须全部在首屏 Main 内呈现，页面 Body/Main 不得因工具或任务数量增加而产生整体纵向滚动。移动布局、200% Zoom、放大文字或极低视口高度可使用可访问的页面滚动。 |
| FR-141 | F-001, F-003, F-007 | Dashboard 父 Cards 必须保持布局分配的固定高度。内容超过容量时，Favs 与 Dashboard Grid 仅使用内部 `overflow-x`，All List、Quick Access 和 Recent 仅使用内部 `overflow-y`；内部溢出不得扩大父 Card 或 Main 的高度。 |
| FR-142 | F-001, F-003 | 除 `FR-178` 的 Card-only 色罩与克制高光及 `FR-179` 的透明 Sidebar 外壳外，Main、Welcome、Quick Access、All、Recent 和 Search 不恢复任何旧渐变、径向光效或固定阴影配方。继续保留组件边界、圆角层级、可读对比和交互状态，最终视觉可由 Owner 后续导入并确认的 HTML 替换。 |
| FR-143 | F-001, F-003, F-007 | Dashboard 所有“大 Card 套小 Card”的集合视口，包括 Favs、All、Quick Access 和 Recent，在初始加载及滚动停止后只能显示完整的小 Card/row；不得把半张 Card 作为还有内容的提示。超出容量的项目可隐藏在内部滚动区域中，并按完整项目边界对齐。 |
| FR-144 | F-003, F-007 | Dashboard All 的 List item 与 Grid Card 都必须显示独立 Favorite Star。Star 仅切换 Favorite，不得打开工具；Card/row 的其余非独立操作区域仍整体在新标签页打开工具。 |
| FR-145 | F-001, F-003, F-007 | Dashboard All 在 List/Grid 切换前后必须保留同一父 Card 高度、底部基线和滚动边界。Grid 必须稳定使用两行等高 Cards，并按可用宽度显示整数列；切换不得导致 Cards 被异常拉高、内容塌陷或 Main 产生整体滚动。 |
| FR-146 | F-001, F-003, F-007, F-015 | 支持的宽屏电脑上，Main 内容宽度必须随可用视口和辅助列收起继续增长。Favs 与 All Grid 按实际容器宽度增加完整可见 Card 数量且无固定五张上限；All List 自动使用 1、2、3 或最多 4 列。Card 宽度必须保持视觉上限。 |
| FR-147 | F-003 | Dashboard 顶部筛选栏的第一个入口必须为 `All`，其后依次显示 `AI`、`Design`、`ServiceNow`、`Automation`、`Productivity`、`Developer`、`Work`、`Learn`。`All` 仅代表取消 Tag 筛选并展示全部工具，不是可保存或分配给工具的 Tag。 |
| FR-148 | F-001, F-003, F-015 | 默认宽屏模板中 Quick Access 顶部与顶部筛选/集合区域对齐；Quick Access 视口最多显示 3 个完整项目，Recent 获取其下方剩余高度。Owner 拖拽后，两者按保存位置显示并遵循各自最小高度；项目过多时仅在各自内部垂直滚动。 |

| FR-149 | F-001, F-003, F-015, F-019, F-020 | 支持的超宽 Dashboard 必须采用 Sidebar 加三段内容区：左侧为 Favs/All 工具区，中间为 Quick Access/Recent 窄栏，右侧为 Calendar/To-Do Widget 栏。Welcome 横跨左侧与中间区域；Navbar Search 在左上，Theme 与 Settings 在右上。 |
| FR-150 | F-001, F-003, F-015, F-019, F-020 | 默认三列布局中 Calendar、To-Do、Favs、All、Quick Access、Recent 必须同时位于正常缩放的首屏内。Owner 合并辅助列后，Body/Main 仍不得整体纵向滚动；超出容量的完整父面板仅通过合并辅助列内部滚动访问。 |
| FR-151 | F-001, F-003, F-019, F-020 | 既有 Arctic Navy、青色、靛紫和径向光源方向不再是当前视觉要求。Dashboard 大背景及 Welcome、All、Quick Access、Recent、Calendar、To-Do 的最终颜色和材质保持未指定，等待 Owner 提供新的 Claude Design HTML 后再作为重构来源。 |
| FR-152 | F-019 | Calendar 必须显示当前月份标题、上一月、下一月、`Today`、Monday-first weekday headings、完整日期网格、相邻月份日期、今天状态、选中日期状态和含任务日期的指示点。 |
| FR-153 | F-019, F-020 | Owner 选择 Calendar 日期时，To-Do 必须聚焦该日期任务；返回 `Today` 后恢复今天上下文。日期选择不得创建、删除或自动完成任务。 |
| FR-154 | F-020 | `Add Task` 必须允许保存标题、日期及可选时间和 Accent；标题为空、日期无效或保存失败时不得创建不完整任务，并必须显示简短英文 inline feedback。 |
| FR-155 | F-020 | To-Do 必须按 `Today`、`Tomorrow`、`This Week`、`Later` 分组显示未完成任务数量；每个任务 row 显示 checkbox、标题、可选时间/日期和 Accent dot。空分组不显示。 |
| FR-156 | F-020 | Owner 必须能够完成、重新打开、编辑和删除任务。完成状态必须立即反映在 Calendar 指示点与分组数量中；失败时回滚并提供 Retry。删除必须确认或提供可撤销恢复。 |
| FR-157 | F-020 | Dashboard To-Do 只显示可用高度内的完整 rows，超出后仅任务 body 内部纵向滚动；Footer `View all tasks →` 保持固定并打开完整任务视图。 |
| FR-158 | F-012, F-019, F-020 | Calendar 选择偏好和 To-Do 任务必须作为 Phil's studio 自身数据在 Owner 设备间同步，并继续遵循在线登录、单一 Owner 授权和最新成功保存优先规则。 |
| FR-159 | F-019, F-020 | MVP 不得连接或读取 Google Calendar、Apple Calendar、Outlook Calendar、Notion Tasks 或其他第三方日历/任务数据，也不得提供通知提醒、重复任务、附件或协作。 |
| FR-160 | F-001, F-003, F-019, F-020 | 在不足以容纳三段内容区的宽度上，Dashboard 必须逐级重排为两段后单列；Calendar 与 To-Do 不得被横向压缩至不可读，所有 Widget 在移动布局继续保持完整操作和内部/页面滚动的可访问性。 |

| FR-161 | F-015, F-019, F-020 | `Quick Access`、`Recent`、`Calendar`、`To-Do` 每个父面板必须提供独立拖拽手柄。拖动手柄可在原列重新排序或移动到另一辅助列；拖动面板内容、链接、日期、任务或按钮不得意外启动布局拖拽。 |
| FR-162 | F-015 | 辅助布局最多存在两条辅助列。每列保存有序面板列表；Owner 可形成默认 `2+2`、`1+3`、`3+1` 或单列 `4+0/0+4` 分配，不得复制或丢失面板。 |
| FR-163 | F-015 | 当任一辅助列变空时，Dashboard 必须自动收起空列并切换为主工具区加一条合并辅助列的两列布局；空列边缘必须保留可发现的 Drop zone，以便拖回面板并恢复三列。 |
| FR-164 | F-001, F-003, F-007, F-015 | 两列布局释放宽度后，主工具区必须自动扩展。Welcome 仅改变宽度并保持高度、内容、排版层级和操作不变；Favs 与 All 必须使用新增宽度显示更多完整 Cards/items。 |
| FR-165 | F-001, F-003, F-007, F-015 | Favs 和 All Grid 的可见完整 Card 数量必须按实际容器宽度计算且不得设置五张的固定上限；All List 可在足够宽的主工具区扩展到最多 4 列。新增空间不得通过把单个 Card/List item 拉伸到不合理宽度来填充。 |
| FR-166 | F-015, F-019, F-020 | 当四个辅助面板位于同一列且无法同时完整显示时，该辅助列必须在自身内部垂直滚动，并按完整父面板边界对齐；不得压缩 Calendar 日期网格、To-Do 间距或 Quick Access/Recent 最小可用高度。 |
| FR-167 | F-015 | 拖拽期间必须显示原尺寸占位、目标列和插入位置；无效位置不得接受 Drop。成功后立即采用新布局，失败时恢复原位置并显示简短英文 Retry feedback。 |
| FR-168 | F-005, F-015 | 所有拖拽操作必须提供键盘和非拖动替代：`Move up`、`Move down`、`Move left`、`Move right`。不可用方向必须禁用并通过可访问名称说明当前面板和目标。 |
| FR-169 | F-012, F-015 | 保存布局必须包含每个辅助面板的稳定 ID、列 ID、列内顺序和列是否收起；同步失败不得丢失当前本地排列，Retry 成功后再确认保存状态。 |
| FR-170 | F-015 | 手机和窄屏不显示桌面辅助列，但必须按保存后的列顺序线性化面板：先读取左辅助列从上到下，再读取右辅助列从上到下；若一列为空则只呈现非空列。 |
| FR-171 | F-001, F-008 | Mobile View 必须完全移除固定 Sidebar 及其占位宽度，并在 Mobile Navbar 左侧显示一个可访问的菜单 Icon。点击该 Icon 必须从左侧覆盖式打开包含完整导航、Workspace helper、Owner Profile 和 `Log out` 的 Drawer；关闭 Drawer 后焦点必须返回该 Icon。 |
| FR-172 | F-001, F-008 | Mobile Drawer 必须默认关闭且不得挤压或缩放 Main。选择导航项、点击遮罩、按 `Esc` 或执行确认的向左关闭手势后必须关闭；打开时必须阻止背景交互和背景滚动，同时保留 iPhone 安全区。 |
| FR-173 | F-001, F-016 | Mobile View 的 Welcome Card 必须把 `Add Tool` 放在 `Your tools, one place.` 下方并与问候语和副标题左边缘对齐。按钮必须使用紧凑的内容宽度，不得与问候语横向并排、右对齐或强制撑满 Card；桌面 Welcome 的右侧按钮布局保持不变。 |
| FR-174 | F-001, F-002, F-003, F-005, F-008, F-011, F-015, F-019, F-020 | 产品内所有页面级和嵌套滚动区域必须隐藏可见 scrollbar chrome，包括横向与纵向 scrollbar；隐藏后不得保留会改变响应式宽度、Card 尺寸或 gap 的 scrollbar gutter。滚轮、触控板、触摸、方向键、Page Up/Down、Home/End 和程序化焦点滚动必须继续可用。 |
| FR-175 | F-001, F-006 | Dashboard 最终选定的页面背景必须覆盖完整可见 viewport。顶部、底部、左右外缘及 Shell 内部间距不得露出意外的 Page/Body 底层、遮罩或 letterbox 边框；布局留白必须由同一页面背景上的内部 padding/gap 形成。当前不规定该背景的颜色或渐变。 |
| FR-176 | F-001, F-019 | Mobile View 的 Calendar Card 必须取消桌面固定宽度、最小宽度和 Widget 列宽约束，并填满 Mobile Main 的可用内容宽度。Calendar 的 Header、月份导航和 Monday-first 七列日期网格必须基于实际容器宽度自适应，不得保持窄固定面板、留下无意义右侧空白或产生页面横向滚动。 |
| FR-177 | F-001, F-015, F-019 | Calendar Card 在所有响应式宽度下必须完整包含 Header、月份导航、weekday headings、六行日期、选中日期阴影、任务圆点和底部 padding。日期网格不得通过 `overflow: visible`、绝对定位或错误固定高度绘制到 Card 边框外；可用列高不足时必须增加 Calendar 自身内容高度或由所在辅助列滚动，不得裁剪或外溢日期。 |
| FR-178 | F-001, F-002, F-003, F-008, F-015, F-019, F-020 | 当前视觉试验中，所有 Card 表面必须增加统一的偏蓝 Indigo 极浅半透明色罩，并使用克制的顶部/左上内高光与细边缘高光增强层次。该处理不得恢复多段渐变、径向光源或 Dashboard 大背景配色；父 Card 与嵌套 Card 必须通过轻微透明度差异保持层级。 |
| FR-179 | F-001, F-008, F-015 | 桌面展开 Sidebar 与收缩后的 Sidebar rail 外壳必须为无色、完全透明的布局容器，不得添加背景填充、颜色罩、渐变、整面透明层、`backdrop-filter` 模糊/饱和度、外壳边框或外壳阴影。Dashboard 最终大背景在 Sidebar 区域下方必须保持与相邻裸露区域相同的颜色、清晰度和亮度，不得被淡化或偏色。导航的 Hover/Focus/Active 状态、Workspace helper 与 Owner Account 可继续使用独立的局部表面以保证可读性；Mobile Drawer 仍是独立模态表面，不受本条透明规则约束。 |

## Acceptance Criteria

| ID | Requirement | Acceptance Criterion |
|---|---|---|
| AC-001 | FR-001, FR-002 | Given 已登记初始工具，When 用户打开主页，Then 每个工具均显示英文信息且整个项目可点击，不显示额外 `Open` 文字按钮。 |
| AC-002 | FR-003 | Given 工具名称、用途或标签中存在匹配文字，When 用户执行搜索，Then 仅显示匹配工具；无匹配时显示英文空状态。 |
| AC-003 | FR-004, FR-054 | Given 工具已关联一个或多个已定义 Tags，When 用户选择一个 Tag tab，Then 仅显示包含该 Tag 的工具。 |
| AC-004 | FR-005 | Given 任意工具卡片，When 用户切换收藏状态，Then `Favs` 结果同步反映该状态。 |
| AC-005 | FR-002, FR-007, FR-017 | Given 工具具有有效链接，When 用户点击整个工具项目，Then 浏览器在新标签页打开该链接且不要求调用工具 API。 |
| AC-006 | FR-006 | Given 同时存在自有和第三方工具，When 用户查看卡片，Then 两种来源可通过简短英文标识区分。 |
| AC-007 | FR-008, FR-010 | Given 用户填写有效的必填资料和 URL，When 用户保存新工具，Then 新工具出现在对应列表、分类和搜索结果中。 |
| AC-008 | FR-009, FR-010 | Given 已存在工具，When 用户保存有效修改，Then 所有相关视图显示更新后的资料；无效输入显示简短英文错误且不保存。 |
| AC-009 | FR-011 | Given 已存在可见工具，When 用户选择 `Hide`，Then 默认列表和搜索不再显示它，且用户可以恢复原记录。 |
| AC-010 | FR-012 | Given 工具资料、收藏或可见状态发生变更，When 保存成功，Then `All`、`Favs`、分类和搜索结果保持一致。 |
| AC-011 | FR-013, FR-014 | Given 用户从中心网站打开工具，When 返回中心网站查看 `Recent`，Then 该工具按最近打开顺序出现，且列表不超过 6 项。 |
| AC-012 | FR-015 | Given `Recent` 中存在记录，When 用户选择并确认 `Clear`，Then 最近记录被清空且显示简短英文空状态。 |
| AC-013 | FR-016 | Given 用户打开任意工具，When 系统更新 `Recent`，Then 仅保存工具标识和打开时间，不保存目标 App 数据。 |
| AC-014 | FR-017 | Given 工具具有有效链接，When 用户从任意中心网站入口打开它，Then 链接在新标签页打开。 |
| AC-015 | FR-018, FR-020 | Given 用户点击页面 `Search`，When 输入查询文字，Then 系统显示与既有名称、用途和标签规则一致的结果。 |
| AC-016 | FR-019, FR-020 | Given 页面未处于冲突输入状态，When 用户按 `Ctrl + K`，Then 同一搜索功能被打开或聚焦，且结果与点击入口一致。 |
| AC-017 | FR-021 | Given 搜索结果存在，When 用户使用方向键并按 `Enter`，Then 选中工具在新标签页打开；When 按 `Esc`，Then 搜索关闭或移除焦点。 |
| AC-018 | FR-022 | Given 用户正在其他表单字段中编辑内容，When 触发键盘输入，Then 当前字段内容不会被快捷搜索意外覆盖或丢失。 |
| AC-019 | FR-023, FR-024 | Given 一个分类包含多个工具，When 用户通过拖动或 `Up`、`Down` 调整顺序，Then 普通分类视图按新顺序显示。 |
| AC-020 | FR-025 | Given 用户新增一个工具，When 保存成功，Then 该工具出现在所属分类自定义顺序的末尾。 |
| AC-021 | FR-026 | Given 用户改变分类内顺序，When 查看 `Favs` 或 `Recent`，Then 两个视图仍分别使用收藏和最近访问规则排序。 |
| AC-022 | FR-027, FR-028 | Given 用户首次打开中心网站，When 系统主题为浅色或深色，Then `Auto` 被选中且中心网站匹配系统主题。 |
| AC-023 | FR-029 | Given 用户手动选择 `Light` 或 `Dark`，When 重新打开中心网站，Then 系统继续使用该手动选择。 |
| AC-024 | FR-030 | Given 任一主题，When 用户浏览、聚焦或操作界面，Then 文字、图标、焦点和交互状态保持清晰可辨。 |
| AC-025 | FR-031 | Given 用户改变中心网站主题，When 打开独立 App，Then 系统不尝试改变目标 App 的主题。 |
| AC-026 | FR-032, FR-033 | Given 当前存在搜索、筛选或排序结果，When 用户在 `Grid` 与 `List` 间切换，Then 工具集合和顺序保持一致，仅呈现方式改变。 |
| AC-027 | FR-034 | Given 用户选择一种视图，When 重新打开中心网站，Then 系统恢复最后选择的视图。 |
| AC-028 | FR-035 | Given 支持的小屏幕宽度，When 用户切换任一视图，Then 主要内容与 `Open` 操作保持可读和可操作。 |
| AC-029 | FR-036, FR-037 | Given 配置的 Owner 使用已验证的 Google 账号，When OAuth 成功完成，Then 系统创建会话并允许进入中心网站。 |
| AC-030 | FR-037, FR-039 | Given 任意非 Owner Google 账号，When OAuth 成功完成，Then 系统拒绝访问且不返回任何受保护数据。 |
| AC-031 | FR-039 | Given 用户未登录或会话已过期，When 请求任意中心网站或管理数据，Then 系统拒绝访问并引导到英文登录界面。 |
| AC-032 | FR-038 | Given 构建产物、客户端网络请求和应用日志，When 检查敏感配置，Then 不包含 Owner 邮箱配置值、OAuth Secret 或令牌。 |
| AC-033 | FR-040 | Given Owner 已登录，When 选择 `Sign out` 或会话过期，Then 受保护会话失效且后续访问需要重新验证。 |
| AC-034 | FR-041 | Given 认证或授权失败，When 显示错误，Then 文案为简短英文且不透露允许的 Owner 邮箱。 |
| AC-035 | FR-042 | Given 用户未登录，When 访问任意受保护页面，Then 系统仅显示独立登录页面且不泄露受保护主页内容。 |
| AC-036 | FR-043 | Given 独立登录页面处于默认、加载、错误或拒绝状态，When 用户查看页面，Then 产品标识、说明、Google 登录操作和状态反馈均为清晰英文。 |
| AC-037 | FR-044 | Given 独立登录页面或任一认证错误，When 检查可见内容，Then 页面不显示或暗示配置的 Owner 邮箱。 |
| AC-038 | FR-045 | Given 配置的 Owner 完成 Google OAuth 且授权通过，When 会话创建成功，Then 系统直接显示 Dashboard 首页而不要求额外确认步骤。 |
| AC-039 | FR-045 | Given Owner 已有有效会话，When 访问登录页，Then 系统直接跳转 Dashboard 首页。 |
| AC-040 | FR-046 | Given Owner 已登录，When Dashboard 加载完成，Then 页面显示左侧可展开/收缩 Sidebar 和右侧主要内容区域。 |
| AC-041 | FR-047, FR-048, FR-054, FR-069 | Given 初始 Tag tabs 已加载，When 尚未自定义 Tags，Then 显示八个默认 Tags；自定义后显示全部未隐藏 Tags，且始终不把 `All`、`Favs`、`Recent`、`Search` 或 `Open` 显示为 Tags。 |
| AC-042 | FR-049 | Given Dashboard Sidebar 已加载，When Sidebar 展开或收缩，Then `Dashboard`、`All`、`Favs`、`Recent` 和 `Manage` 保持一致并可通过文字或图标识别，且主要导航中不显示独立 `Settings` 项。 |
| AC-043 | FR-050, FR-067, FR-170 | Given Owner 进入 Dashboard 首页，When 页面加载完成，Then Navbar 左侧显示带 `Ctrl + K` 提示的 Search；主工具区依次显示 `Favs`、`All`，辅助面板按已保存的列归属与顺序显示；若尚无自定义布局则使用默认 `Quick Access`、`Recent` 与 `Calendar`、`To-Do` 两条辅助列。窄屏按主工具区、已保存左辅助列、已保存右辅助列线性显示。 |
| AC-044 | FR-051, FR-052 | Given Owner 已登录，When 查看 Sidebar 底部并点击 Google 身份区域，Then 展开状态显示头像与用户名、收缩状态保留账户图标，且账户菜单提供 `Log out`。 |
| AC-045 | FR-053 | Given Owner 已登录，When 选择 Navbar 右侧的 `Settings` 图标，Then 右侧 Main 区域显示设置页面，Sidebar、Navbar 和会话保持不变。 |
| AC-046 | FR-017, FR-055 | Given 用户查看任一工具项目，When 在 `Grid` 或 `List` View 中点击该项目，Then 对应应用在新标签页打开；项目可显示右上外部链接箭头，但不显示额外 `Open` 按钮。 |
| AC-047 | FR-056, FR-057 | Given Owner 使用兼容浏览器，When 执行系统提供的安装流程并启动应用，Then 产品从设备入口以独立 PWA 窗口打开。 |
| AC-048 | FR-058 | Given Owner 从已安装 PWA 启动产品，When 会话无效或过期，Then 产品要求通过相同的 Google OAuth 和 Owner 授权流程重新登录。 |
| AC-049 | FR-059 | Given 设备离线，When Owner 启动或使用 PWA，Then 产品显示简短英文联网提示，且不显示缓存的受保护工具数据或允许修改。 |
| AC-050 | FR-060 | Given 浏览器不提供 PWA 安装能力，When Owner访问产品 URL，Then 产品仍可作为响应式网站正常登录和使用。 |
| AC-051 | FR-061 | Given Icon registry 中存在许可允许的官方图标，When 工具显示，Then 使用该官方图标并保持统一容器规格。 |
| AC-052 | FR-062 | Given 没有合适官方图标但存在语义相近的 library icon，When Owner 分配该图标，Then各 View 使用统一样式的相近图标。 |
| AC-053 | FR-063, FR-065 | Given 工具没有合适官方或相近图标，或现有资源加载失败，When 任一 View 加载，Then 显示统一 Monogram 且工具仍可正常搜索和打开。 |
| AC-054 | FR-064 | Given 同一工具分别显示在 `Grid` 与 `List` View，When 用户切换 View，Then 图标尺寸适应布局而工具数据与整个项目点击行为保持一致。 |
| AC-055 | FR-066 | Given 官方、相近和 Monogram 图标同时显示，When 检查视觉系统，Then 它们使用一致尺寸、容器、圆角和线条规则，且第三方资源具有可接受许可。 |
| AC-081 | FR-098, FR-099 | Given 产品部署完成，When 检查运行时图标流程，Then 所有图标来自静态资源且不请求 Owner 的 Codex/ChatGPT 凭据、额度或 OpenAI API Key。 |
| AC-082 | FR-100, FR-101 | Given Owner 粘贴有效公开 URL，When Quick Add 返回建议，Then 显示可编辑名称、规范化域名和 registry Icon 建议，且不抓取 favicon。 |
| AC-083 | FR-102, FR-105 | Given Quick Add 已生成建议，When Owner 尚未确认保存，Then 工具不会被创建且所有建议字段均可修改。 |
| AC-084 | FR-103 | Given URL 无法提供公开基础资料，When建议失败，Then 已填写内容保持不变并可继续手动完成工具。 |
| AC-085 | FR-104 | Given URL 指向不允许的 scheme 或本地、私有、保留网络目标，When Quick Add 处理 URL，Then 系统安全拒绝并显示简短英文说明。 |
| AC-086 | FR-106 | Given Owner 从 Manage 或 Command Palette 选择 `Add Tool`，When流程打开，Then 两个入口显示相同 Add Tool 表单与行为。 |
| AC-087 | FR-107, FR-108 | Given 工具存在匹配 Alias，When Owner 在 Navbar Search 或 Command Palette 输入该 Alias，Then 对应工具出现在 Tools 结果中。 |
| AC-088 | FR-109 | Given Owner 正在 Add Tool，When 添加多个有效 Aliases 并保存，Then 新工具可通过任一 Alias 搜索到。 |
| AC-089 | FR-110 | Given 网站预置工具或 Owner 新增工具，When 在 Manage 选择 Edit，Then 显示相同 Edit Tool 窗口并可维护 Aliases。 |
| AC-090 | FR-111 | Given 工具具有 Aliases，When 查看卡片、Tag tabs 和正式名称，Then Aliases 不作为 Tags、分类或名称显示。 |
| AC-091 | FR-112 | Given Owner 在设备 A 修改 Aliases，When 在设备 B 重新加载并搜索，Then 使用已同步的 Alias 找到同一工具。 |
| AC-092 | FR-113 | Given Owner 编辑 Aliases，When 查看字段帮助，Then 显示简短英文敏感信息警告。 |
| AC-093 | FR-114, FR-115 | Given 已存在相同规范化 URL，When Owner 尝试保存新工具，Then 显示明确重复警告和匹配的现有工具。 |
| AC-094 | FR-115 | Given 已存在相同名称或域名但 URL 不同，When Owner 尝试保存，Then 显示 `Possible duplicate` 而不是自动阻止保存。 |
| AC-095 | FR-116 | Given 两个工具使用相同 Alias，When 任一工具保存，Then 不因 Alias 相同显示重复警告。 |
| AC-096 | FR-117 | Given 重复警告已显示，When Owner 选择 `Edit existing`、`Continue anyway` 或 `Cancel`，Then 分别打开现有记录、保存新记录或返回表单且不自动合并数据。 |
| AC-097 | FR-118 | Given 匹配记录是网站预置工具，When Owner 添加相似工具，Then 使用与 Owner 新增工具相同的重复提示。 |
| AC-098 | FR-119 | Given 两个 URL 具有相同域名但不同 path，When Owner 选择 `Continue anyway`，Then 两个工具可以分别保存。 |
| AC-099 | FR-120 | Given 系统执行重复检查，When 检查网络活动与数据访问，Then 只比较中心网站记录且不请求目标应用。 |
| AC-056 | FR-067 | Given Owner 位于任一 Main 页面，When 点击 Navbar Search 或按 `Ctrl + K`，Then 同一个搜索功能获得焦点并返回一致结果。 |
| AC-057 | FR-068 | Given Owner 查看 Navbar 右侧，When 使用主题开关或 Settings 图标，Then 分别切换 `Light/Dark` 或在 Main 中打开 Settings；Navbar 不显示未经确认的通知入口。 |
| AC-058 | FR-069, FR-070 | Given Owner 在 Settings 管理 Tags，When 新增、重命名、排序或隐藏有效 Tag，Then Tag tabs 与所有关联工具一致更新且不丢失关联。 |
| AC-059 | FR-070, FR-071 | Given Tag 已被使用或名称无效，When Owner 尝试永久删除或保存无效名称，Then 系统阻止操作并显示简短英文说明。 |
| AC-060 | FR-072, FR-073 | Given Owner 在设备 A 成功修改同步范围内的数据，When Owner 在设备 B 使用相同授权账号重新加载，Then 设备 B 显示最新成功保存的数据。 |
| AC-061 | FR-074 | Given Cross-device Sync 正常运行，When 检查同步数据，Then 不包含任何独立应用内部数据、账号内容、文件或文件备份。 |
| AC-062 | FR-075 | Given 两台设备先后修改同一记录，When 两次保存均成功，Then 产品显示最后一次由服务端成功接受的变更。 |
| AC-063 | FR-076 | Given 保存请求失败，When Owner 仍停留在编辑界面，Then 表单输入保持不变并显示简短英文重试状态。 |
| AC-064 | FR-077 | Given 设备离线，When Owner 尝试修改同步数据，Then 产品不接受离线保存或创建延迟同步任务，并显示联网提示。 |
| AC-065 | FR-078, FR-079 | Given Owner 位于任一认证页面，When 点击 Search 或按 `Ctrl + K`，Then 同一个 Command Palette 打开并可用方向键、`Enter` 和 `Esc` 操作。 |
| AC-066 | FR-079, FR-080 | Given 查询同时匹配工具和 Command，When 结果显示，Then 两种结果以清晰英文分区且每项可被键盘选择。 |
| AC-067 | FR-081 | Given Owner 选择工具结果或站内 Command，When 按 `Enter`，Then 工具在新标签页打开，或站内目标在当前 Dashboard Shell 中打开。 |
| AC-068 | FR-082 | Given Owner 使用 Command Palette，When 检查可用 Commands 和持久化数据，Then 不存在永久删除 Command 且不保存搜索查询文字。 |
| AC-069 | FR-083 | Given Owner 选择 `Log out` Command，When 执行成功，Then 会话结束并显示独立登录页面。 |
| AC-070 | FR-084, FR-085 | Given Manage 中存在工具，When Owner 检查单个或全部链接，Then 每个已处理工具显示允许状态之一和 `Last checked`。 |
| AC-071 | FR-086 | Given 目标返回登录跳转、访问限制、超时或模糊响应，When 检查完成，Then 工具显示 `Check` 或 `Unknown` 而不是被判定为永久失效。 |
| AC-072 | FR-087 | Given 任意检查状态，When Owner 点击工具项目，Then 系统仍尝试在新标签页打开原链接且不隐藏或删除记录。 |
| AC-073 | FR-088, FR-089 | Given Owner 未主动执行检查，When 产品正常运行，Then 不发起频繁后台链接检查；执行时不保存目标应用内部内容。 |
| AC-074 | FR-090 | Given 设备 A 完成链接检查，When Owner 在设备 B 重新加载，Then 设备 B 显示相同状态与 `Last checked` 时间。 |
| AC-075 | FR-091 | Given URL 指向不允许的 scheme 或本地、私有、保留网络目标，When Owner 执行检查，Then 系统安全拒绝并显示简短英文说明。 |
| AC-076 | FR-092 | Given 四个辅助面板均可见，When Owner 在 Dashboard 拖拽或在 Settings 使用移动控件，Then 面板按新的列归属和列内顺序显示，主工具区顺序不变。 |
| AC-077 | FR-093 | Given Dashboard 只剩一个可见辅助面板，When Owner 尝试隐藏该面板，Then 系统阻止操作并显示简短英文说明。 |
| AC-078 | FR-094 | Given Owner 已修改列归属、顺序或可见性，When 选择并确认 `Reset Layout`，Then 恢复 FR-094 定义的默认三列和窄屏顺序，并显示全部区域。 |
| AC-079 | FR-095 | Given Owner 自定义 Dashboard，When 保存修改，Then Navbar、Search、主题切换、Settings 和 Sidebar 保持原位置与可见状态。 |
| AC-080 | FR-096, FR-097, FR-170 | Given Owner 在电脑保存列归属和顺序，When 在手机重新加载，Then 按保存的左列后右列顺序线性呈现辅助面板，并保持相同可见性。 |
| AC-100 | FR-050, FR-123, FR-128, FR-149 | Given Owner 使用默认布局打开超宽 Dashboard，When Welcome 区域完成显示，Then 工具区显示 `Favs`/`All`，访问区显示嵌套式 `Quick Access`/`Recent`，Widget 区显示 `Calendar`/`To-Do`，且 Welcome 横跨前两段。 |
| AC-101 | FR-121, FR-122 | Given Navbar 空间充足，When Theme control 显示，Then Icon、目标主题文字与 switch indicator 位于同一按钮内，Settings 是其右侧唯一相邻 Icon 按钮，且不存在 bell 或第二个 Theme 按钮。 |
| AC-102 | FR-124 | Given Sidebar 展开且 Owner 已登录，When 查看 Sidebar 底部，Then Owner Profile 上方显示 Workspace helper，Profile 显示 Owner 名称与 `Personal workspace`；When Sidebar 收缩，Then 保留可访问的 Owner 入口且可隐藏辅助文字。 |
| AC-103 | FR-094, FR-097 | Given Owner 修改过 Dashboard 布局，When 确认 `Reset Layout`，Then 超宽恢复主工具区、访问列与 Widget 列三段，窄屏恢复 `Favs`/`All`/`Quick Access`/`Recent`/`Calendar`/`To-Do` 纵向顺序，且四个辅助面板全部可见。 |
| AC-104 | FR-125, FR-129 | Given 受支持的宽屏视口，When Dashboard 工具数量超过面板容量，Then Shell 和左右栏底边不越过 Sidebar 底边，Recent 保持固定高度，且页面不因工具条目增加而继续向下增长。 |
| AC-105 | FR-126, FR-130 | Given Favorite Cards 超过一行可见容量，When Owner 使用滚轮、触控板、触摸拖动或键盘浏览，Then Favs 保持一行并可水平查看全部项目，且视觉上不显示 scrollbar。 |
| AC-106 | FR-127, FR-130, FR-145 | Given Dashboard All 使用默认 List，When 条目超过剩余高度，Then 条目在 All 内垂直滚动；When Owner 切换 Grid，Then Grid 稳定显示两行等高 Cards，通过隐藏 scrollbar 的水平滚动查看其余 Cards，且父 Card 高度与底部基线不变。 |
| AC-107 | FR-128, FR-130 | Given Quick Access 含有超过 3 项，When Dashboard 加载，Then 父 Card 同时只展示最多 3 个完整条目，并允许在内部垂直滚动访问其余条目而不显示 scrollbar。 |
| AC-108 | FR-129, FR-130 | Given Recent 条目超过父 Card 可见高度，When Owner 浏览 Recent，Then 仅条目区域垂直滚动，Header/Clear 和父 Card 边界保持稳定；默认布局保持既定底线，自定义合并列则由辅助列容器保持底线。 |
| AC-109 | FR-131 | Given Dashboard 已渲染，When 比较 Welcome、主要父 Cards 和嵌套条目，Then 信息层级、边界与文字对比清晰，且没有因统一表面处理而失去父子层级；验收不要求任何指定渐变或色系。 |
| AC-110 | FR-128, FR-132 | Given Owner 在 Add/Edit/Manage 为一个可见工具启用 `Pin to Quick Access`，When 保存成功，Then 该工具立即出现在 Quick Access 最前；When Owner 取消 Pin，Then 该工具立即移除，且两种操作都不打开工具链接。 |
| AC-111 | FR-133 | Given Owner 在一台设备 Pin 多个工具，When 在另一台在线设备重新加载，Then Quick Access 显示相同 Pin 集合，并按最近 Pin 时间倒序排列。 |
| AC-112 | FR-134 | Given 一个已 Pin 工具被隐藏，When 查看 Dashboard，Then 它不显示在 Quick Access；When 重新显示该工具，Then 原 Pin 状态恢复；Given 没有任何可显示 Pin，Then 显示英文空状态且无占位 Card。 |
| AC-113 | FR-135 | Given Owner 已登录并打开任一 Main 页面，When 检查 Sidebar 右侧区域，Then Navbar、Welcome、Widgets 和页面内容位于同一个连续且受约束的玻璃工作区内；环境背景可柔和融合而不显示明显大型 Card 外框，但任何内容与光效都不越过 Main 边界。 |
| AC-114 | FR-136 | Given Dashboard Navbar 已显示，When 检查其背景和右侧控件，Then Navbar 不具有独立 Card 外框或填充，Search 保留输入框表面，Theme switch 与 Settings 各自具有明显深色阴影。 |
| AC-115 | FR-137 | Given Owner 登录成功且 Sidebar 展开，When 查看 Sidebar 底部，Then Google Avatar、Owner 名称和 `Personal workspace` 位于一个独立透明玻璃 Account Card 中。 |
| AC-116 | FR-138 | Given Dashboard All 使用 List View，When容器跨越定义阈值，Then List 自动在 1、2、3、最多 4 列之间切换，工具顺序和数据保持一致，且单个 item 不被不合理拉伸。 |
| AC-117 | FR-139 | Given 默认宽屏 Dashboard，When 内容完成布局，Then All、Recent、To-Do 与 Sidebar Owner Account Card 共享底部基线；Given 自定义合并列，Then 主工具区和辅助列容器共享底线，且 Quick Access/Recent 说明保持单行。 |
| AC-118 | FR-140 | Given 支持的宽屏电脑、正常缩放和足够视口高度，When Dashboard 加载且各集合包含超过可见容量的工具，Then Navbar、Welcome 和四个 Dashboard 区域仍完整位于首屏 Main Card 内，滚动页面 Body/Main 不会成为查看这些区域的必要操作。 |
| AC-119 | FR-141 | Given 任一 Dashboard 区域内容超过固定容量，When Owner 浏览溢出内容，Then 仅指定的内部 x/y 轴滚动容器移动，父 Card 高度、Main 高度及共享底部基线保持不变。 |
| AC-120 | FR-142, FR-178 | Given Dashboard 已渲染，When 对比 Sidebar、Main、Welcome、Quick Access、All、Recent 和 Search，Then 组件结构、圆角、间距、状态和可读性符合规范，Cards 使用当前极浅蓝 Indigo 透明色罩/高光；大背景及其他复杂视觉仍等待后续 HTML，且不出现旧渐变或径向光效。 |
| AC-121 | FR-143 | Given Favs、All、Quick Access 或 Recent 的内容超过可见容量，When Dashboard 初始加载或一次内部滚动停止，Then 视口边缘只出现完整 Card/row；下一个不能完整容纳的项目完全留在裁切区域外。 |
| AC-122 | FR-144 | Given Owner 在 All List 或 Grid 查看工具，When 激活其 Star，Then Favorite 状态和 Favs 立即更新且工具链接不打开；When 激活其余 launch surface，Then 工具在新标签页打开且 Favorite 状态不变。 |
| AC-123 | FR-145 | Given All 已显示多个工具，When Owner 在 List 与 Grid 间反复切换，Then Grid 始终为两行、Cards 保持正常高度、All/Recent/Account 底部基线不移动，且 Body/Main 不出现新增滚动。 |
| AC-124 | FR-138, FR-146 | Given Main 或 All 容器逐级变宽，When跨过阈值或辅助列收起，Then Favs/All Grid 增加完整可见 Card，All List 从 1 列逐步增加到最多 4 列；工具顺序、宽度上限和操作语义保持一致。 |
| AC-125 | FR-147 | Given Dashboard 顶部筛选栏已显示，When Owner 选择 `All`，Then 所有可见工具不受 Tag 限制地显示；When Add/Edit Tool 管理 Tags，Then `All` 不出现在可分配 Tag 列表中。 |
| AC-126 | FR-143, FR-148 | Given 支持的宽屏 Dashboard，When Quick Access 有至少 3 项且 Recent 超过容量，Then Quick Access 在上移位置完整显示 3 项，Recent 使用剩余高度并显示更多完整项目，两者内部滚动且共同保持 Main 首屏和底部基线。 |

| AC-127 | FR-149 | Given 支持的超宽视口，When Dashboard 完成布局，Then Sidebar 右侧依次呈现 Favs/All、Quick Access/Recent、Calendar/To-Do 三段，Welcome 横跨前两段，Search 与 Theme/Settings 位于图片所示顶栏两端。 |
| AC-128 | FR-150, FR-166 | Given 默认三列且集合超量，When Dashboard 加载，Then六个父区域保持首屏和底线；Given 四个辅助面板合并到一列，Then Body/Main 仍不滚动，超出面板通过辅助列内部按完整父 Card 边界访问。 |
| AC-129 | FR-151 | Given 新的 Claude Design HTML 尚未导入，When 生成或评审 Dashboard，Then 不以旧 Arctic Navy、青色、靛紫、径向光源或具体渐变作为通过条件；导入后再依据该 HTML 建立新的视觉验收基线。 |
| AC-130 | FR-152 | Given Calendar 显示任意月份，When Owner 检查日期网格，Then weekday 从 Monday 开始，完整周包含相邻月份日期，Today、选中日期和任务日期使用互不混淆的状态。 |
| AC-131 | FR-152, FR-153 | Given Owner 正在查看其他月份，When 选择 `Today`，Then Calendar 返回本地当前月份并选中今天；When 选择某日，Then To-Do 聚焦该日而不更改任务数据。 |
| AC-132 | FR-154 | Given Owner 选择 `Add Task`，When 提交有效标题和日期，Then 新任务立即出现在正确分组且 Calendar 显示日期指示；When 标题为空或日期无效，Then 保存被阻止并显示英文 inline error。 |
| AC-133 | FR-155 | Given 存在今天、明天、本周和稍后任务，When To-Do 加载，Then 非空分组按时间顺序显示，计数仅包含未完成任务，每个 row 显示 checkbox、标题及已有的时间/日期和 Accent。 |
| AC-134 | FR-156 | Given 一个未完成任务，When Owner 完成、重新打开、编辑或删除它，Then相关分组、数量和 Calendar 指示点立即一致更新；When 保存失败，Then 原状态恢复并提供 Retry。 |
| AC-135 | FR-157 | Given To-Do 任务超过父 Card 容量，When Dashboard 加载或内部滚动停止，Then 只显示完整任务 rows，Footer 保持可见，`View all tasks →` 打开完整任务视图。 |
| AC-136 | FR-158 | Given Owner 在一台设备修改任务，When另一台在线设备重新加载，Then显示相同任务、完成状态、日期、时间与 Accent，且非 Owner 无法读取这些数据。 |
| AC-137 | FR-159 | Given Calendar/To-Do MVP 运行，When 检查授权、网络请求和设置，Then不存在第三方 Calendar/Task OAuth、读取、同步、通知或协作入口。 |
| AC-138 | FR-160 | Given 视口从超宽缩小到桌面、平板和手机，When布局跨过响应式阈值，Then三段变为两段再变为单列，Calendar 和 To-Do 保持可读、可操作且不发生横向页面溢出。 |

| AC-139 | FR-161, FR-167 | Given Dashboard 处于桌面布局，When Owner 从 Quick Access、Recent、Calendar 或 To-Do 的手柄拖动，Then 显示原尺寸占位和有效 Drop 位置；When 从面板内容区开始操作，Then 不进入布局拖拽。 |
| AC-140 | FR-162 | Given 默认两条辅助列，When Owner 在列内或跨列移动四个面板，Then 支持 `2+2`、`1+3`、`3+1` 和单列四面板分配，且每个面板恰好出现一次。 |
| AC-141 | FR-163 | Given 一条辅助列只剩一个面板，When Owner 将它拖到另一列，Then 空列收起、Dashboard 变为两列、主工具区扩展；When 把任一面板拖到收起列边缘 Drop zone，Then 第三列恢复。 |
| AC-142 | FR-164, FR-165 | Given Dashboard 从三列变为两列，When 主工具区获得额外宽度，Then Welcome 仅横向变长，Favs 显示更多完整 Cards，All List/Grid 显示更多完整列，且单个项目不被异常拉宽。 |
| AC-143 | FR-165 | Given 主工具区持续变宽，When Favs 或 All Grid 能完整容纳第六张及更多 Cards，Then 可见数量继续增加而不受五张上限限制；When All List 达到超宽阈值，Then 最多使用 4 列。 |
| AC-144 | FR-166 | Given 四个辅助面板位于同一列且总高度超过首屏容量，When Dashboard 加载或列滚动停止，Then 只显示完整父面板边界，Calendar、To-Do、Quick Access、Recent 保持各自最小高度和内部布局。 |
| AC-145 | FR-168 | Given Owner 仅使用键盘，When 聚焦任一辅助面板布局手柄并执行 Move up/down/left/right，Then 获得与拖拽相同的列和顺序结果，焦点保持在被移动面板。 |
| AC-146 | FR-167, FR-169 | Given Owner 完成有效移动，When保存成功，Then显示简短 `Saved` 状态；When 保存失败，Then界面恢复或保留可重试的本地排列并明确提示未同步，不得重复或丢失面板。 |
| AC-147 | FR-169, FR-170 | Given Owner 保存两列或三列布局，When 在另一台电脑与手机加载，Then电脑恢复相同列归属/顺序/收起状态，手机按确认的线性化规则显示。 |
| AC-148 | FR-171 | Given 视口进入 Mobile View，When Dashboard 渲染，Then 固定 Sidebar 和其布局占位完全消失，Navbar 左侧显示具有 `Open navigation` 可访问名称的菜单 Icon，Main 使用完整可用宽度。 |
| AC-149 | FR-171, FR-172 | Given Mobile Drawer 已关闭，When Owner 点击 Navbar 菜单 Icon，Then Drawer 从左侧覆盖 Main 并显示完整导航、Workspace helper、Owner Profile 和 `Log out`；When Owner 选择导航、点击遮罩、按 `Esc` 或完成关闭手势，Then Drawer 关闭、背景恢复且焦点返回菜单 Icon。 |
| AC-150 | FR-173 | Given Dashboard 进入 Mobile View，When Welcome Card 完成布局，Then 问候语、`Your tools, one place.` 和 `Add Tool` 从上到下排列并共享左边缘，按钮保持紧凑内容宽度；When 返回桌面宽度，Then Add Tool 恢复到 Welcome 右侧。 |
| AC-151 | FR-174 | Given 任意页面、Drawer、父 Card、列表、Grid、表单或 Widget 内容发生溢出，When Owner 在支持的电脑或手机浏览器浏览，Then 不显示横向或纵向 scrollbar、不为其预留 gutter，布局宽度和 gap 不发生跳动，同时滚轮、触控板、触摸和键盘仍能访问全部内容。 |
| AC-152 | FR-175 | Given Dashboard 以任意支持的桌面、手机浏览器或 PWA viewport 渲染，When 检查页面四边及 Sidebar/Main 外部间距，Then 最终选定的页面背景连续覆盖至 viewport 边缘，不出现意外外框、遮罩、letterbox 或默认 Body margin；不对背景颜色或渐变作预设。 |
| AC-153 | FR-176 | Given Dashboard 进入 Mobile View，When Calendar 渲染在单列流中，Then Calendar 外边缘与相邻全宽面板使用相同内容边界，宽度随 Mobile Main 改变；七个 weekday/date columns 等宽收缩且完整可见，不出现固定窄宽度、右侧大块空白或横向页面滚动。 |
| AC-154 | FR-177 | Given Calendar 处于任意支持的中间宽度、手机宽度、放大文字或方向状态，When 六周月份和选中日期渲染，Then 六行日期、圆点与选中态全部位于 Calendar 圆角边框和底部 padding 内；若空间不足则 Card/辅助列按规则增长或滚动，任何日期都不越界、重叠或被裁剪。 |
| AC-155 | FR-178 | Given 任意 Light 或 Dark 页面显示父 Card 与嵌套 Card，When 比较其静止、Hover、Focus 和 Selected 状态，Then Card 具有非常浅、偏蓝 Indigo 的透明色罩和细微高光，父子层级清楚且文字对比合格；页面大背景保持未指定，Card 不出现多段渐变、径向光斑、强霓虹边缘或不透明蓝紫块。 |
| AC-156 | FR-179 | Given Dashboard 大背景在 Sidebar 内外具有可辨识的颜色或图形细节，When 比较展开 Sidebar、收缩 rail 与其相邻裸露背景，Then 外壳区域显示相同的色相、饱和度、亮度、清晰度与细节，不出现整块染色、雾化、变暗、变白、边框或阴影；同时导航文字、图标、Active/Focus 状态及底部独立 Cards 仍清楚可用。 |

## Business Rules and Permissions

- 仅供单一 Owner 使用；整个中心网站需要通过 Google OAuth 验证并执行 Owner 邮箱白名单授权。
- 网站内所有用户可见内容必须为英文。
- 标签和紧凑控件优先采用简短、清晰的英文词。

## Data and Integration Requirements

- 每个工具至少需要：名称、URL、简短说明、Tags、来源类型和收藏状态。
- 每个工具保存 Icon registry key、图标类型（official、matching 或 monogram）和必要的 Monogram 文字。
- 每个工具可以保存零个或多个仅用于搜索的 Aliases。
- 每个工具可以保存链接检查状态和最后检查时间；这些字段只描述入口可达性判断，不存储目标页面内容。
- Tags 初始值为 `AI`、`Design`、`ServiceNow`、`Automation`、`Productivity`、`Developer`、`Work` 和 `Learn`；Owner 可在 Settings 中维护额外的有效短英文 Tags，每个工具可关联一个或多个值。
- 集合视图与操作文字不得写入 Tags 字段。
- 每个工具还需要可见状态，以支持隐藏和恢复。
- 每个工具需要分类内排序位置，以支持自定义排列。
- 最近记录仅需要工具标识和最近打开时间。
- 用户设置需要保存主题选择。
- 用户设置需要保存最后选择的视图。
- 用户设置需要保存 Dashboard 区域顺序和可见性。
- 初始 URL 尚未提供，标记为 TBD。
- 不需要各工具 API 集成。
- 工具目录和偏好必须保存在受 Owner 授权保护的共享私有云数据库中，以支持电脑与手机同步。
- 云端数据库必须统一保存工具、Tags、Aliases、Favs、Recent、排序、主题、View、Dashboard 布局、图标引用和同步状态。
- 设备本地只能保存安全会话和必要的临时界面状态，不得将浏览器 Local Storage 作为唯一或权威数据来源。
- 不得保存独立应用的账号、密码、Token、文件或内部数据。
- 文件备份、导入和导出仍不在产品功能范围内。
- 具体数据库平台、托管方式和数据区域在 Development Definition 中确定。

## Non-Functional Requirements

- Confirmed computer scope: Windows 11 with Chrome and Edge; Mac Studio M4 with Safari and Chrome.
- Confirmed phone scope: iPhone with Safari and Chrome; Android phone with Chrome.
- Support only operating-system releases that still receive vendor security updates.
- Chrome, Edge, and Safari support the current stable major version and the previous major version.
- Windows 11 must remain within Microsoft support.
- macOS and iOS support the current major version and the previous major version.
- Android supports the current major version and the previous two major versions.
- Older versions may attempt browser access but are not guaranteed PWA installation, layout, or complete functionality.
- The supported-version test matrix must be refreshed during the monthly maintenance review.
- iPad and Android Tablet are outside formal MVP support; they may attempt browser access, but dedicated tablet layout, PWA installation, and release testing are not guaranteed.
- PWA runtime: installable where supported, standalone-capable, and online-only for authenticated product data and actions.
- Privacy and local/cloud data boundary: confirmed Owner-only private cloud persistence with minimal local session/UI state; provider and region TBD.
- Reliability target: 99.5% monthly availability for the hub, excluding outages or access failures of linked independent applications.
- Cross-device freshness target: after a successful save, another online device should show the latest data within 5 seconds after reload.
- Save integrity: the product must never report success before the authoritative cloud save succeeds.
- Failure recovery: save failures preserve current form input, show concise English status, and provide `Retry`.
- Unavailable-data behavior: when the database or network is unavailable, the product must not present stale protected data as safely editable current state.
- Session reliability: expired sessions return safely to the standalone sign-in page.
- Data durability target: the product must not cause loss of tools, Tags, Aliases, Favs, Recent, ordering, or settings.
- Maintenance budget: no more than 2 hours of routine maintenance per month.
- Maintenance cadence: monthly review of dependency updates, Google sign-in, synchronization, and PWA installation behavior.
- Security response: target high-risk security updates within 48 hours of discovery; ordinary dependency updates may be batched monthly.
- Operations: Link Check remains Owner-triggered and Icon registry maintenance occurs only when tools or visual direction change.
- Hosting preference: use managed services to reduce server, database, certificate, and infrastructure administration.
- Maintainability: deployment, database, OAuth, and routine maintenance steps require concise documentation.
- Deployment platform: Vercel.
- Availability geography: the product must be reachable globally where Vercel, Google OAuth, and the selected managed services are available.
- Data-region preference: use a Canadian cloud database region when the selected provider offers a suitable option; otherwise use a United States region.
- Accessibility baseline: every confirmed function must be operable by keyboard.
- Focus order must be logical and visible focus must remain clear in every theme and Sidebar state.
- Icon-only controls, including the collapsed Sidebar, require concise English accessible names and visible tooltips.
- Tool items must support keyboard focus and `Enter` launch; Command Palette must support arrow keys, `Enter`, and `Esc`.
- Text, icons, controls, and focus indicators require sufficient contrast in Light and Dark modes.
- Status, validation, and link-check meaning must not rely on color alone.
- Sidebar and other motion must respect the device reduced-motion preference.
- Form errors require explicit English text and programmatically identifiable association with the affected field.
- Performance environment: targets apply on normal broadband or stable 4G/5G connectivity within supported regions.
- Sign-in and Dashboard should normally become interactive within 3 seconds.
- Search and Command Palette results must update within 200 milliseconds for an inventory of up to 500 tools.
- Sidebar, theme, and Grid/List View changes must respond locally without waiting for a server round trip.
- Clicking a tool item must trigger the new browser tab within 500 milliseconds; linked application load time is excluded.
- Add/Edit saves should normally complete within 2 seconds; longer operations must show `Saving…` until authoritative success or failure.
- Static Icon assets must be compressed and cacheable and must not materially delay Dashboard interaction.
- Phone clients must not download large resources used only by computer layouts.

## Roadmap

### MVP Delivery Sequence

1. Secure Foundation: Owner Google OAuth, protected Dashboard Shell, private cloud persistence, Cross-device Sync, and Vercel deployment.
2. Tool Directory: initial inventory, Add/Edit/Hide, unified Icon registry, Tags, Aliases, duplicate warnings, ordering, and Link Check.
3. Fast Retrieval: Navbar Search, `Ctrl + K` Command Palette, All/Favs/Recent, Grid/List, and whole-item external launch.
4. Personal Experience: Light/Dark/Auto, Dashboard customization, accessibility, responsive computer/phone layouts, and installable online-only PWA.
5. Release Validation: supported-browser matrix, security/authorization checks, performance budgets, reliability targets, and maintenance documentation.

No additional feature enters this MVP sequence unless Product Freeze is explicitly reopened.

## Product Definition Gate

- Discovery and Personal Value Gate: PASS.
- Product Definition Gate: PASS on 2026-07-18.
- Coverage: `F-001` through `F-018`, User Stories, Functional Requirements, Acceptance Criteria, success metrics, Non-Goals, Roadmap, Backlog, risks, and open implementation questions are documented.
- Cross-document check: PASS for known active taxonomy, Search/Navbar, Settings, account-menu, Icon, and launch-behavior decisions.
- Security content scan: PASS; no configured Owner email value or OpenAI API Key value is stored in project documents.
- WARN: database provider, OAuth implementation configuration, exact architecture, and operational commands remain intentionally deferred to Development Definition.
- Product Freeze: Historical authorization on 2026-07-18; reopened by the Owner's requested presentation revision on 2026-07-19.

## Product Freeze

- Status: Reopened; renewed authorization pending.
- Previous Frozen Version: `4.1-freeze`.
- Current Draft: `4.18-draft`.
- Version: `4.1-freeze`.
- Date: 2026-07-18.
- Frozen Scope: `F-001` through `F-018`, their User Stories, Functional Requirements, Acceptance Criteria, Non-Goals, success metrics, NFRs, initial inventory mapping, Roadmap, and Backlog decisions.
- Change Process: new feature ideas go to Future Features by default. Any change to frozen MVP behavior, scope, success metrics, or acceptance criteria requires the Owner to explicitly authorize reopening Product Freeze before the change is applied.
- Allowed Without Reopening: typo corrections, non-semantic formatting repairs, traceability fixes that do not change behavior, and later technical/design details that remain consistent with this frozen product definition.
- This Product Freeze does not authorize UI Freeze, implementation, deployment, database creation, OAuth configuration, or production release.

## Backlog

### Rejected Feature Proposals

- `P-003 Backup`：Rejected。各 App 已独立部署并拥有自己的访问链接；中心网站只负责打开入口，不承担 App 数据或工具目录文件的备份、导入和导出。
- `P-009 Private Access`：原拒绝决定已被用户更正并由 `F-008` 取代；当前要求为单一 Owner Google OAuth 登录。
- `P-012 Usage Insights`：Rejected。不在当前产品中记录打开次数、提供 `Most Used` 或按时间范围展示使用统计。

## Future Features

- Open-ended feature discovery closed by the Owner on 2026-07-18.
- No additional feature proposal may enter the current MVP without explicitly reopening scope.
- New ideas discovered later must remain in Future Features until separately reviewed and confirmed.

## Risks, Assumptions, and Open Questions

- Risk: 链接失效后可能继续显示，链接状态检查策略为 TBD。
- Risk: Tag tabs 过多会降低扫描效率；系统以八个默认选项开始，并需要通过排序、隐藏和响应式布局保持可扫描性。
- Risk: Google OAuth、Owner 白名单或服务端授权配置错误可能导致未授权访问或 Owner 无法登录。
- Assumption: 每个工具都存在可直接访问的链接。
- Resolved: 使用滚动版本策略；浏览器当前版与前一版，macOS/iOS 当前与前一主要版本，Android 当前与前两个主要版本，并仅支持仍获安全更新的 OS。
- Open: 私有云数据库供应商是什么？数据区域优先加拿大，不可用时使用美国。
- Resolved: 工具清单、收藏和其他中心网站数据使用 Owner-only 私有云数据库；具体平台与区域进入 Development Definition。

## Version History

| Version | Date | Change |
|---|---|---|
| 0.1-draft | 2026-07-18 | 创建产品草案；加入已确认的 `F-001`、关联故事、需求与验收标准。 |
| 0.2-draft | 2026-07-18 | 接受 `F-002`；加入网站内工具管理、隐藏恢复和输入校验范围。 |
| 0.3-draft | 2026-07-18 | 拒绝 `P-003`；明确排除备份、导入和导出。 |
| 0.4-draft | 2026-07-18 | 接受 `P-004` 为 `F-003`；加入最多 6 项的最近访问和新标签页打开行为。 |
| 0.5-draft | 2026-07-18 | 接受修订后的 `P-005` 为 `F-004`；保留可点击搜索并添加共享搜索逻辑的 `Ctrl + K` 快捷入口。 |
| 0.6-draft | 2026-07-18 | 接受 `P-006` 为 `F-005`；加入拖动、`Up/Down` 和分类内自定义顺序。 |
| 0.7-draft | 2026-07-18 | 接受 `P-007` 为 `F-006`；加入 `Light`、`Dark`、`Auto` 及主题偏好记忆。 |
| 0.8-draft | 2026-07-18 | 接受 `P-008` 为 `F-007`；加入共享数据逻辑的 `Grid` 与 `List` 视图。 |
| 0.9-draft | 2026-07-18 | 拒绝 `P-009`；排除登录，并把无认证下的部署与共享写入风险和开放问题。 |
| 1.0-draft | 2026-07-18 | 用户更正 `P-009`；新增 `F-008` 单一 Owner Google OAuth 登录、独立登录页面、成功后直达 Dashboard，并废止无认证决定。 |
| 1.1-draft | 2026-07-18 | 接受 Dashboard 导航与首页组成；修正分类体系为 `Brand`、`Create`、`Learn`、`Work`，并明确 `All/Favs/Recent` 为视图、`Search` 为功能、`Open` 为操作。 |
| 1.2-draft | 2026-07-18 | 将 `Home` 更名为 `Dashboard`，并把 `Settings` 与 `Log out` 移入 Sidebar 底部的 Google Owner 账户菜单。 |
| 1.3-draft | 2026-07-18 | 确认 `Settings` 在右侧 Main 打开，并以八个可选择的 Tag tabs 替换旧分类集合。 |
| 1.4-draft | 2026-07-18 | 明确 `Open` 是整个工具项目的点击行为而非按钮，并允许使用右上外部链接箭头提示新标签页跳转。 |
| 1.5-draft | 2026-07-18 | 接受 `P-010` 为 `F-009 Installable PWA`；确认电脑与手机可安装、独立启动、必须联网并继续执行 Owner Google OAuth。 |
| 1.6-draft | 2026-07-18 | 接受 `P-011` 为 `F-010 Tool Icons`；加入自动网站图标、手动 URL/上传、首字母回退和跨 View 图标行为。 |
| 1.7-draft | 2026-07-18 | 拒绝 `P-012 Usage Insights`；不加入打开次数、Most Used 或使用趋势统计。 |
| 1.8-draft | 2026-07-18 | 接受 `P-013` 为 `F-011 Manage Tags`；确认 Navbar 左侧 Search、右侧 Light/Dark 与 Settings，并从账户菜单移除 Settings。 |
| 1.9-draft | 2026-07-18 | 接受 `P-014` 为 `F-012 Cross-device Sync`；同步中心网站数据与偏好，排除独立应用数据、文件备份和离线编辑。 |
| 2.0-draft | 2026-07-18 | 接受 `P-015` 为 `F-013 Command Palette`；扩展 Navbar Search 与 Ctrl+K，以分区结果运行工具和安全站内 Commands。 |
| 2.1-draft | 2026-07-18 | 接受 `P-016` 为 `F-014 Link Check`；加入人工检查、谨慎状态、最后检查时间、同步和安全网络边界。 |
| 2.2-draft | 2026-07-18 | 接受 `P-017` 为 `F-015 Customize Dashboard`；加入区域排序、隐藏、重置、跨设备同步和移动端纵向适配。 |
| 2.3-draft | 2026-07-18 | 修订 `F-010 Tool Icons`；采用官方图标、相近 library icon、统一 Monogram 的静态资源优先级，并排除网站运行时复用 Codex 额度。 |
| 2.4-draft | 2026-07-18 | 接受 `P-018` 为 `F-016 Quick Add Tool`；加入 URL 资料建议、静态 registry Icon 建议、Owner 审核和安全网络边界。 |
| 2.5-draft | 2026-07-18 | 接受 `P-019` 为 `F-017 Search Aliases`；允许在 Add Tool 与 Manage Edit 中维护预置和新增工具的搜索别名。 |
| 2.6-draft | 2026-07-18 | 接受修订后的 `P-020` 为 `F-018 Duplicate Tool Warning`；Aliases 可重复，URL、名称和域名提供非破坏性提示。 |
| 2.7-draft | 2026-07-18 | Owner 选择“够了”，结束开放式功能提案；当前 MVP 功能范围固定为 `F-001` 至 `F-018`，继续剩余产品定义。 |
| 2.8-draft | 2026-07-18 | 确认个人使用频率、10 秒工具打开、90% 集中查找、1 分钟 Quick Add、跨设备一致性和 30 天无数据丢失指标。 |
| 2.9-draft | 2026-07-18 | 确认 Windows 11 Chrome/Edge、Mac Studio M4、iPhone Safari 和 Android Chrome 设备范围；Mac 浏览器与最低版本待确认。 |
| 3.0-draft | 2026-07-18 | 补充确认 Mac Studio M4 Safari/Chrome 与 iPhone Safari/Chrome；最低浏览器和 OS 版本仍待 Development Definition。 |
| 3.1-draft | 2026-07-18 | 确认 Owner-only 私有云数据库为权威数据源，本地仅保留安全会话与临时 UI 状态；平台和区域待 Development Definition。 |
| 3.2-draft | 2026-07-18 | 确认 99.5% 月度可用性、5 秒跨设备刷新、真实保存状态、失败保留输入和独立应用故障排除边界。 |
| 3.3-draft | 2026-07-18 | 确认 Vercel 部署、每月最多 2 小时常规维护、月度检查、48 小时高风险安全响应和托管服务优先。 |
| 3.4-draft | 2026-07-18 | 确认产品应全球可访问；数据库区域优先加拿大，所选供应商无法满足时使用美国区域。 |
| 3.5-draft | 2026-07-18 | 确认滚动支持策略：受安全支持的 OS、浏览器当前与前一主要版本、Android 当前与前两个主要版本。 |
| 3.6-draft | 2026-07-18 | 明确 iPad 与 Android Tablet 不属于正式 MVP 支持范围，仅提供不保证布局、PWA 或测试的 best-effort 访问。 |
| 3.7-draft | 2026-07-18 | 确认键盘操作、焦点、Tooltip、对比度、非颜色状态、reduced motion 和表单错误可识别性基线。 |
| 3.8-draft | 2026-07-18 | 确认 3 秒可操作、500 工具下 200ms 搜索、500ms 触发打开、2 秒保存反馈和移动资源限制。 |
| 3.9-draft | 2026-07-18 | 明确 `Online PS` 是 Owner 使用 Claude Code 开发的在线 Photoshop 类图片编辑器。 |
| 4.0-draft | 2026-07-18 | 确认初始工具 Tag mapping，并补全从安全基础到发布验证的 MVP Roadmap。 |
| 4.1-draft | 2026-07-18 | Discovery/Personal Value 与 Product Definition Gate 通过；进入 Product Freeze 等待独立明确授权。 |
| 4.1-freeze | 2026-07-18 | Owner 明确授权 Product Freeze；冻结 `F-001` 至 `F-018`，并进入 Design Definition。 |
| 4.2-draft | 2026-07-19 | 保持 `F-001` 至 `F-018` 不变，重新打开产品规格以明确 Theme+Settings 组合、Sidebar Workspace helper、默认宽屏 Favs/All 左列与 Recent 右列，以及 Recent 大面板嵌套紧凑条目。 |
| 4.3-draft | 2026-07-19 | 明确满高不越界的 Dashboard、单行横向滚动 Favs、默认 List/可切 Grid 的 All、右栏 Quick Access+Recent 固定高度组合、隐藏 scrollbar 的内部滚动，以及更强的分层渐变要求；Quick Access 数据来源保留为 TBD。 |
| 4.4-draft | 2026-07-19 | 解决 Quick Access 数据来源：仅显示 Owner 手动 Pin 的工具；在 Add/Edit/Manage 提供 Pin 控件，定义最近 Pin 优先、跨设备同步、隐藏工具行为、失败回滚和空状态。 |
| 4.5-draft | 2026-07-19 | 明确 Main 为完整玻璃大 Card、Navbar 无独立 Card 背景、Owner Account 为透明玻璃 Card；新增 All List 的 1/2/3 列宽度响应、Theme/Settings 深色阴影、三处底部基线对齐及 Quick Access/Recent 单行说明。 |
| 4.6-draft | 2026-07-19 | 明确宽屏 Dashboard 首屏完整呈现且无整体纵向滚动；溢出仅在固定高度 Cards 内使用指定 x/y 轴滚动；要求 Sidebar、Main、Welcome、Quick Access、All、Recent 使用六套不同方向材质，并区分青色 Card 边缘光与 Search 深色阴影。 |
| 4.7-draft | 2026-07-19 | 禁止嵌套集合初始或停止滚动时显示半张 Card；为 All List/Grid 补充 Favorite Star；将 All Grid 改为稳定两行；取消宽屏内容宽度封顶并增加完整可见列；加入 `All` 筛选入口，并上移 Quick Access 以扩大 Recent。 |
| 4.8-draft | 2026-07-19 | 按新参考图将超宽 Dashboard 改为工具区、访问区、Widget 区三段结构；新增内部 Calendar 与 To-Do 功能、跨设备同步及完整验收标准；采用更明亮的蓝—靛紫—青色玻璃环境光，同时明确不接入第三方日历或任务服务。 |
| 4.9-draft | 2026-07-20 | 允许 Quick Access、Recent、Calendar、To-Do 通过独立手柄在两条辅助列内排序或跨列移动；空列自动收起形成两列布局并可通过 Drop zone 恢复；主工具区自动扩展，Welcome 仅变宽，Favs/All 增加完整可见项目；补充整列滚动、键盘替代、同步与验收规则。 |
| 4.10-draft | 2026-07-20 | 明确 Mobile View 完全移除固定 Sidebar 与占位宽度，由 Navbar 左侧单一菜单 Icon 打开覆盖式左侧 Drawer；补充 Drawer 内容、关闭方式、背景锁定、焦点返回和 iPhone 安全区验收。 |
| 4.11-draft | 2026-07-20 | 将 Mobile Welcome 的 `Add Tool` 移至 `Your tools, one place.` 下方并左对齐，使用紧凑内容宽度；保留桌面 Welcome 的右侧 Action 布局。 |
| 4.12-draft | 2026-07-20 | 将隐藏 scrollbar 提升为全产品要求，覆盖页面和所有嵌套横向/纵向滚动区域；禁止 scrollbar gutter 影响响应式宽度与 gap，同时保留完整指针、触摸和键盘滚动能力。 |
| 4.13-draft | 2026-07-20 | 移除 Dashboard 外围纯黑遮罩/letterbox，要求蓝—青—靛紫环境背景铺满 viewport；保留的视觉间距必须来自同一背景上的内部 padding 与 gap。 |
| 4.14-draft | 2026-07-20 | 取消 Mobile Calendar 的桌面固定宽度与 Widget 列约束，使其填满 Main 可用宽度；七列日期网格按容器等宽响应，禁止右侧空白和页面横向滚动。 |
| 4.15-draft | 2026-07-20 | 为 Calendar 增加全断点内容包含规则：Card 高度必须容纳 Header、导航、weekday、六行日期、状态效果和底部 padding；空间不足时增长或由辅助列滚动，禁止日期越过边框。 |
| 4.16-draft | 2026-07-20 | 取消卡片与 Dashboard 大背景的既有渐变、色值、径向光源和颜色方向要求；保留功能、结构、层级、响应式与可访问性，等待新的 Claude Design HTML 成为视觉重构来源。 |
| 4.17-draft | 2026-07-20 | 在不恢复旧渐变系统的前提下，为 Card 增加偏蓝 Indigo 的极浅半透明统一色罩及克制内/边缘高光；父子 Card 用轻微透明度差异分层，大背景仍保持未指定。 |
| 4.18-draft | 2026-07-20 | 将桌面展开 Sidebar 与收缩 rail 外壳明确为无色完全透明：不使用填充、色罩、渐变、磨砂模糊、外壳边框或阴影，让最终 Dashboard 大背景原样清晰透出；局部导航状态与底部独立 Cards 继续保证可读性，Mobile Drawer 保持独立。 |
