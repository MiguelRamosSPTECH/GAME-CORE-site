const AWS = require('aws-sdk');
const Papa = require('papaparse');

AWS.config.update({ region: process.env.AWS_REGION });
const s3 = new AWS.S3();


function transformarDados(dadosCapturados) {
    dadosCapturados.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

    const agora = new Date();
    const ultimoDia = new Date(agora.getTime() - 24 * 60 * 60 * 1000);
    const dadosDiarios = dadosCapturados.filter(d => new Date(d.timestamp) >= ultimoDia);

    const ultimoMes = new Date(agora.getTime() - 30 * 24 * 60 * 60 * 1000);
    const dadosMensais = dadosCapturados.filter(d => new Date(d.timestamp) >= ultimoMes);

    const dadosPorDia = {};
    dadosMensais.forEach(dado => {
        const data = new Date(dado.timestamp);
        const chaveData = data.toISOString().split('T')[0];

        if (!dadosPorDia[chaveData]) {
            dadosPorDia[chaveData] = {
                maxCpu: 0,
                maxRam: 0,
                maxProcessos: 0,
                alertas: 0
            };
        }

        dadosPorDia[chaveData].maxCpu = Math.max(dadosPorDia[chaveData].maxCpu, dado.cpu_porcentagem || 0);
        dadosPorDia[chaveData].maxRam = Math.max(dadosPorDia[chaveData].maxRam, dado.ram_porcentagem || 0);
        dadosPorDia[chaveData].maxProcessos = Math.max(dadosPorDia[chaveData].maxProcessos, dado.total_processos_ativos || 0);

        if (dado.cpu_porcentagem > 80 || dado.ram_porcentagem > 90 || dado.temperatura_cpu > 80) {
            dadosPorDia[chaveData].alertas++;
        }
    });

    const alertasMesTimeSeries = [];
    const picoMaxRamMesTimeSeries = [];
    const picoMaxCpuMesTimeSeries = [];
    const picoMaxProcessosMesTimeSeries = [];

    const diasOrdenados = Object.keys(dadosPorDia).sort();
    diasOrdenados.forEach(dia => {
        const dados = dadosPorDia[dia];
        const timestamp = `${dia}T00:00:00Z`;

        alertasMesTimeSeries.push({ timestamp, value: dados.alertas });
        picoMaxRamMesTimeSeries.push({ timestamp, value: parseFloat(dados.maxRam.toFixed(1)) });
        picoMaxCpuMesTimeSeries.push({ timestamp, value: parseFloat(dados.maxCpu.toFixed(1)) });
        picoMaxProcessosMesTimeSeries.push({ timestamp, value: Math.round(dados.maxProcessos) });
    });

    const cpuSystemTimeSeries = [];
    const cpuUserTimeSeries = [];
    const desempenhoTimeSeries = [];
    const esperaTimeSeries = [];
    const swapTimeSeries = [];

    dadosDiarios.forEach(dado => {
        const timestamp = new Date(dado.timestamp).toISOString();

        cpuSystemTimeSeries.push({
            timestamp,
            value: parseFloat((dado.cpu_sistema_porcentagem || 0).toFixed(1))
        });

        cpuUserTimeSeries.push({
            timestamp,
            value: parseFloat((dado.cpu_usuarios_porcentagem || 0).toFixed(1))
        });

        const cpuUtilizada = dado.cpu_porcentagem || 0;
        const cpuOciosa = dado.cpu_ociosa_porcentagem || 0;
        const swap = dado.ram_swap_porcentagem || 0;
        const desempenho = cpuOciosa + swap > 0 ? cpuUtilizada / (cpuOciosa + swap) : 0;

        desempenhoTimeSeries.push({
            timestamp,
            value: parseFloat(desempenho.toFixed(2))
        });

        const tempoEspera = ((cpuUtilizada + (dado.ram_porcentagem || 0)) / 2) * 0.3;
        esperaTimeSeries.push({
            timestamp,
            value: parseFloat(tempoEspera.toFixed(1))
        });

        swapTimeSeries.push({
            timestamp,
            value: parseFloat((swap || 0).toFixed(1))
        });
    });

    const dadoMaisRecente = dadosCapturados[dadosCapturados.length - 1] || {};

    let totalAlertasMes = 0;
    alertasMesTimeSeries.forEach(item => { totalAlertasMes += item.value; });

    const picoMaxCpuKPI = picoMaxCpuMesTimeSeries.length > 0
        ? Math.max(...picoMaxCpuMesTimeSeries.map(d => d.value))
        : 0;

    const picoMaxRamKPI = picoMaxRamMesTimeSeries.length > 0
        ? Math.max(...picoMaxRamMesTimeSeries.map(d => d.value))
        : 0;

    const picoMaxProcessosKPI = picoMaxProcessosMesTimeSeries.length > 0
        ? Math.max(...picoMaxProcessosMesTimeSeries.map(d => d.value))
        : 0;

    return {
        dataReferencia: new Date().toISOString().split('T')[0],
        ramUtilizadaPercent: parseFloat((dadoMaisRecente.ram_porcentagem || 0).toFixed(1)),
        ramDisponivelPercent: parseFloat((dadoMaisRecente.ram_disp_porcentagem || 0).toFixed(1)),
        totalProcessos: Math.round(dadoMaisRecente.total_processos_ativos || 0),
        totalAlertasMes,
        picoMaxCpuMesPercentual: parseFloat(picoMaxCpuKPI.toFixed(1)),
        picoMaxRamMesPercentual: parseFloat(picoMaxRamKPI.toFixed(1)),
        picoMaxProcessosMes: Math.round(picoMaxProcessosKPI),
        alertasMesTimeSeries,
        picoMaxRamMesTimeSeries,
        picoMaxCpuMesTimeSeries,
        picoMaxProcessosMesTimeSeries,
        swapTimeSeries,
        desempenhoTimeSeries,
        esperaTimeSeries,
        cpuSystemTimeSeries,
        cpuUserTimeSeries
    };
}




async function lerArquivo(req, res) {
  try {
    const fileKey = req.params.arquivo;

    // regex ->  só aceita oq tá dentro do [], agora aceita sub caminho também - pode botar barra, pra navegar nas pastas
    if (!/^[\w.\-\/]+$/.test(fileKey)) {
      return res.status(400).send('❌ Nome de arquivo inválido.');
    }

    const params = {
      Bucket: process.env.S3_BUCKET,
      Key: fileKey
    };

    console.log(`📥 Lendo do S3: ${params.Bucket}/${params.Key}`);

    const data = await s3.getObject(params).promise();
    const text = data.Body.toString('utf-8').trim();

    let content;
    if (text.startsWith('[') || text.startsWith('{')) {
      content = JSON.parse(text);
    } else {
      const parsed = Papa.parse(text, {
        header: true,
        delimiter: text.includes(';') ? ';' : ',',
        skipEmptyLines: true
      });
      content = parsed.data;
    }

    // TRANSFORMAR SE FOR ARRAY COM DADOS DE MÁQUINA
    if (Array.isArray(content) && content.length > 0 && content[0].macadress) {
      console.log('🔄 Transformando dados para formato do dashboard...');
      content = transformarDados(content);
    }

    res.json(content);
  } catch (err) {
    console.error('❌ Erro ao buscar arquivo:', err.message);
    res.status(500).send('Erro ao buscar arquivo: ' + err.message);
  }
}

module.exports = {
  lerArquivo
};