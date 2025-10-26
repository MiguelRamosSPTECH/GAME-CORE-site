var database = require("../database/config")

async function criar(nome, permissoes, fk_empresa){



        console.log("Permissões Cadastradas: " + permissoes)

        let dbCargo = `

            INSERT INTO Cargo (nome, fk_empresa_cargo) VALUES ('${nome}', '${fk_empresa}');

        `;
        console.log("Cargo Cadastrado: \n" + dbCargo);

        let cadCargo = await database.executar(dbCargo);

        let idCargo = cadCargo.insertId;





        for (i = 0; i < permissoes.length; i++){

            var dbPermissaoCargo = `

                    INSERT INTO PermissaoCargo (fk_permissao_pc, fk_cargo_pc, permissoes)
                    VALUES (
                        (SELECT id FROM Permissao WHERE id = ${permissoes[i]}),
                        ${idCargo},
                        ${permissoes[i]}
                    );

                `;

            let cadPermissaoCargo = await database.executar(dbPermissaoCargo)

        }

        return {idCargo:idCargo};

}

function buscar(fk_empresa){

    var instrucaoSql = `

        SELECT id, nome FROM Cargo where fk_empresa_cargo = ${fk_empresa}

    `;

    console.log("Buscando Cargo por Empresa Registrada: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
        
}

function buscarFunc(fk_empresa){

    var buscaFunc = `
    
        SELECT f.id, f.nome, f.email, f.cpf, f.senha, f.perfilAtivo, fk_cargo_func 
        FROM Funcionario f
        JOIN Cargo c on c.id = f.fk_cargo_func
        JOIN Empresa e on e.id = c.fk_empresa_cargo
        WHERE e.id = ${fk_empresa};

    `;

    console.log("Buscando Funcionário por Empresa Registrada: \n" + buscaFunc)
    return database.executar(buscaFunc);

}



function buscarPermissoesPorCargo(idCargo) {
    var instrucaoSql = `
        SELECT fk_permissao_pc FROM PermissaoCargo 
        WHERE fk_cargo_pc = ${idCargo}
    `;

    console.log("Buscando Permissões do Cargo: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}



module.exports = {
    criar,
    buscar,
    buscarFunc,
    buscarPermissoesPorCargo
};