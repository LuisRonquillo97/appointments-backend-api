import { Logger } from '../../domain/ports/logger';
import { ConsoleLogger } from './consoleLogger';

/**
 * Logger factory class.
 */
export class LoggerFactory {
  private static loggers: Map<string, Logger> = new Map();

  /**
   * Get a logger instance.
   * @param context - The context of the logger.
   * @returns A logger instance.
   */
  static getLogger(context: string): Logger {
    if (!this.loggers.has(context)) {
      // Aquí podrías elegir diferentes implementaciones según el entorno
      this.loggers.set(context, new ConsoleLogger());
    }
    return this.loggers.get(context)!;
  }
}
