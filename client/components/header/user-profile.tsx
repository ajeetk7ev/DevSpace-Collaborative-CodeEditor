import { SignedIn, UserButton } from "@clerk/nextjs";

export function UserProfile() {
  return (
    <div className="flex items-center">
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: "w-10 h-10 ring-2 ring-hite rounded-full", 
            },
          }}
        />
      </SignedIn>
    </div>
  );
}
