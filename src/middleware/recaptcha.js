const RECAPTCHA_SECRET_KEY = '6LcW9jYqAAAAAMxPeIbTiVMTA9puqwL-AC-PSUcV'; 

export const validateRecaptcha = async (req, res, next) => {
  const recaptchaToken = req.body.token;

  try {
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`, {
      method: 'POST'
    });

    const data = await response.json();
    console.log(data, 'response captcha');

    if (!data.success) {
      return res.status(400).json({ message: 'ReCAPTCHA validation failed.' });
    }

    // Si la validación es exitosa, continúa con la solicitud
    next();
  } catch (error) {
    console.error('Error al verificar reCAPTCHA:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
