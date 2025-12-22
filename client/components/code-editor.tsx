"use client";
import { useState, useEffect } from "react";
import { Editor } from "@monaco-editor/react";
import { Navbar } from "./header/navbar";
import { Button } from "./ui/button";
import axios from "axios";
import Split from "react-split";
import { languages, defaultCodes, languageMap } from "@/utils/data";
import { SaveUploadFile } from "./header/save-upload-file";

export function CodeEditor() {
  const [curLanguage, setCurLanguage] = useState("javascript");
  const [code, setCode] = useState(defaultCodes["javascript"]);
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState("");
  const [time, setTime] = useState("");
  const [memory, setMemory] = useState("");
  const [loading, setLoading] = useState(false);
  const [fontSize, setFontSize] = useState<string>("14");
  const [editorTheme, setEditorTheme] = useState("vs-dark");
  const [isFileUpload, setIsFileUpload] = useState(false);

  useEffect(() => {
    if (!isFileUpload) {
      setCode(defaultCodes[curLanguage]);
    }
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
      
      // Display output, stderr, or compile output
      if (data.compile_output) {
        setOutput(data.compile_output);
      } else if (data.stderr) {
        setOutput(data.stderr);
      } else {
        setOutput(data.stdout || "No output");
      }
      
      setTime(data.time ? data.time + "s" : "");
      setMemory(data.memory ? data.memory + " KB" : "");
    } catch (err: any) {
      setOutput("Error: " + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-screen">
      <Navbar
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
        sizes={[70, 30]}
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
            onChange={(value) => setCode(value || "")}
            options={{
              fontSize: parseInt(fontSize),
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: "on",
            }}
          />
        </div>

        <div className="bg-gray-800 text-white p-4 space-y-4 overflow-y-auto h-full">
          <div className="flex items-center gap-4">
            <SaveUploadFile
              currentCode={code}
              setCode={setCode}
              curLanguage={curLanguage}
              setCurLanguage={setCurLanguage}
              setIsFileUpload={setIsFileUpload}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold">STDIN</h2>
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              className="w-full resize-none pl-2 pt-2 h-32 text-gray-500 rounded bg-gray-100"
              placeholder="Your Input Goes Here..."
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold pt-2">STDOUT</h2>
            <pre className="min-h-40 max-h-60  overflow-y-auto  text-white bg-gray-100 p-2 rounded overflow-auto">
              {!output && (
                <p className="text-gray-500">
                  Your Output Will Be Displayed Here ...
                </p>
              )}

              <p className="text-gray-700 whitespace-pre-wrap"> {output}</p>
            </pre>
            <div className="flex justify-between mt-5">
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
            </div>
          </div>

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
