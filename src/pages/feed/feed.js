import { fazerLogout, auth } from '../../firebase/auth.js';
import {
  fazerPost,
  pegarPost,
  curtirPost,
  descurtirPost,
  excluirPost,
  editarPost,
} from '../../firebase/firestore.js';
import logo from '../../imagens/logo-lemos.png';
import avatar from '../../imagens/user.png';
import like from '../../imagens/coracao-vazio.png';
import liked from '../../imagens/coracao-preenchido.png';
import editar from '../../imagens/editar.png';
import excluir from '../../imagens/excluir.png';

export default () => {
  const container = document.createElement('div');
  const template = `
  <header class="conteudo-feed">
    <div class="cabecalho-feed">
      <img class="logo-feed" src="${logo}" a href="/#login">
      <button type="button" class="botao-sair">Sair</button>
    </div>
  </header>
  <main class="feed-post">
    <div class = "nome-usuaria">
      <img class="avatar" src="${avatar}">
      <h3>Olá, ${auth.currentUser.displayName} !</h3>
    </div>
    <section class="nome-livro">
      <h2 class="criar-post">Criar publicação</h2>
      <p>Título do livro</p>
      <input type="text" class="input-titulo" required>
    </section>
    <section class="nome-autora">
      <p>Autora</p>
      <input type="text" class="input-autora" required>
    </section>
    <section class="nivel-leitura">
      <p>Para qual leitora você indica esse livro?</p>
      <div class="botoes-nivel">        
        <input type="radio" class="inicante" value="iniciante" name="nivel">
        <label for="iniciante">iniciante</label>
        <input type="radio" class="intermediaria" value="intermediária" name="nivel">
        <label for="intermediaria">intermediária</label>
        <input type="radio" class="avancada" value="avançada" name="nivel">
        <label for="avancada">avançada</label>
      </div>
    </section>
    <section class="post-publicacao">
      <textarea placeholder="Limite de 350 caracteres..." class="texto-post" required></textarea>
    </section>
    <button type="submit" class="botao-publicar">Publicar</button>
    <div>
      <h3 class="texto-ultimos-posts">Últimas publicações</h3>
      <div class="ultimos-posts"></div>
    </div>
    <dialog class="modal"> Por favor, <br> preencha todos os campos. <br>
      <button class="botao-ok">Ok</button>
    </dialog>
  </main>

  `;
  container.innerHTML = template;

  const exibirPostagem = () => {
    const localPost = container.querySelector('.ultimos-posts');
    pegarPost((post) => {
      const containerPost = document.createElement('div');
      let somaCurtidas = post.likesUsuaria.length;
      const templatePost = `
    <div class="nome-usuaria-post">   
      <img class="avatar-post" src="${avatar}">
      <h3>${post.nome}</h3>
      <p class="dia-post"> ${post.date}</p>
    </div>  
    <section class="publicacao">
      <p class="titulo-post">Título do Livro: <strong>${post.titulo}</strong></p>
      <p class="autora-post">Nome da Autora: <strong>${post.autora}</strong></p>
      <span class="nivel-post">${post.nivel}</span> 
      <textarea disabled class="texto-postagem">${post.post}</textarea>
    </section> 
    <div id="botao-like" class="display">
     <img id="coracao-vazio" src="${like}"> 
     <img id="coracao-cheio" class="hidden" src="${liked}">
      <span id="soma-likes">${somaCurtidas}</span>
      <img id="editar" src="${editar}">
      <img id="excluir" src="${excluir}">
    </div>
     <button id="botao-salvar" class="hidden">Salvar</button>

      `;

      containerPost.innerHTML = templatePost;

      const coracaoVazio = containerPost.querySelector('#coracao-vazio');
      const coracaoCheio = containerPost.querySelector('#coracao-cheio');
      const curtidasNaTela = containerPost.querySelector('#soma-likes');
      const curtidasArray = post.likesUsuaria;

      if (curtidasArray.includes(auth.currentUser.uid)) {
        coracaoVazio.classList.add('hidden');
        coracaoCheio.classList.remove('hidden');
      }

      coracaoVazio.addEventListener('click', () => {
        coracaoVazio.classList.add('hidden');
        coracaoCheio.classList.remove('hidden');
        somaCurtidas += 1;
        curtidasNaTela.innerHTML = somaCurtidas;
        curtirPost(post.postId, auth.currentUser.uid);
      });

      coracaoCheio.addEventListener('click', () => {
        coracaoVazio.classList.remove('hidden');
        coracaoCheio.classList.add('hidden');
        somaCurtidas -= 1;
        curtidasNaTela.innerHTML = somaCurtidas;
        descurtirPost(post.postId, auth.currentUser.uid);
      });

      const botaoEditar = containerPost.querySelector('#editar');
      const botaoExcluir = containerPost.querySelector('#excluir');
      const campoTexto = containerPost.querySelector('.texto-postagem');
      const botaoSalvar = containerPost.querySelector('#botao-salvar');
      const botaoCurtida = containerPost.querySelector('#botao-like');

      if (post.id !== auth.currentUser.uid) {
        botaoEditar.setAttribute('class', 'hidden');
        botaoExcluir.classList.add('hidden');
      }

      botaoEditar.addEventListener('click', () => {
        campoTexto.removeAttribute('disabled');
        botaoSalvar.removeAttribute('class');
        botaoCurtida.setAttribute('class', 'hidden');
        botaoEditar.setAttribute('class', 'hidden');
        botaoExcluir.setAttribute('class', 'hidden');
      });

      botaoSalvar.addEventListener('click', () => {
        editarPost(post.postId, campoTexto.value);
        campoTexto.setAttribute('disabled');
        botaoSalvar.setAttribute('class', 'hidden');
        botaoCurtida.removeAttribute('class');
        botaoEditar.removeAttribute('class');
        botaoExcluir.removeAttribute('class');
      });

      botaoExcluir.addEventListener('click', () => {
        // eslint-disable-next-line no-alert
        if (window.confirm('Tem certeza que deseja excluir a publicação?')) {
          excluirPost(post.postId);
          containerPost.remove();
        }
      });
      localPost.appendChild(containerPost);
    });
  };

  const titulo = container.querySelector('.input-titulo');
  const autora = container.querySelector('.input-autora');
  const postagem = container.querySelector('.texto-post');
  const modal = container.querySelector('.modal');
  const botaoOk = container.querySelector('.botao-ok');

  function limparForm() {
    container.querySelector('.input-titulo').value = '';
    container.querySelector('.input-autora').value = '';
    container.querySelector('.texto-post').value = '';
    container.querySelector('input[name=nivel]').setAttribute('checked', false);
  }

  const botaoPublicar = container.querySelector('.botao-publicar');
  botaoPublicar.addEventListener('click', async () => {
    const nivel = container.querySelector('input[name=nivel]:checked');
    // eslint-disable-next-line max-len
    if ((titulo.value === '') || (autora.value === '') || (postagem.value === '') || (!nivel)) {
      modal.showModal();
      botaoOk.addEventListener('click', () => {
        modal.close();
      });
    } else {
      await fazerPost(titulo.value, autora.value, postagem.value, nivel.value);
      limparForm();
    }
  });

  const botaoSair = container.querySelector('.botao-sair');
  botaoSair.addEventListener('click', () => {
    fazerLogout()
      .then(() => {
        window.location.hash = '#login';
      })
      .catch(() => {
      });
  });
  exibirPostagem();
  return container;
};
