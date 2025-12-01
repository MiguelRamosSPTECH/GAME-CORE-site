const express = require('express');
const router = express.Router();
const path = require('path');

const s3Controller = require('../script/s3');
const s3TratamentoController = require('../script/s3_tratamento');

router.get('/dados/*', (req, res) => {
  req.params.arquivo = req.params[0];
  s3Controller.lerArquivo(req, res);
});

router.get('/dados-transformados/*', (req, res) => {
  req.params.arquivo = req.params[0];
  s3TratamentoController.lerArquivo(req, res);
});


router.get('/ver/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/dashboard', 'latencia.html'));
});

router.get('/ver/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/dashboard/dash_sre', 'saude_servidor_manu.html'));
});


//router.get('/ver/*', (req, res) => {
//  res.sendFile(path.join(__dirname, '../../public/dashboard/dash_sre', 'dashboard_joao.html'));
//});

// Precisa do * pra interpretar a /
router.get('/arquivo/*', (req, res) => {
// Oq vem dps do * vai pra dentro do req em um vetor, ent passa aqui
  
  req.params.arquivo = req.params[0];
  s3Controller.lerArquivoCaminhoCompleto(req, res);
});

module.exports = router;
