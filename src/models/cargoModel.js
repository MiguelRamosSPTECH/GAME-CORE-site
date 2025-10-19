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

module.exports = {
    criar,
    buscar
};