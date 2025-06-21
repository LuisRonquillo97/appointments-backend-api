import { Logger } from '../../domain/ports/logger';

/**
 * Null logger instance. Used on tests.
 * @implements Logger.
 */
export class NullLogger implements Logger {
  debug(): void {}
  info(): void {}
  warn(): void {}
  error(): void {}
  fatal(): void {}
}
