import { Aluno } from "../Aluno";

describe("Aluno - Testes de Integração", () => {
  describe("Fluxo de Criação e Validação", () => {
    it("deve criar um aluno válido sem erros de validação", () => {
      const aluno = new Aluno("1", "João Silva", "3A", "2023001");
      
      expect(aluno.getId()).toBe("1");
      expect(aluno.getNome()).toBe("João Silva");
      expect(aluno.getTurma()).toBe("3A");
      expect(aluno.getMatricula()).toBe("2023001");
      
      const erros = aluno.validar();
      expect(erros).toHaveLength(0);
    });

    it("deve detectar erros ao criar um aluno com dados inválidos", () => {
      const aluno = new Aluno("2", "A", "", "  ");
      
      const erros = aluno.validar();
      
      expect(erros).toHaveLength(3);
      expect(erros).toContain("Nome deve ter pelo menos 2 caracteres.");
      expect(erros).toContain("Turma é obrigatória.");
      expect(erros).toContain("Matrícula é obrigatória.");
    });
  });

  describe("Fluxo de Modificação e Validação", () => {
    it("deve permitir corrigir um aluno inválido através dos setters", () => {
      // Começa com um aluno inválido
      const aluno = new Aluno("3", "B", "", "");
      expect(aluno.validar()).toHaveLength(3);
      
      // Corrige os dados
      aluno.setNome("Maria Santos");
      aluno.setTurma("2B");
      aluno.setMatricula("2023002");
      
      // Valida novamente
      const erros = aluno.validar();
      expect(erros).toHaveLength(0);
      
      // Verifica se os getters retornam os novos valores
      expect(aluno.getNome()).toBe("Maria Santos");
      expect(aluno.getTurma()).toBe("2B");
      expect(aluno.getMatricula()).toBe("2023002");
    });

    it("deve detectar erros quando um aluno válido é alterado para inválido", () => {
      // Começa com um aluno válido
      const aluno = new Aluno("4", "Pedro Costa", "1C", "2023003");
      expect(aluno.validar()).toHaveLength(0);
      
      // Altera para dados inválidos
      aluno.setNome("P");
      aluno.setTurma("  ");
      
      // Valida novamente
      const erros = aluno.validar();
      expect(erros).toHaveLength(2);
      expect(erros).toContain("Nome deve ter pelo menos 2 caracteres.");
      expect(erros).toContain("Turma é obrigatória.");
    });
  });

  describe("Fluxo de Serialização e Desserialização (JSON)", () => {
    it("deve manter a integridade dos dados ao serializar e desserializar", () => {
      // Cria o objeto original
      const alunoOriginal = new Aluno("5", "Ana Lima", "4D", "2023004");
      
      // Serializa para JSON
      const alunoJSON = alunoOriginal.toJSON();
      
      // Verifica o formato JSON
      expect(alunoJSON).toEqual({
        id: "5",
        nome: "Ana Lima",
        turma: "4D",
        matricula: "2023004"
      });
      
      // Desserializa de volta para objeto Aluno
      const alunoRestaurado = Aluno.fromJSON(alunoJSON);
      
      // Verifica se o objeto restaurado é uma instância de Aluno
      expect(alunoRestaurado).toBeInstanceOf(Aluno);
      
      // Verifica se os dados foram mantidos
      expect(alunoRestaurado.getId()).toBe(alunoOriginal.getId());
      expect(alunoRestaurado.getNome()).toBe(alunoOriginal.getNome());
      expect(alunoRestaurado.getTurma()).toBe(alunoOriginal.getTurma());
      expect(alunoRestaurado.getMatricula()).toBe(alunoOriginal.getMatricula());
      
      // Verifica se a validação continua funcionando no objeto restaurado
      expect(alunoRestaurado.validar()).toHaveLength(0);
    });

    it("deve lidar com dados parciais ou inválidos na desserialização e apontar erros na validação", () => {
      // Simula um JSON recebido de uma API externa com dados incompletos
      const jsonIncompleto = {
        id: "6",
        nome: "J"
        // turma e matricula faltando
      };
      
      // Desserializa
      const aluno = Aluno.fromJSON(jsonIncompleto);
      
      // Verifica se os valores undefined/missing foram tratados
      expect(aluno.getId()).toBe("6");
      expect(aluno.getNome()).toBe("J");
      expect(aluno.getTurma()).toBeUndefined();
      expect(aluno.getMatricula()).toBeUndefined();
      
      // A validação deve falhar para os campos faltantes/inválidos
      const erros = aluno.validar();
      expect(erros).toHaveLength(3);
      expect(erros).toContain("Nome deve ter pelo menos 2 caracteres.");
      expect(erros).toContain("Turma é obrigatória.");
      expect(erros).toContain("Matrícula é obrigatória.");
    });
  });
});
