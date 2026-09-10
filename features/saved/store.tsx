"use client";
import { createContext, useContext, useSyncExternalStore } from "react";
const key = "picmagic:saved:v1",
  recentKey = "picmagic:recent:v1";
let fallback: Record<string, string> = {};
const empty = "[]";
function read(key: string) {
  try {
    const value = fallback[key] ?? localStorage.getItem(key) ?? empty;
    const parsed: unknown = JSON.parse(value);
    return Array.isArray(parsed) && parsed.every((x) => typeof x === "string")
      ? value
      : empty;
  } catch {
    return fallback[key] || empty;
  }
}
function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("picmagic:storage", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("picmagic:storage", callback);
  };
}
export function writeIds(key: string, ids: string[]) {
  const text = JSON.stringify([...new Set(ids)]);
  try {
    localStorage.setItem(key, text);
    delete fallback[key];
  } catch {
    fallback = { ...fallback, [key]: text };
  }
  window.dispatchEvent(new Event("picmagic:storage"));
}
export function useIds(storageKey = key) {
  const raw = useSyncExternalStore(
    subscribe,
    () => read(storageKey),
    () => empty,
  );
  return JSON.parse(raw) as string[];
}
export function useSaved() {
  const ids = useIds();
  return {
    ids,
    toggle: (id: string) =>
      writeIds(
        key,
        ids.includes(id) ? ids.filter((x) => x !== id) : [id, ...ids],
      ),
  };
}
export function useRecent() {
  return useIds(recentKey);
}
export function recordRecent(id: string) {
  writeIds(
    recentKey,
    [
      id,
      ...(JSON.parse(read(recentKey)) as string[]).filter((x) => x !== id),
    ].slice(0, 20),
  );
}
const NoticeContext = createContext<(message: string) => void>(() => {});
export const NoticeProvider = NoticeContext.Provider;
export const useNotice = () => useContext(NoticeContext);
