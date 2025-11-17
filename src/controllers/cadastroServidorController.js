var cadastroServidorModel = require("../models/cadastroServidorModel");
const { all } = require("../routes/cadastrarServidor");

function cadastrarServidor(req, res) {

    var apelido = req.body.apelidoServidorServer;
    var macadress = req.body.macadressServer;
    var regiao = req.body.regiaoServidorServer;
    var idEmpresa = req.body.idEmpresaServer;
    var layout = req.body.idLayoutServer;


    if (apelido == undefined) {
        res.status(400).send("Seu apelido está indefinido!");
    } else if (macadress == undefined) {
        res.status(400).send("O macadress está indefinido!");
    } else if (regiao == undefined) {
        res.status(400).send("A região está indefinida!");
    } else if (idEmpresa == undefined) {
        res.status(400).send("O ID da empresa não foi fornecido!");
        return;
    } else if (layout == undefined) {
        res.status(400).send("O ID do layout não foi fornecido!");
        return;
    }
    else {
        cadastroServidorModel.enviarCadastroServidor(apelido, macadress, regiao, idEmpresa, layout)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro de servidor! Erro: ",
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

function buscarServidor(req, res){

    var fk_empresa_server = req.params.idEmpresa;

    cadastroServidorModel.buscarServidor(fk_empresa_server)
        .then(
            function(resultado){
                res.json(resultado);
            }
        ).catch(
            function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao buscar o funcionário! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
        );
}


function editarServer(req, res){

    var apelido = req.body.apelidoServidorServer;
    var regiao = req.body.regiaoServidorServer;
    var idEmpresa = req.body.idEmpresaServer;
    var layout = req.body.idLayoutServer;
    var servidor = req.body.idServidorServer;

    cadastroServidorModel.editarServer(apelido, regiao, idEmpresa, layout, servidor)
        .then(
        function(resultado){
                res.json(resultado);
            }
        ).catch(
            function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao alterar o servidor! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
        );

}
function allServidores(req,res) {
    var idEmpresa = req.params.idEmpresa;
    cadastroServidorModel.allServidores(idEmpresa)
    .then(resposta => {
        if(resposta.length > 0) {
            res.status(200).json(resposta)
        } else {
            res.status(401).json("Nenhum servidor cadastrado")
        }
    })
}

function deletarServidor(req,res) {
    const {idEmpresa, id_do_servidor} = req.params;
    cadastroServidorModel.deletarServidor(idEmpresa, id_do_servidor)
    .then(resposta => {
        if(resposta.affectedRows > 0) {
            res.status(200).send("Deletado com sucesso.")
        } else {
            res.status(404).send("Nenhum servidor encontrado para o ID especificado na empresa.")
        }        
    })
}

module.exports = {
    cadastrarServidor,
    exibeLayout,
    buscarServidor,
    editarServer,
    allServidores,
    deletarServidor
};