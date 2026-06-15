const model = require("../models/clienteModel");

exports.index = (req, res) => {
	const clientes = model.listar();
	res.render("clientes/index",
		{ 
			clientes,
			clienteEditar: null
		});
};

exports.salvar = (req, res) => {
	model.salvar({
		nome: req.body.nome,
		email: req.body.email
	});
	res.redirect("/clientes");
};

exports.formEditar = (req, res) => {
		const clientes = model.listar();
		const clienteEditar = model.buscarPorId(req.params.id);
		res.render('clientes/index', {
				clientes,
				clienteEditar
		});
}

exports.editar = (req, res) => {
		model.editar(req.params.id, {
				nome: req.body.nome,
				email: req.body.email
		});
		res.redirect('/clientes');
}

exports.excluir = (req, res) => {
    model.excluir(req.params.id);
    res.redirect('/clientes');
}
