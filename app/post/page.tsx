"use client";

import React, { useState } from "react";
import { PostForm } from "@/components/PostForm";
import { trpc } from "@/app/_trpc/client";

export default function PostBlogPage() {
  const utils = trpc.useContext(); // cache utils to invalidate queries after success [web:215]
  const [successMsg, setSuccessMsg] = useState<string | null>(null); // local confirmation state [web:234]

  const addPost = trpc.addPost.useMutation({
    onSuccess: async () => {
      setSuccessMsg("Post created successfully."); // show confirmation [web:245]
      await utils.getPosts.invalidate(); // refresh any feeds that list posts [web:215]
    },
    onError: () => {
      setSuccessMsg(null); // hide banner on error [web:234]
    },
  });

  return (
    <div className="mx-auto max-w-xl px-3 py-8">
      <h2 className="mb-6 text-2xl font-bold text-slate-900 dark:text-slate-100">Post a new blog</h2>

      {/* Success banner */}
      {successMsg && (
        <div className="mb-4 rounded-md border border-emerald-300 bg-emerald-50 px-4 py-2 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
          {successMsg}
        </div>
      )}

      <div className="rounded-xl bg-white/10 p-6 shadow-lg dark:bg-slate-900/60">
        <PostForm addPost={addPost} />
      </div>
    </div>
  );
}
