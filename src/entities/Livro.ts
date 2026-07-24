// Livro.ts - representa um livro do acervo
export class Livro {
  private id: string;
  private titulo: string;
  private autor: string;
  private anoPublicacao: number;
  private capaUrl: string | null;

  constructor(id: string, titulo: string, autor: string, anoPublicacao: number, capaUrl: string | null = null) {
    this.id = id;
    this.titulo = titulo;
    this.autor = autor;
    this.anoPublicacao = anoPublicacao;
    this.capaUrl = capaUrl;
  }

  getId() { return this.id; }
  getTitulo() { return this.titulo; }
  getAutor() { return this.autor; }
  getAnoPublicacao() { return this.anoPublicacao; }
  getCapaUrl() { return this.capaUrl; }

  setTitulo(titulo: string) { this.titulo = titulo; }
  setAutor(autor: string) { this.autor = autor; }
  setAnoPublicacao(ano: number) { this.anoPublicacao = ano; }
  setCapaUrl(url: string | null) { this.capaUrl = url; }

  // Confere se os dados fazem sentido antes de salvar
  validar(): string[] {
    const erros: string[] = [];
    if (this.titulo.trim().length < 2) erros.push("Título muito curto.");
    if (this.autor.trim().length < 2) erros.push("Autor muito curto.");
    if (this.anoPublicacao < 1400 || this.anoPublicacao > new Date().getFullYear()) {
      erros.push("Ano de publicação inválido.");
    }
    return erros;
  }

  toJSON() {
    return { id: this.id, titulo: this.titulo, autor: this.autor, anoPublicacao: this.anoPublicacao, capaUrl: this.capaUrl };
  }

  static fromJSON(obj: any): Livro {
    return new Livro(obj.id, obj.titulo, obj.autor, obj.anoPublicacao, obj.capaUrl);
  }
}