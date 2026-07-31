import { EmprestimoRepository } from "../EmprestimoRepository";
import { Emprestimo } from "../../entities/Emprestimo";
import fs from "fs";
import path from "path";

describe("EmprestimoRepository - Testes de Persistência", () => {
  const repository = new EmprestimoRepository();
  const CAMINHO_ARQUIVO = path.join(__dirname, "..", "..", "..", "dados", "emprestimos.json");

  beforeEach(() => {
    if ((repository as any).limpar) {
      (repository as any).limpar();
    }
  });

  it("deve persistir um novo emprestimo no arquivo JSON", () => {
    const emprestimo = new Emprestimo("e1", "livro-1", "aluno-1", "2026-07-22", "2026-07-29");
    repository.criar(emprestimo);

    const conteudo = fs.readFileSync(CAMINHO_ARQUIVO, "utf-8");
    const dados = JSON.parse(conteudo);
    
    expect(dados).toHaveLength(1);
    expect(dados[0].id).toBe("e1");
  });

  it("deve listar todos os emprestimos", () => {
    repository.criar(new Emprestimo("e1", "L1", "A1", "2026-01-01", "2026-01-08"));
    repository.criar(new Emprestimo("e2", "L2", "A2", "2026-02-01", "2026-02-08"));

    const lista = repository.listarTodos();
    expect(lista).toHaveLength(2);
    expect(lista[0]).toBeInstanceOf(Emprestimo);
  });

  it("deve buscar um emprestimo por ID", () => {
    repository.criar(new Emprestimo("e3", "L3", "A3", "2026-03-01", "2026-03-08"));
    const encontrado = repository.buscarPorId("e3");
    expect(encontrado?.getLivroId()).toBe("L3");
  });

  it("deve atualizar um emprestimo", () => {
    const original = new Emprestimo("e4", "L4", "A4", "2026-04-01", "2026-04-08");
    repository.criar(original);

    const atualizado = new Emprestimo("e4", "L4", "A4", "2026-04-01", "2026-04-15", true);
    const sucesso = repository.atualizar("e4", atualizado);

    expect(sucesso).toBe(true);
    const buscado = repository.buscarPorId("e4");
    expect(buscado?.isDevolvido()).toBe(true);
  });

  it("deve remover um emprestimo", () => {
    repository.criar(new Emprestimo("e5", "L5", "A5", "2026-05-01", "2026-05-08"));
    const sucesso = repository.remover("e5");
    expect(sucesso).toBe(true);
    expect(repository.listarTodos()).toHaveLength(0);
  });
});
