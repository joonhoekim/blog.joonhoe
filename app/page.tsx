import Link from 'next/link';
import { db } from '@/db/db';
import { postsTable, commentsTable } from '@/db/schema/schema';
import { desc, eq } from 'drizzle-orm';

async function getPosts() {
  const posts = await db.select().from(postsTable).orderBy(desc(postsTable.createdAt));
  return posts;
}

async function getComments(postId: string) {
  const comments = await db
    .select()
    .from(commentsTable)
    .where(eq(commentsTable.postId, postId))
    .orderBy(desc(commentsTable.createdAt));
  return comments;
}

export default async function Home() {
  const posts = await getPosts();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Link
          href="/edit"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          New Post
        </Link>
      </div>

      <div className="space-y-8">
        {posts.length > 0 && posts.map(async (post) => {
          const comments = await getComments(post.id);
          return (
            <article key={post.id} className="border rounded-lg p-6">
              <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
              <div className="prose max-w-none mb-6">
                {JSON.stringify(post.content)}
              </div>

              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Comments</h3>
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <div key={comment.id} className="border-l-2 border-gray-200 pl-4">
                      <div className="prose max-w-none">
                        {JSON.stringify(comment.content)}
                      </div>
                      <div className="text-sm text-gray-500 mt-2">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
