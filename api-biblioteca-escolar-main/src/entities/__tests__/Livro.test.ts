import { Livro } from "../Livro";


describe("Livro - Testes de Integração", () => {
  const anoAtual = new Date().getFullYear();

  describe("Fluxo de Criação e Validação de Regras", () => {
    it("deve criar um livro válido com todos os campos preenchidos corretamente", () => {
      const livro = new Livro("l1", "O Alquimista", "Paulo Coelho", 1988, "https://capa.com/l1.jpg");
      
      expect(livro.getId()).toBe("l1");
      expect(livro.getTitulo()).toBe("O Alquimista");
      expect(livro.getAutor()).toBe("Paulo Coelho");
      expect(livro.getAnoPublicacao()).toBe(1988);
      expect(livro.getCapaUrl()).toBe("https://capa.com/l1.jpg");
      
      expect(livro.validar()).toHaveLength(0);
    });

    it("deve detectar múltiplos erros de validação em dados inválidos", () => {
      // Título curto, autor curto e ano no futuro
      const livro = new Livro("l2", "A", "B", anoAtual + 1);
      
      const erros = livro.validar();
      expect(erros).toHaveLength(3);
      expect(erros).toContain("Título muito curto.");
      expect(erros).toContain("Autor muito curto.");
      expect(erros).toContain("Ano de publicação inválido.");
    });

    it("deve validar o limite inferior do ano de publicação (1400)", () => {
      const livroAntigo = new Livro("l3", "Manuscrito", "Anônimo", 1399);
      expect(livroAntigo.validar()).toContain("Ano de publicação inválido.");
      
      const livroLimite = new Livro("l4", "Gutenberg Bible", "Johannes Gutenberg", 1455);
      expect(livroLimite.validar()).toHaveLength(0);
    });
  });

  describe("Fluxo de Modificação via Setters", () => {
    it("deve permitir atualizar os dados e revalidar o estado do objeto", () => {
      const livro = new Livro("l5", "Título Inicial", "Autor Inicial", 2000);
      expect(livro.validar()).toHaveLength(0);
      
      livro.setTitulo("Novo Título");
      livro.setAutor("Novo Autor");
      livro.setAnoPublicacao(2023);
      livro.setCapaUrl("http://nova-capa.png");
      
      expect(livro.getTitulo()).toBe("Novo Título");
      expect(livro.getAutor()).toBe("Novo Autor");
      expect(livro.getAnoPublicacao()).toBe(2023);
      expect(livro.getCapaUrl()).toBe("http://nova-capa.png");
      expect(livro.validar()).toHaveLength(0);
    });
  });

  describe("Fluxo de Serialização (JSON)", () => {
    it("deve manter a integridade total dos dados no ciclo toJSON -> fromJSON", () => {
      const original = new Livro("l6", "1984", "George Orwell", 1949, null);
      
      const json = original.toJSON();
      const restaurado = Livro.fromJSON(json);
      
      expect(restaurado).toBeInstanceOf(Livro);
      expect(restaurado.getId()).toBe(original.getId());
      expect(restaurado.getTitulo()).toBe(original.getTitulo());
      expect(restaurado.getAutor()).toBe(original.getAutor());
      expect(restaurado.getAnoPublicacao()).toBe(original.getAnoPublicacao());
      expect(restaurado.getCapaUrl()).toBeNull();
      
      expect(restaurado.validar()).toHaveLength(0);
    });
  });
});
