var sre_futuroModel = require("../models/sre_futuroModel");
    console.log("aasadasdasdas 123123123123");

function entrar(req, res) {

    console.log("aasadasdasdas");
    


    var id = req.body.idServer;


    if (id == undefined) {
        res.status(400).send("Seu id está undefined!");
    } else {
        sre_futuroModel.entrar(id)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String
                     res.json(resultadoAutenticar);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function buscar(req, res) {

    console.log("aasadasdasdas");
    


    var id = req.body.idServer;


    if (id == undefined) {
        res.status(400).send("Seu id está undefined!");
    } else {
        sre_futuroModel.buscar(id)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String
                     res.json(resultadoAutenticar);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}



module.exports = {
    entrar,
    buscar
}