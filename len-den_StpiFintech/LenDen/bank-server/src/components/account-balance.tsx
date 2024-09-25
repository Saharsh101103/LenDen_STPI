import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AccountBalanceProps {
  balance: number | null | undefined
}

export function AccountBalance({ balance }: AccountBalanceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">
          ${(typeof balance === 'number' ? balance : 0).toFixed(2)}
        </p>
        <p className="text-sm text-muted-foreground">Available balance</p>
      </CardContent>
    </Card>
  )
}