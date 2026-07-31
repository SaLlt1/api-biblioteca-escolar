import request from "supertest";
import express from "express";
import session from "express-session";
import authRoutes from "../authRoutes";
import { UsuarioRepository } from "../../models/UsuarioRepository";
import bcrypt from "bcrypt";

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
    const output = `Render: ${view}${options && options.erro ? ` - Erro: ${options.erro}` : ""}`;
    return res.status(200).send(output);
  };
  next();
});

app.use("/", authRoutes);

const repository = new UsuarioRepository();

describe("Auth Routes - Testes", () => {
  beforeEach(() => {
    if ((repository as any).limpar) {
      (repository as any).limpar();
    }
  });

  it("GET /registro - deve retornar 200", async () => {
    const response = await request(app).get("/registro");
    expect(response.status).toBe(200);
  });

  it("POST /registro - deve criar um usuário e redirecionar", async () => {
    const response = await request(app)
      .post("/registro")
      .send({ nome: "Teste", email: "teste@email.com", senha: "123" });
    expect(response.status).toBe(302);
  });

  it("POST /login - deve autenticar e redirecionar", async () => {
    const hash = await bcrypt.hash("123", 10);
    const { Usuario } = require("../../entities/Usuario");
    repository.criar(new Usuario("u1", "User", "user@email.com", hash));
    
    const agent = request.agent(app);
    const response = await agent
      .post("/login")
      .send({ email: "user@email.com", senha: "123" });
    
    expect(response.status).toBe(302);
    expect(response.header.location).toBe("/livros");
  });

  it("POST /logout - deve destruir a sessão e redirecionar", async () => {
    const response = await request(app).post("/logout");
    expect(response.status).toBe(302);
    expect(response.header.location).toBe("/login");
  });
});
