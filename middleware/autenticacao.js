
const { auth } = require("../config/firebase");

async function autenticarUsuario(req, res, next) {
    try {
        const cabecalho = req.get("Authorization") || "";

        if (!cabecalho.startsWith("Bearer ")) {
            return res.status(401).json({
                erro: "Você precisa entrar na sua conta."
            });
        }

        const token = cabecalho.slice(7);
        const usuario = await auth.verifyIdToken(token);

        req.usuarioId = usuario.uid;
        req.usuarioEmail = usuario.email;

        next();
    } catch (erro) {
        return res.status(401).json({
            erro: "Sessão inválida ou expirada. Entre novamente."
        });
    }
}

module.exports = autenticarUsuario;
