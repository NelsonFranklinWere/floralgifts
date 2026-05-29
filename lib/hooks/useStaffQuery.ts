"use client";

import { useCallback, useEffect, useState } from "react";
import { staffFetch } from "@/lib/staff-client";

export function useStaffQuery<T>(url: string | null, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(() => {
    if (!url) return Promise.resolve();
    setError(null);
    return staffFetch<T>(url)
      .then(setData)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Request failed");
      });
  }, [url]);

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, ...deps]);

  return { data, error, reload, setData };
}
