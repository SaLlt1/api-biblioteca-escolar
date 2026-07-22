// AlunoRepository.ts - lê e escreve os alunos no arquivo dados/alunos.json
import fs from "fs";
import path from "path";
import { Aluno } from "../entities/Aluno";

const CAMINHO_ARQUIVO = path.join(__dirname, "..", "..", "dados", "alunos.json");

function lerArquivo(): any[] {
  if (!fs.existsSync(CAMINHO_ARQUIVO)) return [];
  const conteudo = fs.readFileSync(CAMINHO_ARQUIVO, "utf-8");
  if (!conteudo.trim()) return [];
  return JSON.parse(conteudo);
}

function escreverArquivo(dados: any[]): void {
  fs.writeFileSync(CAMINHO_ARQUIVO, JSON.stringify(dados, null, 2), "utf-8");
}

export class AlunoRepository {
  listarTodos(): Aluno[] {
    const dados = lerArquivo();
    return dados.map((obj) => Aluno.fromJSON(obj));
  }

  buscarPorId(id: string): Aluno | null {
    const aluno = this.listarTodos().find((a) => a.getId() === id);
    return aluno ?? null;
  }

  criar(aluno: Aluno): void {
    const dados = lerArquivo();
    dados.push(aluno.toJSON());
    escreverArquivo(dados);
  }

  atualizar(id: string, alunoAtualizado: Aluno): boolean {
    const dados = lerArquivo();
    const index = dados.findIndex((a) => a.id === id);
    if (index === -1) return false;
    dados[index] = alunoAtualizado.toJSON();
    escreverArquivo(dados);
    return true;
  }

  remover(id: string): boolean {
    const dados = lerArquivo();
    const novaLista = dados.filter((a) => a.id !== id);
    if (novaLista.length === dados.length) return false;
    escreverArquivo(novaLista);
    return true;
  }
}