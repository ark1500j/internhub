import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button"
import { LogoutAction } from "@/app/action";

export default function Profile({name, id}:{name:string, id:string}) {
  return ( 
    <DropdownMenu>
    <DropdownMenuTrigger
      asChild
      className="outline-none active:outline-none focus:outline-none"
    >
      <div className="flex items-center">
        <Button  className="h-full bg-white hover:bg-purple-300 py-[10px] text-xs text-neutral-400">
          {name} <ChevronsUpDown size={15} />
        </Button>
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-56">
      <DropdownMenuLabel>My Account</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={async ()=>{
        await LogoutAction("student")
      }}>
        Log out
        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
  );
}
