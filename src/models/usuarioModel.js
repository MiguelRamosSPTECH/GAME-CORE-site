var database = require("../database/config")

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", email, senha)
    var autenticarUser = `
    SELECT f.id, f.nome, f.email, f.cpf, f.senha, f.fk_cargo_func, c.fk_empresa_cargo AS idEmpresa
    FROM Funcionario f
    JOIN Cargo c ON  f.fk_cargo_func = c.id
    WHERE f.email = '${email}' AND f.senha = '${senha}';`
    return database.executar(autenticarUser)
}


function cadastrarFunc(nome, email, cpf, senha, fk_cargo) {

    let instrucaoSql = `

        INSERT INTO funcionario (nome, email, cpf, senha, fk_cargo_func) VALUES ('${nome}', '${email}', '${cpf}', '${senha}', '${fk_cargo}');
        
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}




function editarFunc(nomeFuncionario, emailFuncionario, cpfFuncionario, senhaFuncionario, idCargoFuncionario, idFunc) {

    var edicao = `
    
        
        UPDATE funcionario f SET f.nome = '${nomeFuncionario}', f.email = '${emailFuncionario}', f.cpf = '${cpfFuncionario}', f.senha = '${senhaFuncionario}', f.fk_cargo_func = (SELECT id FROM Cargo WHERE id = ${idCargoFuncionario}) WHERE f.id = ${idFunc}

    `
    console.log("Alterando o Usuário")
    return database.executar(edicao)

}

function allFunc(idEmpresa) {
    let querySql = `SELECT f.id, f.nome, f.email, f.cpf, c.nome as nomeCargo FROM funcionario f
                    INNER JOIN cargo c on
                    c.id = f.fk_cargo_func
                    WHERE c.fk_empresa_cargo = ${idEmpresa}`;
    return database.executar(querySql)
}
function findByIdFunc(idFunc, idEmpresa) {
    let querySql = `SELECT f.id, f.nome, f.email, f.cpf, f.senha, c.nome as nomeCargo, c.id as idCargo FROM funcionario f
                    INNER JOIN cargo c on
                    c.id = f.fk_cargo_func
                    WHERE fk_cargo_func = ${idEmpresa}
                    AND f.id = ${idFunc};
                    `
    return database.executar(querySql);
}

function deletarFunc(idFunc, idEmpresa) {
    let deletarSql = ` DELETE FROM funcionario 
                    WHERE 
                        id = ${idFunc} 
                        AND fk_cargo_func IN (
                            SELECT 
                                c.id 
                            FROM 
                                cargo c
                            WHERE 
                                c.fk_empresa_cargo = ${idEmpresa}
                            ); 
                    `

    return database.executar(deletarSql);
}

module.exports = {
    autenticar,
    cadastrarFunc,
    editarFunc,
    allFunc,
    findByIdFunc,
    deletarFunc
};