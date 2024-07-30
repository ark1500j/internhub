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

const PostCard = ({ item }: PostProps) => {
  const [post, setPost] = usePost();
  const [hoverState, setHoverState] = useState(false);

  function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  function stripHtml(html: string): string {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || "";
  }

  function truncateString(str: string, num: number): string {
    if (str.length <= num) {
      return str;
    }
    return str.slice(0, num) + "...";
  }

  const plainDescription = stripHtml(item.description);
  const truncatedDescription = truncateString(plainDescription, 210);

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-2 cursor-pointer rounded-lg border p-3 text-left text-sm transition-all hover:border-neutral-400",
      )}
      onMouseEnter={() => setHoverState(true)}
      onMouseLeave={() => setHoverState(false)}
      onClick={() => setPost({ selected: item.id })}
    >
      <div className="flex w-full flex-col gap-1">
        <div className="flex items-center">
          <div className="flex items-center gap-2">
            <div className={`font-semibold text-xl ${hoverState && 'underline'}`}>{capitalizeFirstLetter(item.title)}</div>
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
        <div className="rendered-content">
          {truncatedDescription}
        </div>
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
