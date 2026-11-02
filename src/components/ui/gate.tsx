"use client";

import { WifiOff } from "lucide-react";
import type { ReactNode } from "react";
import { useStore } from "@/lib/store";
import { Banner, Button, Skeleton } from "./primitives";

/** Menghormati state layar yang dipaksa dari Demo Panel: loading, kosong, offline. */
export function ScreenGate({ children, empty, skeleton }: { children: ReactNode; empty: ReactNode; skeleton?: ReactNode }) {
  const state = useStore((s) => s.screenState);
  const setScreenState = useStore((s) => s.setScreenState);

  if (state === "loading") {
    return (
      <div aria-busy="true" aria-label="Memuat">
        {skeleton ?? <ListSkeleton />}
      </div>
    );
  }
  if (state === "empty") return <>{empty}</>;
  return (
    <>
      {state === "offline" && (
        <div className="mb-4">
          <Banner tone="warn" action={<Button size="sm" variant="secondary" icon={WifiOff} onClick={() => setScreenState("normal")}>Coba lagi</Button>}>
            Kamu sedang offline. Data terakhir tetap tampil dan perubahan belum terkirim.
          </Banner>
        </div>
      )}
      {children}
    </>
  );
}

export function ListSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-tile border border-line bg-surface p-5">
          <Skeleton className="size-11 !rounded-xl" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-3/5" />
          </div>
          <Skeleton className="h-6 w-20 !rounded-full" />
        </div>
      ))}
    </div>
  );
}
