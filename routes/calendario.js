
const express = require("express");
const router = express.Router();

const { db } = require("../config/firebase");
const autenticarUsuario = require("../middleware/autenticacao");

router.get("/calendario", (req, res) => {
    res.render("calendario", { titulo: "Calendário" });
});

router.get(
    "/api/registros",
    autenticarUsuario,
    async (req, res) => {
        try {
            const mes = req.query.mes;

            if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(mes || "")) {
                return res.status(400).json({
                    erro: "Mês inválido."
                });
            }

            const snapshot = await db
                .collection("usuarios")
                .doc(req.usuarioId)
                .collection("registros")
                .get();

            const registros = {};

            snapshot.forEach(documento => {
                if (documento.id.startsWith(`${mes}-`)) {
                    registros[documento.id] = documento.data().emocao;
                }
            });

            res.json(registros);
        } catch (erro) {
            console.error(erro);

            res.status(500).json({
                erro: "Não foi possível carregar o calendário."
            });
        }
    }
);

module.exports = router;
