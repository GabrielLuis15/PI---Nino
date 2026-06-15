const fs = require("fs");
const path = require("path");
const caminho = path.join(__dirname, "../data/clientes.json");

function lerDados() {
  const dados = fs.readFileSync(caminho);
  return JSON.parse(dados);
}

function listar() {
  return lerDados();
}

function salvarDados(dados) {
  fs.writeFileSync(
    caminho,
    JSON.stringify(dados, null, 2)
  );
}
function salvar(cliente) {
  let clientes = lerDados();
  const novo = {
    id: clientes.length > 0 ?
      clientes[clientes.length - 1].id + 1 :
      1,
    nome: cliente.nome,
    email: cliente.email
  };
  clientes.push(novo);
  salvarDados(clientes);
}

function buscarPorId(id) {
    const clientes = lerDados();
    return clientes.find(c => c.id == id);
}

function editar(id, novoCliente) {
    const clientes = lerDados();
    const index = clientes.findIndex(c => c.id == id);
    clientes[index].nome = novoCliente.nome;
    clientes[index].email = novoCliente.email;
    salvarDados(clientes);
}

function excluir(id) {
    const clientes = lerDados();
    const novaLista = clientes.filter(c => c.id != id);
    salvarDados(novaLista);
}

module.exports = {
  listar,
  salvar,
  buscarPorId,
  editar,
  excluir
};