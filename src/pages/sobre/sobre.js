import logo from '../../imagens/logo-lemos.png';
import menina from '../../imagens/lemos-sobre.png';

export default () => {
  const container = document.createElement('div');

  const template = `

  <header class="conteudo">
    <div class="menu-superior">
     <a href="#login"> <img class="img-logo" src="${logo}"> </a>
     <h2 class="subtitulo">Incentivando a leitura feminista</h2> 
    </div>
  </header>
  <section class="conteudo-sobre">
    <h2 class="sobre">A Le<span style= "color:#FF7373;">m</span>os é uma rede social que surgiu a partir da 
    identificação da vontade das mulheres em aumentar ou iniciar um 
    repertório de leitura com temática feminista. Pensando nisso, 
    desenvolvemos esse projeto para publicar informações pontuais e 
    comentários que facilitem a divulgação de livros, autoras e também 
    indiquem o nível de leitura: inciante, intermediário ou avançado. <br>
    Faça seu cadastro e venha compartilhar com a gente!</h2>
    <img class="menina-sobre" src="${menina}">
 </section>
  `;

  container.innerHTML = template;

  return container;
};
