var database = require("../database/config");

async function criarLayout(nomeLayout,ListaChecked,fk_empresa_cargo){
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
    for (var i = 0; i < ListaChecked.length; i++){
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

    return {idLayout:idLayout};

}

module.exports = {
    criarLayout
};