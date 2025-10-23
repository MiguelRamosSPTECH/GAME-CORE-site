var configModel = require("../models/configModel");

function criarLayout(req,res){
    var nomeLayout = req.body.nomeLayoutServer
    var ListaChecked = req.body.ListaCheckedServer
    var fk_empresa_cargo = req.body.fk_empresaServer;

    if (nomeLayout == undefined){
        res.status(400).send("O nome está indefinido!");
    } else if (ListaChecked == undefined){
        res.status(400).send("A lista está indefinida!");
    } else {
        configModel.criarLayout(nomeLayout,ListaChecked,fk_empresa_cargo)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function(erro){
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao criar config! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

module.exports = {
    criarLayout
}