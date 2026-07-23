// Livro.ts - classe que representa um livro do acervo da biblioteca
export class Livro {
    private id: string;
    private titulo: string;
    private autor: string;
    private anoPublicacao: number;
    private capaUrl: string | null;
  
    constructor(
      id: string,
      titulo: string,
      autor: string,
      anoPublicacao: number,
      capaUrl: string | null = null
    ) {
      this.id = id;
      this.titulo = titulo;
      this.autor = autor;
      this.anoPublicacao = anoPublicacao;
      this.capaUrl = capaUrl;
    }
  
    // Getters
    getId(): string {
      return this.id;
    }
    getTitulo(): string {
      return this.titulo;
    }
    getAutor(): string {
      return this.autor;
    }
    getAnoPublicacao(): number {
      return this.anoPublicacao;
    }
    getCapaUrl(): string | null {
      return this.capaUrl;
    }
  
    // Setters
    setTitulo(titulo: string): void {
      this.titulo = titulo;
    }
    setAutor(autor: string): void {
      this.autor = autor;
    }
    setAnoPublicacao(ano: number): void {
      this.anoPublicacao = ano;
    }
    setCapaUrl(url: string | null): void {
      this.capaUrl = url;
    }
  
    // Valida se os dados do livro fazem sentido antes de salvar
    validar(): string[] {
      const erros: string[] = [];
      if (!this.titulo || this.titulo.trim().length < 2) {
        erros.push("Título deve ter pelo menos 2 caracteres.");
      }
      if (!this.autor || this.autor.trim().length < 2) {
        erros.push("Autor deve ter pelo menos 2 caracteres.");
      }
      const anoAtual = new Date().getFullYear();
      if (this.anoPublicacao < 1400 || this.anoPublicacao > anoAtual) {
        erros.push(`Ano de publicação inválido (deve ser entre 1400 e ${anoAtual}).`);
      }
      return erros;
    }
  
    // Converte a instância em objeto simples pra salvar no JSON
    toJSON() {
      return {
        id: this.id,
        titulo: this.titulo,
        autor: this.autor,
        anoPublicacao: this.anoPublicacao,
        capaUrl: this.capaUrl,
      };
    }
  
    // Recria uma instância de Livro a partir de um objeto vindo do JSON
    static fromJSON(obj: any): Livro {
      return new Livro(obj.id, obj.titulo, obj.autor, obj.anoPublicacao, obj.capaUrl ?? null);
    }
  }