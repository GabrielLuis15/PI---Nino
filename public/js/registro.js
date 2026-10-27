
import { auth } from "/firebase-config.js";

import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const campoData = document.getElementById("dataRegistro");
const campoTexto = document.getElementById("texto");
const contador = document.querySelector(".contador");
const btnSalvar = document.querySelector(".btn-salvar");
const btnEditar = document.querySelector(".btn-editar");
const btnExcluir = document.querySelector(".btn-excluir");
const emocoes = document.querySelectorAll('input[name="emocao"]');

let registroExistente = false;
let modoEdicao = true;
let usuarioAtual = null;
let carregando = false;

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

function emocaoSelecionada() {
    return document.querySelector('input[name="emocao"]:checked')?.value || "";
}

function definirModoEdicao(editar) {
    modoEdicao = editar;

    campoData.disabled = !editar;
    campoTexto.readOnly = !editar;

    emocoes.forEach(input => {
        input.disabled = !editar;
    });

    btnSalvar.hidden = !editar;
    btnEditar.hidden = !registroExistente || editar;
    btnExcluir.hidden = !registroExistente || editar;

    atualizarContador();
}

function atualizarContador() {
    contador.textContent = `${campoTexto.value.length} / 1000`;
}

async function carregarRegistro() {
    if (!campoData.value || carregando) return;

    carregando = true;

    try {
        const registro = await requisicao(
            `/api/registros/${campoData.value}`
        );

        registroExistente = Boolean(registro);

        emocoes.forEach(input => {
            input.checked = registro?.emocao === input.value;
        });

        campoTexto.value = registro?.texto || "";

        atualizarContador();
        definirModoEdicao(!registroExistente);
    } catch (erro) {
        alert(erro.message);
    } finally {
        carregando = false;
    }
}

campoData.addEventListener("change", carregarRegistro);
campoTexto.addEventListener("input", atualizarContador);

btnEditar.addEventListener("click", () => {
    definirModoEdicao(true);
});

btnSalvar.addEventListener("click", async () => {
    if (!modoEdicao) return;

    const emocao = emocaoSelecionada();

    if (!campoData.value) {
        alert("Selecione uma data.");
        return;
    }

    if (!emocao) {
        alert("Selecione uma emoção.");
        return;
    }

    try {
        await requisicao(`/api/registros/${campoData.value}`, {
            method: "POST",
            body: JSON.stringify({
                emocao,
                texto: campoTexto.value
            })
        });

        window.location.href = "/calendario";
    } catch (erro) {
        alert(erro.message);
    }
});

btnExcluir.addEventListener("click", async () => {
    if (!registroExistente) return;

    if (!confirm("Deseja excluir o registro deste dia?")) return;

    try {
        await requisicao(`/api/registros/${campoData.value}`, {
            method: "DELETE"
        });

        window.location.href = "/calendario";
    } catch (erro) {
        alert(erro.message);
    }
});

atualizarContador();

onAuthStateChanged(auth, usuario => {
    if (!usuario) {
        window.location.replace("/login");
        return;
    }

    usuarioAtual = usuario;
    carregarRegistro();
});
