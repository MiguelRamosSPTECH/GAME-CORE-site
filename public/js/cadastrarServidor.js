function enviarCadastroServidor() {
    
    var hostnameVar = ipt_hostname.value;
    var ipVar = ipt_ip.value;
    var localizacaoVar = ipt_localizacao.value;
    var componenteVar = ipt_componente.value;
    var metricaVar = metrica.value;

    let metricasSelecionadas = []
    let componentesSelecionados = []


    document.querySelectorAll("input[type=checkbox]:checked").forEach(c => {
        metricasSelecionadas.push(c.value)
    })
    document.querySelectorAll("input[type=checkbox]:checked").forEach(c => {
        componentesSelecionados.push(c.value)
    })

    if (
        
        hostnameVar == "" ||
        ipVar == "" ||
        localizacaoVar == "" ||
        componenteVar == "" ||
        metricaVar == ""
        
    ) {
        cardErro.style.display = "block";
        mensagem_erro.innerHTML =
            "(Mensagem de erro para todos os campos em branco)";

        finalizarAguardar();
        return false;
    } else {
        setInterval(sumirMensagem, 5000);
    }

    fetch("/cadastrarServidor/enviarCadastroServidor", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            // crie um atributo que recebe o valor recuperado aqui
            // Agora vá para o arquivo routes/usuario.js

            hostname: hostnameVar,
            ip: ipVar,
            localizacao: localizacaoVar,
            componente: componenteVar,
            metrica: metricaVar
        }),
    })
        .then(function (resposta) {
            console.log("resposta: ", resposta);

            if (resposta.ok) {
                cardErro.style.display = "block";

                mensagem_erro.innerHTML =
                    "Cadastro realizado com sucesso!";

                setTimeout(() => {
                    // window.location = "login.html";
                }, "2000");

                // limparFormulario();
                finalizarAguardar();
            } else {
                throw "Houve um erro ao tentar realizar o cadastro!";
            }
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
            finalizarAguardar();
        });

    return false;



}