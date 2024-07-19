'use client'
import { cn } from "@/lib/utils";
import { usePost } from "@/utils/state";
import { Circle, EllipsisVertical } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { Internship } from "@prisma/client";

interface PostProps {
  item: Internship
}


const PostCard = ({item}:PostProps) => {
     
  const [post, setPost] = usePost();
  const [hoverState,SetHoverState]= useState(false)
  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  return (
    <div        
        className={cn(
                  "flex flex-col items-start gap-2 cursor-pointer rounded-lg border p-3 text-left text-sm transition-all hover:border-neutral-400",
                  // post.selected === item.id && "border-neutral-400"
                )}
                onMouseEnter={()=>{
                  SetHoverState(true)
             }}
             onMouseLeave={()=>{SetHoverState(false)}}
                onClick={() =>
                  setPost({ 
                    selected: item.id,
                  }) 
                }
              >
                <div className="flex w-full flex-col gap-1 ">
                  <div className="flex items-center">
                    <div className="flex items-center gap-2">
                      <div className={`font-semibold text-xl ${hoverState && 'underline'}`}>{capitalizeFirstLetter(item.title)}</div>
                      {/* {!item.read && (
                        <span className="flex h-2 w-2 rounded-full bg-blue-600" />
                      )} */}
                    </div>
                    <div
                      className={cn(
                        "ml-auto text-xs",
                        // post.selected === item.id
                          // ? "text-foreground"
                          // : "text-muted-foreground"
                      )}
                    >
                    </div>
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {"indeed"}
                  </div>
                  <div className="text-sm font-medium text-muted-foreground">
                    {"location"}
                  </div>
                </div>
                <div className="line-clamp-2 text-sm text-muted-foreground flex items-start gap-3">
                  <Circle size={"30"} />
                  <div
                            className="rendered-content"
                            dangerouslySetInnerHTML={{
                              __html: `${item.description.substring(0, 210)}...`,
                            }}
                          />
                </div>
                <div className="text-xs text-muted-foreground">
                  posted <span className="text-violet-700">{formatDistanceToNow(new Date(item.createdAt), {
                      addSuffix: true,
                    })}</span>
                </div>
              </div>
  );
};

export default PostCard;
