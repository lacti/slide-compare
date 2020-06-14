import P from "pino";

export const logger = P({
  level: process.env.LOG_LEVEL ?? "info",
});
