import { ShareCodeEditor } from "@/components/share-code-editor";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ShareEditor({ params }: {
  params: Promise<{ room: string }>
}) {
  const {room} =  await params;
  const {userId} = await auth();
  if(!userId){
    redirect('/sign-in')
  }

  const userData = await prisma.user.findUnique({
    where:{
      clerkId:userId
    }
  })

  if(!userData){
    redirect('/sign-in');
  }

  const user = {
    id: userData.id,
    fullname: userData.fullname,
    email: userData.email,
    imageUrl: userData.imageUrl
  }


  return <ShareCodeEditor room={room} user={user} />;
}
