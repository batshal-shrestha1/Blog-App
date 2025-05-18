"use client";
import { useEffect } from "react";

export function IncrementViews({ postId }: { postId: number }) {
  useEffect(() => {
    import("@/app/post/[urlId]/actions").then(({ incrementPostViews }) => {
      incrementPostViews(postId);
    });
  }, [postId]);
  return null;
} 