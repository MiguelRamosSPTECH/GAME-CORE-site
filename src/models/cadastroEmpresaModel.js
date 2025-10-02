var database = require("../database/config")

function cadastrar(nomeEmpresarial, cnpj, nomeRepresentante, email) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function cadastrar():", nomeEmpresarial, cnpj, nomeRepresentante, email);

    var instrucaoSql = `
        INSERT INTO Empresa (nomeEmpresarial, cnpj, nomeRepresentante, email) VALUES ('${nomeEmpresarial}', '${cnpj}', '${nomeRepresentante}', '${email}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar
};