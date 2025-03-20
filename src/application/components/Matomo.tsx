"use client";

import { MatomoService } from "@/infrastructure/matomo";
import { useEffect } from "react";

export function Matomo() {
  useEffect(() => {
    MatomoService.initialize();
  }, []);
  return null;
}
