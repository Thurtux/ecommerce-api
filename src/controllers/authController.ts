import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();
const SECRET = process.env.JWT_SECRET as string;

// Função auxiliar para gerar token JWT
const generateToken = (id: number, email: string, role: string) => {
  return jwt.sign({ id, email, role }, SECRET, { expiresIn: "1h" });
};

// Registrar usuário comum
export const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    // Verifica se o email já está cadastrado
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: "Email já está em uso" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json({ message: "Usuário registrado com sucesso!", user });
  } catch (error) {
    console.error("Erro ao registrar usuário:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Login usuário comum
export const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      res.status(401).json({ message: "Usuário não encontrado" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Senha incorreta" });
      return;
    }

    const token = generateToken(user.id, user.email, "user");

    res.status(200).json({ message: "Login bem-sucedido", token });
  } catch (error) {
    console.error("Erro no login do usuário:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};

// Registrar administrador
export const registerAdmin = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password } = req.body;

  try {
    // Verifica se o email já está cadastrado
    const existingAdmin = await prisma.admin.findUnique({ where: { email } });
    if (existingAdmin) {
      res.status(400).json({ error: "Email já está em uso" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = await prisma.admin.create({
      data: { name, email, password: hashedPassword },
    });

    res.status(201).json({ message: "Administrador registrado!", admin });
  } catch (error) {
    console.error("Erro ao registrar admin:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

// Login administrador
export const loginAdmin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const admin = await prisma.admin.findUnique({ where: { email } });

    if (!admin) {
      res.status(401).json({ message: "Admin não encontrado" });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Senha incorreta" });
      return;
    }

    const token = generateToken(admin.id, admin.email, "admin");

    res.status(200).json({ message: "Login bem-sucedido", token });
  } catch (error) {
    console.error("Erro no login do admin:", error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
};
