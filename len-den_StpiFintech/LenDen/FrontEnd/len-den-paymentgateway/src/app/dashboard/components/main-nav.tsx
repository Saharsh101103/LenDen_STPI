"use client"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

export default function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const params = usePathname()
  const classDocs = cn({
    ["text-sm font-medium text-muted-foreground transition-colors hover:text-primary"]: params != "/dashboard",
    ["text-sm font-medium  transition-colors hover:text-primary"]: params === "/dashboard"
  })
  const classCustomers = cn({
    ["text-sm font-medium text-muted-foreground transition-colors hover:text-primary"]: params != "/customers",
    ["text-sm font-medium  transition-colors hover:text-primary"]: params === "/customers"
  })
  const classIntegrations  = cn({
    ["text-sm font-medium text-muted-foreground transition-colors hover:text-primary"]: params != "/integrations",
    ["text-sm font-medium  transition-colors hover:text-primary"]: params === "/integrations"
  })
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/dashboard"
        className={classDocs}
      >
        Overview
      </Link>
      <Link
        href="/customers"
        className={classCustomers}

      >
        Customers
      </Link>
      <Link
        href="/integrations"
        className={classIntegrations}
      >
        Integrations
      </Link>
    </nav>
  )
}
