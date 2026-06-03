import {
  Sprout,
  ShoppingBag,
  Award,
  Blocks,
  HeartPulse,
  type LucideIcon,
} from "lucide-react";
import type { PackageKey } from "@/lib/packages";

// Package → Lucide icon (open-source, MIT). Used in the rounded brand tiles.
export const PACKAGE_ICON: Record<PackageKey, LucideIcon> = {
  starter: Sprout,
  store: ShoppingBag,
  pro: Award,
  custom: Blocks,
  care: HeartPulse,
};

export function PkgIcon({ pkgKey, size = 28 }: { pkgKey: PackageKey; size?: number }) {
  const Ico = PACKAGE_ICON[pkgKey] ?? Sprout;
  return <Ico size={size} strokeWidth={1.9} />;
}
