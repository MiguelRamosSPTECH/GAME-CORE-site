var database = require("../database/config")

function enviarCadastroServidor(hostname, ip, localizacao, componentes, metricas, fkEmpresa) {
    console.log("ACESSEI O MODEL DE CADASTRO DE SERVIDOR");

    var instrucaoSql = `
        INSERT INTO Servidor (hostName, ip, localizacao, fk_empresa_servidor)
        VALUES ('${hostname}', '${ip}', '${localizacao}', ${fkEmpresa});
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    cadastrar
};