import { SignedIn, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
export function UserProfile(){
     const user = useUser();
    return(
        <div className="text-white flex items-center gap-2">
            <SignedIn >
              <SignOutButton />
            </SignedIn>

            <SignedIn>
              <Avatar  className="w-10 h-10 rounded-full">
                <AvatarImage src={user.user?.imageUrl ?? "https://github.com/shadcn.png"} alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </SignedIn>
          </div>
    ) 

}