type LogLevel = "info" | "error" | "warn";

interface Logger {
  info: (...args: any[]) => void;
  error: (...args: any[]) => void;
  warn: (...args: any[]) => void;
}

const createLogMessage = (level: LogLevel, args: any[]): string => {
  const timestamp = new Date().toISOString();
  return `${timestamp} ${level}:`;
};

const logger: Logger = {
  info: (...args: any[]): void => {
    console.log(createLogMessage("info", args), ...args);
  },
  error: (...args: any[]): void => {
    console.log(createLogMessage("error", args), ...args);
  },
  warn: (...args: any[]): void => {
    console.log(createLogMessage("warn", args), ...args);
  },
};

export default logger;
