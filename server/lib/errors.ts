import type { Response } from "express";

export interface FieldError {
  field: string;
  message: string;
}

/** Sends the project's standard error envelope: { error: { code, message, details? } }. */
export function sendError(
  res: Response,
  status: number,
  code: string,
  message: string,
  details?: FieldError[],
): void {
  res.status(status).json({ error: details ? { code, message, details } : { code, message } });
}
