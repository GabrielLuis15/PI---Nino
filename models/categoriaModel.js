// Importa módulos
const fs = require("fs");
const path = require("path");

// Caminho do arquivo JSON
const caminho = path.join(__dirname, "../data/categorias.json");

/* =====================================================
   LER DADOS
===================================================== */
function lerDados() {
    const dados = fs.readFileSync(caminho);
    return JSON.parse(dados);
}

/* =====================================================
   LISTAR
===================================================== */
function listar() {
    return lerDados();
}

/* =====================================================
   SALVAR DADOS NO JSON
===================================================== */
function salvarDados(dados) {
    fs.writeFileSync(
        caminho,
        JSON.stringify(dados, null, 2)
    );
}

/* =====================================================
   CADASTRAR NOVA CATEGORIA (SEM EDIÇÃO)
===================================================== */
function salvar(categoria) {
    let categorias = lerDados();
    // Cria nova categoria com ID automático
    const novo = {
        id: categorias.length > 0
            ? categorias[categorias.length - 1].id + 1
            : 1,
        nome: categoria.nome
    };
    categorias.push(novo);
    salvarDados(categorias);
}

function buscarPorId(id) {
    const categorias = lerDados();
    return categorias.find(c => c.id == id);
}

function editar(id, novaCategoria) {
    const categorias = lerDados();
    const index = categorias.findIndex(c => c.id == id);
    categorias[index].nome = novaCategoria.nome;
    salvarDados(categorias);
}

function excluir(id) {
    const categorias = lerDados();
    const novaLista = categorias.filter(c => c.id != id);
    salvarDados(novaLista);
}


/* =====================================================
   EXPORTAÇÃO
===================================================== */
module.exports = {
    listar,
    salvar,
    buscarPorId,
    editar,
    excluir
};