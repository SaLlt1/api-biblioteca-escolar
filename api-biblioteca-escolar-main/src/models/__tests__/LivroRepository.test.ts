import { LivroRepository } from "../LivroRepository";
import { Livro } from "../../entities/Livro";
import fs from "fs";
import path from "path";

describe("LivroRepository - Testes de Persistência", () => {
  const repository = new LivroRepository();
  const CAMINHO_ARQUIVO = path.join(__dirname, "..", "..", "..", "dados", "livros.json");

  beforeEach(() => {
    if ((repository as any).limpar) {
      (repository as any).limpar();
    }
  });

  it("deve persistir um novo livro no arquivo JSON", () => {
    const livro = new Livro("l1", "Dom Casmurro", "Machado de Assis", 1899);
    repository.criar(livro);

    const conteudo = fs.readFileSync(CAMINHO_ARQUIVO, "utf-8");
    const dados = JSON.parse(conteudo);
    
    expect(dados).toHaveLength(1);
    expect(dados[0].titulo).toBe("Dom Casmurro");
  });

  it("deve listar todos os livros salvos", () => {
    repository.criar(new Livro("l1", "Livro 1", "Autor 1", 2000));
    repository.criar(new Livro("l2", "Livro 2", "Autor 2", 2010));

    const lista = repository.listarTodos();
    expect(lista).toHaveLength(2);
    expect(lista[0]).toBeInstanceOf(Livro);
  });

  it("deve buscar um livro por ID no arquivo", () => {
    repository.criar(new Livro("l3", "Busca", "Autor", 2020));
    const encontrado = repository.buscarPorId("l3");
    expect(encontrado?.getTitulo()).toBe("Busca");
  });

  it("deve atualizar os dados de um livro no arquivo JSON", () => {
    const original = new Livro("l4", "Original", "Autor", 2000);
    repository.criar(original);

    const atualizado = new Livro("l4", "Atualizado", "Autor", 2000);
    const sucesso = repository.atualizar("l4", atualizado);

    expect(sucesso).toBe(true);
    const buscado = repository.buscarPorId("l4");
    expect(buscado?.getTitulo()).toBe("Atualizado");
  });

  it("deve remover um livro do arquivo JSON", () => {
    repository.criar(new Livro("l5", "Remover", "Autor", 2024));
    const sucesso = repository.remover("l5");
    expect(sucesso).toBe(true);
    expect(repository.listarTodos()).toHaveLength(0);
  });
});
