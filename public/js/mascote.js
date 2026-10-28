
import { auth } from "/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const ninos = [
    { id: "1", nome: "LEZZI", descricao: "Carinhoso e acolhedor, valoriza os momentos de alegria.", foto: "/imagesNino/mascotes/lezzi.png" },
    { id: "2", nome: "BILU", descricao: "Calmo e tranquilo, lembra você de respeitar seu tempo.", foto: "/imagesNino/mascotes/bilu.png" },
    { id: "3", nome: "TATA", descricao: "Alegre e espontâneo, sabe ser forte diante de tudo.", foto: "/imagesNino/mascotes/tata.png" },
    { id: "4", nome: "VIT", descricao: "Sensível e atencioso, entende que todos os sentimentos importam.", foto: "/imagesNino/mascotes/vit.png" },
    { id: "5", nome: "YAMA", descricao: "Corajoso e persistente, incentiva você a seguir no seu ritmo.", foto: "/imagesNino/mascotes/yama.png" },
    { id: "6", nome: "VICKIE", descricao: "Criativo e empático, te mostra que tudo bem descansar quando necessário.", foto: "/imagesNino/mascotes/vickie.png" }
];

const frases = [
    "Você não precisa resolver tudo hoje.",
    "Respeite o seu tempo. Você está aprendendo.",
    "Pequenos passos também são progresso.",
    "Você merece o mesmo carinho que oferece aos outros.",
    "Está tudo bem descansar.",
    "Um dia difícil não define a sua história.",
    "Você não precisa ser perfeito para ser suficiente.",
    "Respire. Você pode recomeçar.",
    "Seus sentimentos merecem ser ouvidos.",
    "Tenho orgulho de você por continuar tentando."
];

const cores = ["amarelo", "rosa", "azul", "verde", "lilas"];
const CHAVE_MASCOTE = "ninoMascoteDados";

const listaNinos = document.getElementById("listaNinos");
const meuNino = document.getElementById("meuNino");
const fotoSelecionada = document.getElementById("fotoSelecionada");
const nomeSelecionado = document.getElementById("nomeSelecionado");
const descricaoSelecionada = document.getElementById("descricaoSelecionada");
const mural = document.getElementById("mural");
const muralVazio = document.getElementById("muralVazio");
const seletorFrases = document.getElementById("seletorFrases");
const listaFrases = document.getElementById("listaFrases");

let ninoAtual = null;
let postits = [];
let proximoId = 1;
let usuarioAtual = null;
let carregandoDados = true;
let filaSalvamento = Promise.resolve();

function requisicao(url, opcoes = {}) {
    return (async () => {
        if (!usuarioAtual) {
            throw new Error("Entre na sua conta para continuar.");
        }

        const token = await usuarioAtual.getIdToken();

        const resposta = await fetch(url, {
            ...opcoes,
            headers: {
                "Content-Type": "application/json",
                ...opcoes.headers,
                "Authorization": `Bearer ${token}`
            }
        });

        const resultado = await resposta.json();

        if (!resposta.ok) {
            throw new Error(resultado.erro || "Ocorreu um erro.");
        }

        return resultado;
    })();
}

/* SALVAR NO FIREBASE E MANTER O CACHE LOCAL */
function salvarDados() {
    const dados = {
        ninoId: ninoAtual ? ninoAtual.id : null,
        postits: postits.map(item => ({ ...item }))
    };

    // Mantém compatibilidade com outras telas que leem o localStorage.
    try {
        localStorage.setItem(CHAVE_MASCOTE, JSON.stringify(dados));
        window.dispatchEvent(new Event("ninoMascoteAtualizado"));
    } catch (erro) {
        console.error("Erro ao atualizar o cache local:", erro);
    }

    if (!usuarioAtual || carregandoDados) return;

    // Organiza os salvamentos para evitar que gravações se sobreponham.
    filaSalvamento = filaSalvamento
        .then(() => requisicao("/api/mascote", {
            method: "PUT",
            body: JSON.stringify(dados)
        }))
        .catch(erro => {
            console.error("Erro ao salvar no Firebase:", erro);
            alert("Não foi possível salvar no Firebase. Confira sua conexão e tente novamente.");
        });

    return filaSalvamento;
}

/* ATUALIZAR A SELEÇÃO VISUAL */
function atualizarSelecaoVisual() {
    document.querySelectorAll(".card-nino").forEach(card => {
        const selecionado = ninoAtual &&
            card.dataset.id === ninoAtual.id;

        card.classList.toggle("selecionado", Boolean(selecionado));

        const botao = card.querySelector(".btn-escolher");
        if (botao) {
            botao.textContent = selecionado
                ? "Nino escolhido ✓"
                : "Escolher este Nino";
        }
    });

    if (!ninoAtual) {
        meuNino.hidden = true;
        return;
    }

    fotoSelecionada.src = ninoAtual.foto;
    fotoSelecionada.alt = `Nino ${ninoAtual.nome}`;
    nomeSelecionado.textContent = ninoAtual.nome;
    descricaoSelecionada.textContent = ninoAtual.descricao;
    meuNino.hidden = false;
}

/* ESCOLHER UM NINO */
function selecionarNino(id, salvar = true) {
    const encontrado = ninos.find(nino => nino.id === String(id));
    if (!encontrado) return;

    ninoAtual = encontrado;
    atualizarSelecaoVisual();

    if (salvar) salvarDados();
}

listaNinos.addEventListener("click", event => {
    const botao = event.target.closest(".btn-escolher");
    if (!botao) return;

    const card = botao.closest(".card-nino");
    if (card) selecionarNino(card.dataset.id);
});

document.getElementById("btnEditarNino").addEventListener("click", () => {
    listaNinos.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
});

