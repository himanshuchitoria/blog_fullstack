import { notFound } from "next/navigation";
import Link from "next/link";
import { serverClient } from "@/app/_trpc/serverClient";
import { Post } from "@/components/Post";

type PageProps = { params: { id: string } };

export default async function PostDetailPage({ params }: PageProps) {
  const id = Number(params.id);
  if (!Number.isFinite(id) || id <= 0) notFound();

  const post = await serverClient.getPostById({ id });
  if (!post) notFound();

  if (post.status === "draft") notFound();

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 text-slate-900 dark:text-slate-100">
      <div className="mb-6">
        <Link
          href="/blogs"
          className="rounded px-2 py-1 text-sm text-blue-700 underline-offset-2 hover:underline dark:text-blue-300"
        >
          ← Back to Blogs
        </Link>
      </div>

      {/* Ensure rendered HTML uses dark-safe colors */}
      <article className="preview-html dark:preview-html-dark">
        <Post
          id={post.id}
          title={post.title}
          content={post.post}
          imageUrl={post.image_url}
          author={post.author}
          createdAt={post.created_at}
          category={post.category}
          status={post.status}
          showEdit={false}
        />
      </article>
    </main>
  );
}
