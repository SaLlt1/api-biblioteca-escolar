import { AlunoRepository } from "../AlunoRepository";
import { Aluno } from "../../entities/Aluno"; 
import fs from "fs";
import path from "path";

describe("AlunoRepository - Testes de Integração (Persistência JSON)", () => {
  const repository = new AlunoRepository();

  const CAMINHO_ARQUIVO = path.join(__dirname, "..", "..", "..", "dados", "alunos.json");

  beforeEach(() => {
    repository.limpar();
  });

  it("deve persistir um novo aluno no arquivo JSON", () => {
    const aluno = new Aluno("1", "Carlos Teste", "3º A", "2026001");
    repository.criar(aluno);

    const conteudo = fs.readFileSync(CAMINHO_ARQUIVO, "utf-8");
    const dados = JSON.parse(conteudo);
    
    expect(dados).toHaveLength(1);
    expect(dados[0].nome).toBe("Carlos Teste");
  });

  it("deve listar todos os alunos a partir do arquivo JSON", () => {
    repository.criar(new Aluno("1", "Aluno 1", "1A", "101"));
    repository.criar(new Aluno("2", "Aluno 2", "1A", "102"));

    const lista = repository.listarTodos();
    expect(lista).toHaveLength(2);
    expect(lista[1].getNome()).toBe("Aluno 2");
  });

  it("deve buscar um aluno por ID", () => {
    repository.criar(new Aluno("5", "Busca Teste", "2B", "505"));
    const encontrado = repository.buscarPorId("5");
    expect(encontrado?.getNome()).toBe("Busca Teste");
  });

  it("deve remover um aluno do arquivo JSON", () => {
    repository.criar(new Aluno("99", "Para Remover", "X", "999"));
    repository.remover("99");
    expect(repository.listarTodos()).toHaveLength(0);
  });
});
