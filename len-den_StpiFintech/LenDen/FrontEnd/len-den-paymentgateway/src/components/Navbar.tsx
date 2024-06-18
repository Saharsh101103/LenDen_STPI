"use client"
import MainNav from "@/app/dashboard/components/main-nav"
import Search from "@/app/dashboard/components/search"
import TeamSwitcher from "@/app/dashboard/components/team-switcher"
import UserNav from "@/app/dashboard/components/user-nav"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Metadata } from "next/types"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"


export const metadata: Metadata = {
  title: "Dashboard",
  description: "LenDen PG dashboard",
}

export default function DashboardPage() {
  const [site, setsite] = useState(false)
  const params = usePathname()
  useEffect(() => {
    if (params === "/dashboard" || params === "/services/payments" || params === "/services/payouts" || params === "/services/subscriptions" || params === "/services/refunds" || params === "/KYC") {
      setsite(false);
    } else {
      setsite(true);
    }
  }, [params]);
  const classnames = cn({["hidden"]: site ,["hidden flex-col md:flex bg-secondary text-secondary-foreground"]: !site} )
  return (
    <>
      <div className={classnames}>
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <TeamSwitcher />
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Link href={"/docs"}><Button variant={"outline"}>Docs</Button></Link>
              <UserNav />
            </div>
          </div>
        </div>
       
      </div>
    </>
  )
}
