import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RecentSalesProps {
  customerName: string;
  email: string;
  amount: number;
}

const RecentSales: React.FC<RecentSalesProps> = ({ customerName, email, amount }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center bg-secondary p-4 rounded-xl">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback className="text-secondary-foreground">
            {customerName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none text-secondary-foreground">
            {customerName}
          </p>
          <p className="text-sm text-muted-foreground">
            {email}
          </p>
        </div>
        <div className="ml-auto font-medium text-secondary-foreground">
          + INR {amount.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default RecentSales;
