const express = require("express");

const router = express.Router();

router.get("/registro", (req, res) => {
    res.render("registro", {
        titulo: "Registro emocional"
    });
});

module.exports = router;