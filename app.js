const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.set("view engine", "ejs");


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));


const registroRoutes = require("./routes/registro");
const calendarioRoutes = require("./routes/calendario");

app.use(registroRoutes);
app.use(calendarioRoutes);

app.get("/", (req, res) => {
    res.render("inicio");
});

app.listen(3000, () => {
    console.log("Nino rodando em http://localhost:3000");
});