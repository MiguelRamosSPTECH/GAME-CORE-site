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


function buscar_Cargos(filtro) {
     console.log("ACESSEI O ACEITAR EMPRESAS MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function entrar(): ", filtro)

    var instrucaoSql = `
        SELECT f.perfilAtivo, e.id
        from Funcionario f
        inner join Cargo c on f.fk_cargo_func = c.id
        inner join Empresa  e on c.fk_empresa_cargo = e.id
        where e.id = ${filtro}
        or e.id = 1
        order by e.id desc;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function atualizar_perfil(novoStatus, idEmpresa) {
    console.log("ACESSEI O AVISO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function editar(): ", novoStatus, idEmpresa);
    var instrucaoSql = `
        UPDATE Funcionario f
        INNER JOIN Cargo c ON f.fk_cargo_func = c.id
        INNER JOIN Empresa e ON c.fk_empresa_cargo = e.id
        SET f.perfilAtivo = ${novoStatus}
        WHERE e.id = ${idEmpresa};
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


function criar_perfil(novoStatus, idEmpresa, nome) {
    console.log("ACESSEI O AVISO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function editar(): ", novoStatus, idEmpresa);
    var emailFuncionario = `${nome}@email.com`;
    var senhaFuncionario = `${nome}${Math.floor(Math.random() * 10000)}`;

    
    var instrucaoSql = `
       START TRANSACTION;

        INSERT INTO Cargo (nome, fk_empresa_cargo, ativo)
        VALUES ('Administrador Master', ${idEmpresa}, 1);

        INSERT INTO Funcionario (nome, email, senha, perfilAtivo, fk_cargo_func)
        VALUES ('Administrador Master', '${emailFuncionario}', '${senhaFuncionario}', 1, LAST_INSERT_ID());

        COMMIT;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}
module.exports = {
    buscar_cards,
    editar,
    buscar_Cargos,
    atualizar_perfil,
    criar_perfil
};