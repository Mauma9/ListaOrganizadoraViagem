// 2. Chave única para o catálogo no LocalStorage
const CHAVE_CATALOGO = 'planner_catalogo';

// 3. Buscamos o que já existe salvo ou começamos um catálogo do zero
// Estrutura: { essenciais: [], looks: [], looksTrabalho: [], necessaire: [], temperaturas: {} }
let catalogo = obter(CHAVE_CATALOGO);

// Se o catálogo estiver vazio (primeira vez), vamos inicializar a estrutura
if (Array.isArray(catalogo) && catalogo.length === 0) {
    catalogo = {
        essenciais: [],
        looks: [],
        looksTrabalho: [],
        necessaire: [],
        temperaturas: { calor: [], normal: [], frio: [],},
        especiais: {trilha: [], piscina: [], neve: []}
    };
}

/**
 * Adiciona um item na lista de Essenciais Diários
 */
 function adicionarEssencial() {
    const input = document.getElementById('inputNovoEssencial');
    const valor = input.value.trim(); // .trim() remove espaços inúteis antes/depois

    if (valor === "") {
        alert("Digite o nome de um item!");
        return;
    }

    // Adicionamos ao array de essenciais dentro do objeto catalogo
    catalogo.essenciais.push(valor);

    // Salvamos o objeto inteiro atualizado no LocalStorage
    salvar(CHAVE_CATALOGO, catalogo);

    // Limpamos o campo para a próxima digitação
    input.value = "";

    // Chamamos a função que atualiza a lista na tela (vamos criá-la abaixo)
    renderizarListaEssenciais();
}

/**
 * Cria o HTML para mostrar os itens cadastrados no modal
 */
 function renderizarListaEssenciais() {
    const listaUI = document.getElementById('listaEssenciaisConfig');

    // Limpamos a lista antes de desenhar para não duplicar itens antigos
    listaUI.innerHTML = "";

    catalogo.essenciais.forEach((item, index) => {
        // Criamos um elemento de lista (li) do Bootstrap
        const li = document.createElement('li');
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
        ${item}
        <button class="btn btn-sm btn-danger" onclick="removerEssencial(${index})">
        <i class="fas fa-trash"></i>
        </button>
        `;
        listaUI.appendChild(li);
    });
}

function removerEssencial(index) {
    // 1. Remove 1 item do array 'catalogo.essenciais' na posição 'index'
    catalogo.essenciais.splice(index, 1);

    // 2. Salva o catálogo atualizado (sem o item) no LocalStorage
    salvar(CHAVE_CATALOGO, catalogo);

    // 3. Manda o JS "desenhar" a lista de novo para refletir a exclusão
    renderizarListaEssenciais();
}

function adicionarLooks(){
    const input =  document.getElementById('inputNovoLook');
    const valor = input.value.trim();

    if (valor === "") {
        alert("Digite o nome de um item!");
        return;}

    catalogo.looks.push(valor);
    input.value = "";

    salvar(CHAVE_CATALOGO, catalogo);

    renderizarListaLooks();
}

function renderizarListaLooks(){
    const listaUI = document.getElementById('listaLooksGerados');
    listaUI.innerHTML = "";
    catalogo.looks.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
        ${item}
        <button class="btn btn-sm btn-danger" onclick="removerLooks(${index})">
        <i class="fas fa-trash"></i>
        </button>
        `;
        listaUI.appendChild(li);
    });
}

function removerLooks(index){
    catalogo.looks.splice(index, 1);
    salvar(CHAVE_CATALOGO, catalogo);
    renderizarListaLooks();
}

function adicionarLooksTrabalho(){
    const input =  document.getElementById('inputNovoLookTrabalho');
    const valor = input.value.trim();

    if (valor === "") {
        alert("Digite o nome de um item!");
        return;}

        catalogo.looksTrabalho.push(valor);
        input.value = "";

        salvar(CHAVE_CATALOGO, catalogo);

        renderizarListaLooksTrabalho();
}

