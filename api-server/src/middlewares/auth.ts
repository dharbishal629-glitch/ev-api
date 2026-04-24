import { type Request, type Response, type NextFunction } from "express";
import { verifySync } from "otplib";

function safeTotpVerify(token: string, secret: string): boolean {
  if (!token || !secret) return false;
  try {
    const result = verifySync({ token, secret });
    return result.valid === true;
  } catch (_err) {
    return false;
  }
}

export function requireApiKey(req: Request, res: Response, next: NextFunction): void {
  const apiKey = req.headers["x-api-key"] as string;
  const totpCode = req.headers["x-totp-code"] as string;

  if (!apiKey) {
    res.status(401).json({ error: "Missing x-api-key header" });
    return;
  }

  if (apiKey !== process.env.WORKER_API_KEY) {
    res.status(401).json({ error: "Invalid API key" });
    return;
  }

  const totpSecret = process.env.TOTP_SECRET || "";

  if (!totpSecret) {
    res.status(500).json({ error: "Server 2FA not configured" });
    return;
  }

  if (!totpCode) {
    res.status(401).json({ error: "Missing x-totp-code header (2FA required)" });
    return;
  }

  if (!safeTotpVerify(totpCode, totpSecret)) {
    res.status(401).json({ error: "Invalid or expired 2FA code" });
    return;
  }

  next();
}
