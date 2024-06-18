import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


export default function   RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center bg-secondary p-4 rounded-xl">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback className="text-secondary-foreground">OM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none text-secondary-foreground">Olivia Martin</p>
          <p className="text-sm text-muted-foreground">
            olivia.martin@email.com
          </p>
        </div>
        <div className="ml-auto font-medium text-secondary-foreground">+$1,999.00</div>
      </div>
     
    </div>
  )
}
