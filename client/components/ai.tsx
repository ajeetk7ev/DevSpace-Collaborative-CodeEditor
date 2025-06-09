"use client"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { AIResponse } from "./header/ai-response";

export const AI = () => {
    const [aiPrompt, setAiPrompt] = useState("");
    const [aiResponse, setAiResponse] = useState("");
    const [loadingAI, setLoadingAI] = useState(false);

    const handleAIRequest = async () => {
        setLoadingAI(true);
        setAiResponse("");

        try {
            const res = await fetch("/api/ai", {
                method: "POST",
                body: JSON.stringify({ prompt: aiPrompt }),
            });

            const data = await res.json();
            setAiResponse(data?.text || "No response");
        } catch (err) {
            setAiResponse("Something went wrong.");
        }

        setLoadingAI(false);
    };
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                    💡 AI
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ask DevSpace AI</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    <textarea
                        className="w-full border rounded-md p-2 h-32 resize-none text-sm"
                        placeholder="Ask anything… (e.g. What's wrong with this code?)"
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                    />

                    <Button
                        onClick={handleAIRequest}
                        disabled={loadingAI || !aiPrompt.trim()}
                        className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                        {loadingAI ? "Thinking..." : "Submit to AI"}
                    </Button>
                    {aiResponse && (
                        <AIResponse aiResponse={aiResponse} darkMode={true /* or your theme state */} />
                    )}

                </div>
            </DialogContent>
        </Dialog>
    )
}