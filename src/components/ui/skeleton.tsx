import { cn } from "@/lib/utils";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "magic-gradient animate-background-shine rounded-md bg-[linear-gradient(110deg,#ececec,45%,#f5f5f5,55%,#ececec)]",
        className
      )}
    />
  );
}

export { Skeleton };


