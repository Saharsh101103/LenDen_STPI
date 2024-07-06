"use client"

import SignOutButton from "@/components/SignoutButton";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { supabase } from "@/lib/supabaseClient";
import axios from "axios";
import Link from "next/link";
import { useState } from "react";

export default function UserNav() {

  const [Name, setName] = useState("")
  const [Email, setEmail] = useState("")

  const getSession = async () => {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session) {
      
    } else {
      try {
        
        const  userDetails = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get_user?email=${session?.user.email}`)
        if(userDetails){
  
          setName(userDetails.data.name)
          setEmail(userDetails.data.email)
        }
      } catch (error) {
        console.log(error)
      }
    }
    };
  
    getSession()
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarFallback>{Name.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{Name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {Email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href={"/integrations"}>Integrations</Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
