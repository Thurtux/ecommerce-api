import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET = process.env.JWT_SECRET as string;

// Definição do tipo correto para `req.user`
interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: string;
  };
}

// Middleware para verificar autenticação
export const verifyToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header("Authorization")?.split(" ")[1]; // Pegando o token do header

  if (!token) {
    res.status(401).json({ error: "Acesso negado. Token não fornecido." });
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET) as { id: number; email: string; role: string };
    req.user = decoded; // Agora req.user tem email e role corretamente tipados
    next();
  } catch (error) {
    res.status(403).json({ error: "Token inválido." });
  }
};

// Middleware para verificar se o usuário é admin
export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== "admin") {
    res.status(403).json({ error: "Acesso negado. Apenas administradores podem realizar esta ação." });
    return;
  }
  next();
};
