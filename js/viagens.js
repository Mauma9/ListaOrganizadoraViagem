// js/viagens.js

const CHAVE_VIAGENS = 'planner_viagens';
let listaViagens = obter(CHAVE_VIAGENS);
let idViagemEmEdicao = null; // Variável fundamental para a edição!

if (!Array.isArray(listaViagens)) {
    listaViagens = [];
}

/**
 * Captura os dados do formulário e salva OU atualiza uma viagem
 */
function salvarNovaViagem() {
    const destino = document.getElementById('destino').value.trim();
    const dataInicio = document.getElementById('dataInicio').value;
    const dataFim = document.getElementById('dataFim').value;
    const diasTrabalho = document.getElementById('diasDeTrabalho').value || 0;
    const temperatura = document.getElementById('temperaturaSelecionada').value;

    const trilha = document.getElementById('checkTrilha').checked;
    const piscina = document.getElementById('checkPiscina').checked;
    const neve = document.getElementById('checkNeve').checked;

    if (!destino || !dataInicio || !dataFim || temperatura === "Selecione a Época do Ano") {
        alert("Preencha o destino, as datas e a temperatura!");
        return;
    }

    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const totalDias = Math.ceil((fim - inicio) / (1000 * 60 * 60 * 24));
    const inputTrab = document.getElementById('diasDeTrabalho').value;
    const diasTrabalhoFinal = parseInt(inputTrab) || 0;
    const totalDiasLooksCasuais = Math.max(0, totalDias - diasTrabalhoFinal);

    if (totalDias <= 0) {
        alert("A data de fim deve ser posterior à data de início!");
        return;
    }

    // Criamos o objeto (ainda sem ID fixo)
    const dadosViagem = {
        destino,
        dataInicio,
        dataFim,
        totalDias,
        diasTrabalho: diasTrabalhoFinal,
        totalDiasLooksCasuais: totalDiasLooksCasuais,
        temperatura,
        especiais: { trilha, piscina, neve }
    };

    // VERIFICAÇÃO: É uma edição ou uma nova?
    if (idViagemEmEdicao !== null) {
        // Modo Edição: Atualiza o item existente
        const index = listaViagens.findIndex(v => v.id === idViagemEmEdicao);
        if (index !== -1) {
            listaViagens[index] = { ...dadosViagem, id: idViagemEmEdicao };
        }
        idViagemEmEdicao = null; // Reseta após salvar
    } else {
        // Modo Criação: Adiciona novo com ID único
        listaViagens.push({ ...dadosViagem, id: Date.now() });
    }

    salvar(CHAVE_VIAGENS, listaViagens);

    // Reseta visual do modal
    document.getElementById('modalNovaViagemLabel').innerText = "Planejamento da Próxima Viagem";
    document.getElementById('btnSalvarViagem').innerText = "Salvar Viagem";

    limparFormularioViagem();
    renderizarTabelaViagens();

    const modalElement = document.getElementById('modalNovaViagem');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
}

/**
 * Prepara o modal para edição preenchendo os campos
 */
function prepararEdicao(id) {
    const viagem = listaViagens.find(v => v.id === id);
    if (!viagem) return;

    idViagemEmEdicao = id; // Ativa o modo edição

    // Preenche os campos
    document.getElementById('destino').value = viagem.destino;
    document.getElementById('dataInicio').value = viagem.dataInicio;
    document.getElementById('dataFim').value = viagem.dataFim;
    document.getElementById('diasDeTrabalho').value = viagem.diasTrabalho;
    document.getElementById('temperaturaSelecionada').value = viagem.temperatura;
    document.getElementById('checkTrilha').checked = viagem.especiais.trilha;
    document.getElementById('checkPiscina').checked = viagem.especiais.piscina;
    document.getElementById('checkNeve').checked = viagem.especiais.neve;

    // Muda textos do modal
    document.getElementById('modalNovaViagemLabel').innerText = "Editar Viagem";
    document.getElementById('btnSalvarViagem').innerText = "Atualizar Viagem";

    // Abre o modal
    const modalElement = document.getElementById('modalNovaViagem');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
}

function renderizarTabelaViagens() {
    const corpoTabela = document.querySelector('#tela-lista-viagens tbody');
    if (!corpoTabela) return;

    corpoTabela.innerHTML = "";

    listaViagens.forEach((viagem, index) => {
        // Tradução da temperatura para o label
        const labelTemp = { "1": "☀️ Calor", "2": "☁️ Normal", "3": "❄️ Frio" }[viagem.temperatura] || "---";

        const tr = document.createElement('tr');
        tr.innerHTML = `
        <th scope="row">${index + 1}</th>
        <td>${viagem.destino}</td>
        <td>${viagem.totalDias} dias</td>
        <td>${labelTemp}</td>
        <td>
        <div class="btn-group" role="group">
        <button type="button" class="btn btn-warning btn-sm" onclick="prepararEdicao(${viagem.id})" title="Editar">
        <i class="fas fa-edit"></i>
        </button>

        <button type="button" class="btn btn-danger btn-sm" onclick="excluirViagem(${viagem.id})" title="Excluir">
        <i class="fas fa-trash"></i>
        </button>

        <button type="button" class="btn btn-success btn-sm" onclick="gerarChecklist(${viagem.id})" title="Gerar Lista">
        <i class="fas fa-list-check"></i> Lista
        </button>
        </div>
        </td>
        `;
        corpoTabela.appendChild(tr);
    });
}


function excluirViagem(id) {
    if (confirm("Deseja realmente excluir esta viagem?")) {
        listaViagens = listaViagens.filter(v => v.id !== id);
        salvar(CHAVE_VIAGENS, listaViagens);
        renderizarTabelaViagens();
    }
}

function limparFormularioViagem() {
    // Limpa os campos de texto e data
    document.getElementById('destino').value = "";
    document.getElementById('dataInicio').value = "";
    document.getElementById('dataFim').value = "";
    document.getElementById('diasDeTrabalho').value = "";

    // Volta o select para a opção inicial
    document.getElementById('temperaturaSelecionada').selectedIndex = 0;

    // Desmarca os Switches (Checkboxes)
    document.getElementById('checkTrilha').checked = false;
    document.getElementById('checkPiscina').checked = false;
    document.getElementById('checkNeve').checked = false;
}
