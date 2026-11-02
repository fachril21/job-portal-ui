"use client";

import { useEffect, useState, type ReactNode } from "react";
import { DemoPanel } from "@/components/demo/DemoPanel";
import { Toaster } from "@/components/ui/overlay";
import { useStore } from "@/lib/store";

/** Menunggu data tersimpan dimuat dari browser sebelum merender, agar tidak terjadi mismatch hydration. */
export function Providers({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const demo = new URLSearchParams(window.location.search).get("demo");
    if (demo === "off") useStore.getState().setDemoEnabled(false);
    if (demo === "on") useStore.getState().setDemoEnabled(true);
    setReady(true);
  }, []);

  if (!ready) {
    return <div className="grid min-h-dvh place-items-center text-sm text-muted" aria-busy="true">Memuat prototype…</div>;
  }
  return (
    <>
      {children}
      <Toaster />
      <DemoPanel />
    </>
  );
}
