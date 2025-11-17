var configModel = require("../models/configModel");

function criarLayout(req, res) {
    var nomeLayout = req.body.nomeLayoutServer
    var ListaChecked = req.body.ListaCheckedServer
    var fk_empresa_cargo = req.body.fk_empresaServer;

    if (nomeLayout == undefined) {
        res.status(400).send("O nome está indefinido!");
    } else if (ListaChecked == undefined) {
        res.status(400).send("A lista está indefinida!");
    } else {
        configModel.criarLayout(nomeLayout, ListaChecked, fk_empresa_cargo)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
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

function listarLayout(req, res) {

    console.log("controller liustar layout")

    const { idLayout, idEmpresa } = req.params;

    configModel.listarLayout(idLayout, idEmpresa)
        .then(result => res.status(201).json(result))
        .catch(erro => {
            console.log("erro listar layout ", erro)
            res.status(500).json(erro.sqlMessage);
        });
}

function editarLayout(req, res) {
    var nomeLayout = req.body.nomeLayoutServer
    var ListaChecked = req.body.ListaCheckedServer
    var fk_empresa_cargo = req.body.fk_empresaServer;
    var idLayout = req.params.idLayout;
    var idCs1 = req.body.idCs1Server
    var idCs2 = req.body.idCs2Server
    var idCs3 = req.body.idCs3Server
    var idCs4 = req.body.idCs4Server

    // console.log(nomeLayout,ListaChecked,fk_empresa_cargo,idLayout)
    // console.log(idCs1,idCs2,idCs3,idCs4)
    if (nomeLayout == undefined) {
        res.status(400).send("O nome está indefinido!");
    } else if (ListaChecked == undefined) {
        res.status(400).send("A lista está indefinida!");
    } else {
        configModel.editarLayout(nomeLayout, ListaChecked, fk_empresa_cargo, idLayout, idCs1, idCs2, idCs3, idCs4)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao editar config! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}

function deletarLayout(req, res){
    const {idEmpresa, idLayout} = req.params;
    configModel.deletarLayout(idEmpresa, idLayout)
    .then(resposta => {
        if(resposta.affectedRows > 0) {
            res.status(200).send("Deletado com sucesso.")
        } else {
            res.status(404).send("Nenhum layout encontrado para o ID especificado na empresa.")
        }        
    })
}

module.exports = {
    criarLayout,
    listarLayout,
    editarLayout,
    deletarLayout
}