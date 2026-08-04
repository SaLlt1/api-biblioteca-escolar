import { Router } from "express";
import { randomUUID } from "crypto";
import { EmprestimoRepository } from "../models/EmprestimoRepository";
import { Emprestimo } from "../entities/Emprestimo";
import { LivroRepository } from "../models/LivroRepository";
import { AlunoRepository } from "../models/AlunoRepository";
import { authGuard } from "../middlewares/authMiddleware"; // era "../middlewares/authGuard"

const emprestimoRouter = Router();
const emprestimoRepository = new EmprestimoRepository();
const livroRepository = new LivroRepository();
const alunoRepository = new AlunoRepository();

emprestimoRouter.get("/emprestimos", authGuard, (req, res) => {
  const emprestimos = emprestimoRepository.listarTodos();
  res.render("emprestimos/listar", { emprestimos });
});

emprestimoRouter.get("/emprestimos/novo", authGuard, (req, res) => {
  const livros = livroRepository.listarTodos();
  const alunos = alunoRepository.listarTodos();
  res.render("emprestimos/formulario", { emprestimo: null, livros, alunos, erro: null });
});

emprestimoRouter.post("/emprestimos", authGuard, (req, res) => {
  const { livroId, alunoId, dataEmprestimo, dataDevolucaoPrevista } = req.body;
  const novoEmprestimo = new Emprestimo(randomUUID(), livroId, alunoId, dataEmprestimo, dataDevolucaoPrevista);
  const erros = novoEmprestimo.validar();

  if (erros.length > 0) {
    const livros = livroRepository.listarTodos();
    const alunos = alunoRepository.listarTodos();
    return res.render("emprestimos/formulario", { emprestimo: null, livros, alunos, erro: erros.join(" ") });
  }

  emprestimoRepository.criar(novoEmprestimo);
  res.redirect("/emprestimos");
});

emprestimoRouter.get("/emprestimos/:id/editar", authGuard, (req, res) => {
  const id = req.params.id as string;
  const emprestimo = emprestimoRepository.buscarPorId(id);
  if (!emprestimo) return res.status(404).send("Empréstimo não encontrado.");
  const livros = livroRepository.listarTodos();
  const alunos = alunoRepository.listarTodos();
  res.render("emprestimos/formulario", { emprestimo, livros, alunos, erro: null });
});

emprestimoRouter.put("/emprestimos/:id", authGuard, (req, res) => {
  const id = req.params.id as string;
  const emprestimoExistente = emprestimoRepository.buscarPorId(id);
  if (!emprestimoExistente) return res.status(404).send("Empréstimo não encontrado.");

  const { livroId, alunoId, dataEmprestimo, dataDevolucaoPrevista, devolvido } = req.body;
  const emprestimoAtualizado = new Emprestimo(id, livroId, alunoId, dataEmprestimo, dataDevolucaoPrevista, devolvido === "on");
  const erros = emprestimoAtualizado.validar();

  if (erros.length > 0) {
    const livros = livroRepository.listarTodos();
    const alunos = alunoRepository.listarTodos();
    return res.render("emprestimos/formulario", { emprestimo: emprestimoExistente, livros, alunos, erro: erros.join(" ") });
  }

  emprestimoRepository.atualizar(id, emprestimoAtualizado);
  res.redirect("/emprestimos");
});

emprestimoRouter.delete("/emprestimos/:id", authGuard, (req, res) => {
  const id = req.params.id as string;
  emprestimoRepository.remover(id);
  res.redirect("/emprestimos");
});

export default emprestimoRouter;
