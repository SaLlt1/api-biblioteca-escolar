import { UsuarioRepository } from "../UsuarioRepository";
import { Usuario } from "../../entities/Usuario";
import fs from "fs";
import path from "path";

describe("UsuarioRepository - Testes de Persistência", () => {
  const repository = new UsuarioRepository();
  const CAMINHO_ARQUIVO = path.join(__dirname, "..", "..", "..", "dados", "usuarios.json");

  beforeEach(() => {
    if ((repository as any).limpar) {
      (repository as any).limpar();
    }
  });

  it("deve persistir um novo usuario no arquivo JSON", () => {
    const usuario = new Usuario("u1", "Admin", "admin@email.com", "hash123");
    repository.criar(usuario);

    const conteudo = fs.readFileSync(CAMINHO_ARQUIVO, "utf-8");
    const dados = JSON.parse(conteudo);
    
    expect(dados).toHaveLength(1);
    expect(dados[0].email).toBe("admin@email.com");
  });

  it("deve buscar um usuario por e-mail", () => {
    repository.criar(new Usuario("u2", "User", "user@email.com", "hash456"));
    const encontrado = repository.buscarPorEmail("user@email.com");
    expect(encontrado?.getNome()).toBe("User");
  });

  it("deve atualizar os dados de um usuario", () => {
    const original = new Usuario("u3", "Antigo", "antigo@email.com", "hash789");
    repository.criar(original);
    const atualizado = new Usuario("u3", "Novo", "novo@email.com", "nova_hash");
    repository.atualizar("u3", atualizado);
    const buscado = repository.buscarPorId("u3");
    expect(buscado?.getNome()).toBe("Novo");
  });

  it("deve remover um usuario do arquivo", () => {
    repository.criar(new Usuario("u4", "Deletar", "del@email.com", "hash000"));
    repository.remover("u4");
    expect(repository.listarTodos()).toHaveLength(0);
  });
});
