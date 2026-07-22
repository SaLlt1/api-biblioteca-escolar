// Aluno.ts - classe que representa um aluno cadastrado na biblioteca
export class Aluno {
    private id: string;
    private nome: string;
    private turma: string;
    private matricula: string;
  
    constructor(id: string, nome: string, turma: string, matricula: string) {
      this.id = id;
      this.nome = nome;
      this.turma = turma;
      this.matricula = matricula;
    }
  
    getId(): string {
      return this.id;
    }
    getNome(): string {
      return this.nome;
    }
    getTurma(): string {
      return this.turma;
    }
    getMatricula(): string {
      return this.matricula;
    }
  
    setNome(nome: string): void {
      this.nome = nome;
    }
    setTurma(turma: string): void {
      this.turma = turma;
    }
    setMatricula(matricula: string): void {
      this.matricula = matricula;
    }
  
    validar(): string[] {
      const erros: string[] = [];
      if (!this.nome || this.nome.trim().length < 2) {
        erros.push("Nome deve ter pelo menos 2 caracteres.");
      }
      if (!this.turma || this.turma.trim().length === 0) {
        erros.push("Turma é obrigatória.");
      }
      if (!this.matricula || this.matricula.trim().length === 0) {
        erros.push("Matrícula é obrigatória.");
      }
      return erros;
    }
  
    toJSON() {
      return {
        id: this.id,
        nome: this.nome,
        turma: this.turma,
        matricula: this.matricula,
      };
    }
  
    static fromJSON(obj: any): Aluno {
      return new Aluno(obj.id, obj.nome, obj.turma, obj.matricula);
    }
  }