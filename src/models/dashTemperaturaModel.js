var database = require("../database/config");

function buscarParametros(idEmpresa) {
    var instrucaoSql = `
        SELECT  l.id as idLayout,
                l.nome as nomeLayout,
                m.unidadeMedida,
                c.nome as nomeComponente,
                cs.alertaLeve,
                cs.alertaGrave
        FROM layout l
        INNER JOIN configuracaoservidor cs ON
            cs.fk_layout = l.id
        INNER JOIN componente c ON
            c.id = cs.fk_componente_cs
        INNER JOIN metrica m ON
            m.id = cs.fk_metrica_cs
        WHERE l.fk_empresa_layout = ${idEmpresa}
        AND l.emUso = 1;
    `;
    console.log("Buscando parâmetros da empresa: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
};

module.exports = {
    buscarParametros
};