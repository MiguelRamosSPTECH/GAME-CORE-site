function verificarStatus(req, res) {
    const idEmpresa = req.params.idEmpresa;

    aceitarEmpresaModel.verificarStatus(idEmpresa)
        .then(function (resultado) {
            if (resultado.length > 0) {
        
                res.json({ statusAcesso: resultado[0].statusAcesso });
            } else {
                res.status(404).send("Empresa não encontrada.");
            }
        })
        .catch(function (erro) {
            console.log("\nHouve um erro ao verificar o status: ", erro.sqlMessage);
            res.status(500).json(erro.sqlMessage);
        });
}


module.exports = {
    buscar_cards,
    editar,
    verificarStatus 
}