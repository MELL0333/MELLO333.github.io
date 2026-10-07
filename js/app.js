/* =========================================================
   SPA - Cadastro de Corredores
   Organização: dados -> utilitários -> telas -> regras -> rotas
   ========================================================= */

/* ---------- 1. DADOS (estado da aplicação) ---------- */
const ANO_EVENTO = 2026;
const corredores = [];

/* ---------- 2. ELEMENTOS GLOBAIS ---------- */
const app = document.querySelector("#app");
const botoesMenu = document.querySelectorAll("nav button");

/* ---------- 3. UTILITÁRIOS ---------- */
function mascaraCPF(valor) {
  return valor
    .replace(/\D/g, "")
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
}

// Idade em 31/12 do ano do evento (Norma CBAt)
function calcularIdade(dataNascimento) {
  const ano = Number(dataNascimento.slice(0, 4));
  return ANO_EVENTO - ano;
}

function escapeHTML(texto) {
  const div = document.createElement("div");
  div.textContent = texto;
  return div.innerHTML;
}

function mostrarMensagem(texto) {
  document.querySelector("#mensagem").innerHTML =
    `<div class="mensagem">${texto}</div>`;
}

/* ---------- 4. TELAS (views) ---------- */
function mostrarInicio() {
  app.innerHTML = `
    <img class="banner" src="imagens/banner.png" alt="Largada da Maratona de Programação 2026" />
    <h1>Cadastro de Corredores</h1>
    <p>
      <strong>1ª CORRIDA - Maratona de Programação 2026</strong>!
    </p>

    <p>Realizado por: Alunos do Curso de ADS.</p>

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
        <label for="Nascimento">Data de nascimento</label>
        <input id="Nascimento" type="date" min="1900-01-01" required />
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

  document.querySelector("#formCorredor")
    .addEventListener("submit", salvarCorredor);
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
      <div class="vazio">Nenhum corredor cadastrado ainda.</div>
    `;
    return;
  }

  let linhas = "";

  corredores.forEach((corredor, indice) => {
    linhas += `
      <tr>
        <td>${escapeHTML(corredor.nome)}</td>
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
      <tbody>${linhas}</tbody>
    </table>
  `;

  document.querySelectorAll(".excluir").forEach(botao => {
    botao.addEventListener("click", function () {
      excluirCorredor(Number(this.dataset.indice));
    });
  });
}

function mostrarSobre() {
  app.innerHTML = `
    <h1>Sobre o evento</h1>
    <p>📌 Evento de corrida de rua com caráter solidário e não competitivo (com classificação e premiação).</p>
    <p>🤝 Promoção: UNIVERSIDADE MAURICIO DE NASSAU (UNINASSAU).</p>
    <p>🏅 Supervisão técnica: Federação Sergipana de Atletismo (FSAt).</p>
    <p>⏰ Largada: 06h30 (pode sofrer ajustes por motivos operacionais: trânsito, energia, comunicação, quantidade de inscritos etc.).</p>
    <p>📍 Local largada/chegada: Estacionamento do Shopping RioMar Aracaju — Av. Delmiro Gouveia, 400 – Coroa do Meio – Aracaju/SE – CEP 49035-500.</p>
    <p>🌦️ A prova ocorre com qualquer condição climática.</p>

    <h2>Percurso</h2>
    <p>🛣️ Percursos: 2,5 km | 5 km | 10 km.</p>
    <p>⏳ Tempo máximo de prova: 1h30 (atletas fora do tempo projetado podem ser convidados a se retirar do percurso).</p>
    <p>👶 Idade mínima (considera a idade em 31/12 do ano do evento – Norma CBAt): ✅ 2,5 km e 5 km: mínimo 14 anos; ✅ 10 km: mínimo 18 anos.</p>
    <p>🧾 Menores de 18 anos: somente com autorização do responsável legal (assinatura do termo) + entrega de cópia de documento oficial com foto (retida na retirada do kit).</p>

    <h3>Premiação</h3>
    <p>🏅 Medalha finisher para todos que concluírem regularmente.</p>
    <p>🏆 Troféus: 2,5 km — Geral top 3 masc e top 3 fem; PCD top 3 masc e top 3 fem. 5 km — Geral top 3 masc e top 3 fem; PCD top 3 masc e top 3 fem. 10 km — Geral top 3 masc e top 3 fem; PCD top 3 masc e top 3 fem; Faixa etária (top 3 masc e fem): 18 a 29; 30 a 39; 40 a 44; 45 a 49; 50 a 54; 55 a 59; 60 a 64; 65 a 69; 70+.</p>
    <p>👥 Assessorias/Equipes/Academias: 1 troféu para a assessoria/equipe/academia com maior número de inscritos.</p>
  `;
}

/* ---------- 5. REGRAS DE NEGÓCIO (ações) ---------- */
function salvarCorredor(evento) {
  evento.preventDefault();

  const nome = document.querySelector("#nome").value.trim();
  const Percurso = document.querySelector("#Percurso").value.trim();
  const Nascimento = document.querySelector("#Nascimento").value.trim();
  const CPF = document.querySelector("#CPF").value.trim();
  const Idade = calcularIdade(Nascimento);

  if (Percurso === "10 km" && Idade < 18) {
    mostrarMensagem("Para o percurso de 10 km a idade mínima é 18 anos.");
    return;
  }

  if (Idade < 14) {
    mostrarMensagem("A idade mínima para participar é 14 anos.");
    return;
  }

  if (CPF.replace(/\D/g, "").length !== 11) {
    mostrarMensagem("CPF inválido. Digite os 11 números.");
    return;
  }

  corredores.push({ nome, Percurso, Idade, CPF });

  mostrarMensagem("Corredor cadastrado com sucesso.");
  evento.target.reset();
}

function excluirCorredor(indice) {
  corredores.splice(indice, 1);
  renderizarTabela();
}

/* ---------- 6. NAVEGAÇÃO (rotas) ---------- */
function marcarMenuAtivo(rota) {
  botoesMenu.forEach(botao => {
    botao.classList.toggle("ativo", botao.dataset.rota === rota);
  });
}

const rotas = {
  inicio: mostrarInicio,
  cadastro: mostrarCadastro,
  lista: mostrarLista,
  sobre: mostrarSobre
};

function irPara(rota) {
  marcarMenuAtivo(rota);
  if (rotas[rota]) rotas[rota]();
}

/* ---------- 7. INICIALIZAÇÃO ---------- */
botoesMenu.forEach(botao => {
  botao.addEventListener("click", () => irPara(botao.dataset.rota));
});

document.querySelector("#logo")
  .addEventListener("click", () => irPara("inicio"));

irPara("inicio");