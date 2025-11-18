var options = {
  chart: {
    type: 'bar',
    stacked: true,
  },
  series: [{
    data: [{
      x: 'mc-container-1',
      y: 12
    }, 
    {
      x: 'mc-container-2',
      y: 18
    }, {

      x: 'mc-container-3',
      y: 20
    },
    {
      x: 'host',
      y: 50
    }]
  }]
}

var chart = new ApexCharts(document.querySelector("#grafico-barra"), options);
chart.render()


function showMetrics(elemento) {
  var areaMetricas = elemento.parentNode.parentNode.parentNode.children[1];
  var iconeSeta = elemento.parentNode.parentNode;
  if (areaMetricas.style.display == "none" || areaMetricas.style.display == "") {
    elemento.style.backgroundColor = "#74ce3a"
    elemento.style.border = "2px solid black"
    areaMetricas.style.display = "flex"
    iconeSeta.removeChild(iconeSeta.lastElementChild)
    iconeSeta.innerHTML += `<i class="fa-solid fa-angles-down"></i>`

  } else {
    elemento.style.backgroundColor = "transparent"
    elemento.style.border = "1px solid black"
    areaMetricas.style.display = "none"
    iconeSeta.removeChild(iconeSeta.lastElementChild)
    iconeSeta.innerHTML += `<i class="fa-solid fa-angles-left"></i>`
    areaMetricas.nextElementSibling.setAttribute('style', 'display:none!important')
  }
}

/* TODO RADIO INPUT QUE FOR CHECKED MOSTRA OS INPUT DE ALERTAS */
var radiosInputs = document.querySelectorAll('input[type="radio"]')
for (let i = 0; i < radiosInputs.length; i++) {
  radiosInputs[i].addEventListener('click', () => {
    var areaInputs = radiosInputs[i].parentNode.parentNode.parentNode.lastElementChild
    if (radiosInputs[i].checked) {
      areaInputs.setAttribute('style', 'display:flex!important')
    }
  })
}


function abrirModalConfigs() {
  var idModal = document.getElementsByClassName('modal')[0];
  var backgroundModal = document.getElementsByClassName('background-modal')[0];
  if (idModal.style.display == "none" || idModal.style.display == "") {
    idModal.style.display = "flex"
    backgroundModal.style.display = "block"
  } else {
    idModal.style.display = "none"
    backgroundModal.style.display = "none"
  }
}

function descricaoChamado() {
  var modalChamado = document.getElementsByClassName('modal-chamado')[0];
  var backgroundModal = document.getElementsByClassName('background-modal')[0];
  if (modalChamado.style.display == "none" || modalChamado.style.display == "") {
    modalChamado.style.display = "flex"
    backgroundModal.style.display = "block"
  } else {
    modalChamado.style.display = "none"
    backgroundModal.style.display = "none"
  }
}

function allServidores() {
  var idEmpresa = sessionStorage.ID_EMPRESA;
  fetch(`/cadastrarServidor/allServidores/${idEmpresa}`, {
    method: "GET"
  })
    .then(async resposta => {
      listaServidores = await resposta.json();
      
      var tabelaServidores = document.getElementById('tabela_servidores')
      var acumulaServidores = ""
      listaServidores.forEach(servidor => {
        acumulaServidores += `
            <tr class="background-linha">
                  <td>${servidor.apelido}</td>
                  <td>${servidor.macadress}</td>
                  <td>${servidor.codregiao}</td>
                  <td class="bloco-alertas critico" style="color: green;">Ativo</td>
                  <td class="bloco-alertas">5</td>
                  <td class="icon_edit" onclick="editar('${servidor.apelido}')"><i class="fa-solid fa-pen-to-square"></i></td>
            </tr>        
        `
      });
      tabelaServidores.innerHTML += acumulaServidores
    })
}

function editar(servidornome) {
  console.log("Servidor a buscar:", servidornome);
  console.log("Conteúdo da lista 'servidor':", listaServidores);
  
  let indice = 0
  for (let i = 0; i < listaServidores.length; i++) {
    if (listaServidores[i].apelido == servidornome) {
      indice = i
      break
    }
  }
  sessionStorage.setItem("SERVIDOR_JSON", JSON.stringify(listaServidores[indice]));

  window.location.href = `servidores/edit_servidor.html`
}

function telaCriarServidor(){
    let permissoes = sessionStorage.PERMISSOES_USUARIO
    if (permissoes.includes(5)){
        window.location.href='./servidores/create_servidor.html'
    } else {
        Swal.fire({
            icon:"error",
            text:"Você não tem permissão para criar servidores"
        })
    }
}

function searchServidor() {

  //to fazendo só pelo nome e ja era
  var input, filter, table, tr, td, i, txtValue;
  input = document.querySelector('.search-bar input');
  filter = input.value.toUpperCase();

  table = document.getElementById("tabela_servidores");
  tr = table.getElementsByTagName("tr");

  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0]

    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}