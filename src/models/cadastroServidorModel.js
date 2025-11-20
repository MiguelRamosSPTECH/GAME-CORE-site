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
    
    console.log("LAYOUT CUZAO: ", fk_layout)
    var editandoServer = `
    UPDATE servidor SET apelido = '${apelido}', fk_regiao = ${regiao}, fk_empresa_servidor = '${fk_idEmpresa}' , fk_layout = ${fk_layout == "null" ? null : fk_layout} WHERE id = ${fk_servidor};
    `;
    console.log("SQL DE EDIÇÃO: ", editandoServer)
    return database.executar(editandoServer)

}

function allServidores(idEmpresa) {
    var querySql = `
    SELECT s.*, s.id as idServidor, r.* FROM servidor s
    INNER JOIN regiao r ON s.fk_regiao
    where fk_empresa_servidor = ${idEmpresa}
    and r.id = s.fk_regiao;`
    return database.executar(querySql);
}

function deletarServidor(idEmpresa, id_do_servidor ){
    var deletarSql = `DELETE FROM servidor WHERE ID = ${id_do_servidor} and fk_empresa_servidor = ${idEmpresa};`
    return database.executar(deletarSql)
}


function getDataLayoutsServidor(idServidor) {
    var querySql = `
    select 
        s.*,
        s.fk_layout as idlayout, 
        l.nome as nomeLayout,
        c.nome as nomeComponente, 
        m.unidadeMedida  
    from servidor s
    left join layout l on
    l.id = s.fk_layout 
    left join configuracaoservidor cs on
    cs.fk_layout =  s.fk_layout
    left join componente c on
    c.id = cs.fk_componente_cs
    left join metrica m on
    m.id = cs.fk_metrica_cs
    where s.id = ${idServidor};`
    return database.executar(querySql);
}  



module.exports = {
    enviarCadastroServidor,
    exibeLayout,
    buscarServidor,
    editarServer,
    allServidores,
    deletarServidor,
    allRegioes,
    getDataLayoutsServidor
};