/* APAGAR A ESCOLHA, PRESERVANDO O MURAL */
document.getElementById("btnApagarNino").addEventListener("click", () => {
    ninoAtual = null;
    atualizarSelecaoVisual();
    salvarDados();
});

/* SELETOR DE FRASES */
frases.forEach((frase, indice) => {
    const botao = document.createElement("button");

    botao.type = "button";
    botao.className = "opcao-frase";
    botao.textContent = frase;

    botao.addEventListener("click", () => {
        adicionarPostit(frase, indice);
        seletorFrases.hidden = true;
    });

    listaFrases.appendChild(botao);
});

document.getElementById("btnEscolherFrase").addEventListener("click", () => {
    seletorFrases.hidden = false;
});

document.getElementById("btnFecharFrases").addEventListener("click", () => {
    seletorFrases.hidden = true;
});

function atualizarMuralVazio() {
    muralVazio.hidden = postits.length > 0;
}

/* CRIAR POST-IT */
function criarPostit(dados) {
    const { id, frase, indice, x, y } = dados;

    const postit = document.createElement("article");
    postit.className = `postit ${cores[indice % cores.length]}`;
    postit.dataset.id = id;

    const texto = document.createElement("p");
    texto.textContent = frase;

    const remover = document.createElement("button");
    remover.type = "button";
    remover.textContent = "Remover frase";

    remover.addEventListener("click", () => {
        postit.remove();
        postits = postits.filter(item => item.id !== id);
        atualizarMuralVazio();
        salvarDados();
    });

    postit.append(texto, remover);
    postit.style.left = `${x}px`;
    postit.style.top = `${y}px`;

    mural.appendChild(postit);
    configurarArraste(postit, id);
}

/* ADICIONAR POST-IT */
function adicionarPostit(frase, indice) {
    const id = proximoId++;
    const margem = 12;
    const maxX = Math.max(margem, mural.clientWidth - 170);
    const maxY = Math.max(margem, mural.clientHeight - 145);

    const x = margem + Math.random() * Math.max(0, maxX - margem);
    const y = margem + Math.random() * Math.max(0, maxY - margem);

    const dados = { id, frase, indice, x, y };

    postits.push(dados);
    criarPostit(dados);
    atualizarMuralVazio();
    salvarDados();
}

/* ARRASTAR E SALVAR POSIÇÕES */
function configurarArraste(elemento, id) {
    elemento.addEventListener("pointerdown", event => {
        if (event.target.closest("button")) return;

        event.preventDefault();

        const inicioX = event.clientX;
        const inicioY = event.clientY;
        const esquerdaInicial = elemento.offsetLeft;
        const topoInicial = elemento.offsetTop;

        elemento.setPointerCapture(event.pointerId);

        function mover(evento) {
            const maxX = Math.max(0, mural.clientWidth - elemento.offsetWidth);
            const maxY = Math.max(0, mural.clientHeight - elemento.offsetHeight);

            const x = Math.max(0, Math.min(
                maxX, esquerdaInicial + evento.clientX - inicioX
            ));

            const y = Math.max(0, Math.min(
                maxY, topoInicial + evento.clientY - inicioY
            ));

            elemento.style.left = `${x}px`;
            elemento.style.top = `${y}px`;

            const item = postits.find(postit => postit.id === id);
            if (item) {
                item.x = x;
                item.y = y;
            }
        }

        function parar() {
            elemento.removeEventListener("pointermove", mover);
            elemento.removeEventListener("pointerup", parar);
            elemento.removeEventListener("pointercancel", parar);
            salvarDados();
        }

        elemento.addEventListener("pointermove", mover);
        elemento.addEventListener("pointerup", parar);
        elemento.addEventListener("pointercancel", parar);
    });
}

/* CARREGAR OS DADOS DO FIREBASE */
async function carregarDados() {
    carregandoDados = true;

    try {
        const dados = await requisicao("/api/mascote");

        ninoAtual = null;
        postits = [];
        proximoId = 1;

        mural.querySelectorAll(".postit").forEach(postit => postit.remove());

        if (dados.ninoId !== null && dados.ninoId !== undefined) {
            selecionarNino(dados.ninoId, false);
        } else {
            atualizarSelecaoVisual();
        }

        if (Array.isArray(dados.postits)) {
            postits = dados.postits
                .filter(item =>
                    item &&
                    typeof item.frase === "string" &&
                    Number.isFinite(item.x) &&
                    Number.isFinite(item.y) &&
                    Number.isFinite(Number(item.id)) &&
                    Number.isInteger(item.indice) &&
                    item.indice >= 0 &&
                    item.indice < frases.length
                )
                .map(item => ({
                    id: Number(item.id),
                    frase: item.frase,
                    indice: item.indice,
                    x: item.x,
                    y: item.y
                }));

            proximoId = postits.reduce(
                (maior, item) => Math.max(maior, item.id + 1),
                1
            );

            postits.forEach(criarPostit);
        }

        atualizarMuralVazio();

        // Atualiza o cache local com os dados oficiais do Firebase.
        localStorage.setItem(CHAVE_MASCOTE, JSON.stringify({
            ninoId: ninoAtual ? ninoAtual.id : null,
            postits
        }));

        window.dispatchEvent(new Event("ninoMascoteAtualizado"));
    } catch (erro) {
        console.error("Erro ao carregar mascote:", erro);
        alert(erro.message || "Não foi possível carregar seu mascote.");
    } finally {
        carregandoDados = false;
    }
}

/* ESPERAR A AUTENTICAÇÃO ANTES DE CARREGAR */
onAuthStateChanged(auth, usuario => {
    if (!usuario) {
        window.location.replace("/login");
        return;
    }

    if (usuarioAtual && usuarioAtual.uid === usuario.uid) return;

    usuarioAtual = usuario;
    carregarDados();
});
