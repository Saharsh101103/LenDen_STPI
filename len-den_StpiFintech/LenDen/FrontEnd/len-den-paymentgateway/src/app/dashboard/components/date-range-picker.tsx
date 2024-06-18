"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { addDays, format } from "date-fns"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"



export default function CalendarDateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
            <CalendarIcon className="mr-2 h-4 w-4" />
            
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
        </PopoverContent>
      </Popover>
    </div>
  )
}
