import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "./ui/button"
import Link from "next/link"

export default function KycAlert() {
  return (
    <Alert className="bg-destructive rounded-none">
      <AlertTitle className="text-destructive-foreground text-lg font-extrabold">Heads up!</AlertTitle>
      <AlertDescription className="text-destructive-foreground text-base">
        Complete KYC to start using services.
      </AlertDescription>
      <div className="flex justify-center items-center">
    <Link href={"/KYC"}>
      <Button variant={"secondary"}>Complete KYC</Button>
    </Link>
      </div>
    </Alert>
  )
}
