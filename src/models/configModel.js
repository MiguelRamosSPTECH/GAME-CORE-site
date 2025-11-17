var database = require("../database/config");

async function criarLayout(nomeLayout, ListaChecked, fk_empresa_cargo) {
    console.log("model config")

    // for + select (componente e metrica) pra pegar cada componente e metrica

    // pegar alertas

    // insert na tabela config do server

    // insert tabela layout
    let insertLayout = `
        INSERT INTO layout (nome,fk_empresa_layout,emuso)
        VALUES ('${nomeLayout}','${fk_empresa_cargo}',0);
    `
    let returnInsertLayout = await database.executar(insertLayout);
    let idLayout = returnInsertLayout.insertId;

    // for pra pegar cada metrica
    for (var i = 0; i < ListaChecked.length; i++) {
        // console.log(ListaChecked[i])
        // console.log(ListaChecked[i]["componente"])
        // console.log(ListaChecked[i]["metrica"])
        // console.log(ListaChecked[i]["AlertaLeve"])
        // console.log(ListaChecked[i]["AlertaGrave"])

        let componente = ListaChecked[i]["componente"];
        let metrica = ListaChecked[i]["metrica"];
        //let selectComponente = `SELECT id FROM componente WHERE nome = '${componente}'`;
        //let returnSelectComponente = await database.executar(selectComponente);
        //let idComponente = returnSelectComponente.id;

        //let selectMetrica = `SELECT id FROM metrica WHERE unidadeMedida = '${metrica}'`;
        //let returnSelectMetrica = await database.executar(selectMetrica);
        //let idMetrica = returnSelectMetrica.id;

        let alertaLeve = ListaChecked[i]["AlertaLeve"];

        let alertaGrave = ListaChecked[i]["AlertaGrave"];

        let insertConfig = `
            INSERT INTO configuracaoservidor    (alertaleve,
                                                alertagrave,
                                                fk_metrica_cs,
                                                fk_componente_cs,
                                                fk_layout)
            VALUES  ('${alertaLeve}',
                    '${alertaGrave}',
                    (SELECT id FROM metrica WHERE unidadeMedida = '${metrica}'),
                    (SELECT id FROM componente WHERE nome = '${componente}'),
                    '${idLayout}');
        `;

        let returnInsertConfig = await database.executar(insertConfig);

    }

    return { idLayout: idLayout };

}

async function listarLayout(idLayout, idEmpresa) {

    console.log("model listar layout")

    var instrucaoSql = `
        SELECT 	l.id, l.nome AS nomeLayout, l.emUso,
		c.nome,
        m.unidadeMedida,
        cs.alertaLeve, cs.alertaGrave, cs.id cs_id
	FROM empresa e
	INNER JOIN layout l ON
        e.id = l.fk_empresa_layout  
	INNER JOIN configuracaoservidor cs ON
        cs.fk_layout =  l.id
	INNER JOIN componente c ON
        c.id = cs.fk_componente_cs
	INNER JOIN metrica m ON
        m.id = cs.fk_metrica_cs
	WHERE e.id = ${idEmpresa} AND l.id = ${idLayout}
    ORDER BY c.nome;
    `;
    // console.log(instrucaoSql);
    return database.executar(instrucaoSql);
}

async function editarLayout(nomeLayout, ListaChecked, fk_empresa_cargo, idLayout, idCs1, idCs2, idCs3, idCs4) {
    console.log("model config editar layout")
    console.log(ListaChecked)
    let updateLayoutNome = `

        UPDATE layout SET nome = '${nomeLayout}' WHERE id = ${idLayout};
    `
    // let returnupdateLayoutNome = 
    await database.executar(updateLayoutNome);
    // let idLayout = returnupdateLayoutNome.insertId;

    // for pra pegar cada metrica
    for (var i = 0; i < ListaChecked.length; i++) {
        // console.log(ListaChecked[i])
        // console.log(ListaChecked[i]["componente"])
        // console.log(ListaChecked[i]["metrica"])
        // console.log(ListaChecked[i]["AlertaLeve"])
        // console.log(ListaChecked[i]["AlertaGrave"])

        let componente = ListaChecked[i]["componente"];
        let metrica = ListaChecked[i]["metrica"];
        //let selectComponente = `SELECT id FROM componente WHERE nome = '${componente}'`;
        //let returnSelectComponente = await database.executar(selectComponente);
        //let idComponente = returnSelectComponente.id;

        //let selectMetrica = `SELECT id FROM metrica WHERE unidadeMedida = '${metrica}'`;
        //let returnSelectMetrica = await database.executar(selectMetrica);
        //let idMetrica = returnSelectMetrica.id;

        let alertaLeve = ListaChecked[i]["AlertaLeve"];

        let alertaGrave = ListaChecked[i]["AlertaGrave"];

        let idCsList = [idCs1, idCs2, idCs3, idCs4];
        console.log(idCsList)
        let updateConfig = `
            UPDATE configuracaoservidor SET 
                alertaleve = ${alertaLeve},
        		alertagrave = ${alertaGrave},
                fk_metrica_cs = (SELECT id FROM metrica WHERE unidadeMedida = '${metrica}'),
                fk_componente_cs = (SELECT id FROM componente WHERE nome = '${componente}')
                WHERE id = ${Number(idCsList[i])};
        `;

        await database.executar(updateConfig);
    }

    return { idLayout: idLayout };
}


async function deletarLayout(idEmpresa, idLayout){
    const queryLimparServidor = `
        UPDATE SERVIDOR SET FK_LAYOUT = NULL WHERE FK_LAYOUT = ${idLayout};
    `;
    
    const queryLimparConfig = `
        UPDATE CONFIGURACAOSERVIDOR SET FK_LAYOUT = NULL WHERE FK_LAYOUT = ${idLayout};
    `;

    const queryDeletarLayout = `
        DELETE FROM LAYOUT WHERE ID = ${idLayout} AND FK_EMPRESA_LAYOUT = ${idEmpresa};
    `;

    try {
        await database.executar(queryLimparServidor);
        
        await database.executar(queryLimparConfig);

        const resultado = await database.executar(queryDeletarLayout);
    
        return resultado;

    } catch (erro) {
        console.error("Erro ao deletar layout ou limpar referências:", erro);
        throw erro; 
    }
}

module.exports = {
    criarLayout,
    listarLayout,
    editarLayout,
    deletarLayout
};