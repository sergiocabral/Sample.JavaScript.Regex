async function search(text, page = 1) {
    const pageStart = (page - 1) * 10;
    const url = `https://www.google.com/search?q=${text}&source=hp&ei=ClmbYLLqGMHO1sQPmPm14Ac&iflsig=AINFCbYAAAAAYJtnGs4foT4Nc_xEKXNmsf5L3dINztNy&oq=${text}&gs_lcp=Cgdnd3Mtd2l6EAMyAggAMgIIADICCAAyAggAMgIIADICCAAyAggAMgIIADICCAAyAggAOgsIABCLAxCoAxDSAzoRCC4QxwEQrwEQiwMQqAMQpgM6AgguUPMrWJo_YPxFaAFwAHgAgAGuAYgBjQqSAQM1LjeYAQCgAQGqAQdnd3Mtd2l6sAEAuAEC&sclient=gws-wiz&ved=0ahUKEwiyl5zbpsPwAhVBp5UCHZh8DXwQ4dUDCAg&uact=5&start=${pageStart}`;
    const response = await fetch(url);
    const content = await response.text();
    return content;
}

async function getEmails(total = 50) {

    const surnames = ['cabral', 'pereira', 'fernandes', 'pessanha', 'peçanha']
    const emailProviders = ['hotmail.com', 'gmail.com', 'ymail.com', 'bol.com.br', 'uol.com.br']

    const surnameRandomIndex = Math.floor(Math.random() * surnames.length);
    const surname = surnames[surnameRandomIndex];

    const emailProviderRandomIndex = Math.floor(Math.random() * emailProviders.length);
    const emailProvider = emailProviders[emailProviderRandomIndex];

    const regexHtmlTags = /<[^>]*>/g;
    const regexEmail = /\w{3,}@\w{3,}\.com(\.br|)/g;

    let result = [];
    let page = 0;
    while (result.length < total) {
        const html = await search(`${surname} "${emailProvider}"`, ++page);
        const text = html.replace(regexHtmlTags, '');
        const emails = text.match(regexEmail) ?? [];
        const emailsSanitized = emails.map(email => email.toLowerCase().trim());

        result.push(...emailsSanitized);

        result = result.filter(
            (element, index, array) =>
                array.indexOf(element) === index);

        if (page >= 10) {
            console.warn(`Could not found more emails. Page count: ${page}`);
            break;
        }
    }

    return result.slice(0, total);
}

await getEmails(5);
