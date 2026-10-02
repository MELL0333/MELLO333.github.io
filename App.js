const corredores = [];

const app = document.querySelector("#app");
const botoesMenu = document.querySelectorAll("nav button");

function marcarMenuAtivo(rota) {
  botoesMenu.forEach(botao => {
    botao.classList.toggle("ativo", botao.dataset.rota === rota);
  });
}

function irPara(rota) {
  marcarMenuAtivo(rota);

  if (rota === "inicio") mostrarInicio();
  if (rota === "cadastro") mostrarCadastro();
  if (rota === "lista") mostrarLista();
  if (rota === "sobre") mostrarSobre();
}

function mostrarInicio() {
  app.innerHTML = `
    <img class="banner" src="imagens/banner.png" alt="Largada da Maratona de Programação 2026" />
    <h1>Cadastro de Corredores</h1>
    <p>
      <strong>1ª CORRIDA - Maratona de Programação 2026</strong>!
    </p>

    <p>
      Realizado por: Alunos do Curso de ADS.
    </p>

    <div class="contador">
      Corredores cadastrados: <strong>${corredores.length}</strong>
    </div>

    <div class="acoes">
      <button class="botao" id="btnCadastrar">Cadastrar corredor</button>
      <button class="botao secundario" id="btnVerCorredores">Ver corredores</button>
    </div>
  `;

  document.querySelector("#btnCadastrar")
    .addEventListener("click", () => irPara("cadastro"));

  document.querySelector("#btnVerCorredores")
    .addEventListener("click", () => irPara("lista"));
}

