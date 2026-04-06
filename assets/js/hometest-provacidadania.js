// ----------------------------
// SETTINGS
// ----------------------------
const QUESTIONS_PER_ROW = 3;

// ----------------------------
// FULL QUESTION POOL – Provacidadania.pt
// Portuguese civics: history, culture, politics, rights, society
// ----------------------------
const INLINE_TEST_QUESTIONS = [
  {
    q: "Em que ano foi fundado o Condado Portucalense?",
    a: ["1096", "1143", "1179"],
    correct: 0
  },
  {
    q: "Qual é o nome do hino nacional português?",
    a: ["A Portuguesa", "Hino da Carta", "A Marselhesa"],
    correct: 0
  },
  {
    q: "Que revolução restaurou a democracia em Portugal em 1974?",
    a: ["Revolução dos Cravos (25 de Abril)", "Revolução de 5 de Outubro", "Revolução de 1640"],
    correct: 0
  },
  {
    q: "Qual é o órgão legislativo de Portugal?",
    a: ["Assembleia da República", "Conselho de Estado", "Tribunal Constitucional"],
    correct: 0
  },
  {
    q: "De quantos em quantos anos se realizam eleições legislativas em Portugal?",
    a: ["4 anos", "5 anos", "3 anos"],
    correct: 0
  },
  {
    q: "Que documento garante os direitos fundamentais dos cidadãos portugueses?",
    a: ["Constituição da República Portuguesa", "Código Civil", "Carta dos Direitos Fundamentais da UE"],
    correct: 0
  },
  {
    q: "Em que ano Portugal aderiu à Comunidade Económica Europeia (atual UE)?",
    a: ["1986", "1995", "1974"],
    correct: 0
  },
  {
    q: "O que representa a esfera armilar na bandeira de Portugal?",
    a: ["A era dos Descobrimentos", "A monarquia constitucional", "A República"],
    correct: 0
  },
  {
    q: "Quem foi o navegador português que chegou à Índia por via marítima em 1498?",
    a: ["Vasco da Gama", "Pedro Álvares Cabral", "Fernão de Magalhães"],
    correct: 0
  },
  {
    q: "Qual é o nome do sistema de saúde público em Portugal?",
    a: ["Serviço Nacional de Saúde (SNS)", "Sistema Único de Saúde (SUS)", "Segurança Social"],
    correct: 0
  },
  {
    q: "Quantos deputados tem a Assembleia da República?",
    a: ["230", "250", "200"],
    correct: 0
  },
  {
    q: "Qual é a língua oficial de Portugal, consagrada na Constituição?",
    a: ["Português", "Português e mirandês", "Não está definida na Constituição"],
    correct: 0
  },
  {
    q: "O que é a CPLP?",
    a: [
      "Comunidade dos Países de Língua Portuguesa",
      "Conselho Permanente da Língua Portuguesa",
      "Comissão para a Proteção da Língua Portuguesa"
    ],
    correct: 0
  },
  {
    q: "Quem é o Chefe de Estado em Portugal?",
    a: ["O Presidente da República", "O Primeiro-Ministro", "O Presidente da Assembleia"],
    correct: 0
  },
  {
    q: "Que tratado consolidou a independência de Portugal em 1143?",
    a: ["Tratado de Zamora", "Tratado de Windsor", "Tratado de Tordesilhas"],
    correct: 0
  },
  {
    q: "Em que data se celebra o Dia de Portugal?",
    a: ["10 de junho", "25 de abril", "5 de outubro"],
    correct: 0
  },
  {
    q: "Qual foi o regime político que vigorou em Portugal entre 1933 e 1974?",
    a: ["Estado Novo", "Monarquia constitucional", "Primeira República"],
    correct: 0
  },
  {
    q: "O que é o fado?",
    a: [
      "Um género musical português, Património da Humanidade",
      "Uma dança tradicional do Alentejo",
      "Um instrumento musical de cordas"
    ],
    correct: 0
  },
  {
    q: "Qual é o tribunal máximo em matéria constitucional em Portugal?",
    a: ["Tribunal Constitucional", "Supremo Tribunal de Justiça", "Tribunal de Contas"],
    correct: 0
  },
  {
    q: "A nova Lei da Nacionalidade introduz que novo requisito para a cidadania por naturalização?",
    a: [
      "Prova de conhecimentos cívicos sobre Portugal",
      "Prova de rendimentos mínimos",
      "Entrevista presencial com o SEF"
    ],
    correct: 0
  }
];

// ----------------------------
// SHUFFLE — runs before DOM logic
// ----------------------------
function shuffleAnswers(question) {
  const combined = question.a.map((opt, index) => ({
    text: opt,
    isCorrect: index === question.correct
  }));
  for (let i = combined.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [combined[i], combined[j]] = [combined[j], combined[i]];
  }
  question.a = combined.map(item => item.text);
  question.correct = combined.findIndex(item => item.isCorrect);
}

INLINE_TEST_QUESTIONS.forEach(q => shuffleAnswers(q));

// ----------------------------
// BUILD ROWS (after shuffle so object references are stable)
// ----------------------------
const rows = [];
for (let i = 0; i < INLINE_TEST_QUESTIONS.length; i += QUESTIONS_PER_ROW) {
  rows.push(INLINE_TEST_QUESTIONS.slice(i, i + QUESTIONS_PER_ROW));
}

