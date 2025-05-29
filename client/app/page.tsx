
import { saveUser } from "@/actions/save-user";
import { redirect } from "next/navigation";


export const dynamic = 'force-dynamic';


export default async function Home() {
    await saveUser();
  return redirect("/dashboard/code-editor");
}
