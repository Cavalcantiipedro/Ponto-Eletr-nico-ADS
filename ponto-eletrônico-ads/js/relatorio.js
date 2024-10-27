let registroParaEditar = null;
const modalEditar = document.getElementById("modal-editar");
const btnConfirmarEditar = document.getElementById("btn-confirmar-editar");
const btnCancelarEditar = document.getElementById("btn-cancelar-editar");

function criarRelatorio() {
    const containerRegistros = document.getElementById("container-registros");
    let registros = JSON.parse(localStorage.getItem("registro")) || [];

    registros.sort((a, b) => {
        const [diaA, mesA, anoA] = a.data.split('-').map(Number);
        const [diaB, mesB, anoB] = b.data.split('-').map(Number);
        const dataFormatadaA = new Date(anoA, mesA - 1, diaA);
        const dataFormatadaB = new Date(anoB, mesB - 1, diaB);
        return dataFormatadaA - dataFormatadaB;
    });

    containerRegistros.innerHTML = '';

    const dataAtual = new Date();
    dataAtual.setHours(0, 0, 0, 0);

    registros.forEach((registro, index) => {
        const divRegistro = document.createElement("div");
        divRegistro.classList.add("abcd");

        let hora = registro.hora || '';
        let data = registro.data;
        let tipo = registro.tipo;
        let justificativa = registro.justificativa || '';

        divRegistro.innerHTML = `<p>${tipo} | ${data} | ${hora} ${justificativa ? '| Justificativa: ' + justificativa : ''}</p>`;

        if (registro.editado) {
            divRegistro.classList.add("registro-editado"); 
        }

        const [dia, mes, ano] = data.split('-').map(Number);
        const dataRegistro = new Date(ano, mes - 1, dia);
        dataRegistro.setHours(0, 0, 0, 0);

        if (dataRegistro < dataAtual) {
            divRegistro.classList.add("registro-passado");
        } else {
            divRegistro.classList.add("registro-atual");
        }

        if (tipo === "falta") {
            divRegistro.classList.add("falta-registro"); 
        }

        const divBotoes = document.createElement("div");
        divBotoes.classList.add("botoes-container"); 

        
        if (tipo !== "falta") {
            const buttonEditar = document.createElement("button");
            buttonEditar.textContent = "Editar";

            buttonEditar.addEventListener("click", () => {
                registroParaEditar = { ...registro, index }; 
                document.getElementById("tipo-editar").value = registro.tipo; 
                document.getElementById("data-editar").value = registro.data; 
                modalEditar.showModal(); 
            });

            divBotoes.appendChild(buttonEditar); 
        }

        const buttonDeletar = document.createElement("button");
        buttonDeletar.textContent = "Deletar";

        buttonDeletar.addEventListener("click", () => {
            alert("Ese ponto não pode ser deletado")
        });

        divBotoes.appendChild(buttonDeletar);
        divRegistro.appendChild(divBotoes);
        containerRegistros.appendChild(divRegistro);
    });
}

const modalJustificativa = document.getElementById("modal-justificativa");
const btnAdicionarJustificativa = document.getElementById("btn-adicionar-justificativa");
const btnCancelarJustificativa = document.getElementById("btn-cancelar-justificativa");

btnAdicionarJustificativa.addEventListener("click", () => {
    modalJustificativa.showModal();
});

btnCancelarJustificativa.addEventListener("click", () => {
    modalJustificativa.close();
});

const btnEnviarJustificativa = document.getElementById("btn-enviar-justificativa");
btnEnviarJustificativa.addEventListener("click", () => {
    const dataFalta = document.getElementById("data-falta").value;
    const justificativa = document.getElementById("justificativa").value;

    if (!dataFalta || !justificativa) {
        alert("Por favor, preencha a data e a justificativa.");
        return;
    }

    const dataAtual = new Date();
    const dataFaltaDate = new Date(dataFalta);
    dataFaltaDate.setHours(0, 0, 0, 0);

    if (dataFaltaDate > dataAtual) {
        alert("A data da falta não pode ser no futuro!");
        return;
    }

    const pontoFalta = {
        data: dataFalta.split('-').reverse().join('-'), 
        justificativa: justificativa,
        tipo: "falta" 
    };

    let registros = JSON.parse(localStorage.getItem("registro")) || [];
    registros.push(pontoFalta);
    localStorage.setItem("registro", JSON.stringify(registros));

    alert("Justificativa enviada com sucesso!");
    document.getElementById("data-falta").value = ""; 
    document.getElementById("justificativa").value = ""; 
    modalJustificativa.close(); 
    criarRelatorio(); 
});

btnConfirmarEditar.addEventListener("click", () => {
    if (registroParaEditar) {
        const tipoSelecionado = document.getElementById("tipo-editar").value;
        const novaData = document.getElementById("data-editar").value;

        let registros = JSON.parse(localStorage.getItem("registro")) || []; 
        registros[registroParaEditar.index].tipo = tipoSelecionado; 
        registros[registroParaEditar.index].data = novaData; 
        registros[registroParaEditar.index].editado = true;
        localStorage.setItem("registro", JSON.stringify(registros)); 
        criarRelatorio(); 
        modalEditar.close(); 
        registroParaEditar = null; 
    }
});


btnCancelarEditar.addEventListener("click", () => {
    modalEditar.close(); 
});


criarRelatorio();
