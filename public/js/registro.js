
const campoData = document.getElementById("dataRegistro");
const campoTexto = document.getElementById("texto");
const contador = document.querySelector(".contador");
const btnSalvar = document.querySelector(".btn-salvar");
const btnEditar = document.querySelector(".btn-editar");
const btnExcluir = document.querySelector(".btn-excluir");
const emocoes = document.querySelectorAll('input[name="emocao"]');

let registroExistente = false;
let modoEdicao = true;

function obterUsuarioId() {
    let id = localStorage.getItem("ninoUsuarioId");

    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem("ninoUsuarioId", id);
    }

    return id;
}

const usuarioId = obterUsuarioId();

async function requisicao(url, opcoes = {}) {
    const resposta = await fetch(url, {
        ...opcoes,
        headers: {
            "Content-Type": "application/json",
            "x-user-id": usuarioId,
            ...opcoes.headers
        }
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
        throw new Error(resultado.erro || "Ocorreu um erro.");
    }

    return resultado;
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
    if (!campoData.value) return;

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

        // Registro existente abre para consulta.
        // Data sem registro abre pronta para preencher.
        definirModoEdicao(!registroExistente);
    } catch (erro) {
        alert(erro.message);
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
carregarRegistro();
