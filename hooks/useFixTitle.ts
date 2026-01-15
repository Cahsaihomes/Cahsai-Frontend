"use client";

import { useEffect } from "react";

export function useFixTitle(title: string = "Cahsai") {
  useEffect(() => {
    if (document.title !== title) {
      document.title = title;
    }
  }, [title]);
}
