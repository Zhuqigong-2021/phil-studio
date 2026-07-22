"use client";

import Link from "next/link";
import type { ShellState } from "@/hooks/useShellState";

export type PageKey = "dashboard" | "all" | "favs" | "recent" | "manage";

interface SidebarProps {
  state: ShellState;
  variant?: "desktop" | "mobile";
  active: PageKey;
  /** Secondary pages (All/Favs/Recent/Manage) use a solid glass sidebar; Dashboard uses a transparent shell. */
  solid?: boolean;
}

const NAV_ITEMS: { key: PageKey; name: string; href: string; icon: React.ReactNode }[] = [
  {
    key: "dashboard",
    name: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="9" rx="1" /><rect x="14" y="3" width="7" height="5" rx="1" />
        <rect x="14" y="12" width="7" height="9" rx="1" /><rect x="3" y="16" width="7" height="5" rx="1" />
      </svg>
    ),
  },
  {
    key: "all",
    name: "All",
    href: "/all",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    key: "favs",
    name: "Favs",
    href: "/favs",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <path d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14l-5-4.87 6.91-1.01L12 2z" />
      </svg>
    ),
  },
  {
    key: "recent",
    name: "Recent",
    href: "/recent",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 3" />
      </svg>
    ),
  },
  {
    key: "manage",
    name: "Manage",
    href: "/manage",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="4" y1="7" x2="20" y2="7" /><circle cx="9" cy="7" r="2" />
        <line x1="4" y1="17" x2="20" y2="17" /><circle cx="15" cy="17" r="2" />
      </svg>
    ),
  },
];

