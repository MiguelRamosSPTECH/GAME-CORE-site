
function verificarStatus(idEmpresa) {
    var instrucaoSql = `
        SELECT statusAcesso FROM Empresa WHERE id = ${idEmpresa};
    `;
    console.log("Executando a instrução SQL de verificação de status: \n" + instrucaoSql);
    return database.executar(instrucaoSql);
}


module.exports = {
    buscar_cards,
    editar,
    verificarStatus
};