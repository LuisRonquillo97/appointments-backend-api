export class Logger {
  info(message: string): void {
    console.log(`[INFO] ${new Date().toISOString()} - ${message}`);
  }

  error(message: string, error?: any): void {
    console.error(`[ERROR] ${new Date().toISOString()} - ${message}`, error || '');
  }

  warn(message: string): void {
    console.warn(`[WARN] ${new Date().toISOString()} - ${message}`);
  }

  debug(message: string): void {
    console.debug(`[DEBUG] ${new Date().toISOString()} - ${message}`);
  }
}
