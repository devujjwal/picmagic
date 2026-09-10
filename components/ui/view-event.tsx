"use client";
import { useEffect } from "react";
import { track } from "@/lib/analytics";
export function CategoryView({ category }: { category: string }) {
  useEffect(() => {
    track("category_view", { category });
  }, [category]);
  return null;
}
