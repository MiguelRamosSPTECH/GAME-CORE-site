var database = require("../database/config")

function criar(nome, permissoes, fk_empresa){
        
        // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
        //  e na ordem de inserção dos dados.
        var instrucaoSql = `
            INSERT INTO Cargo (nome, permissoes, fk_empresa) VALUES ('${nome}', '${permissoes}', '${fk_empresa}');
        `;
        console.log("Executando a instrução SQL: \n" + instrucaoSql);
        return database.executar(instrucaoSql);
}

function buscar(fk_empresa){
    var instrucaoSql = `
        SELECT id, nome FROM cargo where fk_empresa = ${fk_empresa}
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
        return database.executar(instrucaoSql);
}

module.exports = {
    criar,
    buscar
};