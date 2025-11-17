"use client";
import { useEffect, useRef, useState } from "react";
import { FiFilePlus } from "react-icons/fi";
import { AiOutlineCloudUpload } from "react-icons/ai";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IoIosArrowDown } from "react-icons/io";
import { Input } from "../ui/input";

const extensionToLanguageMap: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  java: "java",
  cpp: "cpp",
  c: "c",
  cs: "csharp",
  html: "html",
  css: "css",
  json: "json",
  php: "php",
  go: "go",
  rs: "rust",
  sh: "shell",
  kt: "kotlin",
};

interface SaveUploadFileProps {
  setCode: (code: string) => void;
  currentCode: string;
  curLanguage: string;
  setCurLanguage: (lang: string) => void;
  setIsFileUpload: (isFileUpload: boolean) => void;
}

export function SaveUploadFile({
  setCode,
  currentCode,
  curLanguage,
  setCurLanguage,
  setIsFileUpload,
}: SaveUploadFileProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // For filename input modal visibility and value
  const [showSavePrompt, setShowSavePrompt] = useState(false);

  const [filename, setFilename] = useState(
    `main.${getExtensionByLanguage(curLanguage)}`
  );

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      const fileContent = reader.result as string;
      const extension = file.name.split(".").pop()?.toLowerCase();

      if (extension && extensionToLanguageMap[extension]) {
        setCurLanguage(extensionToLanguageMap[extension]);
      } else {
        console.warn("Unknown file extension:", extension);
      }

      setCode(fileContent);
      setIsFileUpload(true);
    };

    reader.onerror = () => {
      console.error("File reading failed", reader.error);
    };

    reader.readAsText(file);
  };

  // Trigger showing the prompt modal
  const onClickSave = () => {
    setShowSavePrompt(true);
  };

  // Actually download the file with user given filename
  const handleFileSave = () => {
    if (!filename) {
      alert("Please enter a file name.");
      return;
    }
    // Add .txt extension if user doesn't specify an extension
    const hasExtension = filename.includes(".");
    const finalFilename = hasExtension ? filename : filename + ".txt";

    const blob = new Blob([currentCode], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = finalFilename;
    a.click();
    URL.revokeObjectURL(url);

    setShowSavePrompt(false);
  };

  function getExtensionByLanguage(lang: string) {
    return Object.entries(extensionToLanguageMap).find(
      ([ext, language]) => language === lang
    )?.[0];
  }

  const handleCancelSave = () => {
    setShowSavePrompt(false);
  };

  useEffect(() => {
    setFilename(`main.${getExtensionByLanguage(curLanguage)}`);
  }, [curLanguage]);

  return (
    <>
      <Input
        type="file"
        ref={fileInputRef}
        accept=".js,.ts,.py,.cpp,.c,.java"
        className="hidden"
        onChange={handleFileUpload}
      />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="text-black">
            File <IoIosArrowDown className="ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuLabel>File Options</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => fileInputRef.current?.click()}>
            <FiFilePlus className="mr-2" />
            Open File
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={onClickSave}>
            <AiOutlineCloudUpload className="mr-2" />
            Save File
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Filename input modal */}
      {showSavePrompt && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-slate-950 rounded p-6 w-80 max-w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Save File As</h3>
            <Input
              type="text"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="Enter file name with extension"
              className="w-full border border-gray-300 bg-slate-900 rounded px-3 py-2 mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-4">
              <Button
                onClick={handleCancelSave}
                variant={"outline"}
                className="px-4 py-2 text-black bg-gray-300 rounded hover:bg-gray-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleFileSave}
                className="px-4 py-2 bg-slate-600 text-white rounded hover:bg-slate-700"
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
