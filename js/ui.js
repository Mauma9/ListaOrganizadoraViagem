// js/ui.js

/**
 * Esconde a tabela e mostra a lista gerada
 */
function exibirChecklistNaTela(destino, listaGerada) {
    const telaTabela = document.getElementById('tela-lista-viagens');
    const telaChecklist = document.getElementById('tela-visualzar-checklist');
    const titulo = document.getElementById('tituloChecklist');
    const listaUI = document.getElementById('listaItensGerados');

    // 1. Troca as telas
    telaTabela.style.display = 'none';
    telaChecklist.style.display = 'block';

    // 2. Define o título da viagem
    titulo.innerText = destino;

    // 3. Limpa a lista anterior e desenha a nova
    listaUI.innerHTML = "";

    listaGerada.forEach(item => {
        const li = document.createElement('li');
        li.className = "list-group-item d-flex justify-content-between align-items-center";

        // Criamos o HTML com um Checkbox para o usuário marcar
        li.innerHTML = `
        <div>
        <input class="form-check-input me-2" type="checkbox" value="" id="check-${item.nome}">
        <label class="form-check-label" for="check-${item.nome}">
        <strong>${item.qtd}x</strong> ${item.nome}
        </label>
        </div>
        <span class="badge bg-secondary rounded-pill small">${item.categoria}</span>
        `;
        listaUI.appendChild(li);
    });
}

/**
 * Função para voltar à tela principal
 */
function voltarParaViagens() {
    document.getElementById('tela-lista-viagens').style.display = 'block';
    document.getElementById('tela-visualzar-checklist').style.display = 'none';
}
