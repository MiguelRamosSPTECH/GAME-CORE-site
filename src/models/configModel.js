var database = require("../database/config");

async function criarLayout(nomeLayout,ListaChecked,fk_empresa_cargo){
    console.log("model config")

// for + select (componente e metrica) pra pegar cada componente e metrica

// pegar alertas

// insert na tabela config do server

    // insert tabela layout
    let insertLayout = `
        INSERT INTO layout (nome,fk_empresa_layout)
        VALUES ('${nomeLayout}','${fk_empresa_cargo}');
    `
    let returnInsertLayout = await database.executar(insertLayout);
    let idLayout = returnInsertLayout.insertId;

    // for pra pegar cada metrica
    for (var i = 0; i < ListaChecked.length; i++){
        console.log(ListaChecked[i])
    }



}

module.exports = {
    criarLayout
};