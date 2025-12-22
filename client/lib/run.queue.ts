import { Queue } from "bullmq";
import { redis } from "./redis";

export const runQueue = new Queue("code-run", {
  connection: redis,
});