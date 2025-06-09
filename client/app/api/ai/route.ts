import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt || typeof prompt !== 'string') {
      return new Response(JSON.stringify({ error: "Invalid prompt" }), { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    return NextResponse.json({
      text:response.text,
      
    }, { status: 200 });



  } catch (error) {
     console.log("Error in fetching data from Gemini:", error);
     return NextResponse.json({
      error: "Failed to fetch data from Gemini",
    }, { status: 500
     })
  }
}