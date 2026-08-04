// JS da tela de login/registro: fetch para /auth/login e /auth/registro
// auth.js - JS da tela de login/registro: loading state ao enviar o formulário
document.addEventListener('DOMContentLoaded', () => {
    const formLogin = document.querySelector('form[action="/login"]');
    if (formLogin) {
      formLogin.addEventListener('submit', () => {
        const botao = formLogin.querySelector('button[type="submit"]');
        if (botao) {
          botao.disabled = true;
          botao.textContent = 'Entrando...';
        }
      });
    }
  
    const formRegistro = document.querySelector('form[action="/registro"]');
    if (formRegistro) {
      formRegistro.addEventListener('submit', () => {
        const botao = formRegistro.querySelector('button[type="submit"]');
        if (botao) {
          botao.disabled = true;
          botao.textContent = 'Registrando...';
        }
      });
    }
  });