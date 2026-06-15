const fs = require("fs");
const path = require("path");
const caminho = path.join(__dirname, "../data/fornecedores.json");

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
function salvar(fornecedor) {
  let fornecedores = lerDados();
  const novo = {
    id: fornecedores.length > 0 ?
      fornecedores[fornecedores.length - 1].id + 1 :
      1,
    nome: fornecedor.nome,
    cnpj: fornecedor.cnpj,
  };
  fornecedores.push(novo);
  salvarDados(fornecedores);
}

function buscarPorId(id) {
    const fornecedores = lerDados();
    return fornecedores.find(c => c.id == id);
}

function editar(id, novoFornecedor) {
    const fornecedores = lerDados();
    const index = fornecedores.findIndex(f => f.id == id);
    fornecedores[index].nome = novoFornecedor.nome;
    fornecedores[index].cnpj = novoFornecedor.cnpj;
    salvarDados(fornecedores);
}

function excluir(id) {
    const fornecedores = lerDados();
    const novaLista = fornecedores.filter(c => c.id != id);
    salvarDados(novaLista);
}

module.exports = {
  listar,
  salvar,
  buscarPorId,
  editar,
  excluir
};