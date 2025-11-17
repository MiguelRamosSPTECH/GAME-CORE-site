var database = require("../database/config")

async function cadastrar(nomeEmpresarial, cnpj, nomeRepresentante, email) {
    console.log("ACESSEI O MODEL DE CADASTRO DE EMPRESA");
    
    let empresaDB = `

        INSERT INTO empresa (nomeEmpresarial, cnpj, email, nomeRepresentante)
        VALUES ('${nomeEmpresarial}', '${cnpj}', '${email}','${nomeRepresentante}');

    `;
    let cadEmpresa = await database.executar(empresaDB);

    console.log("Executando a instrução SQL (Empresa): \n" + empresaDB);

    let idEmpresa = cadEmpresa.insertId;
    console.log("ID da empresa criada: \n" + idEmpresa);
    console.log("Empresa cadastrada com sucesso!");

    let cargoRootDB = `
    
        INSERT INTO cargo (nome, fk_empresa_cargo) 
        VALUES ('Administrador Master', '${idEmpresa}');

    `
    let cadCargoRoot = await database.executar(cargoRootDB);
    // let idCargo = cadCargoRoot.insertId;
    console.log("Inserindo cargo de administrador ao usuário" + cadCargoRoot)

    // let funcDB = `

    //     INSERT INTO funcionario (nome, email, cpf, senha, fk_cargo_func)
    //     VALUES ('${nomeRepresentante}', '${email}', '${cpfFunc}', '${senhaFunc}', '${idCargo}');

    // `;

    // let cadFunc = await database.executar(funcDB);
    // console.log("Executando a instrução SQL (Funcionário): \n" + funcDB)
    // console.log("Funcionário cadastrado com sucesso!");



    // for (i = 1; i < 7; i++){

    // var permFunc = `

    //     INSERT INTO PermissaoCargo (fk_permissao_pc, fk_cargo_pc, permissoes)
    //     VALUES (
    //             ${i},
    //             ${idCargo},
    //             ${i}
    //             );
    //             `;

    // let cadPermissaoCargoMaster = await database.executar(permFunc)

    // }
    
    return {idEmpresa:idEmpresa};

}

module.exports = {
    cadastrar
};