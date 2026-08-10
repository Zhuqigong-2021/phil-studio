"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  FiBell,
  FiBookOpen,
  FiBox,
  FiChevronDown,
  FiClock,
  FiCloud,
  FiEdit3,
  FiFileText,
  FiGrid,
  FiHeart,
  FiHome,
  FiImage,
  FiMapPin,
  FiMenu,
  FiMonitor,
  FiPlus,
  FiSearch,
  FiSettings,
  FiShield,
  FiStar,
  FiUpload,
  FiUser,
  FiUsers,
  FiVideo,
  FiX,
  FiZap,
} from "react-icons/fi";
import {
  PiHandWaving,
  PiRobot,
  PiSparkleFill,
  PiSquaresFour,
} from "react-icons/pi";
import { TOOLS_RAW } from "@/lib/dashboard/mock-data";
import styles from "./page.module.css";

type IconType = ComponentType<{ "aria-hidden"?: boolean }>;

const toolIcons: Record<string, IconType> = {
  ap: FiEdit3,
  cv: FiFileText,
  ps: FiImage,
  pdf: FiBookOpen,
  am: FiVideo,
  mm: PiSquaresFour,
  sm: FiMonitor,
  no: FiBox,
  ai: PiRobot,
};

const toolColors = [
  "#4f7cf3",
  "#21c99a",
  "#8b5cf6",
  "#f08a38",
  "#e64b8a",
  "#8b5cf6",
  "#397ce8",
  "#ed7444",
  "#1fbd8c",
];

const navItems = [
  { label: "Dashboard", icon: FiHome },
  { label: "All Tools", icon: FiGrid },
  { label: "Favorites", icon: FiHeart },
  { label: "Recent Activity", icon: FiClock },
  { label: "Settings", icon: FiSettings },
];

const metrics = [
  { value: "48", label: "Total Tools", note: "+12 this month", icon: PiSquaresFour, color: "#7654e8" },
  { value: "15", label: "AI Agents", note: "5 active", icon: PiRobot, color: "#19bd8f" },
  { value: "23", label: "Favorites", note: "+8 this month", icon: FiStar, color: "#347cda" },
  { value: "1,098", label: "Total Users", note: "+23 this week", icon: FiUsers, color: "#7958e8" },
  { value: "97%", label: "System Uptime", note: "Excellent", icon: FiShield, color: "#2871ca" },
];

const recentItems = [
  { text: "Opened StudyMate learning workspace", time: "2m ago", icon: FiMonitor, color: "#3f80ee" },
  { text: "Created a mindmap for project planning", time: "15m ago", icon: PiSquaresFour, color: "#22bd92" },
  { text: "Edited a design in Online PS", time: "1h ago", icon: FiImage, color: "#e65391" },
  { text: "Updated the Arts Portfolio", time: "2h ago", icon: FiEdit3, color: "#397be0" },
  { text: "Exported a document from PDF Editor", time: "3h ago", icon: FiFileText, color: "#ed8b37" },
];

