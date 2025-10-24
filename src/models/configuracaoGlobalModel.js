const { atualizar } = require("../controllers/configuracaoGlobalController");
var database = require("../database/config");

function listar(){
    var instrucao = `
        SELECT  layout.nome,
                componente.nome,
                metrica.unidadeMedida
    `;
}

// function atualizar(componente,novaMetrica){
//     var instrucao = ``;
// }

module.exports = {
    listar,
    // atualizar
};