// components/ai/AIResponse.tsx
"use client";

import { useState } from "react";
import { FaCopy } from "react-icons/fa";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import toast from "react-hot-toast";

export const AIResponse = ({ aiResponse, darkMode }: { aiResponse: string; darkMode: boolean }) => {
  const [copied, setCopied] = useState(false);

  const parts = aiResponse.split(/```([\w+]*)\n([\s\S]*?)```/g);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
       toast.success("Code copied successfully");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div
      className={`w-[450px] rounded-lg p-4 max-h-[300px] overflow-y-auto shadow-md transition-all duration-300 text-sm whitespace-pre-wrap border ${
        darkMode ? "bg-[#1e1e2f] text-white border-slate-700" : "bg-gray-50 text-black border-gray-300"
      }`}
    >
      {parts.map((part, idx) => {
        if (idx % 3 === 0) {
          return <p key={idx} className="mb-3 leading-relaxed">{part}</p>;
        } else if (idx % 3 === 1) {
          return null; // language
        } else {
          const lang = parts[idx - 1] || "text";
          return (
            <div key={idx} className="relative mb-4">
              <button
                onClick={() => handleCopy(part)}
                className="absolute top-2 right-2 text-xs bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-600"
              >
                <FaCopy className="inline mr-1" /> Copy
              </button>
              <SyntaxHighlighter
                language={lang}
                style={darkMode ? oneDark : oneLight}
                customStyle={{ borderRadius: "0.5rem", padding: "1rem", margin: 0 }}
              >
                {part}
              </SyntaxHighlighter>
            </div>
          );
        }
      })}

      {copied && (
        <div className="mt-4 text-green-500 text-center font-semibold">Copied to clipboard!</div>
      )}
    </div>
  );
};
