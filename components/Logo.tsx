import { cn } from "@/lib/utils";

// Brixel mark: 2×2 rounded squares — three teal, top-right amber — + wordmark.
export function Logo({
  white = false,
  anim = false,
  className,
}: {
  white?: boolean;
  anim?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <span className="grid h-[34px] w-[34px] grid-cols-2 gap-[3px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "rounded-[6px]",
              i === 1 ? "bg-amber" : white ? "bg-white/30" : "bg-teal",
              anim && "logo-brick",
            )}
          />
        ))}
      </span>
      <span className={cn("font-head text-[25px] font-extrabold tracking-tight", white ? "text-white" : "text-teal")}>
        Brixel
      </span>
    </span>
  );
}
