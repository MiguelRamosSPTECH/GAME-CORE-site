// APLICANDO MÁSCARA NOS INPUT CNPJ E CPF
var campoCnpj = document.getElementById('ipt_cnpj')
    campoCnpj.addEventListener('keydown', () => {
        var valueInput = campoCnpj.value;
        if (valueInput.length == campoCnpj.maxLength) {
                valueInput = valueInput.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4.$5")
                campoCnpj.type = "text"
                campoCnpj.maxLength = 18
                campoCnpj.value = valueInput
        } else {
            campoCnpj.type = "number"
            campoCnpj.value = valueInput.replace(/[^\d]/g, "") //qualquer caracter que nao seja numero em todas as ocorrencias /[^\d]/g por ""
            campoCnpj.maxLength = 14
        }
    })


function cadastrar() {
    var nomeEmpresarialVar = ipt_nome_empresarial.value;
    var cnpjVar = ipt_cnpj.value.replace(/[^\d]/g, "");
    var nomeRepresentanteVar = ipt_nome_representante.value;
    var emailVar = ipt_email.value;
    if (
        nomeEmpresarialVar == "" ||
        nomeRepresentanteVar == "" ||
        emailVar == "" ||
        cnpjVar == ""
    ) {
        // ERRO
        msg_erro.innerHTML = "Preencha todos os campos!"
    } else if (nomeEmpresarialVar.length < 10) {
        msg_erro.innerHTML = `Nome Empresarial muito pequeno. Mínimo : 10`
    } else if (cnpjVar.length != 14) {
        msg_erro.innerHTML = `Insira um CNPJ de 16 caracteres`
    } else if (nomeRepresentanteVar.length < 3) {
        msg_erro.innerHTML = `Insira um nome de representante válido! Nome muito pequeno.`
    } else if (emailVar.length < 5) {
        msg_erro.innerHTML = `Preencha um email válido! Email muito pequeno.`
    } else if (!emailVar.includes("@") || !emailVar.includes(".")) {
        msg_erro.innerHTML = `Insira um e-mail válido! Precisa ter "@" e "."`
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
                emailServer: emailVar

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

                            // alert("Cadastro realizado com sucesso!")

                            Swal.fire({
                                title: "Cadastro realizado!",
                                text: "Redirecionando para login...",
                                icon: "success",
                                showConfirmButton: false,
                                timer: 2000,
                                timerProgressBar: true,
                                customClass: {
                                    popup: 'swal-1'
                                }
                            });

                            setTimeout(() => {
                                window.location.href = "login.html";
                            }, 2100)



                        } else {
                            throw "ID da empresa não retornado pelo servidor. Cadastro falhou.";
                        }
                    });
                } else {
                    throw "Houve um erro ao tentar realizar o cadastro!";
                }
            })
            .catch(function (resposta) {
                Swal.fire({
                    icon: "error",
                    title: "Oops...",
                    text: "Algo deu errado!",
                });
                console.log(`#ERRO: ${resposta}`);
            });


    }

}
