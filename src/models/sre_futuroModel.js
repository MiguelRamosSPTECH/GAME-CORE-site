var database = require("../database/config");


function entrar(id) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", id)
    var instrucaoSql = `
        select
    c.alertaLeve,
    c.alertaGrave
    from layout l
    inner join ConfiguracaoServidor c on c.fk_layout = l.id  
    where fk_empresa_layout =  ${id}
    and
    l.emUso = true;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscar(id) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", id)
    var instrucaoSql = `
        select
        id,
        macadress,
        apelido
    from Servidor   
    where fk_empresa_servidor =  1
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    entrar,
    buscar
};