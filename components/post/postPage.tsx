"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import PostDetail from "@/components/post/postDetail";
import PostCard from "../cards/jobcard";
import { Internship } from "@prisma/client";
import { usePost } from "@/utils/state";
import { Skeleton } from "../ui/skeleton";
import { useEffect } from "react";
interface PostProps {
  data: Internship[];
  isloading: boolean;
}

export function PostList({ data, isloading }: PostProps) {
  const [post, setPost] = usePost();

  useEffect(() => {
    console.log(post, data);
    if (post.selected === "" && !isloading) {
      setPost({ selected: data && data[0]?.id });
    }
  }, [data, isloading, post, setPost]);

  return (
    <>
      <div className="flex mt-5 justify-center min-h-screen">
        <ScrollArea className="h-full max-w-96 mx-7 sm:max-md:min-w-96">
          <div className="flex flex-col gap-4 p-4 pt-0">
            {data && data.map((item) => <PostCard key={item.id} item={item} />)}
            {isloading &&
              Array.from({ length: 5 }).map(() => (
                <div
                  key={1}
                  className="flex flex-col w-80 space-y-3 mb-4 mx-auto"
                >
                  <Skeleton className="h-[200px] w-full bg-neutral-200 rounded-xl" />
                </div>
              ))}
            <div className="h-96 w-full"></div>
          </div>
        </ScrollArea>
        <PostDetail
          post={
            (data && data.find((item) => item.id === post.selected)) || null
          }
        />
      </div>
    </>
  );
}
