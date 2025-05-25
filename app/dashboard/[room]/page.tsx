

import { ShareCodeEditor } from "@/components/share-code-editor";

export default async function ShareEditor({ params }: { params: { room: string } }) {
  const {room} =  await params;

  // Dummy user for now — in real apps, use auth or prompt for username
  const user = "guest-" + Math.floor(Math.random() * 10000);

  return <ShareCodeEditor room={room} user={user} />;
}