export default function Sidebar({ state, variant = "desktop", active, solid = false }: SidebarProps) {
  const { showLabels, sidebarWidth, closeMobileDrawer, toggleSidebar, profileMenuOpen, toggleProfileMenu, closeProfileMenu, goLogout } = state;
  const navJustify = showLabels ? "flex-start" : "center";
  const brandJustify = showLabels ? "flex-start" : "center";
  const toggleAlign = showLabels ? "flex-end" : "center";
  const chromeBg = solid ? "rgba(255,255,255,0.05)" : "transparent";

  return (
    <div
      className={variant === "mobile" ? "sidebar-panel mobile-open glass-shine-card" : "sidebar-panel glass-shine-card"}
      style={{
        position: "relative",
        zIndex: variant === "mobile" ? 60 : 1,
        width: variant === "mobile" ? 240 : sidebarWidth,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        borderRadius: 20,
        backdropFilter: variant === "mobile" ? "blur(26px) saturate(150%)" : "blur(16px) saturate(160%) brightness(1.15)",
        WebkitBackdropFilter: variant === "mobile" ? "blur(26px) saturate(150%)" : "blur(16px) saturate(160%) brightness(1.15)",
        background: variant === "mobile" ? "rgba(8,15,48,.96)" : solid ? "rgba(15,26,64,.32)" : "rgba(255,255,255,.02)",
        border: variant === "mobile" ? "1px solid rgba(125,190,255,.28)" : solid ? "1px solid rgba(125,190,255,.14)" : "1px solid rgba(255,255,255,.14)",
        boxShadow: variant === "mobile" ? "0 24px 64px rgba(0,4,20,.62), inset 0 1px 0 rgba(255,255,255,.1)" : solid ? "0 18px 42px rgba(0,4,20,.26), inset 0 1px 0 rgba(255,255,255,.06)" : "0 18px 42px rgba(0,4,20,.20)",
        padding: 16,
        boxSizing: "border-box",
        transition: "width 0.2s ease-in-out, box-shadow .3s ease, border-color .3s ease",
      }}
    >
      <div style={{ height: 48, display: "flex", alignItems: "center", gap: 10, padding: "0 2px", justifyContent: brandJustify }}>
        <div style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, background: "linear-gradient(120deg,#3B82F6,#8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 17, color: "#fff" }}>P</div>
        {showLabels && (
          <div style={{ display: "flex", flexDirection: "column", minWidth: 0, flex: 1 }}>
            <span style={{ fontSize: 15, fontWeight: 700, whiteSpace: "nowrap" }}>Phil&apos;s studio</span>
            <span style={{ fontSize: 10, color: "#A9B2C3", whiteSpace: "nowrap" }}>Your tools, one place.</span>
          </div>
        )}
        {variant === "mobile" && (
          <button
            onClick={closeMobileDrawer}
            aria-label="Close menu"
            style={{ width: 28, height: 28, flexShrink: 0, borderRadius: 8, background: chromeBg, border: "1px solid rgba(186,230,253,0.16)", color: "#A9B2C3", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#A9B2C3" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg>
          </button>
        )}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 14 }}>
        {NAV_ITEMS.map((item) =>
          item.key === active ? (
            <div
              key={item.key}
              className="sidebar-nav-active"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 13,
                background: "linear-gradient(120deg, rgba(37,99,235,.94) 0%, rgba(79,70,229,.92) 62%, rgba(59,130,246,.88) 100%)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,.30), 0 5px 16px rgba(59,130,246,.24)",
                justifyContent: navJustify,
                cursor: "default",
                color: "#F5F7FF",
              }}
            >
              {item.icon}
              {showLabels && <span style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>{item.name}</span>}
            </div>
          ) : (
            <Link
              key={item.key}
              href={item.href}
              className="sidebar-nav-link"
              style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 13, color: "#A9B2C3", justifyContent: navJustify }}
            >
              {item.icon}
              {showLabels && <span style={{ fontSize: 14, fontWeight: 600, whiteSpace: "nowrap" }}>{item.name}</span>}
            </Link>
          ),
        )}
      </div>

      {variant === "desktop" && (
        <button
          onClick={toggleSidebar}
          aria-label="Toggle sidebar width"
          style={{ marginTop: 10, alignSelf: toggleAlign, width: 32, height: 32, borderRadius: 9, background: chromeBg, border: "1px solid rgba(186,230,253,0.16)", color: "#A9B2C3", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A9B2C3" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" /><line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </button>
      )}

      <div style={{ flex: 1 }} />

      {showLabels && (
        <div style={{ borderRadius: 16, padding: 14, background: chromeBg, border: "1px solid rgba(186,230,253,0.14)", marginBottom: 10 }}>
          <div style={{ fontSize: 13, fontWeight: 600 }}>Make it yours</div>
          <div style={{ fontSize: 12, color: "#A9B2C3", marginTop: 2, lineHeight: 1.4 }}>Add a tool or pin a favorite.</div>
        </div>
      )}

      <div style={{ position: "relative" }}>
        <div
          onClick={toggleProfileMenu}
          style={{ borderRadius: 16, padding: "10px 12px", background: solid ? "rgba(255,255,255,0.045)" : "transparent", border: "1px solid rgba(186,230,253,0.17)", display: "flex", alignItems: "center", gap: 10, justifyContent: navJustify, cursor: "pointer" }}
        >
          <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, background: "linear-gradient(135deg,#3B82F6,#635BFF)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600, fontSize: 13, color: "#fff" }}>P</div>
          {showLabels && (
            <>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Phil</div>
                <div style={{ fontSize: 11, color: "#A9B2C3", whiteSpace: "nowrap" }}>Personal workspace</div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A9B2C3" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginLeft: 16 }}>
                <path d="m6 9 6 6 6-6" />
              </svg>
            </>
          )}
        </div>
        {profileMenuOpen && (
          <div
            style={{ position: "absolute", bottom: "calc(100% + 8px)", left: 0, right: 0, borderRadius: 14, padding: 6, background: "rgba(15,26,64,.96)", backdropFilter: "blur(18px) saturate(170%) brightness(1.2)", WebkitBackdropFilter: "blur(18px) saturate(170%) brightness(1.2)", border: "1px solid rgba(125,190,255,.22)", boxShadow: "0 16px 38px rgba(0,4,20,.32)", zIndex: 70 }}
          >
            <div
              onClick={closeProfileMenu}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 9, fontSize: 13, fontWeight: 600, color: "#F2F6FF", cursor: "pointer" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#A9B2C3" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
              Account Settings
            </div>
            <div
              onClick={goLogout}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 9, fontSize: 13, fontWeight: 600, color: "#FCA5A5", cursor: "pointer" }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FCA5A5" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" />
              </svg>
              Logout
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
