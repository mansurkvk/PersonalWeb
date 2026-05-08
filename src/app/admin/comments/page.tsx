import { AdminShell } from "@/features/admin/admin-shell";
import { CommentModerationActions } from "@/features/admin/admin-forms";
import { listAllComments } from "@/repositories/comments.repository";

export const dynamic = "force-dynamic";

export default async function AdminCommentsPage() {
  const comments = await listAllComments().catch(() => []);

  return (
    <AdminShell title="Yorum Moderasyonu">
      <div className="grid gap-4">
        {comments.map((comment) => (
          <div key={String(comment._id)} className="glass-panel rounded-[1.6rem] p-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm text-[#8bd3dd]">{comment.authorName} | {comment.status}</p>
                <p className="mt-2 text-sm leading-6 text-slate-300">{comment.content}</p>
              </div>
              <CommentModerationActions id={String(comment._id)} status={comment.status} />
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
