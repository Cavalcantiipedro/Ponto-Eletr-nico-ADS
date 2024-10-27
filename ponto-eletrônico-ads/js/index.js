

const diaSemana = document.getElementById("dia-semana");
const diaMesAno = document.getElementById("dia-mes-ano");
const horaMinSeg = document.getElementById("hora-min-seg");
const arrayDayWeek = ["Domingo", "Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira", "Sabado"]
const dialogPonto = document.getElementById("dialog-ponto");



function getUserLocation() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition((position) => {
      let userLocation = {
        "latitude": position.coords.latitude,
        "longitude": position.coords.longitude
      }
      resolve(userLocation);
    },
      (error) => {
        reject(error);
      })
  })
}


let proxPonto = {
  "entrada": "intervalo",
  "intervalo": "volta-intervalo",
  "volta-intervalo": "saida",
  "saida": "entrada"
}


let dialogHora = document.getElementById("dialog-hora");
let dialogData = document.getElementById("dialog-data");

dialogData.textContent = "Data: " + dataCompleta();


const btnRegistrarPonto = document.getElementById("btn-registrar-ponto");
btnRegistrarPonto.addEventListener("click", () => {
  let dialogSelect = document.getElementById("select-tipos-ponto");
  let ultimoPonto = localStorage.getItem("tipoUltimoPonto");
  dialogSelect.value = proxPonto[ultimoPonto];




  dialogPonto.showModal();
});


const btnDialogFechar = document.getElementById("btn-dialog-fechar");
btnDialogFechar.addEventListener("click", () => {
  dialogPonto.close();
});

const btnCaminhoRelatorio = document.getElementById("btn-para-relatorio");
btnCaminhoRelatorio.addEventListener("click", () => {
  window.location.href = "html/relatorio.html"
});


function recuperaPontosLocalStorage() {
  let todosOsPontos = localStorage.getItem("registro");

  if (!todosOsPontos) {
    return [];
  }

  return JSON.parse(todosOsPontos);
}



function salvarRegistroLocalStorage(ponto) {
  let pontos = recuperaPontosLocalStorage();

  pontos.push(ponto);


  localStorage.setItem("registro", JSON.stringify(pontos));
}

const divAlerta = document.getElementById("div-alerta");
let dataSelecionada = document.getElementById("data-ponto")
const btnDialogRegistrarPonto = document.getElementById("btn-dialog-registrar-ponto");
btnDialogRegistrarPonto.addEventListener("click", async () => {

  let data = dataSelecionada.value;

  if (!data) {
    data = dataInput();
  }

  if (new Date(data) > new Date()) {
    alert("A data selecionada não pode ser no futuro!");
    return; 
  }

  let dataFormatada = formataDataParaDDMMYYYY(data);
  let hora = horaCompleta();
  let tipoPonto = document.getElementById("select-tipos-ponto").value;

  let location = await getUserLocation();

  let ponto = {
    "data": dataFormatada,
    "hora": hora,
    "tipo": tipoPonto,
    "location": location,
    "id": 1
  }


  salvarRegistroLocalStorage(ponto);

  localStorage.setItem("tipoUltimoPonto", tipoPonto);



  console.log(ponto);
  dialogPonto.close();

  divAlerta.classList.remove("hidden");
  divAlerta.classList.add("show");

  setTimeout(() => {
    divAlerta.classList.remove("show");
    divAlerta.classList.add("hidden");
  }, 5000);
});

function formataDataParaDDMMYYYY(data) {
  let [ano, mes, dia] = data.split('-');
  return `${dia}-${mes}-${ano}`;
}

function dataInput() {
  const date = new Date();
  return String(date.getFullYear()) + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0');
}

function daySemana() {
  const date = new Date();
  return arrayDayWeek[date.getDay()];
}

function dataCompleta() {
  const date = new Date();
  return String(date.getDate()).padStart(2, '0') + "/" + String(date.getMonth() + 1).padStart(2, '0') + "/" + date.getFullYear();
}

function horaCompleta() {
  const date = new Date();
  return String(date.getHours()).padStart(2, '0') + ":" + String(date.getMinutes()).padStart(2, '0') + ":" + String(date.getSeconds()).padStart(2, '0');
}

function atualizaHora() {
  horaMinSeg.textContent = horaCompleta();
}

function atualizaHoraDialog() {
  dialogHora.textContent = "Hora: " + horaCompleta();
}

atualizaHora();
setInterval(atualizaHora, 1000);

atualizaHoraDialog()
setInterval(atualizaHoraDialog, 1000);

diaSemana.textContent = daySemana();
diaMesAno.textContent = dataCompleta();