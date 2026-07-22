// EmprestimoRepository.ts - lê e escreve os empréstimos no arquivo dados/emprestimos.json
import fs from "fs";
import path from "path";
import { Emprestimo } from "../entities/Emprestimo";

const CAMINHO_ARQUIVO = path.join(__dirname, "..", "..", "dados", "emprestimos.json");

function lerArquivo(): any[] {
  if (!fs.existsSync(CAMINHO_ARQUIVO)) return [];
  const conteudo = fs.readFileSync(CAMINHO_ARQUIVO, "utf-8");
  if (!conteudo.trim()) return [];
  return JSON.parse(conteudo);
}

function escreverArquivo(dados: any[]): void {
  fs.writeFileSync(CAMINHO_ARQUIVO, JSON.stringify(dados, null, 2), "utf-8");
}

export class EmprestimoRepository {
  listarTodos(): Emprestimo[] {
    const dados = lerArquivo();
    return dados.map((obj) => Emprestimo.fromJSON(obj));
  }

  buscarPorId(id: string): Emprestimo | null {
    const emprestimo = this.listarTodos().find((e) => e.getId() === id);
    return emprestimo ?? null;
  }

  criar(emprestimo: Emprestimo): void {
    const dados = lerArquivo();
    dados.push(emprestimo.toJSON());
    escreverArquivo(dados);
  }

  atualizar(id: string, emprestimoAtualizado: Emprestimo): boolean {
    const dados = lerArquivo();
    const index = dados.findIndex((e) => e.id === id);
    if (index === -1) return false;
    dados[index] = emprestimoAtualizado.toJSON();
    escreverArquivo(dados);
    return true;
  }

  remover(id: string): boolean {
    const dados = lerArquivo();
    const novaLista = dados.filter((e) => e.id !== id);
    if (novaLista.length === dados.length) return false;
    escreverArquivo(novaLista);
    return true;
  }
}