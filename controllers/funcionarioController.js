const model = require("../models/funcionarioModel");

exports.index = (req, res) => {
  const funcionarios = model.listar();
  res.render("funcionarios/index", 
    { 
      funcionarios,
      funcionarioEditar: null
    });
};

exports.salvar = (req, res) => {
  model.salvar({
    nome: req.body.nome,
    id: req.body.id,
    email: req.body.email,
    cargo: req.body.cargo,
  });
  res.redirect("/funcionarios");
};

exports.formEditar = (req, res) => {
    const funcionarios = model.listar();
    const funcionarioEditar = model.buscarPorId(req.params.id);
    res.render('funcionarios/index', {
        funcionarios,
        funcionarioEditar
    });
}

exports.editar = (req, res) => {
    model.editar(req.params.id, {
        nome: req.body.nome,
        email: req.body.email,
        cargo: req.body.cargo,
    });
    res.redirect('/funcionarios');
}

exports.excluir = (req, res) => {
    model.excluir(req.params.id);
    res.redirect('/funcionarios');
}
