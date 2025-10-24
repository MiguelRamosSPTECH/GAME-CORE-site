var cadastroServidorModel = require("../models/cadastroServidorModel");

function cadastrarServidor(req, res) {
    var hostname = req.body.hostnameServer;
    var ip = req.body.ipServer;
    var localizacao = req.body.localizacaoServer;
    // var metrica = req.body.metricaServer;
    // var componente = req.body.componenteServer;
    var configuracao = req.body.configuracaoServer;
    var idEmpresa = req.body.idEmpresaServer;


    if (hostname == undefined) {
        res.status(400).send("O nome hostname está indefinido!");
    } else if (ip == undefined) {
        res.status(400).send("Seu ip está indefinido!");
    } else if (localizacao == undefined) {
        res.status(400).send("A localização está indefinida!");
    } if (configuracao == undefined) {
        res.status(400).send("A configuração(componente x métrica) está indefinida!");
    } else if (idEmpresa == undefined) {
        res.status(400).send("O ID da empresa não foi fornecido!");
        return;
    }
    else {
        cadastroServidorModel.enviarCadastroServidor(hostname, ip, localizacao, configuracao, idEmpresa)
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

function exibeLayout(req, res){

    var fk_empresa_layout = req.params.idEmpresa;

    cadastroServidorModel.exibeLayout(fk_empresa_layout)
        .then(
            function(resultado){
                res.json(resultado);
                console.log("O QUE TEM AQUIIIIII?" + res)
                console.log("O QUE TEM AQUIIIIII?" + resultado)
            }
        ).catch(
            function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao buscar o layout! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
        );
}


module.exports = {
    cadastrarServidor,
    exibeLayout
};