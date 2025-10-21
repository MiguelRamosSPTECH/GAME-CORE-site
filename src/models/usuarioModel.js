var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var instrucaoSql = `
    SELECT id, nome, email, cpf, senha, fk_empresa_func
    FROM Funcionario 
    WHERE email = '${email}' AND senha = '${senha}';
`;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function cadastrarFunc(nome, email, cpf, senha, fk_cargo_func, fk_empresa_func) {

    var instrucaoSql = `

        INSERT INTO Funcionario (nome, email, cpf, senha,  fk_cargo_func, fk_empresa_func) VALUES ('${nome}', '${email}', '${cpf}', '${senha}', '${fk_cargo_func}', '${fk_empresa_func}');
        
    `;
    
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

module.exports = {
    autenticar,
    cadastrarFunc
};