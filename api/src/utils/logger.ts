import postToSlack from "./postToSlack";

enum LogLevel {
  trace = 1,
  debug = 2,
  info = 3,
  warn = 4,
  error = 5,
  fatal = 6,
  silent = 99,
}

function parseLogLevel(input?: string) {
  switch ((input ?? "info").toLowerCase()) {
    case "trace":
      return LogLevel.trace;
    case "debug":
      return LogLevel.debug;
    case "info":
      return LogLevel.info;
    case "warn":
      return LogLevel.warn;
    case "error":
      return LogLevel.error;
    case "fatal":
      return LogLevel.fatal;
    case "silent":
      return LogLevel.silent;
  }
  return LogLevel.info;
}

function toLogLevelName(level: LogLevel) {
  switch (level) {
    case LogLevel.trace:
      return "trace";
    case LogLevel.debug:
      return "debug";
    case LogLevel.info:
      return "info";
    case LogLevel.warn:
      return "warn";
    case LogLevel.error:
      return "error";
    case LogLevel.fatal:
      return "fatal";
    case LogLevel.silent:
      return "silent";
  }
}

const maxSlackTextLength = 24 * 1024;
let slackPromise: Promise<void> = Promise.resolve();

export class Logger {
  constructor(
    private readonly componentName: string,
    private readonly filename: string,
    public consoleLevel: LogLevel = LogLevel.trace,
    public slackLevel: LogLevel = LogLevel.info
  ) {}

  public trace = (context: unknown, message: string): void =>
    this.write(LogLevel.trace, context, message);
  public debug = (context: unknown, message: string): void =>
    this.write(LogLevel.debug, context, message);
  public info = (context: unknown, message: string): void =>
    this.write(LogLevel.info, context, message);
  public warn = (context: unknown, message: string): void =>
    this.write(LogLevel.warn, context, message);
  public error = (context: unknown, message: string): void =>
    this.write(LogLevel.error, context, message);
  public fatal = (context: unknown, message: string): void =>
    this.write(LogLevel.fatal, context, message);

  private write = (
    level: LogLevel,
    context: unknown,
    message: string
  ): void => {
    if (this.consoleLevel <= level) {
      console.log(
        new Date().toISOString(),
        this.componentName,
        this.filename,
        toLogLevelName(level).toUpperCase(),
        message,
        context
      );
    }
    if (this.slackLevel <= level) {
      slackPromise = slackPromise.then(() =>
        postToSlack(
          `[${toLogLevelName(level).toUpperCase()}] ${message}\n` +
            "```" +
            JSON.stringify(
              {
                timestamp: new Date().toISOString(),
                componentName: this.componentName,
                filename: this.filename,
                context,
              },
              null,
              2
            ).slice(0, maxSlackTextLength) +
            "```"
        )
      );
    }
  };
}

export const logger = {
  get: (componentName: string, filename: string): Logger =>
    new Logger(
      componentName,
      filename,
      parseLogLevel(process.env.CONSOLE_LOG_LEVEL),
      parseLogLevel(process.env.SLACK_LOG_LEVEL)
    ),
};

export const flushSlack = (): Promise<void> => slackPromise;
