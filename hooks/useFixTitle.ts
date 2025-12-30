"use client";

import { useEffect } from "react";

export function useFixTitle(title: string = "Cahsia") {
  useEffect(() => {
    if (document.title !== title) {
      document.title = title;
    }
  }, [title]);
}
