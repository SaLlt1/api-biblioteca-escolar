# 📚 Biblioteca Escolar

Sistema web para gestão de uma biblioteca escolar (livros, alunos e empréstimos), desenvolvido como Projeto Final da UC31 — Codificar Back-end.

> Preencher com uma descrição de 2-3 frases sobre o que o sistema faz.

## Equipe

| Nome completo | Papel |
| --- | --- |
| _preencher_ | Líder técnico |
| _preencher_ | Back-end |
| _preencher_ | Front-end |
| _preencher_ | QA / Testes |

## Tecnologias utilizadas

- Node.js + TypeScript
- Express
- EJS
- Repository Pattern + MVC
- bcrypt + express-session
- Multer (upload de imagens)
- Jest (testes)

## Diagrama de caso de uso

> Inserir diagrama aqui.

## Como executar

```bash
git clone <url-do-repositorio>
cd biblioteca-escolar
npm install
npm run dev
```

## Como rodar os testes

```bash
npm test
```

## Screenshots

> Inserir no mínimo 3 imagens: tela de login, listagem e formulário.

## Estrutura de pastas

```
biblioteca-escolar/
  src/
    entities/       -> Classes OOP (Livro, Aluno, Emprestimo, Usuario)
      __tests__/
    models/         -> Repositories
      __tests__/
    routes/         -> Rotas Express
      __tests__/
    middlewares/    -> Auth guard, upload Multer
    views/          -> Templates EJS
    app.ts
    server.ts
  public/
    css/
    js/
  uploads/          -> Imagens enviadas
  dados/            -> Arquivos JSON
  jest.config.js
  tsconfig.json
  package.json
  README.md
```

## Rotas da API

| Método | Rota | Descrição | Auth? | Status |
| --- | --- | --- | --- | --- |
| POST | /auth/registro | Registrar usuário | Não | 201/400 |
| POST | /auth/login | Login | Não | 200/401 |
| POST | /auth/logout | Logout | Sim | 200 |
| GET | /livros | Listar livros | Sim | 200 |
| POST | /livros | Criar livro (com upload de imagem) | Sim | 201/400 |
| GET | /livros/:id | Detalhes do livro | Sim | 200/404 |
| PUT | /livros/:id | Atualizar livro | Sim | 200/404 |
| DELETE | /livros/:id | Remover livro | Sim | 200/404 |
| GET | /alunos | Listar alunos | Sim | 200 |
| POST | /alunos | Criar aluno | Sim | 201/400 |
| GET | /alunos/:id | Detalhes do aluno | Sim | 200/404 |
| PUT | /alunos/:id | Atualizar aluno | Sim | 200/404 |
| DELETE | /alunos/:id | Remover aluno | Sim | 200/404 |
| GET | /emprestimos | Listar empréstimos | Sim | 200 |
| POST | /emprestimos | Criar empréstimo | Sim | 201/400 |
| PUT | /emprestimos/:id | Atualizar/registrar devolução | Sim | 200/404 |
| DELETE | /emprestimos/:id | Remover empréstimo | Sim | 200/404 |

*(adaptar conforme as rotas reais implementadas)*
