
import request from "supertest";
import express from "express";
import session from "express-session";
import emprestimoRoutes from "../emprestimoRoutes";


import { EmprestimoRepository } from "../../models/EmprestimoRepository";
import { LivroRepository } from "../../models/LivroRepository";
import { AlunoRepository } from "../../models/AlunoRepository";
import { Emprestimo } from "../../entities/Emprestimo";

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

app.use("/", emprestimoRoutes);

const repository = new EmprestimoRepository();

describe("Emprestimo Routes - Testes", () => {
  beforeEach(() => {
    if ((repository as any).limpar) (repository as any).limpar();
  });

  it("GET /emprestimos - deve retornar 200 se logado", async () => {
    const agent = request.agent(app);
    await agent.get("/login-simulado");
    const response = await agent.get("/emprestimos");
    expect(response.status).toBe(200);
  });

  it("POST /emprestimos - deve criar um emprestimo e redirecionar", async () => {
    const agent = request.agent(app);
    await agent.get("/login-simulado");
    const novo = {
      livroId: "l1",
      alunoId: "a1",
      dataEmprestimo: "2026-01-01",
      dataDevolucaoPrevista: "2026-01-08"
    };
    const response = await agent.post("/emprestimos").send(novo);
    expect(response.status).toBe(302);
    expect(response.header.location).toBe("/emprestimos");
  });

  it("DELETE /emprestimos/:id - deve remover o emprestimo", async () => {
    const agent = request.agent(app);
    await agent.get("/login-simulado");
    const id = "e1";
    repository.criar(new Emprestimo(id, "L1", "A1", "2026-01-01", "2026-01-08"));
    const response = await agent.delete(`/emprestimos/${id}`);
    expect(response.status).toBe(302);
  });
});
