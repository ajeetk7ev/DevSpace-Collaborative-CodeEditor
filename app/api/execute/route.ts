import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY!;
const RAPIDAPI_HOST = "judge0-ce.p.rapidapi.com";

export async function POST(req: NextRequest) {
  const { source_code, language_id, stdin } = await req.json();

  try {
    const response = await axios.post(
      `https://${RAPIDAPI_HOST}/submissions`,
      {
        source_code,
        language_id,
        stdin,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
        params: {
          base64_encoded: "false",
          wait: "true", // wait for execution
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.response?.data || error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  try {
    const response = await axios.get(
      `https://${RAPIDAPI_HOST}/submissions/${token}`,
      {
        headers: {
          "X-RapidAPI-Key": RAPIDAPI_KEY,
          "X-RapidAPI-Host": RAPIDAPI_HOST,
        },
        params: {
          base64_encoded: "false",
        },
      }
    );

    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.response?.data || error.message },
      { status: 500 }
    );
  }
}
