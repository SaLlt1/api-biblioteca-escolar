// jest.config.js - configuração do Jest pra rodar testes em TypeScript
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
};