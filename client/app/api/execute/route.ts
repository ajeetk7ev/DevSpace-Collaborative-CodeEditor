import { NextRequest, NextResponse } from "next/server";
import { QueueEvents } from "bullmq";
import { redis } from "@/lib/redis";
import { runQueue } from "@/lib/run.queue";
import { languageMap } from "@/utils/data";
// Import worker to ensure it's initialized
import "@/lib/run.worker";

export async function POST(req: NextRequest) {
  try {
    const { source_code, language_id, stdin } = await req.json();

    if (!source_code || !language_id) {
      return NextResponse.json(
        { error: "source_code and language_id are required" },
        { status: 400 }
      );
    }

    // Find language name from language_id
    const language = Object.keys(languageMap).find(
      (key) => languageMap[key] === language_id
    );

    if (!language) {
      return NextResponse.json(
        { error: "Unsupported language" },
        { status: 400 }
      );
    }

    // Add job to queue
    const job = await runQueue.add(
      "code-run",
      {
        code: source_code,
        language: language,
        stdin: stdin || "",
      },
      {
        attempts: 3,
        backoff: {
          type: "exponential",
          delay: 2000,
        },
      }
    );

     // Wait for job to complete (with timeout)
    const queueEvents = new QueueEvents("code-run", { connection: redis });

    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Job timeout")), 30000)
    );
    
    const result = await Promise.race([
      job.waitUntilFinished(queueEvents),
      timeoutPromise
    ]) as any;

      return NextResponse.json({
        stdout: result.stdout,
        stderr: result.stderr,
        compile_output: result.compileOutput,
        verdict: result.verdict,
        time: result.runtime ? (result.runtime / 1000).toFixed(3) : null,
        memory: result.memory,
        exit_code: result.exitCode,
      });
   
  } catch (error: any) {
    console.error("Error executing code:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to execute code" },
      { status: 500 }
    );
  }
}
