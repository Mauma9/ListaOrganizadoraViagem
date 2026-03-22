/**
 * 1. PONTO DE ENTRADA
 * Decide se o usuário precisa escolher looks no modal ou se o sistema gera a lista direto.
 */
function gerarChecklist(idViagem) {
    const viagem = listaViagens.find(v => v.id === idViagem);
    const catalogo = obter('planner_catalogo');

    if (!viagem || !catalogo) {
        alert("Erro ao carregar dados. Verifique se o catálogo está preenchido.");
        return;
    }

    // Guardamos a viagem na 'window' para ser usada pela função de finalização
    window.viagemAtivaParaChecklist = viagem;

    // REGRA DE DECISÃO:
    // Só abre o modal se houver MAIS looks no catálogo do que dias na viagem.
    const precisaEscolherCasual = catalogo.looks.length > viagem.totalDiasLooksCasuais;
    const precisaEscolherTrabalho = (viagem.diasTrabalho > 0) && (catalogo.looksTrabalho.length > viagem.diasTrabalho);

    if (precisaEscolherCasual || precisaEscolherTrabalho) {
        abrirSelecaoDeLooks(viagem, catalogo);
    } else {
        // Se a quantidade de looks for igual ou menor que os dias, adicionamos tudo automaticamente
        construirChecklistFinal(viagem, catalogo, null, null);
    }
}

/**
 * 2. INTERFACE DE SELEÇÃO (MODAL)
 * Cria os checkboxes apenas para as categorias onde há necessidade de escolha.
 */
function abrirSelecaoDeLooks(viagem, catalogo) {
    const containerCasuais = document.getElementById('containerSelecaoLooks');
    const containerTrabalho = document.getElementById('containerSelecaoTrabalho');

    containerCasuais.innerHTML = "";
    containerTrabalho.innerHTML = "";

    // Renderiza seção Casual se houver excesso de looks
    if (catalogo.looks.length > viagem.totalDiasLooksCasuais) {
        catalogo.looks.forEach((look, i) => {
            containerCasuais.innerHTML += `
            <div class="form-check mb-2">
            <input class="form-check-input check-look-casual" type="checkbox" value="${look}" id="look-c-${i}">
            <label class="form-check-label" for="look-c-${i}">${look}</label>
            </div>`;
        });
        document.getElementById('avisoLimiteCasual').innerText = `(Escolha ${viagem.totalDiasLooksCasuais})`;
        configurarTravaSelecao('.check-look-casual', viagem.totalDiasLooksCasuais);
    } else {
        containerCasuais.innerHTML = "<p class='text-muted small'>✓ Todos os looks casuais serão incluídos automaticamente.</p>";
    }

    // Renderiza seção Trabalho se houver excesso de looks
    if (viagem.diasTrabalho > 0) {
        if (catalogo.looksTrabalho.length > viagem.diasTrabalho) {
            catalogo.looksTrabalho.forEach((look, i) => {
                containerTrabalho.innerHTML += `
                <div class="form-check mb-2">
                <input class="form-check-input check-look-trabalho" type="checkbox" value="${look}" id="look-t-${i}">
                <label class="form-check-label" for="look-t-${i}">${look}</label>
                </div>`;
            });
            document.getElementById('avisoLimiteTrabalho').innerText = `(Escolha ${viagem.diasTrabalho})`;
            configurarTravaSelecao('.check-look-trabalho', viagem.diasTrabalho);
        } else {
            containerTrabalho.innerHTML = "<p class='text-muted small'>✓ Todos os looks de trabalho serão incluídos automaticamente.</p>";
        }
    }

    const modal = new bootstrap.Modal(document.getElementById('modalSelecaoLooks'));
    modal.show();
}

/**
 * 3. CAPTURA DOS DADOS DO MODAL
 * Fecha a janela e envia o que foi marcado para o motor de montagem.
 */
