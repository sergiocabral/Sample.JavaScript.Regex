/**
 * Faz uma busca no google
 * @param {string} text Texto a pesquisar.
 * @param {number} page Número da página
 * @returns {Promise<string>} Código HMTL.
 */
 async function search(text, page = 1) {
    const skip = (page - 1) * 10;
    console.debug(`Pesquisando termo "${text}" na página ${page}, saltando ${skip}.`);
    const url = `https://www.google.com/search?q=${text}&hl=pt-BR&ei=xPudYMtukdLWxA_6lZ3gCw&start=${skip}&sa=N&ved=2ahUKEwjL4I6XqsjwAhURqZUCHfpKB7wQ8NMDegQIARBN&biw=766&bih=799`;
    console.debug(`URL preparada`, url);
    const response = await fetch(url);
    const html = await response.text();
    console.debug(`Conteúdo obtido com ${html.length} bytes.`);
    return html;
}

/**
 * Obtem emails aleatórios do Google
 * @param {number} total Total de emails requeridos.
 * @returns {Promise<string[]>} Emails encontrados.
 */
async function getEmails(total = 10) {
    const surnames = [
        "cabral",
        "pereira",
        "cardoso",
        "ferreira",
        "osvaldo",
        "pessanha",
        "silva"
    ];
    const emailProviders = [
        "gmail.com",
        "hotmail.com",
        "outlook.com",
        "ymail.com",
        "uol.com.br",
        "bol.com.br",
        "terra.com.br"
    ];

    let result = [];

    const maxEmptyPageAllowed = 3;
    let emptyPageCount = 0;

    while (result.length < total && 
           emptyPageCount < maxEmptyPageAllowed) {

        const surnameRandomIndex = 
            Math.floor(Math.random() * surnames.length);
        const emailProviderRandomIndex = 
            Math.floor(Math.random() * emailProviders.length);

        const surname = surnames[surnameRandomIndex];
        const emailProvider = emailProviders[emailProviderRandomIndex];

        const maxRandomStartPage = 3;
        const randomStartPage = Math.floor(Math.random() * maxRandomStartPage) + 1;
        let pageCount = 3;        
        for (let page = randomStartPage; pageCount > 0; pageCount--) {
            const queryTerms = `${surname} @${emailProvider}`;
            const html = await search(queryTerms, page);

            const regexHtmlTags = /<[^>]*>/g;
            const text = html.replace(regexHtmlTags, '');

            const regexEmail = /[a-z]\w{2,}@\w{3,}\.com(\.br|)/gi;
            const emails = text.match(regexEmail) ?? [];

            emails.forEach(email => console.debug(email));

            if (emails.length == 0) {
                emptyPageCount++;
                console.debug(`Sem resultados de email para a pesquisa "${queryTerms}" na página ${page}. EmptyPageCount = ${emptyPageCount}`);
            }
            if (emptyPageCount == maxEmptyPageAllowed) {
                console.warn('Não foi possível obter mais emails.');
                break;
            }

            result.push(...emails);
            result = result
                .filter((value, index, array) => 
                    array.indexOf(value) === index);

            if (result.length >= total) break;
        }
    }

    return result.slice(0, total);
}

//await getEmails(30);