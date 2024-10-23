export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export const getInitials = (name) => {
    if (!name) return '';
    const words = name.split(' ');
    let initials = '';

    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i][0];
    }

    return initials.toUpperCase();
}

export const firstAndLastName = (name) => {
    // Dividimos o nome completo em um array de palavras (nomes)
    const nameParts = name.trim().split(' ');

    // Se o nome tiver mais de uma palavra, retornamos o primeiro e o segundo nome
    if (nameParts.length > 1) {
        return `${nameParts[0]} ${nameParts[1]}`;
    }

    // Se o nome tiver apenas uma palavra, retornamos essa palavra
    return nameParts[0];
}

export const stringToDate = (dateString) => {
    const [day, month, year] = dateString.split('/').map(Number);
    return new Date(year, month - 1, day);
}

export const dateToString = (isoString) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Janeiro é 0
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
}

export const severityToPT = (severity) => {
    switch (severity) {
        case 'neutral':
            return 'Neutra';
            break;
        case 'mild':
            return 'Leve';
            break;
        case 'modarate':
            return 'Moderada';
            break;
        case 'serious':
            return 'Grave';
            break;
        case 'critical':
            return 'Gravíssima';
            break;
    }
}

export const typeToPT = (type) => {
    switch (type) {
        case 'behavior':
            return 'Comportamento';
            break;
        case 'health':
            return 'Saúde';
            break;
        default:
            return 'Outro';
    }
}