import request from "supertest";
import express from "express";
import livroRoutes from "../livroRoutes";
import { LivroRepository } from "../../models/LivroRepository";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  res.render = (view: string, options?: any) => {
    return res.status(200).send(`Renderizou: ${view}`);
  };
  next();
});

app.use("/", livroRoutes);

const repository = new LivroRepository();

describe("Livro Routes - Testes de Integração", () => {
  
  beforeEach(() => {

    if ((repository as any).limpar) (repository as any).limpar();
  });

  it("GET /livros - deve retornar status 200", async () => {
    const response = await request(app).get("/livros");
    
    expect(response.status).toBe(200);
  });

  it("POST /livros - deve criar um livro e redirecionar", async () => {
    const novoLivro = {
      titulo: "Dom Casmurro",
      autor: "Machado de Assis",
      anoPublicacao: "1899"
    };

    const response = await request(app)
      .post("/livros")
      .send(novoLivro);

    expect(response.status).toBe(302);
    expect(response.header.location).toBe("/livros");
  });

  it("DELETE /livros/:id - deve remover o livro e redirecionar", async () => {

    const { randomUUID } = require("crypto");
    const { Livro } = require("../../entities/Livro");
    const id = randomUUID();
    repository.criar(new Livro(id, "Teste", "Autor", 2024));

    const response = await request(app).delete(`/livros/${id}`);
    
    expect(response.status).toBe(302);
    expect(response.header.location).toBe("/livros");
  });
});
