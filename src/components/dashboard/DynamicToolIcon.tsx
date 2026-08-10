"use client";

import {
  Component,
  lazy,
  Suspense,
  type ComponentType,
  type ReactNode,
} from "react";
import { AppWindow, type LucideIcon, type LucideProps } from "lucide-react";
import dynamicIconImports from "lucide-react/dynamicIconImports.mjs";
import {
  DEFAULT_TOOL_ICON_KEY,
  getToolIcon,
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

type IconModule = { default: LucideIcon };
type IconLoader = () => Promise<IconModule>;

const loaders = dynamicIconImports as unknown as Record<string, IconLoader>;
const lazyIcons = new Map<string, ComponentType<LucideProps>>();

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
  const lucideName = metadata.lucideName ?? metadata.key;
  const cached = lazyIcons.get(lucideName);

  if (cached) return cached;

  const loader = loaders[lucideName] ?? loaders[DEFAULT_TOOL_ICON_KEY];
  const Icon = lazy(async () => {
    const module = await loader();
    return { default: module.default };
  });

  lazyIcons.set(lucideName, Icon);
  return Icon;
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
        <Icon {...props} />
      </Suspense>
    </IconLoadBoundary>
  );
}
