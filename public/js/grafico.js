
import { auth } from "/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";


const cores = {
    feliz: "#F7C6D9",
    calmo: "#B9DDB5",
    neutro: "#D6D6D6",
    triste: "#AFCBEF",
    ansioso: "#F5C58A"
};

const nomes = {
    feliz: "Feliz 😊",
    calmo: "Calmo 😌",
    neutro: "Neutro 😐",
    triste: "Triste 😢",
    ansioso: "Ansioso 😰"
};

const valores = {
    triste: 1,
    ansioso: 2,
    neutro: 3,
    calmo: 4,
    feliz: 5
};

const campoMensagem = document.getElementById("mensagem");
const campoEmocao = document.getElementById("emocaoPrincipal");
const campoTotal = document.getElementById("totalRegistros");
const campoReflexao = document.getElementById("textoReflexao");
const tituloReflexao = document.getElementById("tituloReflexao");

let grafico = null;
let periodoAtual = "semana";

const canvas = document.getElementById("graficoEmocional");

const dataFormatada = data => {
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}`;
};

function atualizarReflexao(registros) {
    const periodo = {
        semana: "da semana",
        mes: "do mês",
        seisMeses: "dos últimos 6 meses",
        ano: "do ano"
    };

    tituloReflexao.textContent =
        `Reflexão ${periodo[periodoAtual]}`;

    if (!registros.length) {
        campoReflexao.textContent =
            "Você ainda não tem registros neste período. " +
            "Quando quiser, reserve um momento para observar como está se sentindo.";
        return;
    }

    const contagem = {};

    registros.forEach(registro => {
        contagem[registro.emocao] =
            (contagem[registro.emocao] || 0) + 1;
    });

    const emocaoPrincipal = Object.keys(contagem).sort(
        (a, b) => contagem[b] - contagem[a]
    )[0];

    const mensagens = {
        feliz: "Que bom encontrar momentos de alegria! " +
            "Tente perceber o que trouxe leveza ao seu dia.",
        calmo: "Você registrou momentos de tranquilidade. " +
            "Se puder, observe o que ajuda você a se sentir assim.",
        neutro: "Nem todo dia precisa ser intenso. " +
            "Respeite seu ritmo e acolha o que sente.",
        triste: "Se a tristeza apareceu, permita-se reconhecer " +
            "esse sentimento sem se cobrar. Você merece acolhimento.",
        ansioso: "Se a ansiedade apareceu, tente fazer uma pausa " +
            "e respirar no seu ritmo. Você não precisa resolver tudo agora."
    };

    campoReflexao.textContent = mensagens[emocaoPrincipal];
}

function desenharGrafico(registros) {
    if (grafico) {
        grafico.destroy();
        grafico = null;
    }

    if (!registros.length) return;

    grafico = new Chart(canvas, {
        type: "line",
        data: {
            labels: registros.map(r => dataFormatada(r.data)),
            datasets: [{
                label: "Estado emocional",
                data: registros.map(r => valores[r.emocao]),
                borderColor: "#43875A",
                backgroundColor: registros.map(r => cores[r.emocao]),
                pointBackgroundColor: registros.map(r => cores[r.emocao]),
                pointBorderColor: "#43875A",
                pointRadius: 6,
                pointHoverRadius: 9,
                borderWidth: 2,
                tension: 0.3,
                spanGaps: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                intersect: false,
                mode: "nearest"
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: contexto => {
                            const registro = registros[contexto.dataIndex];
                            return nomes[registro.emocao];
                        }
                    }
                }
            },
            scales: {
                y: {
                    min: 1,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        callback: valor => ({
                            1: "Triste",
                            2: "Ansioso",
                            3: "Neutro",
                            4: "Calmo",
                            5: "Feliz"
                        })[valor] || ""
                    },
                    grid: { color: "#77777718" }
                },
                x: {
                    grid: { display: false },
                    ticks: {
                        maxRotation: 45,
                        autoSkip: true,
                        maxTicksLimit: 10
                    }
                }
            }
        }
    });
}


async function carregarGrafico() {
    campoMensagem.textContent = "Carregando registros...";

    const usuario = auth.currentUser;

    if (!usuario) {
        campoMensagem.textContent = "Verificando sua conta...";
        return;
    }

    try {
        const token = await usuario.getIdToken();

        const resposta = await fetch(
            `/api/grafico/registros?periodo=${periodoAtual}`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        if (!resposta.ok) {
            const resultado = await resposta.json();
            throw new Error(resultado.erro || "Falha ao consultar os registros.");
        }

        const registros = await resposta.json();

        campoMensagem.textContent = "";
        campoTotal.textContent = registros.length;

        if (!registros.length) {
            campoEmocao.textContent = "Nenhuma";
            campoMensagem.textContent =
                "Nenhum registro encontrado neste período.";

            desenharGrafico([]);
            atualizarReflexao([]);
            return;
        }

        const contagem = {};

        registros.forEach(registro => {
            contagem[registro.emocao] =
                (contagem[registro.emocao] || 0) + 1;
        });

        const emocaoPrincipal = Object.keys(contagem).reduce(
            (a, b) => contagem[a] >= contagem[b] ? a : b
        );

        campoEmocao.textContent =
            `${nomes[emocaoPrincipal]} — ${contagem[emocaoPrincipal]} vezes`;

        desenharGrafico(registros);
        atualizarReflexao(registros);
    } catch (erro) {
        console.error(erro);
        campoMensagem.textContent =
            "Não foi possível carregar os registros. Tente novamente.";
    }
}


document.querySelectorAll(".filtro").forEach(botao => {
    botao.addEventListener("click", () => {
        periodoAtual = botao.dataset.periodo;

        document.querySelectorAll(".filtro").forEach(item => {
            item.classList.toggle("ativo", item === botao);
        });

        carregarGrafico();
    });
});


onAuthStateChanged(auth, (usuario) => {
    if (!usuario) {
        window.location.replace("/login");
        return;
    }

    carregarGrafico();
});

