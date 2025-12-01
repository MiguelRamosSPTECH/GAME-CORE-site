const axios = require('axios');

const JIRA_HOST = process.env.JIRA_HOST; 
const JIRA_EMAIL = process.env.JIRA_EMAIL;
const JIRA_TOKEN = process.env.JIRA_TOKEN;
const API_VERSION = '/rest/api/3';

async function listarChamadosEmAberto(req, res) {
    
    if (!JIRA_EMAIL || !JIRA_TOKEN || !JIRA_HOST) {
        console.error("ERRO: Credenciais JIRA não estão definidas no ambiente do servidor.");
        return res.status(500).json({ error: "Configuração do servidor JIRA pendente." });
    }

    try {
        // 1. Cabeçalho cripto
        const CREDENCIAL_CRIPTO = Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString('base64');
        
        const authHeaders = {
            'Authorization': `Basic ${CREDENCIAL_CRIPTO}`,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        };

        // 2. Montando query
        const jqlQuery = 'created >= startOfDay() AND statusCategory!=Done ORDER BY created DESC';
        const url = `${JIRA_HOST}${API_VERSION}/search/jql?jql=${encodeURIComponent(jqlQuery)}&maxResults=10&fields=*all`;
        console.log(`[JIRA] Buscando chamados na URL: ${JIRA_HOST}${API_VERSION}/search`);

            
        const response = await axios.get(url, { headers: authHeaders });

        res.status(200).json({ issues: response.data.issues });

    } catch (error) {
        // 5. Tratamento de Erro
        console.error(`[JIRA] Falha na integração com a API: ${error.message}`);
        
        // Retorna um erro 500 para o front-end
        res.status(500).json({ 
            error: "Falha ao buscar chamados no Jira. Verifique as credenciais e permissões.", 
            details: errorMessage 
        });
    }
}

module.exports = {
    listarChamadosEmAberto
};