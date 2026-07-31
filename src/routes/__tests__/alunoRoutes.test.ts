import request from "supertest";
import express from "express";
import session from "express-session";
import alunoRoutes from "../alunoRoutes";
import { AlunoRepository } from "../../models/AlunoRepository";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "test-secret",
  resave: false,
  saveUninitialized: true
}));

app.use((req, res, next) => {
  res.render = (view: string, options?: any) => {
    return res.status(200).send(`Render: ${view}`);
  };
  next();
});

app.get("/login-simulado", (req, res) => {
  (req.session as any).usuarioId = "admin-123";
  res.status(200).send("Logado");
});

app.use("/", alunoRoutes);

const repository = new AlunoRepository();

describe("Aluno Routes - Testes", () => {
  beforeEach(() => {
    if ((repository as any).limpar) {
      (repository as any).limpar();
    }
  });

  it("GET /alunos - deve retornar 200 se logado", async () => {
    const agent = request.agent(app);
    await agent.get("/login-simulado");
    const response = await agent.get("/alunos");
    expect(response.status).toBe(200);
  });

  it("POST /alunos - deve criar um aluno e redirecionar", async () => {
    const agent = request.agent(app);
    await agent.get("/login-simulado");
    const novoAluno = { nome: "Teste", turma: "1A", matricula: "2026" };
    const response = await agent.post("/alunos").send(novoAluno);
    expect(response.status).toBe(302);
    expect(response.header.location).toBe("/alunos");
  });

  it("PUT /alunos/:id - deve atualizar um aluno", async () => {
    const agent = request.agent(app);
    await agent.get("/login-simulado");
    const { Aluno } = require("../../entities/Aluno");
    const id = "a1";
    repository.criar(new Aluno(id, "Original", "1A", "100"));
    const response = await agent.put(`/alunos/${id}`).send({ nome: "Atualizado", turma: "1A", matricula: "100" });
    expect(response.status).toBe(302);
  });

  it("DELETE /alunos/:id - deve remover o aluno", async () => {
    const agent = request.agent(app);
    await agent.get("/login-simulado");
    const { Aluno } = require("../../entities/Aluno");
    const id = "a2";
    repository.criar(new Aluno(id, "Remover", "X", "000"));
    const response = await agent.delete(`/alunos/${id}`);
    expect(response.status).toBe(302);
   
    const alunoExiste = repository.listarTodos().some((a: any) => a.getId() === id);
    expect(alunoExiste).toBe(false);
  });
});
