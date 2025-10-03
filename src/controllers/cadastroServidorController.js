var cadastroServidorModel = require("../models/cadastroServidorModel");

function cadastrarServidor(req,res){
    var hostname = req.body.hostnameServer
    var ip = req.body.ipServer
    var localizacao = req.body.localizacaoServer
    var metrica = req.body.metricaServer
    var componente = req.body.componenteServer


    if (hostname == undefined) {
        res.status(400).send("O nome hostname está indefinido!");
    } else if (ip == undefined) {
        res.status(400).send("Seu ip está indefinido!");
    } else if (localizacao == undefined) {
        res.status(400).send("A localização está indefinida!");
    } else if (metrica == undefined) {
        res.status(400).send("Selecione ao menos 1 métrica!");
    } else if (componente == undefined) {
        res.status(400).send("Selecione ao menos 1 componente!"); 
    } 
    else{
        cadastroServidorModel.enviarCadastroServidor(hostname,ip,localizacao,metrica,componente)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}
