// JS da tela de alunos: fetch API para listar, criar, editar e remover
document.addEventListener('DOMContentLoaded', () => {
    const buscaInput = document.getElementById('buscaAlunos');
    if (buscaInput) {
        buscaInput.addEventListener('keyup', () => {
            const termo = buscaInput.value.toLowerCase();
            const linhas = document.querySelectorAll('#tabelaAlunos tbody tr');

            linhas.forEach(linha => {
                const texto = linha.innerText.toLowerCase();
                linha.style.display = texto.includes(termo) ? '' : 'none';
            });
        });
    }

    const deleteForms = document.querySelectorAll('form[action*="/alunos/"][action*="_method=DELETE"]');
    deleteForms.forEach(form => {
        form.addEventListener('submit', (e) => {
            if (!confirm('Deseja realmente excluir este aluno?')) {
                e.preventDefault();
            }
        });
    });
});