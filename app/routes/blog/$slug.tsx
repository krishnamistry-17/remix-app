import { useLoaderData } from "react-router";
import type { Route } from "../+types/home";

type Post = {
  id: number;
  title: string;
  body: string;
};

export async function loader({ params }: { params: { id: string } }) {
  const id = params.id;
  if (!id) throw new Error("Not Found");

  const response = fetch(`https://jsonplaceholder.typicode.com/posts/${id}`)
    .then((r) => r.json())
    .then((post: Post) => post);

  if (!id) throw new Error("Not Found");
  return { response };
}

const BlogDetail = () => {
  const { post } = useLoaderData<typeof loader>() as unknown as {
    post: Post;
  };
  return (
    <div>
      <h1 className="text-2xl font-bold text-center pt-10">Blog Detail</h1>
      {post ? (
        <div className="mt-4 space-y-2 container mx-auto px-2 py-10 max-w-3xl">
          <h2 className="text-xl font-semibold">{post.title}</h2>
          <p className="text-base leading-6">{post.body}</p>
        </div>
      ) : (
        <p className="mt-4">No post found.</p>
      )}
    </div>
  );
};

export default BlogDetail;

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Blog Detail" },
    { name: "description", content: "Blog detail page" },
  ];
}