function mascaraCPF(valor) {
  return valor
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

function mostrarCadastro() {
  app.innerHTML = `
    <h1>Cadastrar Corredor</h1>

    <form id="formCorredor">
      <div class="campo">
        <label for="nome">Nome</label>
        <input id="nome" type="text" placeholder="Digite o nome do corredor" required />
      </div>

      <div class="campo">
        <label for="Percurso">Percurso</label>
        <select id="Percurso" required>
          <option value="">Selecione o percurso</option>
          <option value="2,5 km">2,5 km</option>
          <option value="5 km">5 km</option>
          <option value="10 km">10 km</option>
        </select>
      </div>

      <div class="campo">
        <label for="Idade">Idade</label>
        <input id="Idade" type="number" min="14" max="80" placeholder="Digite a idade" required />
      </div>

      <div class="campo">
        <label for="CPF">CPF</label>
        <input id="CPF" type="text" placeholder="000.000.000-00"
               maxlength="14" inputmode="numeric" required />
      </div>

      <button class="botao" type="submit">Salvar corredor</button>
      <div id="mensagem"></div>
    </form>
  `;

  const campoCPF = document.querySelector("#CPF");
  campoCPF.addEventListener("input", () => {
    campoCPF.value = mascaraCPF(campoCPF.value);
  });

  document.querySelector("#formCorredor").addEventListener("submit", function (evento) {
    evento.preventDefault();

    const nome = document.querySelector("#nome").value.trim();
    const Percurso = document.querySelector("#Percurso").value.trim();
    const Idade = document.querySelector("#Idade").value.trim();
    const CPF = document.querySelector("#CPF").value.trim();

    if (Percurso === "10 km" && Number(Idade) < 18) {
      document.querySelector("#mensagem").innerHTML =
        `<div class="mensagem">Para o percurso de 10 km a idade mínima é 18 anos.</div>`;
      return;
    }

    if (CPF.replace(/\D/g, "").length !== 11) {
      document.querySelector("#mensagem").innerHTML =
        `<div class="mensagem">CPF inválido. Digite os 11 números.</div>`;
      return;
    }

    corredores.push({ nome, Percurso, Idade, CPF });

    document.querySelector("#mensagem").innerHTML =
      `<div class="mensagem">Corredor cadastrado com sucesso.</div>`;

    evento.target.reset();
  });
}

function mostrarLista() {
  app.innerHTML = `
    <h1>Lista de Corredores</h1>
    <p>Dados dos corredores cadastrados.</p>
    <div id="conteudoLista"></div>
  `;

  renderizarTabela();
}

function renderizarTabela() {
  const conteudo = document.querySelector("#conteudoLista");

  if (corredores.length === 0) {
    conteudo.innerHTML = `
      <div class="vazio">
        Nenhum corredor cadastrado ainda.
      </div>
    `;
    return;
  }

  let linhas = "";

  corredores.forEach((corredor, indice) => {
    linhas += `
      <tr>
        <td>${corredor.nome}</td>
        <td>${corredor.Percurso}</td>
        <td>${corredor.CPF}</td>
        <td>${corredor.Idade}</td>
        <td>
          <button class="excluir" data-indice="${indice}">Excluir</button>
        </td>
      </tr>
    `;
  });

  conteudo.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Percurso</th>
          <th>CPF</th>
          <th>Idade</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
        ${linhas}
      </tbody>
    </table>
  `;

  document.querySelectorAll(".excluir").forEach(botao => {
    botao.addEventListener("click", function () {
      const indice = Number(this.dataset.indice);
      corredores.splice(indice, 1);
      renderizarTabela();
    });
  });
}

function mostrarSobre() {
  app.innerHTML = `
    <h1>Sobre o evento</h1>
    <p>
      📌 Evento de corrida de rua com caráter solidário e não competitivo (com classificação e premiação).
    </p>
    <p>
      🤝 Promoção: UNIVERSIDADE MAURICIO DE NASSAU (UNINASSAU).
    </p>
    <p>
      🏅 Supervisão técnica: Federação Sergipana de Atletismo (FSAt).
    </p>
    <p>
      ⏰ Largada: 06h30 (pode sofrer ajustes por motivos operacionais: trânsito, energia, comunicação, quantidade de inscritos etc.).
    </p>
    <p>
      📍 Local largada/chegada: Estacionamento do Shopping RioMar Aracaju — Av. Delmiro Gouveia, 400 – Coroa do Meio – Aracaju/SE – CEP 49035-500.
    </p>
    <p>
      🌦️ A prova ocorre com qualquer condição climática.
    </p>
    <h2>Percurso</h2>
    <p>
      🛣️ Percursos: 2,5 km | 5 km | 10 km.
    </p>
    <p>
      ⏳ Tempo máximo de prova: 1h30 (atletas fora do tempo projetado podem ser convidados a se retirar do percurso).
    </p>
    <p>
      👶 Idade mínima (considera a idade em 31/12 do ano do evento – Norma CBAt): ✅ 2,5 km e 5 km: mínimo 14 anos; ✅ 10 km: mínimo 18 anos.
    </p>
    <p>
      🧾 Menores de 18 anos: somente com autorização do responsável legal (assinatura do termo) + entrega de cópia de documento oficial com foto (retida na retirada do kit).
    </p>
    <h3>Premiação</h3>
    <p>
      🏅 Medalha finisher para todos que concluírem regularmente.
    </p>
    <p>
      🏆 Troféus: 2,5 km — Geral top 3 masc e top 3 fem; PCD top 3 masc e top 3 fem. 5 km — Geral top 3 masc e top 3 fem; PCD top 3 masc e top 3 fem. 10 km — Geral top 3 masc e top 3 fem; PCD top 3 masc e top 3 fem; Faixa etária (top 3 masc e fem): 18 a 29; 30 a 39; 40 a 44; 45 a 49; 50 a 54; 55 a 59; 60 a 64; 65 a 69; 70+.
    </p>
    <p>
      👥 Assessorias/Equipes/Academias: 1 troféu para a assessoria/equipe/academia com maior número de inscritos.
    </p>
  `;
}

// Eventos globais (registrados uma única vez)
botoesMenu.forEach(botao => {
  botao.addEventListener("click", () => irPara(botao.dataset.rota));
});

document.querySelector("#logo")
  .addEventListener("click", () => irPara("inicio"));

// Tela inicial
mostrarInicio();

