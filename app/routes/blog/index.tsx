import React from "react";
import type { Route } from "../+types/home";
import { Link, redirect, useLoaderData } from "react-router";

interface Post {
  id: number;
  title: string;
  body: string;
}

export async function loader() {
  const posts = (await fetch("https://jsonplaceholder.typicode.com/posts").then(
    (r) => r.json()
  )) as Post[];

  if (posts.length === 0) {
    throw redirect("/");
  }
  return { posts: posts.slice(0, 10) };
}

const Blog: React.FC = () => {
  const { posts } = useLoaderData<typeof loader>();
  return (
    <div className=" container mx-auto py-10 max-w-5xl">
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((item: Post) => (
          <div
            className=" flex flex-col h-full border border-gray-200 rounded-md p-4
               space-y-4
              "
            key={item.id}
          >
            <h2 className=" text-lg font-semibold leading-tight">
              {item.title}
            </h2>
            <p className=" text-sm text-gray-500 line-clamp-3 leading-relaxed">
              {item.body}
            </p>
            <Link to={`/blog/${item.id}`}>
              <button className=" mt-auto bg-blue-500 text-white px-4 py-2 rounded-md tracking-wide">
                Read More
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;

export function meta({}: Route.MetaArgs) {
  return [{ title: "Blog" }, { name: "description", content: "Blog page" }];
}
