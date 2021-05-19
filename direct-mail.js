async function searchAsync(text) {
    const url = `https://www.google.com/search?q=${text}&sxsrf=ALeKk02A8YgmBIVtBGCgSpbo3wnRx7ZmzQ%3A1621378258905&source=hp&ei=0kSkYM7pNIir5OUPgeK9EA&iflsig=AINFCbYAAAAAYKRS4iS8pteKuKfQP9U99xafc2h9Q4my&oq=&gs_lcp=Cgdnd3Mtd2l6EAMYADIHCCMQ6gIQJzIHCCMQ6gIQJzIHCCMQ6gIQJzIHCCMQ6gIQJzIHCCMQ6gIQJzIHCCMQ6gIQJzIHCCMQ6gIQJzIJCCMQ6gIQJxATMgcIIxDqAhAnMgcIIxDqAhAnUABYAGCcwQFoAXAAeACAAQCIAQCSAQCYAQCqAQdnd3Mtd2l6sAEK&sclient=gws-wiz`;
    const response = await fetch(url);
    const html = await response.text();
    return html;
}

function removeHtmlTags(html) {
    return html.replace(/<[^>]*>/g, '');
}

function extractEmails(content) {
    return content.match(/\w{3,}@\w{3,}\.com(\.br{2}|)/g);
}

function extractPhones(content) {
    return content.match(/((?<=\+55)\d{10,11}|\(\d{2}\)\s*(9-?\d{4}|\d{4,5})-?\d{4})/g);
}

function getSurnames() {
    return [
        "souza",
        "ferreira",
        "silva",
        "oliveira",
        "matos",
        "gomes",
    ];
}

function getEmailProviders() {
    return [
        "gmail.com",
        "hotmail.com",
        "ymail.com",
        "bol.com.br",
        "uol.com.br"
    ];
}

function getRandomItem(list) {
    const randomIndex =
        Math.floor(Math.random() * list.length);
    return list[randomIndex];
}

function getSurname() {
    return getRandomItem(getSurnames());
}

function getEmailProvider() {
    return getRandomItem(getEmailProviders());
}

async function getEmails(total = 10) {
    const surname = getSurname();
    const emailProvider = getEmailProvider();
    const searchTerm = `${surname} ${emailProvider}`;
    const html = await searchAsync(searchTerm);
    const text = removeHtmlTags(html);
    const emails = extractEmails(text);
    const sanitizedEmails = emails
        .map(email => email.toLowerCase())
        .filter((element, index, array) =>
            array.indexOf(element) === index)
        .sort();

    return sanitizedEmails;
}

async function getPhones(total = 10) {
    const surname = getSurname();
    const searchTerm = `${surname} telefone`;
    const html = await searchAsync(searchTerm);
    const text = removeHtmlTags(html);
    const phones = extractPhones(text);
    const sanitizedPhones = phones
        .filter((element, index, array) =>
            array.indexOf(element) === index)
        .sort();

    return sanitizedPhones;
}