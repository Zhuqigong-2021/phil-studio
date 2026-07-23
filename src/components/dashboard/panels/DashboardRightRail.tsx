import type { DashboardState } from "@/hooks/useDashboardState";
import DateTimeWidget from "./DateTimeWidget";
import WeatherWidget from "./WeatherWidget";
import QuickRecentPanel from "./QuickRecentPanel";
import TodoWidget from "./TodoWidget";

export default function DashboardRightRail({ state }: { state: DashboardState }) {
  return (
    <aside className="dashboard-right-rail noscroll" aria-label="Dashboard overview">
      <DateTimeWidget />
      <WeatherWidget />
      <QuickRecentPanel state={state} />
      <TodoWidget state={state} />
    </aside>
  );
}
