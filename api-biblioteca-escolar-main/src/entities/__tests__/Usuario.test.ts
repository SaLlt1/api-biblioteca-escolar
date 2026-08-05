import { Usuario } from "../Usuario";


describe("Usuario - Testes de Integridade", () => {
  const senhaMock = "$2b$10$Kqx.l/J.y8H8Y/8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y8Y";

  describe("Validação de Dados", () => {
    it("deve validar um usuário com dados corretos", () => {
      const usuario = new Usuario("u1", "Admin", "admin@biblioteca.com", senhaMock);
      expect(usuario.validar()).toHaveLength(0);
    });

    it("deve invalidar e-mails com formato incorreto", () => {
      const emaisInvalidos = ["emailsemarroba.com", "@semusuario.com"];
      
      emaisInvalidos.forEach(email => {
        const usuario = new Usuario("u2", "Teste", email, senhaMock);
        const erros = usuario.validar();
        expect(erros).toContain("E-mail inválido.");
      });
    });

    it("deve invalidar nomes muito curtos", () => {
      const usuario = new Usuario("u3", "A", "teste@email.com", senhaMock);
      const erros = usuario.validar();
      expect(erros).toContain("Nome deve ter pelo menos 2 caracteres.");
    });
  });

  describe("Manipulação de Estado (Setters)", () => {
    it("deve atualizar os dados corretamente e manter a integridade", () => {
      const usuario = new Usuario("u4", "Original", "original@email.com", senhaMock);
      
      usuario.setNome("Novo Nome");
      usuario.setEmail("novo@email.com");
      usuario.setSenhaHash("nova_hash");
      
      expect(usuario.getNome()).toBe("Novo Nome");
      expect(usuario.getEmail()).toBe("novo@email.com");
      expect(usuario.getSenhaHash()).toBe("nova_hash");
      expect(usuario.validar()).toHaveLength(0);
    });
  });

  describe("Serialização e Persistência (JSON)", () => {
    it("deve garantir que o ciclo toJSON -> fromJSON não perca dados sensíveis", () => {
      const original = new Usuario("u5", "Carlos Silva", "carlos@provedor.com.br", senhaMock);
      
      const json = original.toJSON();
      
      // Verifica se a senha hash está incluída no JSON (importante para persistência)
      expect(json.senhaHash).toBe(senhaMock);
      
      const restaurado = Usuario.fromJSON(json);
      
      expect(restaurado).toBeInstanceOf(Usuario);
      expect(restaurado.getId()).toBe(original.getId());
      expect(restaurado.getNome()).toBe(original.getNome());
      expect(restaurado.getEmail()).toBe(original.getEmail());
      expect(restaurado.getSenhaHash()).toBe(original.getSenhaHash());
      
      expect(restaurado.validar()).toHaveLength(0);
    });
  });
});
