
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
const graficoRoutes = require("./routes/grafico");
const membrosRoutes = require("./routes/membros");
const mascoteRoutes = require("./routes/mascote");


// Rotas de autenticação
app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/cadastro", (req, res) => {
    res.render("cadastro");
});

app.get("/mascote", (req, res) => {
    res.render("mascote");
});

// Registro das rotas existentes
app.use(registroRoutes);
app.use(calendarioRoutes);
app.use("/conforto", confortoRoutes);
app.use(graficoRoutes);
app.use(membrosRoutes);
app.use(mascoteRoutes);

// Página inicial
app.get("/", (req, res) => {
    res.render("inicio");
});

// Inicialização do servidor
app.listen(3000, () => {
    console.log("Nino rodando em http://localhost:3000");
});
