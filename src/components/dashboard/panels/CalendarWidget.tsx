"use client";

import { useEffect, useMemo, useState } from "react";
import type { DashboardState } from "@/hooks/useDashboardState";

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function isSameLocalDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function CalendarWidget({ state }: { state: DashboardState }) {
  const { weekdays } = state;
  const [today, setToday] = useState<Date | null>(null);
  const [visibleMonth, setVisibleMonth] = useState<Date | null>(null);

  useEffect(() => {
    const syncToday = () => {
      const current = new Date();
      setToday(current);
      setVisibleMonth((month) => month ?? startOfMonth(current));
    };

    syncToday();
    const interval = window.setInterval(syncToday, 60_000);
    window.addEventListener("focus", syncToday);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", syncToday);
    };
  }, []);

  const calendarDays = useMemo(() => {
    if (!visibleMonth || !today) return [];

    const year = visibleMonth.getFullYear();
    const month = visibleMonth.getMonth();
    const firstGridDay = new Date(year, month, 1 - new Date(year, month, 1).getDay());

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(
        firstGridDay.getFullYear(),
        firstGridDay.getMonth(),
        firstGridDay.getDate() + index,
      );

      return {
        date,
        currentMonth: date.getMonth() === month,
        today: isSameLocalDay(date, today),
      };
    });
  }, [today, visibleMonth]);

  const monthLabel = visibleMonth
    ? new Intl.DateTimeFormat("en-US", {
        month: "long",
        year: "numeric",
      }).format(visibleMonth)
    : "";

  const changeMonth = (offset: number) => {
    setVisibleMonth((month) =>
      month ? new Date(month.getFullYear(), month.getMonth() + offset, 1) : month,
    );
  };

  const returnToToday = () => {
    const current = new Date();
    setToday(current);
    setVisibleMonth(startOfMonth(current));
  };

  const arrowButtonStyle = {
    width: 28,
    height: 28,
    padding: 0,
    border: "none",
    borderRadius: 8,
    background: "transparent",
    color: "#A9B2C3",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  } as const;

  return (
    <div
      className="glass-shine-card"
      style={{
        flexShrink: 0,
        minWidth: 0,
        borderRadius: 16,
        padding: "14px 16px",
        boxSizing: "border-box",
        background:
          "linear-gradient(165deg, rgba(165,180,255,.055) 0%, rgba(99,102,241,.04) 40%, rgba(10,20,50,.16) 100%)",
        backdropFilter:
          "blur(2px) saturate(185%) brightness(1.28) contrast(1.08)",
        WebkitBackdropFilter:
          "blur(2px) saturate(185%) brightness(1.28) contrast(1.08)",
        border: "1px solid rgba(139,157,255,.26)",
        boxShadow:
          "inset 0 1.5px 0 rgba(210,220,255,.18), inset 0 0 28px rgba(99,102,241,.04), 0 18px 40px rgba(0,4,20,.26)",
        overflow: "hidden",
        width: "100%",
        height: 318,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, letterSpacing: 0.3 }}>
          Calendar
        </div>
        <button
          type="button"
          onClick={returnToToday}
          style={{
            height: 24,
            padding: "0 10px",
            borderRadius: 8,
            background: "rgba(59,130,246,.16)",
            border: "1px solid rgba(59,130,246,.45)",
            color: "#93C5FD",
            fontSize: 10.5,
            fontWeight: 700,
            cursor: "pointer",
          }}
        >
          Today
        </button>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginTop: 6,
        }}
      >
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => changeMonth(-1)}
          style={arrowButtonStyle}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>
        <div style={{ fontSize: 12, fontWeight: 650, letterSpacing: 0.4 }}>
          {monthLabel}
        </div>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => changeMonth(1)}
          style={arrowButtonStyle}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7,minmax(0,1fr))",
          gap: 3,
          marginTop: 4,
        }}
      >
        {weekdays.map((weekday) => (
          <div
            key={weekday}
            style={{
              fontSize: 9,
              color: "#7C8698",
              textAlign: "center",
              fontWeight: 600,
            }}
          >
            {weekday}
          </div>
        ))}
        {calendarDays.map(({ date, currentMonth, today: isToday }) => (
          <div
            key={`${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`}
            aria-current={isToday ? "date" : undefined}
            style={{
              width: "min(100%, 40px)",
              aspectRatio: "1",
              minWidth: 0,
              justifySelf: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 6,
              fontSize: "clamp(8px,2.6vw,10.5px)",
              color: isToday
                ? "#FFFFFF"
                : currentMonth
                  ? "#F2F6FF"
                  : "#4B5878",
              background: isToday
                ? "linear-gradient(135deg,rgba(37,99,235,.82) 0%,rgba(79,70,229,.76) 100%)"
                : "transparent",
              boxShadow: isToday
                ? "inset 0 1px 0 rgba(219,234,254,.22), 0 0 0 1px rgba(147,197,253,.46), 0 4px 10px rgba(30,64,175,.20)"
                : "none",
              fontWeight: isToday ? 700 : 500,
              overflow: "hidden",
            }}
          >
            {date.getDate()}
          </div>
        ))}
      </div>
    </div>
  );
}
