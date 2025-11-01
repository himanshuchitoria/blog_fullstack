import { notFound } from "next/navigation";
import { serverClient } from "@/app/_trpc/serverClient";
import EditFormClient from "./EditFormClient";

type PageProps = { params: { id: string } };

export default async function EditPostPage({ params }: PageProps) {
  const id = Number(params.id);
  if (!Number.isFinite(id) || id <= 0) notFound();

  const post = await serverClient.getPostById({ id });
  if (!post) notFound();

  return (
    <section className="max-w-3xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Post</h1>
      <EditFormClient
        initial={{
          id: post.id,
          title: post.title ?? "",
          content: post.post ?? "", // HTML
          author: post.author ?? "",
          imageUrl: post.image_url ?? "",
          category: post.category ?? "General",
          status: (post.status as "draft" | "published") ?? "draft",
        }}
      />
    </section>
  );
}
