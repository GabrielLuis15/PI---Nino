const express = require("express");

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

app.set("view engine", "ejs");

const registroRoutes = require("./routes/registro");

app.use(registroRoutes);

app.get("/", (req, res) => {
    res.render("inicio");
});

app.listen(3000, () => {
    console.log("Nino rodando em http://localhost:3000");
});