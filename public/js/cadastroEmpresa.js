function cadastrar() {
    var nomeEmpresarialVar = ipt_nome_empresarial.value;
    var cnpjVar = ipt_cnpj.value;
    var nomeRepresentanteVar = ipt_nome_representante.value;
    var emailVar = ipt_email.value;
    var cpfVar = ipt_cpf.value;
    var senhaVar = ipt_senha.value;

    if (
        nomeEmpresarialVar == "" ||
        cnpjVar == "" ||
        nomeRepresentanteVar == "" ||
        emailVar == "" ||
        cpfVar == "" ||
        senhaVar == ""
    ) {
        // ERRO
        msg_erro.innerHTML = "Preencha todos os campos!"
      } // else if (nomeEmpresarialVar.length < 10) {
//        msg_erro.innerHTML = `Insira um nome empresarial válido! Nome muito pequeno.`
//    } else if (cnpjVar.length != 14){
//        msg_erro.innerHTML = `Insira um CNPJ válido!`
//    } else if (nomeRepresentanteVar.length < 3) {
//        msg_erro.innerHTML = `Insira um nome de representante válido! Nome muito pequeno.`
//    } else if (emailVar.length < 5) {
//        msg_erro.innerHTML = `Preencha um email válido! Email muito pequeno.`
//    } else if (!emailVar.includes("@") || !emailVar.includes(".")) {
//        msg_erro.innerHTML = `Insira um e-mail válido! Precisa ter "@" e "."`
//    } else if (nomeFuncVar.length < 10) {
//        msg_erro.innerHTML = `Insira um nome válido! Nome muito curto.`
//    } else if (emailFuncVar.length < 2) {
//        msg_erro.innerHTML = `Insira um e-mail válido! Email muito pequeno.`
//    } else if (!emailFuncVar.includes("@") || !emailFuncVar.includes(".")) {
//        msg_erro.innerHTML = `Insira um e-mail válido! Precisa ter "@" e "."`
//    } else if (cpfVar.length != 11){
//        msg_erro.innerHTML = `Insira um CPF válido!`
//    } else if (senhaVar.length < 5) {
//        msg_erro.innerHTML = `Insira uma senha válida! Senha muito curta.`
//    } else if (confirmarSenhaVar != senhaVar) {
//        msg_erro.innerHTML = `E-mail e/ou senha diferentes.`
//    }
    else {
        console.log("CADASTRO OK")
        fetch("/cadastroEmpresa/cadastrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nomeEmpresarialServer: nomeEmpresarialVar,
                cnpjServer: cnpjVar,
                nomeRepresentanteServer: nomeRepresentanteVar,
                emailServer: emailVar,
                cpfServer: cpfVar,
                senhaServer: senhaVar

            })
        })
            .then(function (resposta) {
                console.log("resposta: ", resposta);

                if (resposta.ok) {
                    resposta.json().then(json => {

                        const idEmpresaGerado = json.id || json.insertId || json.idEmpresa || idEmpresa;

                        if (idEmpresaGerado) {
                            sessionStorage.ID_EMPRESA = idEmpresaGerado;
                            console.log("Cadastro de empresa realizado com sucesso. ID:", idEmpresaGerado);
                            window.location.href = "login.html";

                        } else {
                            throw "ID da empresa não retornado pelo servidor. Cadastro falhou.";
                        }
                    });
                } else {
                    throw "Houve um erro ao tentar realizar o cadastro!";
                }
            })
            .catch(function (resposta) {
                console.log(`#ERRO: ${resposta}`);
            });

        return false;

    }

}