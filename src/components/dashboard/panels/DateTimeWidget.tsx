"use client";

import { useEffect, useState } from "react";

const timeZone = "America/Toronto";

export default function DateTimeWidget() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const sync = () => setNow(new Date());
    sync();
    const interval = window.setInterval(sync, 30_000);
    return () => window.clearInterval(interval);
  }, []);

  const time = now
    ? new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone }).formatToParts(now)
    : [];
  const clock = time.filter((part) => part.type !== "dayPeriod").map((part) => part.value).join("").trim();
  const period = time.find((part) => part.type === "dayPeriod")?.value ?? "";
  const date = now
    ? new Intl.DateTimeFormat("en-US", { weekday: "long", month: "short", day: "numeric", timeZone }).format(now)
    : "Loading date";
  const zone = now
    ? new Intl.DateTimeFormat("en-US", { timeZone, timeZoneName: "short" })
        .formatToParts(now)
        .find((part) => part.type === "timeZoneName")?.value ?? ""
    : "";

  return (
    <section className="glass-shine-card info-widget" aria-label="Current date and time">
      <div className="info-widget-header">
        <span>Date &amp; Time</span>
        <span className="info-widget-badge">Today</span>
      </div>
      <div className="info-widget-value">{clock || "--:--"} <span>{period}</span></div>
      <div className="info-widget-meta">{date} · Montréal · {zone}</div>
    </section>
  );
}
