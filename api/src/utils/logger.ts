import P from "pino";
import pinoHttp from "pino-http";

export const defaultLogger = P({
  level: process.env.LOG_LEVEL ?? "DEBUG",
});

export const httpLogger = pinoHttp({
  logger: defaultLogger,
});

export interface WithLogger {
  logger: P.Logger;
}

export interface WithLoggerMaybe {
  logger?: P.Logger;
}
