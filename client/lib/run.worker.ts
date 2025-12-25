import { Worker, Job } from "bullmq";
import { redis } from "./redis";
import { submitToJudge0, pollJudge0Result } from "../utils/judge0";


interface RunJobData {
  code: string;
  language: string;
  stdin?: string;
}

interface RunJobResult {
  stdout: string | null;
  stderr: string | null;
  compileOutput: string | null;
  runtime: number | null;
  memory: number | null;
  exitCode?: number | undefined;
}

export const runWorker = new Worker<RunJobData, RunJobResult>(
  "code-run",
  async (job: Job<RunJobData, RunJobResult>) => {
    const { code, language, stdin } = job.data;

    try {
      // Submit code to Judge0
      const token = await submitToJudge0(code, language, stdin);

      // Poll for result
      const result = await pollJudge0Result(token);

      //

      return {
        stdout: result.stdout,
        stderr: result.stderr,
        compileOutput: result.compile_output,
        runtime: result.time ? parseFloat(result.time) * 1000 : null, // Convert to milliseconds
        memory: result.memory,
        exitCode: result.exit_code ?? undefined,
      };
    } catch (error: any) {
      console.error(`Error processing run job ${job.id}:`, error);
      throw error;
    }
  },
  {
    connection: redis,
    concurrency: 1, 
  }
);

runWorker.on("ready", () => {
  console.log("🚀 Run worker is ready");
});

runWorker.on("error", (err) => {
  console.error("❌ Run worker error:", err);
});

runWorker.on("completed", (job) => {
  console.log(`Run job ${job.id} completed`);
});

runWorker.on("failed", (job, err) => {
  console.error(`Run job ${job?.id} failed:`, err);
});