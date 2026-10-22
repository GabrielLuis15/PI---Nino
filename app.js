
const express = require("express");

const app = express();

// Configurações
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.set("view engine", "ejs");

// Importação das rotas
const registroRoutes = require("./routes/registro");
const calendarioRoutes = require("./routes/calendario");
const confortoRoutes = require("./routes/conforto");

// Registro das rotas
app.use(registroRoutes);
app.use(calendarioRoutes);
app.use("/conforto", confortoRoutes);

// Página inicial
app.get("/", (req, res) => {
    res.render("inicio");
});

// Inicialização do servidor
app.listen(3000, () => {
    console.log("Nino rodando em http://localhost:3000");
});
