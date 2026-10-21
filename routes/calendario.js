const express = require("express");
const router = express.Router();
const db = require("../config/firebase");

router.get("/calendario", (req, res) => {
    res.render("calendario", { titulo: "Calendário" });
});

router.get("/api/registros", async (req, res) => {
    try {
        const usuarioId = req.get("x-user-id");
        const mes = req.query.mes;

        if (!usuarioId || !/^[a-zA-Z0-9-]{10,80}$/.test(usuarioId)) {
            return res.status(400).json({ erro: "Identificador inválido." });
        }

        if (!/^\d{4}-\d{2}$/.test(mes || "")) {
            return res.status(400).json({ erro: "Mês inválido." });
        }

        const snapshot = await db.collection("usuarios")
            .doc(usuarioId)
            .collection("registros")
            .get();

        const registros = {};

        snapshot.forEach(doc => {
            if (doc.id.startsWith(mes)) {
                registros[doc.id] = doc.data().emocao;
            }
        });

        res.json(registros);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Não foi possível carregar o calendário." });
    }
});

module.exports = router;