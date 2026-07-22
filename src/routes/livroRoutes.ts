// livroRoutes.ts - CRUD completo de livros (protegido por login)
import { Router } from "express";
import { randomUUID } from "crypto";
import { LivroRepository } from "../models/LivroRepository";
import { Livro } from "../entities/Livro";
import { authGuard } from "../middlewares/authGuard";
import { upload } from "../middlewares/upload";

const router = Router();
const livroRepository = new LivroRepository();

// Listar todos
router.get("/livros", authGuard, (req, res) => {
  const livros = livroRepository.listarTodos();
  res.render("livros/listar", { livros });
});

// Formulário de criação
router.get("/livros/novo", authGuard, (req, res) => {
  res.render("livros/formulario", { livro: null, erro: null });
});

// Criar
router.post("/livros", authGuard, upload.single("capa"), (req, res) => {
  const { titulo, autor, anoPublicacao } = req.body;
  const capaUrl = req.file ? `/uploads/${req.file.filename}` : null;

  const novoLivro = new Livro(randomUUID(), titulo, autor, Number(anoPublicacao), capaUrl);
  const erros = novoLivro.validar();

  if (erros.length > 0) {
    return res.render("livros/formulario", { livro: null, erro: erros.join(" ") });
  }

  livroRepository.criar(novoLivro);
  res.redirect("/livros");
});

// Formulário de edição
router.get("/livros/:id/editar", authGuard, (req, res) => {
  const livro = livroRepository.buscarPorId(req.params.id);
  if (!livro) return res.status(404).send("Livro não encontrado.");
  res.render("livros/formulario", { livro, erro: null });
});

// Atualizar
router.put("/livros/:id", authGuard, upload.single("capa"), (req, res) => {
  const livroExistente = livroRepository.buscarPorId(req.params.id);
  if (!livroExistente) return res.status(404).send("Livro não encontrado.");

  const { titulo, autor, anoPublicacao } = req.body;
  const capaUrl = req.file ? `/uploads/${req.file.filename}` : livroExistente.getCapaUrl();

  const livroAtualizado = new Livro(req.params.id, titulo, autor, Number(anoPublicacao), capaUrl);
  const erros = livroAtualizado.validar();

  if (erros.length > 0) {
    return res.render("livros/formulario", { livro: livroExistente, erro: erros.join(" ") });
  }

  livroRepository.atualizar(req.params.id, livroAtualizado);
  res.redirect("/livros");
});

// Remover
router.delete("/livros/:id", authGuard, (req, res) => {
  livroRepository.remover(req.params.id);
  res.redirect("/livros");
});

export default router;