function finalizarGeracaoLista() {
    const viagem = window.viagemAtivaParaChecklist;
    const catalogo = obter('planner_catalogo');

    const selecionadosCasuais = Array.from(document.querySelectorAll('.check-look-casual:checked')).map(el => el.value);
    const selecionadosTrabalho = Array.from(document.querySelectorAll('.check-look-trabalho:checked')).map(el => el.value);

    const modalElement = document.getElementById('modalSelecaoLooks');
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) modal.hide();

    construirChecklistFinal(viagem, catalogo, selecionadosCasuais, selecionadosTrabalho);
}

/**
 * 4. MOTOR DE MONTAGEM (O CORAÇÃO DO SISTEMA)
 * Compila todas as categorias em um único array final para exibição.
 */
function construirChecklistFinal(viagem, catalogo, casuaisEscolhidos, trabalhoEscolhidos) {
    let checklistFinal = [];

    // --- PROCESSAMENTO DE LOOKS ---
    // Se a lista vier vazia/null, o sistema pega os primeiros do catálogo até o limite de dias
    const listaCasuais = (casuaisEscolhidos && casuaisEscolhidos.length > 0)
    ? casuaisEscolhidos
    : catalogo.looks.slice(0, viagem.totalDiasLooksCasuais);

    listaCasuais.forEach(look => {
        checklistFinal.push({ nome: `Look: ${look}`, qtd: 1, categoria: 'Looks Casuais' });
    });

    if (viagem.diasTrabalho > 0) {
        const listaTrabalho = (trabalhoEscolhidos && trabalhoEscolhidos.length > 0)
        ? trabalhoEscolhidos
        : catalogo.looksTrabalho.slice(0, viagem.diasTrabalho);

        listaTrabalho.forEach(look => {
            checklistFinal.push({ nome: `Look Trabalho: ${look}`, qtd: 1, categoria: 'Roupas de Trabalho' });
        });
    }

    // --- ITENS FIXOS E MULTIPLICADOS ---
    catalogo.essenciais.forEach(item => {
        checklistFinal.push({ nome: item, qtd: viagem.totalDias, categoria: 'Essenciais Diários' });
    });

    catalogo.necessaire.forEach(item => {
        checklistFinal.push({ nome: item, qtd: 1, categoria: 'Higiene/Necessaire' });
    });

    // --- CLIMA E ATIVIDADES ---
    const mapaTemp = { "1": "calor", "2": "normal", "3": "frio" };
    const tempKey = mapaTemp[viagem.temperatura];
    if (catalogo.temperaturas[tempKey]) {
        catalogo.temperaturas[tempKey].forEach(i => checklistFinal.push({ nome: i, qtd: 1, categoria: `Clima: ${tempKey.toUpperCase()}` }));
    }

    if (viagem.especiais.trilha) catalogo.especiais.trilha.forEach(i => checklistFinal.push({ nome: i, qtd: 1, categoria: 'Trilha' }));
    if (viagem.especiais.piscina) catalogo.especiais.piscina.forEach(i => checklistFinal.push({ nome: i, qtd: 1, categoria: 'Piscina' }));
    if (viagem.especiais.neve) catalogo.especiais.neve.forEach(i => checklistFinal.push({ nome: i, qtd: 1, categoria: 'Neve' }));

    // Chama a função de UI para trocar de tela e mostrar a lista
    exibirChecklistNaTela(viagem.destino, checklistFinal);
}

/**
 * 5. AUXILIAR: TRAVA DE CHECKBOXES
 * Impede que o usuário selecione mais roupas do que a viagem permite.
 */
function configurarTravaSelecao(classe, limite) {
    const checkboxes = document.querySelectorAll(classe);
    checkboxes.forEach(cb => {
        cb.addEventListener('change', () => {
            const marcados = document.querySelectorAll(`${classe}:checked`).length;
            if (marcados >= limite) {
                checkboxes.forEach(c => { if (!c.checked) c.disabled = true; });
            } else {
                checkboxes.forEach(c => c.disabled = false);
            }
        });
    });
}
