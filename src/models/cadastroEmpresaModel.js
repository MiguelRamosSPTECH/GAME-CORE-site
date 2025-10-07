var database = require("../database/config")

function cadastrar(nomeEmpresarial, cnpj, nomeRepresentante, email, nomeFunc, emailFunc, cpfFunc, senhaFunc) {
    console.log("ACESSEI O MODEL DE CADASTRO DE SERVIDOR");

    var instrucaoSql = `
    START TRANSACTION;

        INSERT INTO Empresa (nomeEmpresarial, cnpj, nomeRepresentante, email)
        VALUES ('${nomeEmpresarial}', '${cnpj}', '${nomeRepresentante}', '${email}');

        SET @idEmpresa = LAST_INSERT_ID(); 
        
        INSERT INTO Funcionario (nome, email, cpf, senha, userMaster, fk_empresa_func)
        VALUES ('${nomeFunc}', '${emailFunc}', '${cpfFunc}', '${senhaFunc}', 1, @idEmpresa);

    COMMIT;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);  
}

module.exports = {
    cadastrar
};