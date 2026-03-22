
// 2. Aguardamos o HTML carregar completamente antes de rodar o JS
document.addEventListener('DOMContentLoaded', () => {

    console.log("Sistema Planner de Mala carregado!");

    // --- CONFIGURAÇÃO DE ESSENCIAIS ---

    configurarClick('btnAdicionarEssencial', adicionarEssencial);

    configurarEnter('inputNovoEssencial', adicionarEssencial);

    // --- CONFIGURAÇÃO DE Looks ---
    configurarClick('btnAdicionarLook', adicionarLooks);

    configurarEnter('inputNovoLook', adicionarLooks);

    // --- CONFIGURAÇÃO DE Looks de Trabalho ---
    configurarClick('btnAdicionarLookTrabalho', adicionarLooksTrabalho);

    configurarEnter('inputNovoLookTrabalho', adicionarLooksTrabalho);

    // --- CONFIGURAÇÃO DE Looks ---
    configurarClick('btnAdicionarNecessaire', adicionarItemNecessaire);

    configurarEnter('inputNovoItemNecessaire', adicionarItemNecessaire);

    // --- CONFIGURAÇÂO de Itens por Temperatura
    // Para as temperaturas, como tem parâmetro, usamos uma função anônima
    configurarClick('btnAdicionarCalor', () => adicionarItemTemp('calor'));

    configurarEnter('inputCalor', () => adicionarItemTemp('calor'));

    configurarClick('btnAdicionarNormal', () => adicionarItemTemp('normal'));

    configurarEnter('inputNormal', () => adicionarItemTemp('normal'));

    configurarClick('btnAdicionarFrio', () => adicionarItemTemp('frio'));

    configurarEnter('inputFrio', () => adicionarItemTemp('frio'));

    // --- CONFIGURAÇÂO de Itens Especiais ---
    configurarClick('btnAdicionarTrilha', () => adicionarItemEspecial('trilha'));

    configurarEnter('inputTrilha', () => adicionarItemEspecial('trilha'));

    configurarClick('btnAdicionarPiscina', () => adicionarItemEspecial('piscina'));

    configurarEnter('inputPiscina', () => adicionarItemEspecial('piscina'));

    configurarClick('btnAdicionarNeve', () => adicionarItemEspecial('neve'));

    configurarEnter('inputNeve', () => adicionarItemEspecial('neve'));

    // --- CONFIGURAÇÃO DE VIAGENS ---
    configurarClick('btnSalvarViagem', salvarNovaViagem);

    // --- CONFIGURAÇÃO DA UI ---
    configurarClick('btnVoltar', voltarParaViagens);

    // E no final de tudo, chame a função para mostrar tudo o que já estava salvo:
    renderizarTudo();
});


// Função auxiliar para evitar repetição: configuração da tecla enter
function configurarEnter(idInput, acao) {
    const input = document.getElementById(idInput);
    if (input) {
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') acao();
        });
    }
}

// Função auxiliar para evitar repetição: coniguração do click
function configurarClick(idInput, acao){
    const input = document.getElementById(idInput);
    if (input) {
        input.addEventListener('click', () => {
            acao();
        });
    }
}
