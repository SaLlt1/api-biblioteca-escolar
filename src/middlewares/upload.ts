import { Request, Response, NextFunction } from "express";

export const upload = {
  single: (fieldName: string) => (req: Request, res: Response, next: NextFunction) => {
    // Simula o comportamento do multer sem salvar arquivos no disco
    next();
  }
};
