// app.ts - configuração central do Express (middlewares, view engine, rotas)
import express from "express";
import session from "express-session";
import methodOverride from "method-override";
import path from "path";
import { LivroRepository } from "./models/LivroRepository";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(methodOverride("_method"));

app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use(
  session({
    secret: "troque-essa-chave-depois",
    resave: false,
    saveUninitialized: false,
  })
);

import authRoutes from "./routes/authRoutes";
import livroRoutes from "./routes/livroRoutes";
import alunoRoutes from "./routes/alunoRoutes";
import emprestimoRoutes from "./routes/emprestimoRoutes";

app.use(authRoutes);
app.use(livroRoutes);
app.use(alunoRoutes);
app.use(emprestimoRoutes);

const livroRepositoryHome = new LivroRepository();

app.get("/", (req, res) => {
  const livrosEmDestaque = livroRepositoryHome.listarTodos().slice(0, 4);
  res.render("index", { livros: livrosEmDestaque });
});

export default app;