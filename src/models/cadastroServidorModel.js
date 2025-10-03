var database = require("../database/config")


function enviarCadastroServidor(hostname, ip, localizacao, componentes, metricas, idEmpresa) {
    console.log("ACESSEI O MODEL DE CADASTRO DE SERVIDOR");

    // PASSO 1: INSERIR O SERVIDOR NA TABELA 'Servidor'
    var instrucaoSqlServidor = `
        INSERT INTO Servidor (hostName, ip, localizacao, fk_empresa_servidor) 
        VALUES ('${hostname}', '${ip}', '${localizacao}', ${idEmpresa});
    `;

    // 1. Executa a inserção do Servidor e, na sequência, busca o ID gerado.
    return database.executar(instrucaoSqlServidor)
        .then(resultado => {
            // Supondo que o driver de banco de dados retorna o ID inserido em 'insertId'
            const servidorId = resultado.insertId;

            // PASSO 2: PREPARAR AS INSERÇÕES NA TABELA 'ConfiguracaoServidor'
            // O objetivo é inserir uma linha para cada combinação de Componente x Métrica.

            const promisesConfiguracao = [];

            // Itera sobre CADA componente selecionado
            for (const componenteNome of componentes) {
                // Itera sobre CADA métrica selecionada
                for (const metricaNome of metricas) {

                    // Instrução SQL para inserir a configuração. 
                    // Usamos subqueries para buscar o ID do Componente e o ID da Métrica
                    // pelos seus respectivos nomes/unidades (enviados do frontend).
                    var instrucaoSqlConfiguracao = `
                        INSERT INTO ConfiguracaoServidor (fk_servidor_config, fk_componente_config, fk_metrica_config, alertaLeve, alertaGrave)
                        VALUES (
                            ${servidorId},
                            (SELECT id FROM Componente WHERE nome = '${componenteNome.toUpperCase()}'),
                            (SELECT id FROM Metrica WHERE unidadeMedida = '${metricaNome.toUpperCase()}'),
                            NULL, -- Alerta Leve (pode ser ajustado)
                            NULL  -- Alerta Grave (pode ser ajustado)
                        );
                    `;

                    // Adiciona a Promise de execução ao array
                    promisesConfiguracao.push(database.executar(instrucaoSqlConfiguracao));
                }
            }

            // 3. Executa todas as inserções de configuração em paralelo.
            return Promise.all(promisesConfiguracao);

        }).catch(erro => {
            console.error("Erro no cadastro de servidor ou configuração:", erro);
            throw erro; // Propaga o erro para ser tratado no Controller
        });
}

module.exports = {
    enviarCadastroServidor
};