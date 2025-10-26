// APLICANDO MÁSCARA NOS INPUT CNPJ E CPF
var campoCpf= document.getElementById('ipt_cpf')
var campoCnpj = document.getElementById('ipt_cnpj')
var inputs = [campoCpf, campoCnpj]
inputs.forEach(input => {
    input.addEventListener('keydown', () => {
        var valueInput = input.value;
            if(valueInput.length == input.maxLength) {
                if(input.id == "ipt_cpf") {
                    valueInput = valueInput.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
                    //esse replace pega \d{3} = intervalo de 3 numeros consecutivos e guarda em um grupo, em ordem, ou seja, grupo 1,2,3,4.
                    // dai () => guarda isso, essa ordem e o grupo, dai no segundo parametro ele só concatena esses grupos com a string correta do cpf.
                    input.type = "text"
                    input.maxLength = 14
                    input.value = valueInput   
                } else {
                    valueInput = valueInput.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4.$5")
                    input.type = "text"
                    input.maxLength = 18
                    input.value = valueInput
                }
            } else {
                input.type = "number"
                input.value = valueInput.replace(/[^\d]/g, "") //qualquer caracter que nao seja numero em todas as ocorrencias /[^\d]/g por ""
                input.maxLength = input.id == "ipt_cpf" ? 11 : 14
            }
    })
})


function cadastrar() {
    var nomeEmpresarialVar = ipt_nome_empresarial.value;
    var cnpjVar = ipt_cnpj.value.replace(/[^\d]/g, "");
    var nomeRepresentanteVar = ipt_nome_representante.value;
    var emailVar = ipt_email.value;
    var cpfVar = ipt_cpf.value.replace(/[^\d]/g, "");
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
      } else if (nomeEmpresarialVar.length < 10) {
       msg_erro.innerHTML = `Nome Empresarial muito pequeno. Mínimo : 10`
   } else if (cnpjVar.length != 14){
       msg_erro.innerHTML = `Insira um CNPJ de 14 caracteres`
   } else if (nomeRepresentanteVar.length < 3) {
       msg_erro.innerHTML = `Insira um nome de representante válido! Nome muito pequeno.`
   } else if (emailVar.length < 5) {
       msg_erro.innerHTML = `Preencha um email válido! Email muito pequeno.`
   } else if (!emailVar.includes("@") || !emailVar.includes(".")) {
       msg_erro.innerHTML = `Insira um e-mail válido! Precisa ter "@" e "."`
   }  else if (cpfVar.length != 11){
       msg_erro.innerHTML = `Insira um CPF válido!`
   } else if (senhaVar.length < 5) {
       msg_erro.innerHTML = `Insira uma senha válida! Senha muito curta.`
   } else {
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
                        console.log(json)
                        const idEmpresaGerado = json.idEmpresa;

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


    }

}
