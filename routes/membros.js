const express = require("express");
const router = express.Router();

const membros = [
    {
        nome: "Letícia Fernandes",
        funcao: "Função",
        mascote: "/imagesNino/membros/mascotes/leticiaM.jpeg",
        foto: "/imagesNino/membros/fotos/leticia.jpeg"

    },
       {
       nome: "Gabriel Luis",
        funcao: "Função",
        mascote: "/imagesNino/membros/mascotes/gabrielM.jpeg",
        foto: "/imagesNino/membros/fotos/gabriel.jpeg"  
    },
    {
        nome: "Vitória Magaldi",
        funcao: "Função",
        mascote: "/imagesNino/membros/mascotes/vitoriaM.jpeg",
        foto: "/imagesNino/membros/fotos/vitoria.jpeg"
    },
    {
        nome: "Vitor Moraes",
        funcao: "Função",
        mascote: "/imagesNino/membros/mascotes/vitorM.jpeg",
        foto: "/imagesNino/membros/fotos/vitor.jpeg"
    },
    {
        nome: "Gustavo Hirayama",
        funcao: "Função",
        mascote: "/imagesNino/membros/mascotes/gustaM.jpeg",
        foto: "/imagesNino/membros/fotos/gustavo.jpeg"
    },
    {
        nome: "Otávio Lima",
        funcao: "Função",
        mascote: "/imagesNino/membros/mascotes/limaM.jpeg",
        foto: "/imagesNino/membros/fotos/lima.jpeg"
    }
];

router.get("/membros", (req, res) => {
    res.render("membros", {
        titulo: "Membros",
        membros
    });
});

module.exports = router;