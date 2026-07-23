// Emprestimo.ts - classe que representa o empréstimo de um livro para um aluno
export class Emprestimo {
    private id: string;
    private livroId: string;
    private alunoId: string;
    private dataEmprestimo: string; // formato ISO (ex: "2026-07-22")
    private dataDevolucaoPrevista: string;
    private devolvido: boolean;
  
    constructor(
      id: string,
      livroId: string,
      alunoId: string,
      dataEmprestimo: string,
      dataDevolucaoPrevista: string,
      devolvido: boolean = false
    ) {
      this.id = id;
      this.livroId = livroId;
      this.alunoId = alunoId;
      this.dataEmprestimo = dataEmprestimo;
      this.dataDevolucaoPrevista = dataDevolucaoPrevista;
      this.devolvido = devolvido;
    }
  
    getId(): string {
      return this.id;
    }
    getLivroId(): string {
      return this.livroId;
    }
    getAlunoId(): string {
      return this.alunoId;
    }
    getDataEmprestimo(): string {
      return this.dataEmprestimo;
    }
    getDataDevolucaoPrevista(): string {
      return this.dataDevolucaoPrevista;
    }
    isDevolvido(): boolean {
      return this.devolvido;
    }
  
    setDataDevolucaoPrevista(data: string): void {
      this.dataDevolucaoPrevista = data;
    }
    marcarComoDevolvido(): void {
      this.devolvido = true;
    }
  
    validar(): string[] {
      const erros: string[] = [];
      if (!this.livroId) erros.push("Livro é obrigatório.");
      if (!this.alunoId) erros.push("Aluno é obrigatório.");
      if (!this.dataEmprestimo) erros.push("Data de empréstimo é obrigatória.");
      if (!this.dataDevolucaoPrevista) erros.push("Data de devolução prevista é obrigatória.");
      if (
        this.dataEmprestimo &&
        this.dataDevolucaoPrevista &&
        new Date(this.dataDevolucaoPrevista) < new Date(this.dataEmprestimo)
      ) {
        erros.push("Data de devolução não pode ser antes da data de empréstimo.");
      }
      return erros;
    }
  
    toJSON() {
      return {
        id: this.id,
        livroId: this.livroId,
        alunoId: this.alunoId,
        dataEmprestimo: this.dataEmprestimo,
        dataDevolucaoPrevista: this.dataDevolucaoPrevista,
        devolvido: this.devolvido,
      };
    }
  
    static fromJSON(obj: any): Emprestimo {
      return new Emprestimo(
        obj.id,
        obj.livroId,
        obj.alunoId,
        obj.dataEmprestimo,
        obj.dataDevolucaoPrevista,
        obj.devolvido ?? false
      );
    }
  }