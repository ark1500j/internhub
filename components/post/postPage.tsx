"use client";
import { ScrollArea } from "@/components/ui/scroll-area";
import PostDetail from "@/components/post/postDetail";
import PostCard from "../cards/jobcard";
import { Internship } from "@prisma/client";
import { usePost } from "@/utils/state";
interface PostProps {
  data: Internship[],
  isloading:boolean,
}

export function PostList({ data, isloading }: PostProps) {
   const [post,setPost]= usePost()
if (data)
  return (
    <>
      <div className="flex mt-5 justify-center">
        <ScrollArea className="h-screen max-w-96 mx-7 sm:max-md:min-w-96">
          <div className="flex flex-col gap-4 p-4 pt-0">
            {data.map((item) => (
              <PostCard key={item.id} item={item}/>
            ))}
            <div className="h-96 w-full"></div>
          </div>
        </ScrollArea>
        <div className="hidden md:block">
          <PostDetail
            post={data.find((item) => item.id === post.selected ) || null}
          />
          </div>
      </div>
    </>
  );
}

