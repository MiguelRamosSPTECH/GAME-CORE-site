var database = require("../database/config")

async function cadastrar(nomeEmpresarial, cnpj, nomeRepresentante, email, nomeFunc, emailFunc, cpfFunc, senhaFunc) {
    console.log("ACESSEI O MODEL DE CADASTRO DE SERVIDOR");
    
    let empresaDB = `

        INSERT INTO Empresa (nomeEmpresarial, cnpj, nomeRepresentante, email)
        VALUES ('${nomeEmpresarial}', '${cnpj}', '${nomeRepresentante}', '${email}');

    `;
    let cadEmpresa = await database.executar(empresaDB);

    console.log("Executando a instrução SQL (Empresa): \n" + empresaDB);

    let idEmpresa = cadEmpresa.insertId;
    console.log("ID da empresa criada: \n" + idEmpresa);
    console.log("Empresa cadastrada com sucesso!");
    


    let funcDB = `

        INSERT INTO Funcionario (nome, email, cpf, senha, userMaster, fk_empresa_func)
        VALUES ('${nomeFunc}', '${emailFunc}', '${cpfFunc}', '${senhaFunc}', 1, ${idEmpresa});

    `;
    let cadFunc = await database.executar(funcDB);
    console.log("Executando a instrução SQL (Funcionário): \n" + funcDB)
    console.log("Funcionário cadastrado com sucesso!");
    
    return {idEmpresa:idEmpresa};

}

module.exports = {
    cadastrar
};