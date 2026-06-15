// Importa o model de categorias
const model = require("../models/categoriaModel");

/* =====================================================
   LISTAR CATEGORIAS
===================================================== */
exports.index = (req, res) => {
    const categorias = model.listar();
    res.render("categorias/index",
        {
            categorias,
            categoriaEditar: null
        });
};

/* =====================================================
   SALVAR NOVA CATEGORIA (SEM EDIÇÃO)
===================================================== */
exports.salvar = (req, res) => {
    model.salvar({
        nome: req.body.nome
    });
    res.redirect("/categorias");
};

exports.formEditar = (req, res) => {
    const categorias = model.listar();
    const categoriaEditar = model.buscarPorId(req.params.id);
    res.render('categorias/index', {
        categorias,
        categoriaEditar
    });
}

exports.editar = (req, res) => {
    model.editar(req.params.id, {
        nome: req.body.nome
    });
    res.redirect('/categorias');
}

exports.excluir = (req, res) => {
    model.excluir(req.params.id);
    res.redirect('/categorias');
}



