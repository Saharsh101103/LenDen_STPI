"use client";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import MainNav from "@/app/dashboard/components/main-nav";
import TeamSwitcher from "@/app/dashboard/components/team-switcher";
import UserNav from "@/app/dashboard/components/user-nav";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Metadata } from "next/types";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "LenDen PG dashboard",
};

export default function DashboardPage() {
  const [site, setSite] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const dashboardPaths = [
      "/dashboard",
      "/services/payments",
      "/services/payouts",
      "/services/subscriptions",
      "/services/refunds",
      "/KYC",
      "/integrations",
      "/customers",
    ];
    setSite(!dashboardPaths.includes(pathname));
  }, [pathname]);

  const classnames = cn({
    hidden: site,
    "hidden fixed flex-col md:flex bg-secondary text-secondary-foreground w-full": !site,
  });

  return (
    <div className={classnames}>
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <TeamSwitcher />
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <Link href="/docs">
              <Button variant="outline">Docs</Button>
            </Link>
            <UserNav />
          </div>
        </div>
      </div>
    </div>
  );
}
