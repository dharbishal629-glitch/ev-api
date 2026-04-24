import { type Request, type Response, type NextFunction } from "express";

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const adminKey = req.headers["x-admin-key"] as string;

  if (!adminKey) {
    res.status(403).json({ error: "Missing x-admin-key header" });
    return;
  }

  if (adminKey !== process.env.ADMIN_KEY) {
    res.status(403).json({ error: "Invalid admin key" });
    return;
  }

  (req as any).isAdmin = true;
  next();
}

// Optional admin check — sets req.isAdmin without blocking
export function checkAdmin(req: Request, _res: Response, next: NextFunction): void {
  const adminKey = req.headers["x-admin-key"] as string;
  if (adminKey && adminKey === process.env.ADMIN_KEY) {
    (req as any).isAdmin = true;
  }
  next();
}
