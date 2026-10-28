
const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const autenticarUsuario = require("../middleware/autenticacao");

const ninosValidos = ["1", "2", "3", "4", "5", "6"];

function validarDados(body) {
    if (
        !body ||
        !(body.ninoId === null || ninosValidos.includes(String(body.ninoId))) ||
        !Array.isArray(body.postits) ||
        body.postits.length > 100
    ) {
        return false;
    }

    return body.postits.every(item =>
        item &&
        Number.isFinite(Number(item.id)) &&
        typeof item.frase === "string" &&
        item.frase.length <= 300 &&
        Number.isInteger(item.indice) &&
        Number.isFinite(item.x) &&
        Number.isFinite(item.y)
    );
}

function referenciaMascote(usuarioId) {
    return db
        .collection("usuarios")
        .doc(usuarioId)
        .collection("mascote")
        .doc("dados");
}

// CARREGAR MASCOTE E POST-ITS
router.get("/api/mascote", autenticarUsuario, async (req, res) => {
    try {
        const documento = await referenciaMascote(req.usuarioId).get();

        res.json(documento.exists ? documento.data() : {
            ninoId: null,
            postits: []
        });
    } catch (erro) {
        console.error("Erro ao carregar mascote:", erro);
        res.status(500).json({
            erro: "Não foi possível carregar o mascote."
        });
    }
});

// SALVAR MASCOTE E POST-ITS
router.put("/api/mascote", autenticarUsuario, async (req, res) => {
    try {
        if (!validarDados(req.body)) {
            return res.status(400).json({
                erro: "Os dados do mascote ou do mural são inválidos."
            });
        }

        const ninoId = req.body.ninoId === null
            ? null
            : String(req.body.ninoId);

        await referenciaMascote(req.usuarioId).set({
            ninoId,
            postits: req.body.postits.map(item => ({
                id: Number(item.id),
                frase: item.frase,
                indice: item.indice,
                x: item.x,
                y: item.y
            })),
            atualizadoEm: new Date().toISOString()
        });

        res.json({ sucesso: true });
    } catch (erro) {
        console.error("Erro ao salvar mascote:", erro);
        res.status(500).json({
            erro: "Não foi possível salvar os dados do mascote."
        });
    }
});

module.exports = router;
