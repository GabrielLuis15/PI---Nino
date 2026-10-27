
import { auth } from "/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";


const mesAno = document.getElementById("mesAno");
const diasCalendario = document.getElementById("diasCalendario");
const mesAnterior = document.getElementById("mesAnterior");
const proximoMes = document.getElementById("proximoMes");
const mesAtual = document.getElementById("mesAtual");

const hoje = new Date();
let anoExibido = hoje.getFullYear();
let mesExibido = hoje.getMonth();

const nomesMeses = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro"
];



const coresEmocoes = {
    feliz: "#F7C6D9",
    calmo: "#B9DDB5",
    neutro: "#D6D6D6",
    triste: "#AFCBEF",
    ansioso: "#F5C58A"
};

function formatarISO(ano, mes, dia) {
    return `${ano}-${String(mes + 1).padStart(2, "0")}-${String(dia).padStart(2, "0")}`;
}

function abrirRegistro(data) {
    window.location.href = `/registro?data=${data}`;
}


async function buscarRegistros(mes) {
    const usuario = auth.currentUser;

    if (!usuario) {
        throw new Error("Você precisa entrar na sua conta.");
    }

    const token = await usuario.getIdToken();

    const resposta = await fetch(`/api/registros?mes=${mes}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    if (!resposta.ok) {
        const resultado = await resposta.json();
        throw new Error(resultado.erro || "Não foi possível carregar os registros.");
    }

    return resposta.json();
}


async function renderizarCalendario() {
    mesAno.textContent = `${nomesMeses[mesExibido]} de ${anoExibido}`;
    diasCalendario.innerHTML = "";

    const mes = `${anoExibido}-${String(mesExibido + 1).padStart(2, "0")}`;

    let registros = {};

    try {
        registros = await buscarRegistros(mes);
    } catch (erro) {
        console.error(erro);
    }

    const primeiroDia = new Date(anoExibido, mesExibido, 1).getDay();
    const totalDias = new Date(anoExibido, mesExibido + 1, 0).getDate();

    for (let i = 0; i < primeiroDia; i++) {
        const vazio = document.createElement("div");
        vazio.className = "dia vazio";
        diasCalendario.appendChild(vazio);
    }

    for (let dia = 1; dia <= totalDias; dia++) {
        const data = formatarISO(anoExibido, mesExibido, dia);
        const botao = document.createElement("button");

        botao.type = "button";
        botao.className = "dia";
        botao.textContent = dia;

        botao.setAttribute(
            "aria-label",
            `Abrir registro de ${dia} de ${nomesMeses[mesExibido]} de ${anoExibido}`
        );

        if (
            dia === hoje.getDate() &&
            mesExibido === hoje.getMonth() &&
            anoExibido === hoje.getFullYear()
        ) {
            botao.classList.add("hoje");
        }

        const emocao = registros[data];

        if (emocao && coresEmocoes[emocao]) {
            const bolinha = document.createElement("span");
            bolinha.className = "emocao-dot";
            bolinha.style.backgroundColor = coresEmocoes[emocao];
            bolinha.setAttribute("aria-label", `Emoção: ${emocao}`);
            botao.appendChild(bolinha);
        }

        botao.addEventListener("click", () => abrirRegistro(data));
        diasCalendario.appendChild(botao);
    }
}

mesAnterior.addEventListener("click", () => {
    mesExibido--;

    if (mesExibido < 0) {
        mesExibido = 11;
        anoExibido--;
    }

    renderizarCalendario();
});

proximoMes.addEventListener("click", () => {
    mesExibido++;

    if (mesExibido > 11) {
        mesExibido = 0;
        anoExibido++;
    }

    renderizarCalendario();
});

mesAtual.addEventListener("click", () => {
    anoExibido = hoje.getFullYear();
    mesExibido = hoje.getMonth();
    renderizarCalendario();
});

onAuthStateChanged(auth, (usuario) => {
    if (!usuario) {
        window.location.replace("/login");
        return;
    }

    renderizarCalendario();
});