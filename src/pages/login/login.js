import { fazerLogin, loginGoogle } from '../../firebase/auth.js';
import logo from '../../imagens/logo-lemos.png';
import menina from '../../imagens/lemos-figura.png';
import google from '../../imagens/figura-google.png';

export default () => {
  const container = document.createElement('div');
  const template = ` 
  <header class="conteudo">
    <div class="menu-superior">
      <img class="img-logo" src="${logo}" a href="#login"/>
     <h2 class="subtitulo">Incentivando a leitura feminista</h2> 
    </div>
  </header>
  <body>
  <main class="conteudo-pagina">
    <section class="conteudo-login">
    <div class = "figura-menina-texto">
      <p class="descricao">Faça parte da Le<span style= "color:#FF7373;">m</span>os , a maior rede social de incentivo e compartilhamento de leitura feminista! </p>
      <img class="menina-lemos" src=${menina}>
    </div>
    <form class="form-login">
        <h1 class="titulo-login">Login</h1>
        <input type="text" class="email-login" id="email-login" placeholder="E-MAIL"><br>
        <input type="password" class="senha-login" id="senha-login" placeholder="SENHA"><br>
        <button type="submit" class="botao-entrar">Entrar</button>
        <p class="texto-ou"> ou </p>
        <img class="botao-google" a href="#feed" src=${google}></a>
        <p class="texto-cadastro">Ainda não faz parte? <br> <a href="#cadastro">Cadastre-se aqui!</p></a>
      </form>
   </section>
      <dialog class="modal"> Usuário ou senha incorretos
        <button class="botao-ok">Ok</button>
      </dialog>
      </main>
     </body>
    
    `;

  container.innerHTML = template;

  const loginEmail = container.querySelector('#email-login');
  const loginSenha = container.querySelector('#senha-login');
  const botaoEntrar = container.querySelector('.botao-entrar');
  const botaoGoogle = container.querySelector('.botao-google');
  const modal = container.querySelector('.modal');
  const botaoOk = container.querySelector('.botao-ok');

  botaoEntrar.addEventListener('click', (e) => {
    e.preventDefault();

    fazerLogin(loginEmail.value, loginSenha.value)
      .then(() => {
        window.location.hash = '#feed';
      })
      .catch(() => {
        modal.showModal();
        botaoOk.addEventListener('click', () => {
          modal.close();
        });
      });
  });

  botaoGoogle.addEventListener('click', () => {
    loginGoogle()
      .then(() => {
        window.location.hash = '#feed';
      })
      .catch(() => {
      });
  });
  return container;
};
