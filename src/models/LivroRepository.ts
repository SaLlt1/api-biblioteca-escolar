// LivroRepository.ts - lê e escreve os livros no arquivo dados/livros.json
import fs from "fs";
import path from "path";
import { Livro } from "../entities/Livro";

const CAMINHO_ARQUIVO = path.join(__dirname, "..", "..", "dados", "livros.json");

// Lê o arquivo JSON e devolve um array de objetos (ou [] se estiver vazio/não existir)
function lerArquivo(): any[] {
  if (!fs.existsSync(CAMINHO_ARQUIVO)) return [];
  const conteudo = fs.readFileSync(CAMINHO_ARQUIVO, "utf-8");
  if (!conteudo.trim()) return [];
  return JSON.parse(conteudo);
}

// Escreve o array de objetos de volta no arquivo JSON
function escreverArquivo(dados: any[]): void {
  fs.writeFileSync(CAMINHO_ARQUIVO, JSON.stringify(dados, null, 2), "utf-8");
}

export class LivroRepository {
  listarTodos(): Livro[] {
    const dados = lerArquivo();
    return dados.map((obj) => Livro.fromJSON(obj));
  }

  buscarPorId(id: string): Livro | null {
    const livro = this.listarTodos().find((l) => l.getId() === id);
    return livro ?? null;
  }

  criar(livro: Livro): void {
    const dados = lerArquivo();
    dados.push(livro.toJSON());
    escreverArquivo(dados);
  }

  atualizar(id: string, livroAtualizado: Livro): boolean {
    const dados = lerArquivo();
    const index = dados.findIndex((l) => l.id === id);
    if (index === -1) return false;
    dados[index] = livroAtualizado.toJSON();
    escreverArquivo(dados);
    return true;
  }

  remover(id: string): boolean {
    const dados = lerArquivo();
    const novaLista = dados.filter((l) => l.id !== id);
    if (novaLista.length === dados.length) return false;
    escreverArquivo(novaLista);
    return true;
  }
}