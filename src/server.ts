// server.ts - ponto de entrada: sobe o servidor na porta 3000
import app from "./app";

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});