import React from "react";
import type { Route } from "../+types/home";
import { Link, redirect, useLoaderData, useSearchParams } from "react-router";
import Search from "~/components/search";
import Pagination from "~/components/pagination";

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
  return { posts: posts.slice(0, 20) };
}

const Blog: React.FC = () => {
  const { posts } = useLoaderData<typeof loader>();
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search");

  const filteredPosts = posts?.filter((post) =>
    post.title.includes(search || "")
  );

  const postPerPage = 6;
  const totalPages = Math.ceil(filteredPosts.length / postPerPage);
  const currentPage = searchParams.get("page")
    ? Number(searchParams.get("page"))
    : 1;
  const startIndex = (currentPage - 1) * postPerPage;
  const endIndex = startIndex + postPerPage;
  const currentPosts = filteredPosts?.slice(startIndex, endIndex) ?? [];
  console.log("currentPosts", currentPosts);

  return (
    <div className=" container mx-auto py-10 max-w-5xl">
      <Search
        search={search || ""}
        setSearch={(search) => setSearchParams({ search: search || "" })}
      />
      <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {currentPosts?.length > 0 ? (
          currentPosts?.map((item: Post) => (
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
          ))
        ) : (
          <div className=" text-center text-gray-500 py-8">No posts found</div>
        )}
      </div>
      <div>
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => {
            setSearchParams({ page: page.toString() || "1" });
          }}
        />
      </div>
    </div>
  );
};

export default Blog;

export function meta({}: Route.MetaArgs) {
  return [{ title: "Blog" }, { name: "description", content: "Blog page" }];
}
