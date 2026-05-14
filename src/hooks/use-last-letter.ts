import { useEffect, useState } from "react";
import type { LetterId } from "@/data/letters";

const KEY = "dispute-playbook:last-letter";

export function useLastLetter(): LetterId | null {
  const [id, setId] = useState<LetterId | null>(null);
  useEffect(() => {
    try {
      const v = localStorage.getItem(KEY);
      if (v) setId(v as LetterId);
    } catch {
      /* ignore */
    }
    const onStorage = (e: StorageEvent) => {
      if (e.key === KEY) setId((e.newValue as LetterId | null) ?? null);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return id;
}

export function rememberLetter(id: LetterId) {
  try {
    localStorage.setItem(KEY, id);
  } catch {
    /* ignore */
  }
}
