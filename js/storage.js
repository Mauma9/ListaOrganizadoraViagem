/**
 * Salva qualquer dado no LocalStorage do navegador.
 * @param {string} chave - O nome da "gaveta" (ex: 'viagens', 'catalogo')
 * @param {any} dados - O objeto ou array que queremos guardar
 */
 function salvar(chave, dados) {
    // 1. Transformamos o objeto/array em uma String (texto)
    const dadoString = JSON.stringify(dados);

    // 2. Gravamos no navegador usando a chave escolhida
    localStorage.setItem(chave, dadoString);
}

/**
 * Lê os dados do LocalStorage e os transforma de volta em objetos JS.
 * @param {string} chave - O nome da "gaveta" que queremos ler
 * @returns {any} - Retorna os dados originais ou um array vazio se não houver nada.
 */
 function obter(chave) {
    // 1. Buscamos o texto bruto do LocalStorage
    const dadoString = localStorage.getItem(chave);

    // 2. Se o dado existir, transformamos de volta em objeto.
    // 3. Se NÃO existir (null), retornamos um array vazio [] para evitar erros no código.
    return dadoString ? JSON.parse(dadoString) : [];
}
