"use client";

import {
  Component,
  createElement,
  lazy,
  Suspense,
  type ComponentType,
  type ReactNode,
} from "react";
import { AppWindow, type LucideProps } from "lucide-react";
import {
  TOOL_ICON_LOADERS,
  type ToolIconLoader,
} from "@/lib/dashboard/tool-icon-loaders";
import {
  DEFAULT_TOOL_ICON_KEY,
  getToolIcon,
  TOOL_ICONS,
} from "@/lib/dashboard/tool-icons";
import styles from "./DynamicToolIcon.module.css";

interface DynamicToolIconProps extends LucideProps {
  iconKey: string;
}

interface IconLoadBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface IconLoadBoundaryState {
  failed: boolean;
}

function createLazyIcon(loader: ToolIconLoader): ComponentType<LucideProps> {

  return lazy(async () => {
    const loadedIcon = await loader();
    return { default: loadedIcon.default };
  });
}

const lazyIcons = new Map(
  TOOL_ICONS.map((metadata) => {
    const loader =
      TOOL_ICON_LOADERS[metadata.key] ?? TOOL_ICON_LOADERS[DEFAULT_TOOL_ICON_KEY];
    return [metadata.key, createLazyIcon(loader)] as const;
  }),
);

class IconLoadBoundary extends Component<
  IconLoadBoundaryProps,
  IconLoadBoundaryState
> {
  state: IconLoadBoundaryState = { failed: false };

  static getDerivedStateFromError(): IconLoadBoundaryState {
    return { failed: true };
  }

  componentDidCatch(): void {
    // The stable fallback keeps Add Tool usable if an icon chunk cannot load.
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

function getLazyIcon(iconKey: string): ComponentType<LucideProps> {
  const metadata = getToolIcon(iconKey);
  return lazyIcons.get(metadata.key) ?? lazyIcons.get(DEFAULT_TOOL_ICON_KEY)!;
}

export default function DynamicToolIcon({
  iconKey,
  ...props
}: DynamicToolIconProps) {
  const metadata = getToolIcon(iconKey);
  const Icon = getLazyIcon(metadata.key);

  return (
    <IconLoadBoundary
      key={metadata.key}
      fallback={<AppWindow {...props} />}
    >
      <Suspense
        fallback={<span className={styles.placeholder} aria-hidden="true" />}
      >
        {createElement(Icon, props)}
      </Suspense>
    </IconLoadBoundary>
  );
}
