var configuracaoGlobalModel = require("../models/configuracaoGlobalModel");

async function listar(req, res) {

    configuracaoGlobalModel.listar()
        .then(resultado => {
            res.json(resultado);
        })
        .catch(erro => {
            console.log("Erro ao listar configs globais");
            res.json(erro.sqlMessage);
        });
        
}

// function atualizar(req, res) {
//     const { componente, metrica } = req.body;

//     if (componente == undefined || metrica == undefined) {
//         res.status(400).send("Componente ou métrica indefinidos")
//         return;
//     }

//     configuracaoGlobalModel.atualizar(componente, metrica)
//         .then(resultado => {
//             res.json("Config atualizada!", resultado)
//         })
//         .catch(erro => {
//             console.log("Erro ao atualizar configs");
//             res.status(500).json(erro.sqlMessage);
//         });
// }

module.exports = {
    listar
    // atualizar
};