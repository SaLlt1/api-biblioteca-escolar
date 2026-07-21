// app.ts - configuração central do Express (middlewares, view engine, rotas)
import express from "express";
import session from "express-session";
import methodOverride from "method-override";
import path from "path";

const app = express();

// Configura o EJS como view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Permite ler dados de formulários (POST) e JSON (fetch)
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Permite usar métodos PUT/DELETE em formulários HTML (que só suportam GET/POST)
app.use(methodOverride("_method"));

// Serve arquivos estáticos (css, js do navegador, imagens enviadas)
app.use(express.static(path.join(__dirname, "..", "public")));
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// Sessão (necessária pro login funcionar)
app.use(
  session({
    secret: "troque-essa-chave-depois", // depois trocamos por variável de ambiente
    resave: false,
    saveUninitialized: false,
  })
);

// Rota de teste só pra confirmar que tá tudo funcionando
app.get("/", (req, res) => {
  res.send("Servidor da biblioteca escolar funcionando!");
});

export default app;