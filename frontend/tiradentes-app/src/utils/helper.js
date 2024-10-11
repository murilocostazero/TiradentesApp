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