var database = require("../database/config");

function enviarCadastroServidor(apelido, macadress, regiao, idEmpresa, idLayout) {
    console.log("ACESSEI O MODEL DE CADASTRO DE SERVIDOR. ID da Empresa:", idEmpresa);
    console.log("ACESSEI O MODEL DE CADASTRO DE SERVIDOR. ID do Layout:", idLayout);


    var cadastroServidor = `
        INSERT INTO servidor (apelido, macadress, fk_regiao, fk_empresa_servidor, fk_layout) 
        VALUES ('${apelido}', '${macadress}', '${regiao}', ${idEmpresa}, ${idLayout});
    `;

    return database.executar(cadastroServidor);
        
}

function allRegioes() {
    let querySql = `select * from regiao;`
    return database.executar(querySql);
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
        FROM servidor s 
        JOIN empresa e on e.id = s.fk_empresa_servidor
        JOIN layout l on l.id = s.fk_layout 
        WHERE e.id = ${fk_empresa_server}
    
    `

    return database.executar(obtendoServidor)

}

function editarServer(apelido, regiao, fk_idEmpresa, fk_layout, fk_servidor){
    fk_layout = fk_layout == "null" ? null : fk_layout;
    var editandoServer = `
    
    UPDATE servidor s SET s.apelido = '${apelido}', s.fk_regiao = ${regiao}, s.fk_empresa_servidor = '${fk_idEmpresa}' , s.fk_layout = ${fk_layout} WHERE s.id = ${fk_servidor}
    `
    return database.executar(editandoServer)

}

function allServidores(idEmpresa) {
    var querySql = `
    SELECT s.*, r.* FROM servidor s
    INNER JOIN regiao r ON s.fk_regiao
    where fk_empresa_servidor = 1
    and r.id = s.fk_regiao;`
    return database.executar(querySql);
}

function deletarServidor(idEmpresa, id_do_servidor ){
    var deletarSql = `DELETE FROM servidor WHERE ID = ${id_do_servidor} and fk_empresa_servidor = ${idEmpresa};`
    return database.executar(deletarSql)
}



module.exports = {
    enviarCadastroServidor,
    exibeLayout,
    buscarServidor,
    editarServer,
    allServidores,
    deletarServidor,
    allRegioes
};