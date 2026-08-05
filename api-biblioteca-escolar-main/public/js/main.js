// JS geral (compartilhado entre paginas): funcoes de feedback visual (loading, toasts/mensagens)
document.addEventListener('DOMContentLoaded', () => {
    console.log('Biblioteca Escolar carregada!');
    
    const botoes = document.querySelectorAll('.botao');
    botoes.forEach(btn => {
        btn.addEventListener('click', () => {
            btn.style.opacity = '0.7';
        });
    });
});


 /** Uma função para exibir mensagens de feedback (Toast/Alert) 
  @param {string} mensagem - Texto a ser exibido
  @param {boolean} erro - Caso for uma mensagem de erro  */

function exibirFeedback(mensagem, erro = false) {
    alert(mensagem); 
}
