"use client";
import { useState, useEffect, useRef } from "react";
import { Editor } from "@monaco-editor/react";
import { ShareNavbar } from "./header/share-navbar";
import { Button } from "./ui/button";
import axios from "axios";
import Split from "react-split";
import { languages } from "@/utils/data";
import { defaultCodes } from "@/utils/data";
import { languageMap } from "@/utils/data";


export function ShareCodeEditor({ room, user }: { room: string; user: string }) {
  const [curLanguage, setCurLanguage] = useState("javascript");
   const [code, setCode] = useState(defaultCodes["javascript"]);
   const [stdin, setStdin] = useState("");
   const [output, setOutput] = useState("");
   const [time, setTime] = useState("");
   const [memory, setMemory] = useState("");
   const [loading, setLoading] = useState(false);
   const [fontSize, setFontSize] = useState<string>("14");
  const [editorTheme, setEditorTheme] = useState("vs-dark")

  const wsref = useRef<WebSocket | null>(null);
  const ignoreIncomingRef = useRef(false); 

  // Initialize WebSocket
  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);
    wsref.current = ws;

    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join",
          payload: { room, user },
        })
      );
      console.log("Connected to WS");
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "code-update") {
        ignoreIncomingRef.current = true;
        setCode(message.payload.code);
      }

      if (message.type === "user-joined") {
        console.log(`${message.payload.user} joined`);
      }

      if (message.type === "user-left") {
        console.log(`${message.payload.user} left`);
      }
    };

    return () => {
      ws.close();
    };
  }, [room, user]);

  // Handle local code changes and broadcast
  const handleCodeChange = (value: string | undefined) => {
    if (value === undefined) return;

    setCode(value);

   
    if (ignoreIncomingRef.current) {
      ignoreIncomingRef.current = false;
      return;
    }

    if (wsref.current?.readyState === WebSocket.OPEN) {
      wsref.current.send(
        JSON.stringify({
          type: "code-change",
          payload: {
            room,
            code: value,
          },
        })
      );
    }
  };

  // Change default code when language changes
  useEffect(() => {
    setCode(defaultCodes[curLanguage]);
  }, [curLanguage]);

   const runCode = async () => {
    setLoading(true);
    setOutput("");
    setTime("");
    setMemory("");

    try {
      const res = await axios.post("/api/execute", {
        source_code: code,
        language_id: languageMap[curLanguage],
        stdin,
      });

      const data = res.data;
      setOutput(data.stdout || data.stderr || "No output");
      setTime(data.time + "s");
      setMemory(data.memory + " KB");
    } catch (err: any) {
      setOutput("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen">
      <ShareNavbar
        languages={languages}
        setCurLanguage={setCurLanguage}
        curLanguage={curLanguage}
        onRunCode={runCode}
        loading={loading}
         setEditorTheme={setEditorTheme}
        setFontSize={setFontSize}
        editorTheme={editorTheme}
      />

       <Split
        className="flex h-[95vh]"
        sizes={[75, 25]}
        minSize={250}
        direction="horizontal"
        gutterSize={8}
      >
        <div className="h-full">
          <Editor
            height="100%"
            width="100%"
            theme={editorTheme}
            language={curLanguage}
            value={code}
            onChange={handleCodeChange}
            options={{
              fontSize:parseInt(fontSize),
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: "on",
            }}
          />
        </div>

        <div className="bg-gray-800 text-white p-4 space-y-4 overflow-y-auto h-full">
          <h2 className="text-xl font-semibold">Input (stdin)</h2>
          <textarea
            value={stdin}
            onChange={(e) => setStdin(e.target.value)}
            className="w-full h-28 p-2 text-black rounded bg-gray-100"
            placeholder="Enter input if required"
          />

          <div className="flex justify-between">
            <Button
              className="bg-red-600 hover:bg-red-700"
              onClick={() => {
                setOutput("");
                setTime("");
                setMemory("");
              }}
            >
              Clear
            </Button>
            {loading && <span className="text-green-300">Running...</span>}
          </div>

          <h2 className="text-xl font-semibold pt-2">Output</h2>
          <pre className="min-h-40 bg-black p-2 rounded overflow-auto">{output}</pre>

          {time && (
            <div className="text-sm mt-2">
              <p>Execution Time: {time}</p>
              <p>Memory Used: {memory}</p>
            </div>
          )}
        </div>
      </Split>
    </div>
  );
}



// "use client";
// import { useState, useEffect } from "react";
// import { Editor } from "@monaco-editor/react";
// import { Navbar } from "./header/navbar";
// import { Button } from "./ui/button";
// import axios from "axios";
// import Split from "react-split";

// const languages = ["javascript", "typescript", "python", "cpp", "c", "java", "go"];

// const defaultCodes: Record<string, string> = {
//   javascript: `console.log("Hello, JavaScript!");`,
//   typescript: `const greet = (name: string): void => {\n  console.log("Hello, " + name);\n};\ngreet("TypeScript");`,
//   python: `def greet(name):\n    print("Hello,", name)\n\ngreet("Python")`,
//   cpp: `#include <iostream>\nusing namespace std;\n\nint main() {\n    cout << "Hello, C++!" << endl;\n    return 0;\n}`,
//   c: `#include <stdio.h>\n\nint main() {\n    printf("Hello, C!\\n");\n    return 0;\n}`,
//   java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, Java!");\n    }\n}`,
//   go: `package main\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, Go!")\n}`,
// };

// const languageMap: Record<string, number> = {
//   javascript: 63,
//   typescript: 74,
//   python: 71,
//   cpp: 54,
//   c: 50,
//   java: 62,
//   go: 60,
// };

// export function CodeEditor() {
//   const [curLanguage, setCurLanguage] = useState("javascript");
//   const [code, setCode] = useState(defaultCodes["javascript"]);
//   const [stdin, setStdin] = useState("");
//   const [output, setOutput] = useState("");
//   const [time, setTime] = useState("");
//   const [memory, setMemory] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [fontSize, setFontSize] = useState<string>("14");
//   const [editorTheme, setEditorTheme] = useState("vs-dark")

//   useEffect(() => {
//     setCode(defaultCodes[curLanguage]);
//   }, [curLanguage]);

//   const runCode = async () => {
//     setLoading(true);
//     setOutput("");
//     setTime("");
//     setMemory("");

//     try {
//       const res = await axios.post("/api/execute", {
//         source_code: code,
//         language_id: languageMap[curLanguage],
//         stdin,
//       });

//       const data = res.data;
//       setOutput(data.stdout || data.stderr || "No output");
//       setTime(data.time + "s");
//       setMemory(data.memory + " KB");
//     } catch (err: any) {
//       setOutput("Error: " + (err.response?.data?.error || err.message));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="h-screen">
//       <Navbar
//         languages={languages}
//         setCurLanguage={setCurLanguage}
//         curLanguage={curLanguage}
//         onRunCode={runCode}
//         loading={loading}
//         setEditorTheme={setEditorTheme}
//         setFontSize={setFontSize}
//         editorTheme={editorTheme}
//       />
//       <Split
//         className="flex h-[95vh]"
//         sizes={[75, 25]}
//         minSize={250}
//         direction="horizontal"
//         gutterSize={8}
//       >
//         <div className="h-full">
//           <Editor
//             height="100%"
//             width="100%"
//             theme={editorTheme}
//             language={curLanguage}
//             value={code}
//             onChange={(value) => setCode(value || "")}
//             options={{
//               fontSize:parseInt(fontSize),
//               minimap: { enabled: false },
//               scrollBeyondLastLine: false,
//               lineNumbers: "on",
//             }}
//           />
//         </div>

//         <div className="bg-gray-800 text-white p-4 space-y-4 overflow-y-auto h-full">
//           <h2 className="text-xl font-semibold">Input (stdin)</h2>
//           <textarea
//             value={stdin}
//             onChange={(e) => setStdin(e.target.value)}
//             className="w-full h-28 p-2 text-black rounded bg-gray-100"
//             placeholder="Enter input if required"
//           />

//           <div className="flex justify-between">
//             <Button
//               className="bg-red-600 hover:bg-red-700"
//               onClick={() => {
//                 setOutput("");
//                 setTime("");
//                 setMemory("");
//               }}
//             >
//               Clear
//             </Button>
//             {loading && <span className="text-green-300">Running...</span>}
//           </div>

//           <h2 className="text-xl font-semibold pt-2">Output</h2>
//           <pre className="min-h-40 bg-black p-2 rounded overflow-auto">{output}</pre>

//           {time && (
//             <div className="text-sm mt-2">
//               <p>Execution Time: {time}</p>
//               <p>Memory Used: {memory}</p>
//             </div>
//           )}
//         </div>
//       </Split>
//     </div>
//   );
// }

