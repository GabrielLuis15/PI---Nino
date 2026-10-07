import {
    auth,
    db,
    entrarComoUsuarioAnonimo
} from "../../config/firebase.js";

import {
    doc,
    setDoc,
    getDoc,
    deleteDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


/* ==========================
   ELEMENTOS
========================== */

const dataAtual =
    document.getElementById("dataAtual");

const mensagem =
    document.getElementById("mensagem");

const contador =
    document.getElementById("contador");

const botoesEmocao =
    document.querySelectorAll(".emotion");

const salvarButton =
    document.getElementById("salvarRegistro");

const editarButton =
    document.getElementById("editarRegistro");

const excluirButton =
    document.getElementById("excluirRegistro");


/* ==========================
   ESTADO
========================== */

let emocaoSelecionada = null;

let usuario = null;


/* ==========================
   DATA
========================== */

function obterData() {

    const agora = new Date();

    const ano =
        agora.getFullYear();

    const mes =
        String(
            agora.getMonth() + 1
        ).padStart(2, "0");

    const dia =
        String(
            agora.getDate()
        ).padStart(2, "0");

    return `${ano}-${mes}-${dia}`;
}


function formatarData(data) {

    const partes =
        data.split("-");

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}


const dataRegistro =
    obterData();


dataAtual.textContent =
    `Hoje, ${formatarData(dataRegistro)}`;


/* ==========================
   EMOÇÕES
========================== */

botoesEmocao.forEach(botao => {

    botao.addEventListener(
        "click",
        () => {

            botoesEmocao.forEach(
                outro => {

                    outro.classList.remove(
                        "selected"
                    );

                }
            );


            botao.classList.add(
                "selected"
            );


            emocaoSelecionada = {

                nome:
                    botao.dataset.emotion,

                cor:
                    botao.dataset.color

            };

        }
    );

});


/* ==========================
   CONTADOR
========================== */

mensagem.addEventListener(
    "input",
    () => {

        contador.textContent =
            `${mensagem.value.length}/1000`;

    }
);


/* ==========================
   CAMINHO DO REGISTRO
========================== */

function referenciaRegistro() {

    return doc(
        db,
        "usuarios",
        usuario.uid,
        "registros",
        dataRegistro
    );

}


/* ==========================
   CARREGAR REGISTRO
========================== */

async function carregarRegistro() {

    try {

        const referencia =
            referenciaRegistro();


        const resultado =
            await getDoc(referencia);


        if (!resultado.exists()) {

            return;

        }


        const registro =
            resultado.data();


        mensagem.value =
            registro.mensagem || "";


        contador.textContent =
            `${mensagem.value.length}/1000`;


        botoesEmocao.forEach(
            botao => {

                if (
                    botao.dataset.emotion ===
                    registro.emocao
                ) {

                    botao.classList.add(
                        "selected"
                    );


                    emocaoSelecionada = {

                        nome:
                            registro.emocao,

                        cor:
                            registro.cor

                    };

                }

            }
        );


        salvarButton.textContent =
            "💾 Atualizar registro";


        editarButton.hidden =
            false;


        excluirButton.hidden =
            false;


    } catch (erro) {

        console.error(
            "Erro ao carregar registro:",
            erro
        );

        alert(
            "Não foi possível carregar seu registro."
        );

    }

}


/* ==========================
   SALVAR
========================== */

async function salvarRegistro() {

    if (!emocaoSelecionada) {

        alert(
            "Escolha uma emoção antes de salvar."
        );

        return;

    }


    try {

        salvarButton.disabled = true;

        salvarButton.textContent =
            "Salvando...";


        await setDoc(
            referenciaRegistro(),
            {

                data:
                    dataRegistro,

                emocao:
                    emocaoSelecionada.nome,

                cor:
                    emocaoSelecionada.cor,

                mensagem:
                    mensagem.value.trim(),

                atualizadoEm:
                    serverTimestamp()

            },
            {
                merge: true
            }
        );


        alert(
            "Registro salvo com sucesso! 💚"
        );


        editarButton.hidden =
            false;


        excluirButton.hidden =
            false;


    } catch (erro) {

        console.error(
            "Erro ao salvar:",
            erro
        );


        alert(
            "Não foi possível salvar o registro."
        );


    } finally {

        salvarButton.disabled =
            false;

        salvarButton.textContent =
            "💾 Atualizar registro";

    }

}


/* ==========================
   EXCLUIR
========================== */

async function excluirRegistro() {

    const confirmar =
        confirm(
            "Deseja realmente excluir seu registro de hoje?"
        );


    if (!confirmar) {

        return;

    }


    try {

        await deleteDoc(
            referenciaRegistro()
        );


        mensagem.value = "";

        contador.textContent =
            "0/1000";


        emocaoSelecionada =
            null;


        botoesEmocao.forEach(
            botao => {

                botao.classList.remove(
                    "selected"
                );

            }
        );


        salvarButton.textContent =
            "♡ Salvar registro";


        editarButton.hidden =
            true;


        excluirButton.hidden =
            true;


        alert(
            "Registro excluído."
        );


    } catch (erro) {

        console.error(
            "Erro ao excluir:",
            erro
        );


        alert(
            "Não foi possível excluir o registro."
        );

    }

}


/* ==========================
   EVENTOS
========================== */

salvarButton.addEventListener(
    "click",
    salvarRegistro
);


excluirButton.addEventListener(
    "click",
    excluirRegistro
);


editarButton.addEventListener(
    "click",
    () => {

        mensagem.focus();

    }
);


/* ==========================
   INICIALIZAÇÃO
========================== */

async function iniciar() {

    try {

        usuario =
            await entrarComoUsuarioAnonimo();


        console.log(
            "Usuário Firebase:",
            usuario.uid
        );


        await carregarRegistro();


    } catch (erro) {

        console.error(
            "Erro ao iniciar Nino:",
            erro
        );


        alert(
            "Não foi possível conectar ao Nino."
        );

    }

}


iniciar();