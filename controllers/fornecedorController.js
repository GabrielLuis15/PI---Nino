const model = require("../models/fornecedorModel");

exports.index = (req, res) => {
  const fornecedores = model.listar();
  res.render("fornecedores/index", 
    { 
      fornecedores,
      fornecedorEditar: null
    });
};

exports.salvar = (req, res) => {
  model.salvar({
    nome: req.body.nome,
    cnpj: req.body.cnpj
  });
  res.redirect("/fornecedores");
};

exports.formEditar = (req, res) => {
    const fornecedores = model.listar();
    const fornecedorEditar = model.buscarPorId(req.params.id);
    res.render('fornecedores/index', {
        fornecedores,
        fornecedorEditar
    });
}

exports.editar = (req, res) => {
    model.editar(req.params.id, {
        nome: req.body.nome,
        cnpj: req.body.cnpj
    });
    res.redirect('/fornecedores');
}

exports.excluir = (req, res) => {
    model.excluir(req.params.id);
    res.redirect('/fornecedores');
}
