"use client";

import { useEffect, useState } from "react";

type ClickPulse = {
  id: number;
  x: number;
  y: number;
  variant: "default" | "interactive";
};

function isIgnoredTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(
    target.closest("input, textarea, select, option, [contenteditable='true'], [data-disable-click-effect='true']")
  );
}

function isInteractiveTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest("a, button, [role='button'], summary, label"));
}

export function ClickPulseEffect() {
  const [pulses, setPulses] = useState<ClickPulse[]>([]);

  useEffect(() => {
    let nextId = 0;

    function handlePointerDown(event: PointerEvent) {
      if (event.pointerType === "touch" || isIgnoredTarget(event.target)) return;

      const id = nextId++;
      const variant = isInteractiveTarget(event.target) ? "interactive" : "default";
      setPulses((current) => [...current.slice(-8), { id, x: event.clientX, y: event.clientY, variant }]);
      window.setTimeout(() => {
        setPulses((current) => current.filter((pulse) => pulse.id !== id));
      }, 720);
    }

    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    return () => window.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      {pulses.map((pulse) => (
        <span
          key={pulse.id}
          className={`click-pulse ${pulse.variant === "interactive" ? "click-pulse-interactive" : ""}`}
          style={{ left: pulse.x, top: pulse.y }}
        >
          <span className="click-pulse-core" />
          <span className="click-pulse-scan click-pulse-scan-a" />
          <span className="click-pulse-scan click-pulse-scan-b" />
        </span>
      ))}
    </div>
  );
}
