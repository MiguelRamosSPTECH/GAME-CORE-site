var database = require("../database/config")

async function criar(nome, permissoes, fk_empresa){
        
        // Insira exatamente a query do banco aqui, lembrando da nomenclatura exata nos valores
        //  e na ordem de inserção dos dados.
        let dbCargo = `
            INSERT INTO Cargo (nome, fk_empresa_cargo) VALUES ('${nome}', '${fk_empresa}');
        `;
        console.log("Executando a instrução SQL: \n" + dbCargo);

        let cadCargo = await database.executar(dbCargo);

        let idCargo = cadCargo.insertId;

        console.log("Cargo model: " + permissoes)

        let dbPermissao = `
            
            

        `;

        let permissao = await database.executar(dbPermissao)
        let idPermissao = permissao.insertId


        let dbPermissaoCargo = `
            INSERT INTO PermissaoCargo (fk_permissao_pc, fk_cargo_pc, permissoes) VALUES ('${idPermissao}', '${idCargo}', '${permissoes}')
        `
        let cadPermissao = await database.executar(dbPermissaoCargo)

        return {idCargo:idCargo};



}

function buscar(fk_empresa){
    var instrucaoSql = `
        SELECT id, nome FROM cargo where fk_empresa_cargo = ${fk_empresa}
    `;

    console.log("Executando a instrução SQL: \n" + instrucaoSql);
        return database.executar(instrucaoSql);
}

module.exports = {
    criar,
    buscar
};