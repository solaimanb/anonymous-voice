export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class AuthError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, 401);
    this.name = "AuthError";
  }
}

export class DatabaseError extends AppError {
  constructor(code: string, message: string) {
    super(code, message, 500);
    this.name = "DatabaseError";
  }
}
