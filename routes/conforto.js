
const express = require("express");
const router = express.Router();

// Página Espaço de Conforto
router.get("/", (req, res) => {
    res.render("conforto");
});

module.exports = router;
