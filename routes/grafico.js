
const express = require("express");
const router = express.Router();

const { db } = require("../config/firebase");
const autenticarUsuario = require("../middleware/autenticacao");

router.get("/grafico", (req, res) => {
    res.render("grafico", { titulo: "Gráfico emocional" });
});

router.get(
    "/api/grafico/registros",
    autenticarUsuario,
    async (req, res) => {
        try {
            const periodo = req.query.periodo;

            const periodosValidos = [
                "semana",
                "mes",
                "seisMeses",
                "ano"
            ];

            if (!periodosValidos.includes(periodo)) {
                return res.status(400).json({
                    erro: "Período inválido."
                });
            }

            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            const inicio = new Date(hoje);

            if (periodo === "semana") {
                inicio.setDate(inicio.getDate() - 6);
            } else if (periodo === "mes") {
                inicio.setDate(1);
            } else if (periodo === "seisMeses") {
                inicio.setMonth(inicio.getMonth() - 5);
                inicio.setDate(1);
            } else if (periodo === "ano") {
                inicio.setMonth(0, 1);
            }

            const dataInicio = inicio.toLocaleDateString("sv-SE");
            const dataFim = hoje.toLocaleDateString("sv-SE");

            const snapshot = await db
                .collection("usuarios")
                .doc(req.usuarioId)
                .collection("registros")
                .where("data", ">=", dataInicio)
                .where("data", "<=", dataFim)
                .get();

            const registros = snapshot.docs
                .map(documento => documento.data())
                .sort((a, b) => a.data.localeCompare(b.data));

            res.json(registros);
        } catch (erro) {
            console.error(erro);

            res.status(500).json({
                erro: "Não foi possível carregar os registros do gráfico."
            });
        }
    }
);

module.exports = router;
