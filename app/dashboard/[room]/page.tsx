import { ShareCodeEditor } from "@/components/share-code-editor";

export default async function ShareEditor({ params }: {
  params: Promise<{ room: string }>
}) {
  const {room} =  await params;

 
  //TODO->ADD AUTHENTICATION FOR REAL USER
  const user = "guest-" + Math.floor(Math.random() * 10000);

  return <ShareCodeEditor room={room} user={user} />;
}
