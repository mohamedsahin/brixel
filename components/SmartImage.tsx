"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function SmartImage({
  src,
  label,
  className,
  style,
  priority = false,
}: {
  src: string;
  label: string;
  className?: string;
  style?: React.CSSProperties;
  priority?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={cn("ph relative overflow-hidden", className)} style={style}>
      {failed && <span className="lbl">{label}</span>}
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={label}
          fetchPriority={priority ? "high" : "auto"}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500"
          style={{ opacity: loaded ? 1 : 0 }}
        />
      )}
    </div>
  );
}
