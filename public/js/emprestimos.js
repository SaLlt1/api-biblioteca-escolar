// JS da tela de emprestimos: fetch API para listar, criar e registrar devolucao
// emprestimos.js - JS da tela de emprestimos: exclusão via fetch e loading state no formulário
document.addEventListener('DOMContentLoaded', () => {
    const inputBusca = document.getElementById('buscaEmprestimos');
    const tabela = document.getElementById('tabelaEmprestimos');
  
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
  
    document.querySelectorAll('form[action*="?_method=DELETE"]').forEach((form) => {
      form.addEventListener('submit', async (evento) => {
        evento.preventDefault();
  
        if (!confirm('Tem certeza que deseja remover este empréstimo?')) return;
  
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
          exibirFeedback('Erro ao remover o empréstimo. Tente novamente.', true);
          if (botao) {
            botao.disabled = false;
            botao.textContent = textoOriginal;
          }
        }
      });
    });
  
    const formEmprestimo = document.querySelector('.cardF form');
    if (formEmprestimo) {
      formEmprestimo.addEventListener('submit', () => {
        const botao = formEmprestimo.querySelector('button[type="submit"]');
        if (botao) {
          botao.disabled = true;
          botao.textContent = 'Salvando...';
        }
      });
    }
  });