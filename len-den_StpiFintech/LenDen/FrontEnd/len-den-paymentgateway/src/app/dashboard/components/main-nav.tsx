import Link from "next/link"

import { cn } from "@/lib/utils"

export default function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Link
        href="/docs"
        className="text-sm font-medium transition-colors hover:text-primary"
      >
        Overview
      </Link>
      <Link
        href="/customers"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Customers
      </Link>
      <Link
        href="/integrations"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
      >
        Integrations
      </Link>
    </nav>
  )
}
