export class AppError extends Error {
  public readonly statusCode: number;
  public readonly errors: string[];

  constructor(message: string | string[], statusCode = 400) {
    const mainMessage = Array.isArray(message) ? message[0] : message;
    super(mainMessage);

    this.statusCode = statusCode;
    this.name = this.constructor.name;
    this.errors = Array.isArray(message) ? message : [message];

    Error.captureStackTrace(this, this.constructor);
  }
}
