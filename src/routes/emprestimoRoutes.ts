// emprestimoRoutes.ts - CRUD completo de empréstimos (protegido por login)
import { Router } from "express";
import { randomUUID } from "crypto";
import { EmprestimoRepository } from "../models/EmprestimoRepository";
import { Emprestimo } from "../entities/Emprestimo";
import { LivroRepository } from "../models/LivroRepository";
import { AlunoRepository } from "../models/AlunoRepository";
import { authGuard } from "../middlewares/authGuard";

const router = Router();
const emprestimoRepository = new EmprestimoRepository();
const livroRepository = new LivroRepository();
const alunoRepository = new AlunoRepository();

// Listar todos
router.get("/emprestimos", authGuard, (req, res) => {
  const emprestimos = emprestimoRepository.listarTodos();
  res.render("emprestimos/listar", { emprestimos });
});

// Formulário de criação (manda livros e alunos pra popular os <select>)
router.get("/emprestimos/novo", authGuard, (req, res) => {
  const livros = livroRepository.listarTodos();
  const alunos = alunoRepository.listarTodos();
  res.render("emprestimos/formulario", { emprestimo: null, livros, alunos, erro: null });
});

// Criar
router.post("/emprestimos", authGuard, (req, res) => {
  const { livroId, alunoId, dataEmprestimo, dataDevolucaoPrevista } = req.body;

  const novoEmprestimo = new Emprestimo(
    randomUUID(),
    livroId,
    alunoId,
    dataEmprestimo,
    dataDevolucaoPrevista
  );
  const erros = novoEmprestimo.validar();

  if (erros.length > 0) {
    const livros = livroRepository.listarTodos();
    const alunos = alunoRepository.listarTodos();
    return res.render("emprestimos/formulario", { emprestimo: null, livros, alunos, erro: erros.join(" ") });
  }

  emprestimoRepository.criar(novoEmprestimo);
  res.redirect("/emprestimos");
});

// Formulário de edição
router.get("/emprestimos/:id/editar", authGuard, (req, res) => {
  const emprestimo = emprestimoRepository.buscarPorId(req.params.id);
  if (!emprestimo) return res.status(404).send("Empréstimo não encontrado.");
  const livros = livroRepository.listarTodos();
  const alunos = alunoRepository.listarTodos();
  res.render("emprestimos/formulario", { emprestimo, livros, alunos, erro: null });
});

// Atualizar
router.put("/emprestimos/:id", authGuard, (req, res) => {
  const emprestimoExistente = emprestimoRepository.buscarPorId(req.params.id);
  if (!emprestimoExistente) return res.status(404).send("Empréstimo não encontrado.");

  const { livroId, alunoId, dataEmprestimo, dataDevolucaoPrevista, devolvido } = req.body;
  const emprestimoAtualizado = new Emprestimo(
    req.params.id,
    livroId,
    alunoId,
    dataEmprestimo,
    dataDevolucaoPrevista,
    devolvido === "on" // checkbox HTML manda "on" quando marcado
  );
  const erros = emprestimoAtualizado.validar();

  if (erros.length > 0) {
    const livros = livroRepository.listarTodos();
    const alunos = alunoRepository.listarTodos();
    return res.render("emprestimos/formulario", { emprestimo: emprestimoExistente, livros, alunos, erro: erros.join(" ") });
  }

  emprestimoRepository.atualizar(req.params.id, emprestimoAtualizado);
  res.redirect("/emprestimos");
});

// Remover
router.delete("/emprestimos/:id", authGuard, (req, res) => {
  emprestimoRepository.remover(req.params.id);
  res.redirect("/emprestimos");
});

export default router;