function renderizarListaLooksTrabalho(){
    const listaUI = document.getElementById('listaLooksTrabalho');
    listaUI.innerHTML = "";
    catalogo.looksTrabalho.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
        ${item}
        <button class="btn btn-sm btn-danger" onclick="removerLooksTrabalho(${index})">
        <i class="fas fa-trash"></i>
        </button>
        `;
        listaUI.appendChild(li);
    });
}

function removerLooksTrabalho(index){
    catalogo.looksTrabalho.splice(index, 1);
    salvar(CHAVE_CATALOGO, catalogo);
    renderizarListaLooksTrabalho();
}

function adicionarItemNecessaire(){
    const input =  document.getElementById('inputNovoItemNecessaire');
    const valor = input.value.trim();

    if (valor === "") {
        alert("Digite o nome de um item!");
        return;}

        catalogo.necessaire.push(valor);
        input.value = "";

        salvar(CHAVE_CATALOGO, catalogo);

        renderizarListaNecessaire();
}

function renderizarListaNecessaire(){
    const listaUI = document.getElementById('listaNecessaireConfig');
    listaUI.innerHTML = "";
    catalogo.necessaire.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
        ${item}
        <button class="btn btn-sm btn-danger" onclick="removerItemNecessaire(${index})">
        <i class="fas fa-trash"></i>
        </button>
        `;
        listaUI.appendChild(li);
    });
}

function removerItemNecessaire(index){
    catalogo.necessaire.splice(index, 1);
    salvar(CHAVE_CATALOGO, catalogo);
    renderizarListaNecessaire();
}

/**
 * Adiciona itens baseados na temperatura selecionada
 */
function adicionarItemTemp(tipo) {
    // Definimos qual input ler baseado no tipo (calor, normal, frio)
    const idInput = 'input' + tipo.charAt(0).toUpperCase() + tipo.slice(1);
    const input = document.getElementById(idInput);
    const valor = input.value.trim();

    if (valor === "") {
        alert("Digite um item!");
        return;
    }

    // Adiciona na sub-pasta correta: catalogo.temperaturas['calor'], etc.
    catalogo.temperaturas[tipo].push(valor);

    salvar(CHAVE_CATALOGO, catalogo);
    input.value = "";
    renderizarListaTemp(tipo);
}

function renderizarListaTemp(tipo) {
    // Monta o ID da lista: listaCalor, listaNormal ou listaFrio
    const idLista = 'lista' + tipo.charAt(0).toUpperCase() + tipo.slice(1);
    const listaUI = document.getElementById(idLista);

    listaUI.innerHTML = "";

    catalogo.temperaturas[tipo].forEach((item, index) => {
        const li = document.createElement('li');
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
        ${item}
        <button class="btn btn-sm text-danger" onclick="removerItemTemp('${tipo}', ${index})">
        <i class="fas fa-trash"></i>
        </button>
        `;
        listaUI.appendChild(li);
    });
}

function removerItemTemp(tipo, index) {
    catalogo.temperaturas[tipo].splice(index, 1);
    salvar(CHAVE_CATALOGO, catalogo);
    renderizarListaTemp(tipo);
}

//
function adicionarItemEspecial(tipo) {
    // Definimos qual input ler baseado no tipo (Trilha, Piscina, Neve)
    const idInput = 'input' + tipo.charAt(0).toUpperCase() + tipo.slice(1);
    const input = document.getElementById(idInput);
    const valor = input.value.trim();

    if (valor === "") {
        alert("Digite um item!");
        return;
    }

    // Adiciona na sub-pasta correta: catalogo.temperaturas['calor'], etc.
    catalogo.especiais[tipo].push(valor);

    salvar(CHAVE_CATALOGO, catalogo);
    input.value = "";
    renderizarListaEspeciais(tipo);
}

function renderizarListaEspeciais(tipo) {
    // Monta o ID da lista: listaCalor, listaNormal ou listaFrio
    const idLista = 'lista' + tipo.charAt(0).toUpperCase() + tipo.slice(1);
    const listaUI = document.getElementById(idLista);

    listaUI.innerHTML = "";

    catalogo.especiais[tipo].forEach((item, index) => {
        const li = document.createElement('li');
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
        ${item}
        <button class="btn btn-sm text-danger" onclick="removerItemEspecial('${tipo}', ${index})">
        <i class="fas fa-trash"></i>
        </button>
        `;
        listaUI.appendChild(li);
    });
}

function removerItemEspecial(tipo, index) {
    catalogo.especiais[tipo].splice(index, 1);
    salvar(CHAVE_CATALOGO, catalogo);
    renderizarListaEspeciais(tipo);
}

// Inicialização: Renderiza tudo ao carregar a página pela primeira vez
function renderizarTudo() {
    renderizarListaEssenciais();
    renderizarListaLooks();
    renderizarListaLooksTrabalho();
    renderizarListaNecessaire();
    renderizarListaTemp('calor');
    renderizarListaTemp('normal');
    renderizarListaTemp('frio');
    renderizarListaEspeciais('trilha');
    renderizarListaEspeciais('piscina');
    renderizarListaEspeciais('neve');
    renderizarTabelaViagens();
}
