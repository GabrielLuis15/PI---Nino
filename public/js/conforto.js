document.addEventListener("DOMContentLoaded", () => {
// ===== SONS AMBIENTES =====
const btnSom = document.getElementById("btnSom");
const iconeSom = document.getElementById("iconeSom");
const textoBotaoSom = document.getElementById("textoBotaoSom");
const somStatus = document.getElementById("somStatus");
const audioChuva = document.getElementById("audioChuva");
const audioMar = document.getElementById("audioMar");

let somAtual = "off";
let trocandoSom = false;

function pararSons() {
  [audioChuva, audioMar].forEach((audio) => {
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  });
}

function atualizarBotaoSom() {
  if (!btnSom || !iconeSom || !textoBotaoSom || !somStatus) return;

  if (somAtual === "off") {
    iconeSom.textContent = "🔇";
    textoBotaoSom.textContent = "Ativar som ambiente";
    somStatus.textContent = "Silêncio ativado";
  } else if (somAtual === "chuva") {
    iconeSom.textContent = "🌧️";
    textoBotaoSom.textContent = "Som de chuva";
    somStatus.textContent = "Agora: chuva. Clique para trocar o som.";
  } else {
    iconeSom.textContent = "🌊";
    textoBotaoSom.textContent = "Som do mar";
    somStatus.textContent = "Agora: mar. Clique para desligar.";
  }
}

if (btnSom && iconeSom && textoBotaoSom && somStatus) {
  btnSom.addEventListener("click", async () => {
    if (trocandoSom) return;

    trocandoSom = true;

    const proximoSom = {
      off: "chuva",
      chuva: "mar",
      mar: "off"
    };

    const escolhido = proximoSom[somAtual];

    try {
      pararSons();

      if (escolhido === "off") {
        somAtual = "off";
        atualizarBotaoSom();
        return;
      }

      const audio = escolhido === "chuva" ? audioChuva : audioMar;

      if (!audio) {
        somStatus.textContent = "Não foi possível encontrar o áudio.";
        return;
      }

      await audio.play();

      somAtual = escolhido;
      atualizarBotaoSom();
    } catch (erro) {
      somAtual = "off";
      pararSons();
      atualizarBotaoSom();

      somStatus.textContent =
        "Não foi possível tocar o áudio. Confira os arquivos de som.";

      console.error("Erro ao reproduzir áudio:", erro);
    } finally {
      trocandoSom = false;
    }
  });
}
  // ===== RESPIRAÇÃO GUIADA =====

  const btnRespirar = document.getElementById("btnRespirar");
  const circulo = document.getElementById("circuloRespiracao");
  const fraseRespiracao = document.getElementById("fraseRespiracao");
  const textoCirculo = document.getElementById("textoCirculo");

  let respiracaoAtiva = false;
  let temporizador = null;
  let faseAtual = "inspirar";

  function mostrarFase(fase) {
    faseAtual = fase;

    circulo.classList.remove("inspirar", "expirar");

    if (fase === "inspirar") {
      textoCirculo.textContent = "INSPIRE";
      fraseRespiracao.textContent = "Inspire devagar pelo nariz...";
    } else {
      textoCirculo.textContent = "EXPIRE";
      fraseRespiracao.textContent = "Expire suavemente, sem pressa...";
    }

    // Reinicia a transição para a animação começar em cada fase.
    void circulo.offsetWidth;
    circulo.classList.add(fase);
  }

  function alternarFase() {
    if (!respiracaoAtiva) return;

    mostrarFase(faseAtual === "inspirar" ? "expirar" : "inspirar");

    temporizador = setTimeout(alternarFase, 4000);
  }

  function pararRespiracao() {
    respiracaoAtiva = false;
    clearTimeout(temporizador);
    temporizador = null;

    circulo.classList.remove("inspirar", "expirar");
    textoCirculo.textContent = "PAUSA";
    fraseRespiracao.textContent =
      "Tudo bem. Respire no seu tempo. Você pode voltar quando quiser.";

    btnRespirar.textContent = "Começar respiração";
    btnRespirar.setAttribute("aria-pressed", "false");
  }

  btnRespirar.addEventListener("click", () => {
    if (respiracaoAtiva) {
      pararRespiracao();
      return;
    }

    respiracaoAtiva = true;
    btnRespirar.textContent = "Encerrar respiração";
    btnRespirar.setAttribute("aria-pressed", "true");

    mostrarFase("inspirar");

    clearTimeout(temporizador);
    temporizador = setTimeout(alternarFase, 4000);
  });

  // ===== FRASES POR EMOÇÃO =====

  const opcoesEmocao = document.querySelectorAll(".emocao-opcao");
  const iconeMensagem = document.getElementById("iconeMensagem");
  const textoMensagem = document.getElementById("textoMensagem");

  const mensagens = {
    feliz: {
      icone: "☀️",
      texto: "Que alegria! Permita-se aproveitar esse momento bom e guardar com carinho o que faz seu coração sorrir."
    },
    calmo: {
      icone: "🍃",
      texto: "Que bom poder encontrar um pouco de tranquilidade. Você pode permanecer nesse instante, sem precisar correr."
    },
    neutro: {
      icone: "🌿",
      texto: "Você não precisa sentir algo extraordinário o tempo todo. Estar como está hoje também faz parte da vida."
    },
    triste: {
      icone: "💚",
      texto: "Sinto muito que hoje esteja sendo difícil. Você não precisa fingir que está tudo bem. Vá com carinho consigo mesmo."
    },
    ansioso: {
      icone: "🫶",
      texto: "Vamos por partes. Você não precisa resolver tudo de uma vez. Volte sua atenção para este instante e respire no seu ritmo."
    }
  };

  opcoesEmocao.forEach((botao) => {
    botao.addEventListener("click", () => {
      const emocao = botao.dataset.emocao;
      const mensagem = mensagens[emocao];

      opcoesEmocao.forEach((opcao) => {
        opcao.setAttribute("aria-pressed", "false");
      });

      botao.setAttribute("aria-pressed", "true");
      iconeMensagem.textContent = mensagem.icone;
      textoMensagem.textContent = mensagem.texto;
    });
  });

  // Interrompe sons e animação ao sair da página.
  window.addEventListener("pagehide", () => {
    pararSons();
    clearTimeout(temporizador);
  });
});