var database = require("../database/config");
const { all } = require("../routes/cadastrarServidor");

function enviarCadastroServidor(apelido, macadress, regiao, idEmpresa, idLayout) {
    console.log("ACESSEI O MODEL DE CADASTRO DE SERVIDOR. ID da Empresa:", idEmpresa);
    console.log("ACESSEI O MODEL DE CADASTRO DE SERVIDOR. ID do Layour:", idLayout);


    var cadastroServidor = `
        INSERT INTO Servidor (apelido, macadress, localizacao, fk_empresa_servidor, fk_layout) 
        VALUES ('${apelido}', '${macadress}', '${regiao}', ${idEmpresa}, ${idLayout});
    `;

    return database.executar(cadastroServidor);
        
}


function exibeLayout(fk_empresa_layout){

    var obtendoLayout = `

        SELECT id, nome FROM layout WHERE fk_empresa_layout = ${fk_empresa_layout}

    `;

    console.log("Layout obtido: " + obtendoLayout);
    return database.executar(obtendoLayout);

}


function buscarServidor(fk_empresa_server){

    var obtendoServidor = `
    
        SELECT s.id, s.apelido, s.macadress, s.localizacao, s.fk_empresa_servidor, s.fk_layout
        FROM Servidor s 
        JOIN Empresa e on e.id = s.fk_empresa_servidor
        JOIN Layout l on l.id = s.fk_layout 
        WHERE e.id = ${fk_empresa_server}
    
    `

    return database.executar(obtendoServidor)

}

function editarServer(apelido, regiao, fk_idEmpresa, fk_layout, fk_servidor){

    var editandoServer = `
    
    UPDATE Servidor s SET s.apelido = '${apelido}',  s.localizacao = '${regiao}', s.fk_empresa_servidor = '${fk_idEmpresa}', s.fk_layout = (SELECT id FROM Layout l WHERE l.id = ${fk_layout}) WHERE s.id = ${fk_servidor}

    `

    return database.executar(editandoServer)

}

function allServidores(idEmpresa) {
    var querySql = `SELECT * FROM servidor where fk_empresa_servidor = ${idEmpresa};`
    return database.executar(querySql);
}

function deletarServidor(idEmpresa, id_do_servidor ){
    var deletarSql = `DELETE FROM SERVIDOR WHERE ID = ${id_do_servidor} and FK_EMPRESA_SERVIDOR = ${idEmpresa};`
    return database.executar(deletarSql)
}



module.exports = {
    enviarCadastroServidor,
    exibeLayout,
    buscarServidor,
    editarServer,
    allServidores,
    deletarServidor
};