// authGuard.ts - middleware que bloqueia acesso a rotas se o usuário não estiver logado
import { Request, Response, NextFunction } from "express";

export function authGuard(req: Request, res: Response, next: NextFunction) {
  if (req.session && (req.session as any).usuarioId) {
    return next(); // usuário logado, pode seguir
  }
  return res.redirect("/login"); // não logado, manda pro login
}