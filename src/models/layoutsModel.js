var database = require("../database/config");

function buscar(idEmpresa){
    var instrucaoSql = `
        SELECT id, nome 
        FROM Layout 
        WHERE fk_empresa_layout = ${idEmpresa};
    `;

    console.log("Buscando layouts da empresa: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    buscar
};
