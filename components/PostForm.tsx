"use client";

import React, { useEffect, useMemo, useState } from "react";
import { RichTextEditor } from "@/components/RichTextEditor";
import { PostPreview } from "@/components/PostPreview";

type CreatePayload = {
  title: string;
  content: string; // HTML from editor
  author: string;
  imageUrl?: string;
  category: string;
  status: "draft" | "published";
};

type UpdatePayload = CreatePayload & { id: number };

interface MutationLike<T> {
  mutate: (data: T) => void;
  isLoading?: boolean;
}

interface PostFormProps {
  mode?: "create" | "edit";
  initialValues?: {
    id?: number;
    title?: string;
    content?: string; // HTML
    author?: string;
    imageUrl?: string | null;
    category?: string | null;
    status?: "draft" | "published" | null;
  };
  addPost?: MutationLike<CreatePayload>;
  updatePost?: MutationLike<UpdatePayload>;
  onSuccess?: () => void;
}

export const PostForm: React.FC<PostFormProps> = ({
  mode = "create",
  initialValues,
  addPost,
  updatePost,
  onSuccess,
}) => {
  const [title, setTitle] = useState(initialValues?.title ?? "");
  const [content, setContent] = useState(initialValues?.content ?? "");
  const [author, setAuthor] = useState(initialValues?.author ?? "");
  const [imageUrl, setImageUrl] = useState(initialValues?.imageUrl ?? "");
  const [category, setCategory] = useState(initialValues?.category ?? "General");
  const [status, setStatus] = useState<"draft" | "published">(
    (initialValues?.status as "draft" | "published") ?? "draft"
  );
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    setTitle(initialValues?.title ?? "");
    setContent(initialValues?.content ?? "");
    setAuthor(initialValues?.author ?? "");
    setImageUrl(initialValues?.imageUrl ?? "");
    setCategory(initialValues?.category ?? "General");
    setStatus((initialValues?.status as "draft" | "published") ?? "draft");
  }, [
    initialValues?.title,
    initialValues?.content,
    initialValues?.author,
    initialValues?.imageUrl,
    initialValues?.category,
    initialValues?.status,
  ]);

  const canSubmit = useMemo(
    () =>
      title.trim() !== "" &&
      content.replace(/<[^>]*>/g, " ").trim() !== "" &&
      author.trim() !== "" &&
      category.trim() !== "",
    [title, content, author, category]
  );

  const busy = Boolean(addPost?.isLoading || updatePost?.isLoading);

  const submit = (desiredStatus: "draft" | "published") => {
    if (!canSubmit || busy) return;

    if (mode === "edit") {
      if (!updatePost || !initialValues?.id) return;
      updatePost.mutate({
        id: initialValues.id,
        title,
        content,
        author,
        imageUrl: imageUrl || undefined,
        category,
        status: desiredStatus,
      });
      onSuccess?.();
      return;
    }

    if (!addPost) return;
    addPost.mutate({
      title,
      content,
      author,
      imageUrl: imageUrl || undefined,
      category,
      status: desiredStatus,
    });
    setTitle("");
    setContent("");
    setAuthor("");
    setImageUrl("");
    setCategory("General");
    setStatus("draft");
    onSuccess?.();
  };

  return (
    <div className="relative mx-auto max-w-[980px]">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -top-10 -left-8 h-40 w-40 rounded-full bg-indigo-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -right-8 h-48 w-48 rounded-full bg-emerald-200/25 blur-3xl" />

      <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white/60 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70">
        {/* gradient hairline */}
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-fuchsia-400/40 via-slate-200 to-emerald-400/40" />

        {/* card header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-white/50 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/60 md:px-6">
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-widest text-slate-600 dark:text-slate-400">
              {mode === "edit" ? "Edit post" : "Create a post"}
            </p>
            <h4 className="text-[18px] font-extrabold leading-tight md:text-[20px]">
              <span className="bg-gradient-to-r from-slate-900 via-indigo-700 to-emerald-700 bg-clip-text text-transparent dark:from-white dark:via-indigo-300 dark:to-emerald-300">
                {mode === "edit" ? "Polish your thoughts" : "Share what matters"}
              </span>
            </h4>
          </div>

          <button
            type="button"
            onClick={() => setShowPreview((s) => !s)}
            className="hidden items-center gap-2 rounded-full border border-slate-300 px-3 py-2 text-[12px] text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800 md:inline-flex"
          >
            {showPreview ? "Hide preview" : "Preview"}
          </button>
        </div>

        {/* form body */}
        <div className="space-y-4 px-5 py-5 md:px-6 md:py-6">
          {/* Title */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Title</label>
            <input
              type="text"
              placeholder="Write a compelling headline"
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Rich text editor */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Content</label>
            <div className="rounded-xl border border-slate-200 bg-white/80 dark:border-slate-700 dark:bg-slate-900/60">
              <RichTextEditor value={content} onChange={setContent} className="rte" />
            </div>
            <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
              Use headings, lists, and code blocks to keep it readable.
            </p>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Author</label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Image URL</label>
              <input
                type="text"
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
                value={imageUrl ?? ""}
                onChange={(e) => setImageUrl(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">Category</label>
              <input
                type="text"
                placeholder="General, Tech, AWS"
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-100"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          {/* Status segmented control */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-700 dark:text-slate-300">Status:</span>
            <div className="inline-flex rounded-full border border-slate-200 bg-white/70 p-1 dark:border-slate-700 dark:bg-slate-900/60">
              <button
                type="button"
                onClick={() => setStatus("draft")}
                className={[
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                  status === "draft"
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
                ].join(" ")}
              >
                Draft
              </button>
              <button
                type="button"
                onClick={() => setStatus("published")}
                className={[
                  "rounded-full px-3 py-1.5 text-xs font-semibold transition",
                  status === "published"
                    ? "bg-emerald-600 text-white"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
                ].join(" ")}
              >
                Published
              </button>
            </div>
          </div>
        </div>

        {/* sticky action bar */}
        <div className="sticky bottom-0 z-10 flex flex-wrap items-center justify-between border-t border-slate-200 bg-white/70 px-5 py-4 backdrop-blur dark:border-slate-800 dark:bg-slate-900/60 md:px-6">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full border border-sky-300 px-4 py-2 text-sky-700 hover:bg-sky-50 dark:border-sky-500/30 dark:text-sky-300 dark:hover:bg-sky-500/10"
            onClick={() => setShowPreview((s) => !s)}
          >
            {showPreview ? "Hide preview" : "Preview"}
          </button>

          <div className="flex items-center gap-2">
            <button
              disabled={!canSubmit || busy}
              className={[
                "inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 text-slate-800",
                !canSubmit || busy ? "cursor-not-allowed opacity-50" : "hover:bg-slate-100",
                "dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800",
              ].join(" ")}
              onClick={() => submit("draft")}
            >
              {busy ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
                  </svg>
                  Saving…
                </span>
              ) : (
                "Save as draft"
              )}
            </button>

            <button
              disabled={!canSubmit || busy}
              className={[
                "inline-flex items-center gap-2 rounded-full border border-emerald-400 px-4 py-2 text-emerald-700",
                !canSubmit || busy ? "cursor-not-allowed opacity-50" : "hover:bg-emerald-50",
                "dark:border-emerald-500/30 dark:text-emerald-300 dark:hover:bg-emerald-500/10",
              ].join(" ")}
              onClick={() => submit("published")}
            >
              {busy ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v3a5 5 0 00-5 5H4z" />
                  </svg>
                  Publishing…
                </span>
              ) : (
                "Publish"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      {showPreview && (
        <div className="mt-6">
          <div className="rounded-3xl border border-slate-200 bg-white/60 p-5 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/70 md:p-6">
            <PostPreview
              title={title}
              author={author}
              date={new Date()}
              imageUrl={imageUrl || undefined}
              contentHtml={content}
              category={category}
              status={status}
            />
          </div>
        </div>
      )}
    </div>
  );
};
