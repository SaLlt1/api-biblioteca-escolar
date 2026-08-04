// authRoutes.ts - registro, login e logout de usuarios (sessao + bcrypt)
import { Router } from "express";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { UsuarioRepository } from "../models/UsuarioRepository";
import { Usuario } from "../entities/Usuario";

const router = Router();
const usuarioRepository = new UsuarioRepository();

// Tela de registro
router.get("/registro", (req, res) => {
  res.render("auth/registro", { erro: null });
});

// Criar conta
router.post("/registro", async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (usuarioRepository.buscarPorEmail(email)) {
      return res.render("auth/registro", { erro: "Este e-mail já está cadastrado." });
    }

    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = new Usuario(randomUUID(), nome, email, senhaHash);
    const erros = novoUsuario.validar();

    if (erros.length > 0) {
      return res.render("auth/registro", { erro: erros.join(" ") });
    }

    usuarioRepository.criar(novoUsuario);
    res.redirect("/login");
  } catch (erro) {
    res.status(500).render("auth/registro", { erro: "Erro ao criar a conta." });
  }
});

// Tela de login
router.get("/login", (req, res) => {
  res.render("auth/login", { erro: null });
});

// Autenticar
router.post("/login", async (req, res) => {
  try {
    const { email, senha } = req.body;
    const usuario = usuarioRepository.buscarPorEmail(email);

    if (!usuario) {
      return res.render("auth/login", { erro: "E-mail ou senha inválidos." });
    }

    const senhaCorreta = await bcrypt.compare(senha, usuario.getSenhaHash());
    if (!senhaCorreta) {
      return res.render("auth/login", { erro: "E-mail ou senha inválidos." });
    }

    (req.session as any).usuarioId = usuario.getId();
    res.redirect("/livros");
  } catch (erro) {
    res.status(500).render("auth/login", { erro: "Erro ao entrar." });
  }
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

export default router;