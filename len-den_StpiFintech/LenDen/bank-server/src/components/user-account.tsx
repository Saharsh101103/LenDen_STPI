import { AccountBalance } from "./account-balance"


interface UserAccountProps {
  name: string
  balance: number
}

export function UserAccount({ name, balance }: UserAccountProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{name || 'Unknown User'}&apos;s Account</h2>
      <AccountBalance balance={balance || 0} />
    </div>
  )
}