// ----------------------------
// ALL DOM LOGIC INSIDE DOMContentLoaded
// ----------------------------
document.addEventListener("DOMContentLoaded", function () {

  const totalQuestions    = INLINE_TEST_QUESTIONS.length;
  let correctCount        = 0;
  let wrongCount          = 0;
  let answeredCount       = 0;
  let currentRow          = 0;

  const rowAnsweredCounts = new Array(rows.length).fill(0);

  const container = document.getElementById("inline-test-questions");
  if (!container) {
    console.error("hometest-provacidadania: #inline-test-questions not found in DOM.");
    return;
  }

  // ----------------------------
  // PROGRESS
  // ----------------------------
  function updateProgressDisplay() {
    const el = document.getElementById("inline-progress-text");
    if (el) el.textContent = "Progresso: " + answeredCount + " / " + totalQuestions + " perguntas";
  }

  function updateProgressBar() {
    const bar = document.getElementById("inline-progressbar");
    if (bar) bar.style.width = ((answeredCount / totalQuestions) * 100) + "%";
  }

  // ----------------------------
  // END CARD
  // ----------------------------
  function createDonutChart() {
    const pct = Math.round((correctCount / totalQuestions) * 100);
    const C   = 2 * Math.PI * 40;
    return (
      '<div class="donut-wrapper">' +
        '<svg width="120" height="120" viewBox="0 0 100 100">' +
          '<circle cx="50" cy="50" r="40" stroke="#d4edda" stroke-width="12" fill="none"></circle>' +
          '<circle cx="50" cy="50" r="40" stroke="#006600" stroke-width="12" fill="none"' +
            ' stroke-dasharray="' + ((pct / 100) * C) + ' ' + ((1 - pct / 100) * C) + '"' +
            ' transform="rotate(-90 50 50)" stroke-linecap="round"></circle>' +
        '</svg>' +
        '<div class="donut-center">' + pct + '%</div>' +
      '</div>'
    );
  }

  function createEndCard() {
    const pct  = Math.round((correctCount / totalQuestions) * 100);
    const card = document.createElement("div");
    card.className = "inline-question-card end-card";
    const title =
      pct >= 80 ? "Excelente!" :
      pct >= 50 ? "Bom resultado!" :
      pct >= 25 ? "Bom começo!" :
      "Continue a praticar!";
    card.innerHTML =
      "<h3>" + title + "</h3>" +
      createDonutChart() +
      "<p>Acabou de experimentar algumas das nossas perguntas de exemplo. " +
      "Tenha acesso a <strong>800 perguntas em 5 temas com explicações detalhadas</strong> e estude ao seu ritmo.</p>" +
      '<a href="https://civiclearn.com/portugal/checkout" class="hero-primary-btn">Acesso completo</a>';
    return card;
  }

  // ----------------------------
  // RENDER
  // ----------------------------
  function renderRow(rowIndex) {
    if (!rows[rowIndex]) return;
    rows[rowIndex].forEach(function (q, offset) {
      var absoluteIndex = rowIndex * QUESTIONS_PER_ROW + offset;
      container.appendChild(createQuestionCard(q, absoluteIndex, rowIndex));
    });
  }

  function createQuestionCard(questionObj, absoluteIndex, rowIndex) {
    var card = document.createElement("div");
    card.className = "inline-question-card";

    var title = document.createElement("h3");
    title.textContent = questionObj.q;
    card.appendChild(title);

    var feedback = document.createElement("div");
    feedback.className = "inline-feedback";

    questionObj.a.forEach(function (opt, i) {
      var btn = document.createElement("button");
      btn.className = "inline-option-btn";
      btn.textContent = opt;

      btn.onclick = function () {
        answeredCount++;
        rowAnsweredCounts[rowIndex]++;
        updateProgressDisplay();
        updateProgressBar();

        var allBtns = card.querySelectorAll("button");
        allBtns.forEach(function (b) { b.disabled = true; });

        if (i === questionObj.correct) {
          correctCount++;
          btn.style.background  = "rgba(24, 160, 110, 0.15)";
          btn.style.borderColor = "#18a06e";
          btn.style.color       = "#14805a";
          feedback.textContent  = "Correto!";
          feedback.classList.add("inline-correct");
        } else {
          wrongCount++;
          btn.style.background  = "rgba(230, 57, 70, 0.12)";
          btn.style.borderColor = "#e63946";
          btn.style.color       = "#c5303b";
          allBtns[questionObj.correct].style.background  = "rgba(24, 160, 110, 0.15)";
          allBtns[questionObj.correct].style.borderColor = "#18a06e";
          allBtns[questionObj.correct].style.color       = "#14805a";
          feedback.textContent = "Resposta correta: " + questionObj.a[questionObj.correct];
          feedback.classList.add("inline-wrong");
        }

        card.appendChild(feedback);

        if (absoluteIndex === totalQuestions - 1) {
          setTimeout(function () { container.appendChild(createEndCard()); }, 300);
          return;
        }

        var rowSize = rows[rowIndex].length;
        if (rowAnsweredCounts[rowIndex] === rowSize) {
          currentRow++;
          setTimeout(function () { renderRow(currentRow); }, 150);
        }
      };

      card.appendChild(btn);
    });

    return card;
  }

  // ----------------------------
  // INIT
  // ----------------------------
  renderRow(0);
  updateProgressDisplay();
  updateProgressBar();

}); // end DOMContentLoaded
