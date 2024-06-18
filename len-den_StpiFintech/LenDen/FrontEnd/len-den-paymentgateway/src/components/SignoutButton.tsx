import { supabase } from "@/lib/supabaseClient";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";

const SignOutButton = () => {
    const handleSignOut = async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
            title: "Error signing out",
            description: error.message,
            variant: "destructive",
          })
        console.log(error);
      } else {
          toast({
              title: "Successfully signed out!",
              description: ":)",
              variant: "destructive",
            })
        }
    };
  
    return <Button variant={"destructive"} onClick={handleSignOut}>Logout</Button>;
  };
  
  export default SignOutButton;
  