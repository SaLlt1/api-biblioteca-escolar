// JS da tela de livros: fetch API para listar, criar (com FormData/imagem), editar e remover
// livros.js - JS da tela de livros: busca com debounce, exclusão via fetch e loading state no formulário
document.addEventListener('DOMContentLoaded', () => {
    // Busca com debounce na listagem (filtra as linhas da tabela sem recarregar)
    const inputBusca = document.getElementById('buscaLivros');
    const tabela = document.getElementById('tabelaLivros');
  
    if (inputBusca && tabela) {
      let temporizador;
      inputBusca.addEventListener('input', () => {
        clearTimeout(temporizador);
        temporizador = setTimeout(() => {
          const termo = inputBusca.value.trim().toLowerCase();
          const linhas = tabela.querySelectorAll('tbody tr');
  
          linhas.forEach((linha) => {
            const texto = linha.textContent.toLowerCase();
            linha.style.display = texto.includes(termo) ? '' : 'none';
          });
        }, 300);
      });
    }
  
    // Exclusão via fetch API (sem recarregar a página)
    document.querySelectorAll('form[action*="?_method=DELETE"]').forEach((form) => {
      form.addEventListener('submit', async (evento) => {
        evento.preventDefault();
  
        if (!confirm('Tem certeza que deseja remover este livro do acervo?')) return;
  
        const url = form.action.split('?')[0];
        const botao = form.querySelector('button');
        const textoOriginal = botao ? botao.textContent : '';
  
        try {
          if (botao) {
            botao.disabled = true;
            botao.textContent = 'Removendo...';
          }
  
          const resposta = await fetch(url, { method: 'DELETE' });
          if (!resposta.ok) throw new Error('Falha ao remover.');
  
          form.closest('tr').remove();
        } catch (erro) {
          exibirFeedback('Erro ao remover o livro. Tente novamente.', true);
          if (botao) {
            botao.disabled = false;
            botao.textContent = textoOriginal;
          }
        }
      });
    });
  
    // Loading state no formulário de cadastro/edição
    const formLivro = document.querySelector('.cardF form');
    if (formLivro) {
      formLivro.addEventListener('submit', () => {
        const botao = formLivro.querySelector('button[type="submit"]');
        if (botao) {
          botao.disabled = true;
          botao.textContent = 'Salvando...';
        }
      });
    }
  });