var database = require("../database/config");

function buscar(idEmpresa){
    var instrucaoSql = `
        SELECT id, nome 
        FROM Layout 
        WHERE fk_empresa_layout = ${idEmpresa};
    `;

    console.log("Buscando layouts da empresa: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}

function buscarCompleto(idEmpresa) {
    var instrucaoSql = `
        select l.id, l.nome as nomeLayout, c.nome, m.unidadeMedida, l.emUso from empresa e
        inner join layout l on
        e.id = l.fk_empresa_layout  
        inner join configuracaoservidor cs on
        cs.fk_layout =  l.id
        inner join componente c on
        c.id = cs.fk_componente_cs
        inner join metrica m on
        m.id = cs.fk_metrica_cs
        where e.id = ${idEmpresa}
        ORDER BY id, c.nome;`;
        console.log("Buscando layouts da empresa COMPLETO: \n" + instrucaoSql);
        return database.executar(instrucaoSql);
}

module.exports = {
    buscar,
    buscarCompleto
};
