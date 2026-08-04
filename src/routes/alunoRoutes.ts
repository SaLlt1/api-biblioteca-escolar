import { Router } from "express";
import { randomUUID } from "crypto";
import { AlunoRepository } from "../models/AlunoRepository";
import { Aluno } from "../entities/Aluno";
import { authGuard } from "../middlewares/authMiddleware"; // era "../middlewares/authGuard"

const router = Router();
const alunoRepository = new AlunoRepository();

router.get("/alunos", authGuard, (req, res) => {
  const alunos = alunoRepository.listarTodos();
  res.render("alunos/listar", { alunos });
});

router.get("/alunos/novo", authGuard, (req, res) => {
  res.render("alunos/formulario", { aluno: null, erro: null });
});

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

router.get("/alunos/:id/editar", authGuard, (req, res) => {
  const id = req.params.id as string;
  const aluno = alunoRepository.buscarPorId(id);
  if (!aluno) return res.status(404).send("Aluno não encontrado.");
  res.render("alunos/formulario", { aluno, erro: null });
});

router.put("/alunos/:id", authGuard, (req, res) => {
  const id = req.params.id as string;
  const alunoExistente = alunoRepository.buscarPorId(id);
  if (!alunoExistente) return res.status(404).send("Aluno não encontrado.");

  const { nome, turma, matricula } = req.body;
  const alunoAtualizado = new Aluno(id, nome, turma, matricula);
  const erros = alunoAtualizado.validar();

  if (erros.length > 0) {
    return res.render("alunos/formulario", { aluno: alunoExistente, erro: erros.join(" ") });
  }

  alunoRepository.atualizar(id, alunoAtualizado);
  res.redirect("/alunos");
});

router.delete("/alunos/:id", authGuard, (req, res) => {
  const id = req.params.id as string;
  alunoRepository.remover(id);
  res.redirect("/alunos");
});

export default router;
