export default () => {
  const container = document.createElement('div');

  const template = `

  <header class="conteudo">
    <div class="menu-superior">
      <img class="img-logo" src="/imagens/logo-lemos.png" href="/#login">
     <h2 class="subtitulo">Incentivando a leitura feminista</h2> 
    </div>
  </header>
  <h2 class="sobre">A Lemos é uma rede social que surgiu a partir da 
  identificação da vontade das mulheres em aumentar ou iniciar um 
  repertório de leitura com temática feminista. Pensando nisso, 
  desenvolvemos esse projeto para publicar informações pontuais e 
  comentários que facilitem a divulgação de livros, autoras e também 
  indiquem o nível de leitura: inciante, intermediário ou avançado.</h2>
  `;

  container.innerHTML = template;

  return container;
};
