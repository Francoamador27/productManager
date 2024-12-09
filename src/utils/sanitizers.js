import validator from 'validator';

export const sanitizeEmail = (input) => {
    try {
        if (validator.isEmail(input)) {
            input = input.replace(/<\/?script.*?>/gi, '');
            input = validator.escape(input).trim();
            return input;
        } else {
            throw new Error("Email inválido");
        }
    } catch (e) {
        throw new Error("Error en el email");
    }
};

export const sanitizePassword = (password) => {
    password = password.trim();

    if (password.length < 2 || password.length > 128) {
        throw new Error("Contraseña inválida");
    }
    password = password.replace(/<\/?script.*?>/gi, '');
    return password;
};