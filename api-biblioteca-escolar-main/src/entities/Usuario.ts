// Usuario.ts - classe que representa um usuário do sistema (quem faz login)
export class Usuario {
    private id: string;
    private nome: string;
    private email: string;
    private senhaHash: string; // já vem criptografada com bcrypt
  
    constructor(id: string, nome: string, email: string, senhaHash: string) {
      this.id = id;
      this.nome = nome;
      this.email = email;
      this.senhaHash = senhaHash;
    }
  
    getId(): string {
      return this.id;
    }
    getNome(): string {
      return this.nome;
    }
    getEmail(): string {
      return this.email;
    }
    getSenhaHash(): string {
      return this.senhaHash;
    }
  
    setNome(nome: string): void {
      this.nome = nome;
    }
    setEmail(email: string): void {
      this.email = email;
    }
    setSenhaHash(hash: string): void {
      this.senhaHash = hash;
    }
  
    validar(): string[] {
      const erros: string[] = [];
      if (!this.nome || this.nome.trim().length < 2) {
        erros.push("Nome deve ter pelo menos 2 caracteres.");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        erros.push("E-mail inválido.");
      }
      return erros;
    }
  
    toJSON() {
      return {
        id: this.id,
        nome: this.nome,
        email: this.email,
        senhaHash: this.senhaHash,
      };
    }
  
    static fromJSON(obj: any): Usuario {
      return new Usuario(obj.id, obj.nome, obj.email, obj.senhaHash);
    }
  }