import axios from "axios";
import { languageMap } from "./data";


// Judge0 API configuration
const JUDGE0_API_URL = process.env.JUDGE0_API_URL;
const JUDGE0_RAPIDAPI_KEY = process.env.JUDGE0_RAPIDAPI_KEY;
const JUDGE0_RAPIDAPI_HOST = process.env.JUDGE0_RAPIDAPI_HOST;



interface Judge0Submission {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: number;
  memory_limit?: number;
}

interface Judge0Response {
  token: string;
}

interface Judge0Result {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  status: {
    id: number;
    description: string;
  };
  time: string | null;
  memory: number | null;
  exit_code?: number;
  exit_signal?: number;
}

// Create headers for Judge0 API
const getHeaders = () => {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (JUDGE0_RAPIDAPI_KEY && JUDGE0_RAPIDAPI_HOST) {
    headers["x-rapidapi-key"] = JUDGE0_RAPIDAPI_KEY;
    headers["x-rapidapi-host"] = JUDGE0_RAPIDAPI_HOST;
  }

  return headers;
};

/**
 * Submit code to Judge0 for execution
 */
export const submitToJudge0 = async (
  code: string,
  language: string,
  stdin?: string,
): Promise<string> => {
  try {
    const languageId = languageMap[language];
    if (!languageId) {
      throw new Error(`Unsupported language: ${language}`);
    }

    const submission: Judge0Submission = {
      source_code: code,
      language_id: languageId,
    };

    if (stdin) {
      submission.stdin = stdin;
    }


    const response = await axios.post<Judge0Response>(
     `${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=false`,
      submission,
      { headers: getHeaders() }
    );

    return response.data.token;
  } catch (error: any) {
    console.error("Error submitting to Judge0:", error);
    throw new Error(`Failed to submit code to Judge0: ${error.message}`);
  }
};

/**
 * Get result from Judge0 using token
 */
export const getJudge0Result = async (token: string): Promise<Judge0Result> => {
  try {
    const response = await axios.get<Judge0Result>(
     `${JUDGE0_API_URL}/submissions/${token}?base64_encoded=false`,
      { headers: getHeaders() }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error fetching Judge0 result:", error);
    throw new Error(`Failed to fetch result from Judge0: ${error.message}`);
  }
};

/**
 * Poll Judge0 result until it's ready (status 1 = In Queue, status 2 = Processing)
 */
export const pollJudge0Result = async (
  token: string,
  maxAttempts: number = 30,
  delayMs: number = 1000
): Promise<Judge0Result> => {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const result = await getJudge0Result(token);

    // Status IDs:
    // 1 = In Queue
    // 2 = Processing
    // 3 = Accepted
    // 4 = Wrong Answer
    // 5 = Time Limit Exceeded
    // 6 = Compilation Error
    // 7 = Runtime Error (SIGSEGV)
    // 8 = Runtime Error (SIGXFSZ)
    // 9 = Runtime Error (SIGFPE)
    // 10 = Runtime Error (SIGABRT)
    // 11 = Runtime Error (NZEC)
    // 12 = Runtime Error (Other)
    // 13 = Internal Error
    // 14 = Exec Format Error

    if (result.status.id > 2) {
      // Status is final (not in queue or processing)
      return result;
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error("Timeout waiting for Judge0 result");
};

