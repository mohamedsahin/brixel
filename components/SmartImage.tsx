"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// Photo with a graceful striped-placeholder fallback (so a missing/blocked
// image never looks broken). Plain <img> on purpose for simple onError handling.
export function SmartImage({
  src,
  label,
  className,
  style,
}: {
  src: string;
  label: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={cn("ph relative overflow-hidden", className)} style={style}>
      {(!loaded || failed) && <span className="lbl">{label}</span>}
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={label}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
          style={{ opacity: loaded ? 1 : 0 }}
        />
      )}
    </div>
  );
}
