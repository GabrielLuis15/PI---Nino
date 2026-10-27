
const express = require("express");
const router = express.Router();
const { db } = require("../config/firebase");
const autenticarUsuario = require("../middleware/autenticacao");

function dataValida(data) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data || "")) return false;

    const dataObj = new Date(`${data}T12:00:00`);

    return !Number.isNaN(dataObj.getTime()) &&
        dataObj.toISOString().slice(0, 10) === data;
}

router.get("/registro", (req, res) => {
    const data = req.query.data;

    res.render("registro", {
        titulo: "Registro emocional",
        dataSelecionada: dataValida(data)
            ? data
            : new Date().toLocaleDateString("sv-SE")
    });
});

router.get(
    "/api/registros/:data",
    autenticarUsuario,
    async (req, res) => {
        try {
            const { data } = req.params;

            if (!dataValida(data)) {
                return res.status(400).json({ erro: "Data inválida." });
            }

            const ref = db
                .collection("usuarios")
                .doc(req.usuarioId)
                .collection("registros")
                .doc(data);

            const documento = await ref.get();

            res.json(documento.exists ? documento.data() : null);
        } catch (erro) {
            console.error(erro);
            res.status(500).json({
                erro: "Não foi possível carregar o registro."
            });
        }
    }
);

router.post(
    "/api/registros/:data",
    autenticarUsuario,
    async (req, res) => {
        try {
            const { data } = req.params;
            const { emocao, texto } = req.body;

            const emocoesValidas = [
                "feliz", "calmo", "neutro", "triste", "ansioso"
            ];

            if (!dataValida(data)) {
                return res.status(400).json({ erro: "Data inválida." });
            }

            if (!emocoesValidas.includes(emocao)) {
                return res.status(400).json({
                    erro: "Selecione uma emoção válida."
                });
            }

            if (typeof texto !== "string" || texto.length > 1000) {
                return res.status(400).json({
                    erro: "O texto deve ter até 1000 caracteres."
                });
            }

            await db
                .collection("usuarios")
                .doc(req.usuarioId)
                .collection("registros")
                .doc(data)
                .set({
                    data,
                    emocao,
                    texto: texto.trim(),
                    atualizadoEm: new Date().toISOString()
                });

            res.json({ sucesso: true });
        } catch (erro) {
            console.error(erro);
            res.status(500).json({
                erro: "Não foi possível salvar o registro."
            });
        }
    }
);

router.delete(
    "/api/registros/:data",
    autenticarUsuario,
    async (req, res) => {
        try {
            const { data } = req.params;

            if (!dataValida(data)) {
                return res.status(400).json({ erro: "Data inválida." });
            }

            await db
                .collection("usuarios")
                .doc(req.usuarioId)
                .collection("registros")
                .doc(data)
                .delete();

            res.json({ sucesso: true });
        } catch (erro) {
            console.error(erro);
            res.status(500).json({
                erro: "Não foi possível excluir o registro."
            });
        }
    }
);

module.exports = router;
