"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import { PostForm } from "@/components/PostForm";

export default function EditFormClient({
  initial,
}: {
  initial: {
    id: number;
    title: string;
    content: string; // HTML from editor
    author: string;
    imageUrl?: string | null;
    category?: string | null;
    status?: "draft" | "published"; // include status for badge + default
  };
}) {
  const router = useRouter();
  const updatePost = trpc.updatePost.useMutation({
    onSuccess: () => {
      router.push("/dashboard");
    },
  });

  return (
    <PostForm
      mode="edit"
      initialValues={{
        id: initial.id,
        title: initial.title,
        content: initial.content, // pass HTML
        author: initial.author,
        imageUrl: initial.imageUrl ?? "",
        category: initial.category ?? "General",
        status: initial.status ?? "draft",
      }}
      updatePost={updatePost}
      onSuccess={() => router.refresh()}
    />
  );
}
