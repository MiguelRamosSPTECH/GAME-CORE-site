function cadastrar() {
    var nomeEmpresarialVar = ipt_nome_empresarial.value;
    var nomeRepresentanteVar = ipt_nome_representante.value;
    var emailVar = ipt_email.value;
    var cnpjVar = ipt_cnpj.value;

    if (
        nomeEmpresarialVar == "" ||
        nomeRepresentanteVar == "" ||
        emailVar == "" ||
        cnpjVar == ""
    ) {
        // ERRO
        msg_erro.innerHTML = "Preencha todos os campos!"
    } else if (nomeEmpresarialVar.length < 10) {
        msg_erro.innerHTML = `Insira um nomeEmpresarial válido! Nome muito pequeno.`
    } else if (nomeRepresentanteVar.length < 3) {
        msg_erro.innerHTML = `Insira um nome válido! Nome muito pequeno.`
    } else if (emailVar.length < 5) {
        msg_erro.innerHTML = `Preencha um email válido! Muito pequeno.`
    } else if (!emailVar.includes("@") || !emailVar.includes(".")) {
        msg_erro.innerHTML = `Insira um e-mail válido!`
    } else if (cnpjVar.length < 14){
        msg_erro.innerHTML = `Insira um cnpj válido!`
    } 
    else {
        console.log("CADASTRO OK")
        fetch("/cadastroEmpresa/cadastrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nomeEmpresarialServer: nomeEmpresarialVar,
                nomeRepresentanteServer: nomeRepresentanteVar,
                emailServer: emailVar,

            })
        })
            .then(function (resposta) {
                console.log("resposta: ", resposta);

                if (resposta.ok) {
                    console.log("cadastro realizado com sucesso")
                    console.log("redirecionando para tela de login")
                } else {
                    throw "Houve um erro ao tentar realizar o cadastro!";
                }
            })
            .catch(function (resposta) {
                console.log(`#ERRO: ${resposta}`);
            });
    }
}