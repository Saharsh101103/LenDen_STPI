"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {}

const MainNav: React.FC<MainNavProps> = ({ className, ...props }) => {
  const pathname = usePathname();

  const linkClasses = (path: string) =>
    cn("text-sm font-medium transition-colors hover:text-primary", {
      "text-muted-foreground": pathname !== path,
    });

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link href="/dashboard" className={linkClasses("/dashboard")}>
        Overview
      </Link>
      <Link href="/integrations" className={linkClasses("/integrations")}>
        Integrations
      </Link>
    </nav>
  );
};

export default MainNav;
