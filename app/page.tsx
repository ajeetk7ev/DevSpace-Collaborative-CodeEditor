import { CodeEditor } from "@/components/code-editor";
import { redirect } from "next/navigation";



export default function Home() {
 return redirect("/dashboard/code-editor");
  return (
  <div className="w-screen min-h-screen">
      <CodeEditor/>
  </div>
  );
}