export default function DashboardPreviewPage() {
  const [query, setQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [notice, setNotice] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileImageFailed, setProfileImageFailed] = useState(false);

  useEffect(() => {
    let activeRequest = true;

    async function loadProfileImage() {
      const response = await fetch("/api/auth/session");
      if (!response.ok) return;

      const session = (await response.json()) as { user?: { image?: string | null } } | null;
      if (activeRequest && session?.user?.image) {
        setProfileImage(session.user.image);
      }
    }

    void loadProfileImage();

    return () => {
      activeRequest = false;
    };
  }, []);

  const visibleTools = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return TOOLS_RAW.filter((tool) =>
      normalized
        ? `${tool.name} ${tool.tags.join(" ")}`.toLowerCase().includes(normalized)
        : true,
    );
  }, [query]);

  function showNotice(message: string) {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 1800);
  }

  return (
    <main className={`${styles.canvas} ${darkMode ? styles.dark : ""}`}>
      <section className={styles.appShell}>
        <div className={styles.background} aria-hidden="true" />
        <button
          className={styles.mobileMenu}
          type="button"
          aria-label="Toggle navigation"
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>

        <aside className={`${styles.sidebar} ${mobileOpen ? styles.sidebarOpen : ""}`}>
          <div className={styles.brand}>
            <span className={styles.brandMark}>P</span>
            <span>
              <strong>Phil&apos;s studio</strong>
              <small>Your tools, one place.</small>
            </span>
          </div>

          <nav className={styles.nav} aria-label="Dashboard navigation">
            <button
              type="button"
              className={activeNav === "Dashboard" ? styles.navActive : undefined}
              onClick={() => {
                setActiveNav("Dashboard");
                setMobileOpen(false);
              }}
            >
              <FiHome /><span>Dashboard</span>
            </button>

            <p>AI TOOLS</p>
            {TOOLS_RAW.slice(0, 7).map((tool) => {
              const Icon = toolIcons[tool.id] ?? FiZap;
              return (
                <button
                  type="button"
                  key={tool.id}
                  onClick={() => {
                    setActiveNav(tool.name);
                    setMobileOpen(false);
                  }}
                >
                  <Icon /><span>{tool.name}</span>
                </button>
              );
            })}

            <p>SYSTEM</p>
            {navItems.slice(2).map(({ label, icon: Icon }) => (
              <button
                type="button"
                key={label}
                className={activeNav === label ? styles.navActive : undefined}
                onClick={() => {
                  setActiveNav(label);
                  setMobileOpen(false);
                }}
              >
                <Icon /><span>{label}</span>
              </button>
            ))}
          </nav>

          <article className={styles.planCard}>
            <h3><PiSparkleFill /> Pro Plan</h3>
            <p>Unlock all features and premium tools.</p>
            <button type="button" onClick={() => showNotice("Upgrade flow opened")}>
              Upgrade Now <span>→</span>
            </button>
          </article>
        </aside>

        <section className={styles.workspace}>
          <div className={styles.scrollArea}>
            <header className={styles.topbar}>
              <label className={styles.search}>
                <FiSearch />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search tools, agents, files..."
                  aria-label="Search tools, agents, files"
                />
                <kbd>⌘ K</kbd>
              </label>

              <div className={styles.topActions}>
                <button
                  className={styles.themeToggle}
                  type="button"
                  onClick={() => setDarkMode((current) => !current)}
                  aria-label="Toggle theme"
                >
                  <span>Light</span><i className={darkMode ? styles.toggleOn : undefined}><b /></i><span>Dark</span>
                </button>
                <button className={styles.notification} type="button" aria-label="Notifications">
                  <FiBell /><i />
                </button>
                <button className={styles.profile} type="button">
                  <span className={styles.profileMark}>
                    {profileImage && !profileImageFailed ? (
                      <Image
                        src={profileImage}
                        alt="Phil's profile photo"
                        width={48}
                        height={48}
                        onError={() => setProfileImageFailed(true)}
                      />
                    ) : (
                      <FiUser aria-hidden="true" />
                    )}
                  </span>
                  <span><strong>Phil</strong><small>Pro Plan</small></span>
                  <FiChevronDown />
                </button>
              </div>
            </header>

            <section className={styles.hero}>
              <div className={styles.welcome}>
                <h1>Bonjour, Phil! <PiHandWaving aria-hidden="true" /></h1>
                <p>Welcome to your AI Tools Dashboard</p>
                <span><FiMapPin /> Montréal, Canada</span>
              </div>

              <aside className={styles.heroSide}>
                <article className={styles.weather}>
                  <FiCloud />
                  <div><strong>18°C</strong><span>Montréal</span></div>
                  <i />
                  <div><strong>Friday</strong><span>May 30, 2025</span></div>
                  <i />
                  <strong>10:30 PM</strong>
                </article>

                <article className={styles.quickAccess}>
                  <h2>Quick Access</h2>
                  <div>
                    <button type="button" onClick={() => showNotice("Add Tool opened")}><span><FiPlus /></span>Add Tool</button>
                    <button type="button" onClick={() => showNotice("Create Agent opened")}><span><PiRobot /></span>Create Agent</button>
                    <button type="button" onClick={() => showNotice("Upload opened")}><span><FiUpload /></span>Upload File</button>
                    <button type="button" onClick={() => showNotice("AI Chat opened")}><span><PiSparkleFill /></span>AI Chat</button>
                  </div>
                </article>
              </aside>
            </section>

            <section className={styles.metrics} aria-label="Workspace metrics">
              {metrics.map(({ value, label, note, icon: Icon, color }) => (
                <article key={label}>
                  <span style={{ color }}><Icon /></span>
                  <div>
                    <strong>{value}</strong>
                    <p>{label}</p>
                    <small style={{ color }}>{note}</small>
                  </div>
                </article>
              ))}
            </section>

            <section className={styles.lowerGrid}>
              <article className={styles.toolsPanel}>
                <header>
                  <h2>My AI Tools</h2>
                  <button type="button" onClick={() => setQuery("")}>View All</button>
                </header>
                <div className={styles.toolGrid}>
                  {visibleTools.map((tool, index) => {
                    const Icon = toolIcons[tool.id] ?? FiZap;
                    const color = toolColors[index % toolColors.length];
                    return (
                      <button
                        type="button"
                        key={tool.id}
                        onClick={() => showNotice(`${tool.name} selected`)}
                      >
                        <span
                          style={{
                            color,
                            backgroundColor: `${color}0d`,
                            borderColor: `${color}16`,
                          }}
                        >
                          <Icon />
                        </span>
                        <strong>{tool.name}</strong>
                      </button>
                    );
                  })}
                  {visibleTools.length === 0 && <p className={styles.empty}>No tools match “{query}”.</p>}
                </div>
              </article>

              <article className={styles.activityPanel}>
                <header>
                  <h2>Recent Activity</h2>
                  <button type="button">View All</button>
                </header>
                <div className={styles.activityList}>
                  {recentItems.map(({ text, time, icon: Icon, color }) => (
                    <div key={text}>
                      <span style={{ color }}><Icon /></span>
                      <p>{text}</p>
                      <time>{time}</time>
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </div>
        </section>

        {notice && <div className={styles.toast} role="status">{notice}</div>}
      </section>
    </main>
  );
}
