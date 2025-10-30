var database = require("../database/config")

function buscar_cards(filtro) {
    console.log("ACESSEI O ACEITAR EMPRESAS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", filtro)

    var instrucaoSql = `
        SELECT * FROM empresa where statusAcesso in (${filtro});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function editar(novoStatus, idEmpresa) {
    console.log("ACESSEI O AVISO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function editar(): ", novoStatus, idEmpresa);
    var instrucaoSql = `
        UPDATE empresa SET statusAcesso = '${novoStatus}' WHERE id = ${idEmpresa};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


// function buscar_Cargos(filtro) {
//      console.log("ACESSEI O ACEITAR EMPRESAS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", filtro)

//     var instrucaoSql = `
//         SELECT f.perfilAtivo
//         from Funcionario f
//         inner join Cargo c on f.fk_cargo_func = c.id
//         inner join Empresa  e on c.fk_empresa_cargo = e.id
//         where e.id = ${metrica};
//     `;
//     console.log("Executando a instrução SQL: \n" + instrucaoSql);
//     return database.executar(instrucaoSql);
// }

module.exports = {
    buscar_cards,
    editar,
    // buscar_Cargos
};