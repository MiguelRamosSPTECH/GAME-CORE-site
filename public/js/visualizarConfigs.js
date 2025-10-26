function carregarConfigs() {
    var idEmpresa = sessionStorage.ID_EMPRESA;
    fetch(`/layouts/buscarCompleto/${idEmpresa}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(async resposta => {
        var listaLayouts = await resposta.json();
        var nomeLayoutTroca = "";
        var nomeComponenteTroca = ""
        if(resposta.ok) {
            var divLayouts = document.getElementById('area_layouts');
            var contador = 0;
            listaLayouts.forEach(layout => {
                if(nomeLayoutTroca != layout.nomeLayout) {
                    divLayouts.innerHTML+=`
                        <div class="card">
                            <div class="icon-top">
                                <img src="../../assets/imgs/icon-config-layout.png">
                            </div>
                            <h2>${layout.nomeLayout.toUpperCase()}</h2>
                            <input type="text" style="display:none" value="${layout.id}">
                            <div class="icons-bottom" id="componentes_${contador}">
                            </div>
                            <button onclick="usarLayout(${layout.id})">USAR LAYOUT</button>
                            <button onclick="edicaoLayout(${layout.id})">EDITAR LAYOUT</button>
                        </div>                          
                    `
                    contador++;
                }
                nomeLayoutTroca = layout.nomeLayout
            })
            contador = 0;
            var contaVezes = 0;
            nomeComponenteTroca = ""
            nomeLayoutTroca = ""
            var stringsComponentes = ""
            var areaComponentes
            listaLayouts.forEach(layout => {
                if(document.getElementById(`componentes_${contador}`) == null) {
                    contador--
                } 
                areaComponentes = document.getElementById(`componentes_${contador}`)
                console.log(areaComponentes)
                    if(contaVezes <=3) {
                        console.log(nomeComponenteTroca != layout.nome.split("_")[0].toLowerCase())
                        if(nomeComponenteTroca != layout.nome.split("_")[0].toLowerCase()) {
                            if(layout.nome.split("_")[0].toLowerCase() == "cpu") {
                                stringsComponentes+=
                                `
                                    <div class="icon-item">
                                        <div class="icon-cpu"></div>
                                        <span>CPU</span>
                                    </div>                           
                                `
                            } else if(layout.nome.split("_")[0].toLowerCase() == "ram") {
                                stringsComponentes+=
                                `
                                    <div class="icon-item">
                                        <div class="icon-ram"></div>
                                        <span>RAM</span>
                                    </div>                           
                                `
                            } else {
                                stringsComponentes+=
                                `
                                    <div class="icon-item">
                                        <div class="icon-disco"></div>
                                        <span>DISCO</span>
                                    </div>                           
                                `
                            }
                        }        
                        contador++ 
                        contaVezes++              
                    }  else {
                        contaVezes = 0;
                    }
                    
                    nomeComponenteTroca = layout.nome.split("_")[0].toLowerCase()
            })
            areaComponentes.innerHTML = stringsComponentes
            

        }
    })
        .then(function (resposta) {
            console.log("resposta: ", resposta)
        })
        .catch(function (resposta) {
            console.log(`#ERRO: ${resposta}`);
        });
}

function edicaoLayout(idLayout){
    sessionStorage.ID_LAYOUT = idLayout;
    window.location='./edit_layout.html';
}
