
import { auth } from "/firebase-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

const ninos = {
    "1": {
        nome: "LEZZI",
        foto: "/imagesNino/mascotes/lezzi.png",
        criador: "Letícia Fernandes"
    },
    "2": {
        nome: "BILU",
        foto: "/imagesNino/mascotes/bilu.png",
        criador: "Gabriel Luis"
    },
    "3": {
        nome: "TATA",
        foto: "/imagesNino/mascotes/tata.png",
        criador: "Otávio Lima"
    },
    "4": {
        nome: "VIT",
        foto: "/imagesNino/mascotes/vit.png",
        criador: "Vitor Moraes"
    },
    "5": {
        nome: "YAMA",
        foto: "/imagesNino/mascotes/yama.png",
        criador: "Gustavo Hirayama"
    },
    "6": {
        nome: "VICKIE",
        foto: "/imagesNino/mascotes/vickie.png",
        criador: "Vitória Magaldi"
    }
};

const secao = document.getElementById("secao-criador");
const imagem = document.getElementById("imagem-nino-criador");
const fala = document.getElementById("fala-criador");
const nome = document.getElementById("nome-criador");

async function carregarNino(usuario) {
    try {
        const token = await usuario.getIdToken();

        const resposta = await fetch("/api/mascote", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (!resposta.ok) {
            throw new Error("Não foi possível carregar o mascote.");
        }

        const dados = await resposta.json();
        const nino = ninos[String(dados.ninoId)];

        if (!nino) {
            secao.hidden = true;
            return;
        }

        imagem.src = nino.foto;
        imagem.alt = `Nino ${nino.nome}`;
        fala.textContent =
            `Oi! Eu sou o ${nino.nome}! Quer conhecer quem me criou?`;
        nome.textContent = nino.criador;

        secao.hidden = false;
    } catch (erro) {
        console.error("Erro ao carregar Nino em Membros:", erro);
        secao.hidden = true;
    }
}

onAuthStateChanged(auth, usuario => {
    if (!usuario) {
        secao.hidden = true;
        return;
    }

    carregarNino(usuario);
});
