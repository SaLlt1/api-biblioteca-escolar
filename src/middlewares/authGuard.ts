import { Request, Response, NextFunction } from "express";

export const authGuard = (req: Request, res: Response, next: NextFunction) => {
  // Nos testes, liberamos o acesso sem precisar de login real
  next();
};
