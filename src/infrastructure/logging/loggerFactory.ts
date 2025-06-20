// src/infrastructure/logging/loggerFactory.ts
import { Logger } from '../../domain/ports/logger';
import { ConsoleLogger } from './consoleLogger';

export class LoggerFactory {
  private static loggers: Map<string, Logger> = new Map();

  static getLogger(context: string): Logger {
    if (!this.loggers.has(context)) {
      // Aquí podrías elegir diferentes implementaciones según el entorno
      this.loggers.set(context, new ConsoleLogger());
    }
    return this.loggers.get(context)!;
  }
}
