var database = require("../database/config");

function enviarCadastroServidor(hostname, ip, localizacao, configuracao, idEmpresa) {
    console.log("ACESSEI O MODEL DE CADASTRO DE SERVIDOR. ID da Empresa:", idEmpresa);


    var instrucaoSqlServidor = `
        INSERT INTO Servidor (hostName, ip, localizacao, fk_empresa_servidor) 
        VALUES ('${hostname}', '${ip}', '${localizacao}', ${idEmpresa});
    `;


    return database.executar(instrucaoSqlServidor)
        .then(resultado => {
            const servidorId = resultado.insertId;
            const promisesConfiguracao = [];

            // for (const componenteNome of componentes) {

            //     for (const metricaNome of metricas) {

            //         var instrucaoSqlConfiguracao = `
            //             INSERT INTO ConfiguracaoServidor (fk_servidor_config, fk_componente_config, fk_metrica_config, alertaLeve, alertaGrave)
            //             VALUES (
            //                 ${servidorId},
            //                 (SELECT id FROM Componente WHERE nome = '${componenteNome}'),
            //                 (SELECT id FROM Metrica WHERE unidadeMedida = '${metricaNome}'),
            //                 NULL, -- Alerta Leve padrão
            //                 NULL  -- Alerta Grave padrão
            //             );
            //         `;

            //         promisesConfiguracao.push(database.executar(instrucaoSqlConfiguracao));
            //     }
            // }
            for (const { componente, metrica } of configuracao) {
                // for para exibir individualmente componentes e metricas

                // console.log(componente)
                // console.log(metrica)
                var instrucaoSqlConfiguracao = `
                    INSERT INTO configuracaoServidor (fk_servidor_config, fk_componente_config, fk_metrica_config, alertaLeve, alertaGrave)
                    VALUES (
                        ${servidorId},
                        (SELECT id FROM Componente WHERE nome = '${componente}'),
                        (SELECT id FROM Metrica WHERE unidadeMedida = '${metrica}'),
                        NULL, -- Alerta Leve padrão
                        NULL  -- Alerta Grave padrão
                    );
                `;
                promisesConfiguracao.push(database.executar(instrucaoSqlConfiguracao));
            }

            return Promise.all(promisesConfiguracao);

        }).catch(erro => {
            console.error("Erro no cadastro de servidor ou configuração:", erro);
            throw erro;
        });
}

module.exports = {
    enviarCadastroServidor
};