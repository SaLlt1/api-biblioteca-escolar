// JS da tela de alunos: fetch API para listar, criar, editar e remover
// alunos.js - JS da tela de alunos: busca com debounce, exclusão via fetch e loading state no formulário
document.addEventListener('DOMContentLoaded', () => {
    const inputBusca = document.getElementById('buscaAlunos');
    const tabela = document.getElementById('tabelaAlunos');
  
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
  
        if (!confirm('Tem certeza que deseja remover este aluno?')) return;
  
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
          exibirFeedback('Erro ao remover o aluno. Tente novamente.', true);
          if (botao) {
            botao.disabled = false;
            botao.textContent = textoOriginal;
          }
        }
      });
    });
  
    const formAluno = document.querySelector('.cardF form');
    if (formAluno) {
      formAluno.addEventListener('submit', () => {
        const botao = formAluno.querySelector('button[type="submit"]');
        if (botao) {
          botao.disabled = true;
          botao.textContent = 'Salvando...';
        }
      });
    }
  });