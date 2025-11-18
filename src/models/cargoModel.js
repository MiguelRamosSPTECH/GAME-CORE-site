var database = require("../database/config");
const { all } = require("../routes/cargos");

async function criar(nome, permissoes, fk_empresa) {



    console.log("Permissões Cadastradas: " + permissoes)

    let dbCargo = `

            INSERT INTO cargo (nome, fk_empresa_cargo) VALUES ('${nome}', '${fk_empresa}');

        `;
    console.log("Cargo Cadastrado: \n" + dbCargo);

    let cadCargo = await database.executar(dbCargo);

    let idCargo = cadCargo.insertId;





    for (i = 0; i < permissoes.length; i++) {

        var dbPermissaoCargo = `

                    INSERT INTO permissaocargo (fk_permissao_pc, fk_cargo_pc, permissoes)
                    VALUES (
                        (SELECT id FROM permissao WHERE id = ${permissoes[i]}),
                        ${idCargo},
                        ${permissoes[i]}
                    );

                `;

        let cadPermissaoCargo = await database.executar(dbPermissaoCargo)

    }

    return { idCargo: idCargo };

}

function buscar(fk_empresa) {

    var instrucaoSql = `

        SELECT id, nome FROM cargo where fk_empresa_cargo = ${fk_empresa}

    `;

    console.log("Buscando Cargo por Empresa Registrada: \n" + instrucaoSql);
    return database.executar(instrucaoSql);

}

function buscarFunc(fk_empresa) {

    var buscaFunc = `
    
        SELECT f.id, f.nome, f.email, f.cpf, f.senha, f.perfilAtivo, fk_cargo_func 
        FROM funcionario f
        JOIN cargo c on c.id = f.fk_cargo_func
        JOIN empresa e on e.id = c.fk_empresa_cargo
        WHERE e.id = ${fk_empresa};

    `;

    console.log("Buscando Funcionário por Empresa Registrada: \n" + buscaFunc)
    return database.executar(buscaFunc);

}



function buscarPermissoesPorCargo(idCargo) {
    var instrucaoSql = `
        SELECT fk_permissao_pc FROM permissaocargo 
        WHERE fk_cargo_pc = ${idCargo}
    `;

    console.log("Buscando Permissões do Cargo: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

//implementar inner join dps
function allCargos(idEmpresa) {
    var querySql = `select c.nome as nomeCargo, p.nome as nomePermissao from cargo c
                    inner join permissaocargo ps on
                    ps.fk_cargo_pc = c.id
                    inner join permissao p on
                    p.id = ps.fk_permissao_pc
                    where c.fk_empresa_cargo = ${idEmpresa}`
    return database.executar(querySql);
}

async function deletarCargo(idEmpresa, idCargo) {
    const queryLimparFuncionario = `
        UPDATE funcionario SET fk_cargo_func = NULL WHERE fk_cargo_func = ${idCargo};
    `;

    const queryLimparPc = `
        UPDATE permissaocargo SET fk_cargo_pc = 1 WHERE fk_cargo_pc = ${idCargo};
    `;

    const queryDeletarCargo = `
        DELETE FROM cargo WHERE id = ${idCargo} AND fk_empresa_cargo = ${idEmpresa};
    `;

    try {
        await database.executar(queryLimparFuncionario);

        await database.executar(queryLimparPc);

        const resultado = await database.executar(queryDeletarCargo);

        return resultado;

    } catch (erro) {
        console.error("Erro ao deletar cargo ou limpar referências:", erro);
        throw erro;
    }
}

module.exports = {
    criar,
    buscar,
    buscarFunc,
    buscarPermissoesPorCargo,
    allCargos,
    deletarCargo
};