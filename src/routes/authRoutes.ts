// authRoutes.ts - registro, login e logout de usuários
import { Router } from "express";
import bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { UsuarioRepository } from "../models/UsuarioRepository";
import { Usuario } from "../entities/Usuario";

const router = Router();
const usuarioRepository = new UsuarioRepository();

// Tela de registro
router.get("/registro", (req, res) => {
  res.render("registro", { erro: null });
});

// Processa o registro
router.post("/registro", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = new Usuario(randomUUID(), nome, email, senhaHash);

    const erros = novoUsuario.validar();
    if (erros.length > 0) {
      return res.render("registro", { erro: erros.join(" ") });
    }

    usuarioRepository.criar(novoUsuario);
    res.redirect("/login");
  } catch (erro) {
    res.status(500).render("registro", { erro: "Erro ao registrar usuário." });
  }
});

// Tela de login
router.get("/login", (req, res) => {
  res.render("login", { erro: null });
});

// Processa o login
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = usuarioRepository.listarTodos().find((u) => u.getEmail() === email);

    if (!usuario) {
      return res.render("login", { erro: "E-mail ou senha inválidos." });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.getSenhaHash());
    if (!senhaCorreta) {
      return res.render("login", { erro: "E-mail ou senha inválidos." });
    }

    (req.session as any).usuarioId = usuario.getId();
    res.redirect("/livros");
  } catch (erro) {
    res.status(500).render("login", { erro: "Erro ao fazer login." });
  }
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

export default router;