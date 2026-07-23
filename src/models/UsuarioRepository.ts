// UsuarioRepository.ts - lê e escreve os usuários no arquivo dados/usuarios.json
import fs from "fs";
import path from "path";
import { Usuario } from "../entities/Usuario";

const CAMINHO_ARQUIVO = path.join(__dirname, "..", "..", "dados", "usuarios.json");

function lerArquivo(): any[] {
  if (!fs.existsSync(CAMINHO_ARQUIVO)) return [];
  const conteudo = fs.readFileSync(CAMINHO_ARQUIVO, "utf-8");
  if (!conteudo.trim()) return [];
  return JSON.parse(conteudo);
}

function escreverArquivo(dados: any[]): void {
  fs.writeFileSync(CAMINHO_ARQUIVO, JSON.stringify(dados, null, 2), "utf-8");
}

export class UsuarioRepository {
  listarTodos(): Usuario[] {
    const dados = lerArquivo();
    return dados.map((obj) => Usuario.fromJSON(obj));
  }

  buscarPorId(id: string): Usuario | null {
    const usuario = this.listarTodos().find((u) => u.getId() === id);
    return usuario ?? null;
  }

  buscarPorEmail(email: string): Usuario | null {
    const usuario = this.listarTodos().find((u) => u.getEmail() === email);
    return usuario ?? null;
  }

  criar(usuario: Usuario): void {
    const dados = lerArquivo();
    dados.push(usuario.toJSON());
    escreverArquivo(dados);
  }

  atualizar(id: string, usuarioAtualizado: Usuario): boolean {
    const dados = lerArquivo();
    const index = dados.findIndex((u) => u.id === id);
    if (index === -1) return false;
    dados[index] = usuarioAtualizado.toJSON();
    escreverArquivo(dados);
    return true;
  }

  remover(id: string): boolean {
    const dados = lerArquivo();
    const novaLista = dados.filter((u) => u.id !== id);
    if (novaLista.length === dados.length) return false;
    escreverArquivo(novaLista);
    return true;
  }
}