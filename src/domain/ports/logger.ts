/**
 * Logger interface.
 */
export interface Logger {
  /**
   * Debug level logging.
   * @param message Log message.
   * @param meta Extra data to log.
   */
  debug(message: string, meta?: Record<string, any>): void;
  /**
   * Information level logging.
   * @param message Log message.
   * @param meta extra data to log.
   */
  info(message: string, meta?: Record<string, any>): void;
  /**
   * Warning level logging.
   * @param message Log message.
   * @param meta Extra data to log.
   */
  warn(message: string, meta?: Record<string, any>): void;
  /**
   * Error level logging.
   * @param message Log message.
   * @param meta Extra data to log.
   */
  error(message: string, meta?: Record<string, any>): void;
  /**
   * Fatal level logging.
   * @param message Log message.
   * @param meta Extra data to log.
   */
  fatal(message: string, meta?: Record<string, any>): void;
}
