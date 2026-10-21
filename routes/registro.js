const express = require("express");
const router = express.Router();
const db = require("../config/firebase");

function usuarioValido(req, res, next) {
    const id = req.get("x-user-id");

    if (!id || !/^[a-zA-Z0-9-]{10,80}$/.test(id)) {
        return res.status(400).json({ erro: "Identificador inválido." });
    }

    req.usuarioId = id;
    next();
}

function dataValida(data) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data || "")) return false;

    const dataObj = new Date(`${data}T12:00:00`);
    return !Number.isNaN(dataObj.getTime()) &&
        dataObj.toISOString().slice(0, 10) === data;
}

// Abre a tela de registro
router.get("/registro", (req, res) => {
    res.render("registro", {
        titulo: "Registro emocional",
        dataSelecionada: dataValida(req.query.data)
            ? req.query.data
            : new Date().toLocaleDateString("sv-SE")
    });
});

// Busca o registro de uma data
router.get("/api/registros/:data", usuarioValido, async (req, res) => {
    try {
        const { data } = req.params;

        if (!dataValida(data)) {
            return res.status(400).json({ erro: "Data inválida." });
        }

        const ref = db.collection("usuarios")
            .doc(req.usuarioId)
            .collection("registros")
            .doc(data);

        const doc = await ref.get();

        res.json(doc.exists ? doc.data() : null);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Não foi possível carregar o registro." });
    }
});

// Salva ou atualiza um registro
router.post("/api/registros/:data", usuarioValido, async (req, res) => {
    try {
        const { data } = req.params;
        const { emocao, texto } = req.body;

        const emocoesValidas = ["feliz", "calmo", "neutro", "triste", "ansioso"];

        if (!dataValida(data)) {
            return res.status(400).json({ erro: "Data inválida." });
        }

        if (!emocoesValidas.includes(emocao)) {
            return res.status(400).json({ erro: "Selecione uma emoção válida." });
        }

        if (typeof texto !== "string" || texto.length > 1000) {
            return res.status(400).json({ erro: "O texto deve ter até 1000 caracteres." });
        }

        await db.collection("usuarios")
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
        res.status(500).json({ erro: "Não foi possível salvar o registro." });
    }
});

// Exclui o registro de uma data
router.delete("/api/registros/:data", usuarioValido, async (req, res) => {
    try {
        const { data } = req.params;

        if (!dataValida(data)) {
            return res.status(400).json({ erro: "Data inválida." });
        }

        await db.collection("usuarios")
            .doc(req.usuarioId)
            .collection("registros")
            .doc(data)
            .delete();

        res.json({ sucesso: true });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ erro: "Não foi possível excluir o registro." });
    }
});

module.exports = router;