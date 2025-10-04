var database = require("../database/config")

function cadastrar(nomeEmpresarial, cnpj, nomeRepresentante, email) {
    console.log("ACESSEI O MODEL DE CADASTRO DE SERVIDOR");

    var instrucaoSql = `
        INSERT INTO Empresa (nomeEmpresarial, cnpj, nomeRepresentante, email)
        VALUES ('${nomeEmpresarial}', '${cnpj}', '${nomeRepresentante}', '${email}');
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);  
}

module.exports = {
    cadastrar
};