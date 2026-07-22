// alunoRoutes.ts - CRUD completo de alunos (protegido por login)
import { Router } from "express";
import { randomUUID } from "crypto";
import { AlunoRepository } from "../models/AlunoRepository";
import { Aluno } from "../entities/Aluno";
import { authGuard } from "../middlewares/authGuard";

const router = Router();
const alunoRepository = new AlunoRepository();

// Listar todos
router.get("/alunos", authGuard, (req, res) => {
  const alunos = alunoRepository.listarTodos();
  res.render("alunos/listar", { alunos });
});

// Formulário de criação
router.get("/alunos/novo", authGuard, (req, res) => {
  res.render("alunos/formulario", { aluno: null, erro: null });
});

// Criar
router.post("/alunos", authGuard, (req, res) => {
  const { nome, turma, matricula } = req.body;

  const novoAluno = new Aluno(randomUUID(), nome, turma, matricula);
  const erros = novoAluno.validar();

  if (erros.length > 0) {
    return res.render("alunos/formulario", { aluno: null, erro: erros.join(" ") });
  }

  alunoRepository.criar(novoAluno);
  res.redirect("/alunos");
});

// Formulário de edição
router.get("/alunos/:id/editar", authGuard, (req, res) => {
  const aluno = alunoRepository.buscarPorId(req.params.id);
  if (!aluno) return res.status(404).send("Aluno não encontrado.");
  res.render("alunos/formulario", { aluno, erro: null });
});

// Atualizar
router.put("/alunos/:id", authGuard, (req, res) => {
  const alunoExistente = alunoRepository.buscarPorId(req.params.id);
  if (!alunoExistente) return res.status(404).send("Aluno não encontrado.");

  const { nome, turma, matricula } = req.body;
  const alunoAtualizado = new Aluno(req.params.id, nome, turma, matricula);
  const erros = alunoAtualizado.validar();

  if (erros.length > 0) {
    return res.render("alunos/formulario", { aluno: alunoExistente, erro: erros.join(" ") });
  }

  alunoRepository.atualizar(req.params.id, alunoAtualizado);
  res.redirect("/alunos");
});

// Remover
router.delete("/alunos/:id", authGuard, (req, res) => {
  alunoRepository.remover(req.params.id);
  res.redirect("/alunos");
});

export default router;