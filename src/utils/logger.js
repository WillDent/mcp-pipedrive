import winston from 'winston';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '../..');

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log level based on environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : process.env.LOG_LEVEL || 'info';
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

// Add colors to winston
winston.addColors(colors);

// Define the format for logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Ensure logs directory exists
let logsDir = path.join(projectRoot, 'logs');
try {
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
    process.stderr.write(`Created logs directory at: ${logsDir}\n`);
  }
} catch (error) {
  process.stderr.write(`Error creating logs directory: ${error.message}\n`);
  // Fallback to a directory we know exists
  const fallbackDir = path.join(process.env.HOME || process.env.USERPROFILE || '/tmp', 'pipedrive-mcp-logs');
  try {
    if (!fs.existsSync(fallbackDir)) {
      fs.mkdirSync(fallbackDir, { recursive: true });
    }
    process.stderr.write(`Using fallback logs directory: ${fallbackDir}\n`);
    logsDir = fallbackDir;
  } catch (fallbackError) {
    process.stderr.write(`Error creating fallback logs directory: ${fallbackError.message}\n`);
  }
}

// Define which transports to use
const transports = [
  new winston.transports.Console({
    stderrLevels: ['error', 'warn', 'info', 'http', 'debug'], // Send all logs to stderr
  }),
  new winston.transports.File({
    filename: path.join(logsDir, 'error.log'),
    level: 'error',
  }),
  new winston.transports.File({ 
    filename: path.join(logsDir, 'all.log') 
  }),
];

// Create the logger
const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
});

export default logger; 