"use client";

import { useEffect } from "react";

export function CaptureMode() {
  useEffect(() => {
    document.body.classList.add("capture-mode");

    return () => {
      document.body.classList.remove("capture-mode");
    };
  }, []);

  return null;
}
