import { Emprestimo } from "../Emprestimo";

describe("Emprestimo - Testes de Integração", () => {
  const dataHoje = "2026-07-22";
  const dataFutura = "2026-07-29";
  const dataPassada = "2026-07-15";

  describe("Fluxo de Criação e Validação de Datas", () => {
    it("deve criar um empréstimo válido com datas coerentes", () => {
      const emprestimo = new Emprestimo(
        "e1",
        "livro-123",
        "aluno-456",
        dataHoje,
        dataFutura
      );

      expect(emprestimo.validar()).toHaveLength(0);
      expect(emprestimo.isDevolvido()).toBe(false);
      expect(emprestimo.getLivroId()).toBe("livro-123");
      expect(emprestimo.getAlunoId()).toBe("aluno-456");
      expect(emprestimo.getDataEmprestimo()).toBe(dataHoje);
    });

    it("deve falhar se a data de devolução for anterior à data de empréstimo", () => {
      const emprestimo = new Emprestimo(
        "e2",
        "livro-123",
        "aluno-456",
        dataHoje,
        dataPassada
      );

      const erros = emprestimo.validar();
      expect(erros).toContain("Data de devolução não pode ser antes da data de empréstimo.");
    });

    it("deve falhar se campos obrigatórios estiverem ausentes", () => {
      const emprestimo = new Emprestimo("e3", "", "", "", "");
      const erros = emprestimo.validar();
      
      expect(erros).toContain("Livro é obrigatório.");
      expect(erros).toContain("Aluno é obrigatório.");
      expect(erros).toContain("Data de empréstimo é obrigatória.");
      expect(erros).toContain("Data de devolução prevista é obrigatória.");
    });
  });

  describe("Fluxo de Ciclo de Vida (Devolução)", () => {
    it("deve permitir alterar a data de devolução prevista e marcar como devolvido", () => {
      const emprestimo = new Emprestimo("e4", "L1", "A1", dataHoje, dataFutura);
      
      // Prorroga o prazo
      const novaData = "2026-08-05";
      emprestimo.setDataDevolucaoPrevista(novaData);
      expect(emprestimo.getDataDevolucaoPrevista()).toBe(novaData);
      
      // Marca como devolvido
      emprestimo.marcarComoDevolvido();
      expect(emprestimo.isDevolvido()).toBe(true);
      
      // Validação deve continuar passando
      expect(emprestimo.validar()).toHaveLength(0);
    });
  });

  describe("Fluxo de Persistência (JSON)", () => {
    it("deve converter para JSON e restaurar mantendo o estado de devolução", () => {
      const original = new Emprestimo("e5", "L5", "A5", dataHoje, dataFutura, true);
      
      const json = original.toJSON();
      expect(json.devolvido).toBe(true);
      
      const restaurado = Emprestimo.fromJSON(json);
      expect(restaurado.isDevolvido()).toBe(true);
      expect(restaurado.getId()).toBe("e5");
      expect(restaurado.validar()).toHaveLength(0);
    });

    it("deve assumir devolvido como false se o campo estiver ausente no JSON", () => {
      const jsonSemDevolvido = {
        id: "e6",
        livroId: "L6",
        alunoId: "A6",
        dataEmprestimo: dataHoje,
        dataDevolucaoPrevista: dataFutura
      };
      
      const restaurado = Emprestimo.fromJSON(jsonSemDevolvido);
      expect(restaurado.isDevolvido()).toBe(false);
    });
  });

  describe("Integração Complexa: Datas Limite", () => {
    it("deve aceitar empréstimo e devolução no mesmo dia", () => {
      const emprestimo = new Emprestimo("e7", "L7", "A7", dataHoje, dataHoje);
      expect(emprestimo.validar()).toHaveLength(0);
    });
  });
});
