const RECAPTCHA_SECRET_KEY = '6LcwvjcqAAAAAPp5A5KoUYeZ6qSVZW7aEqX_byVi'; 

export const validateRecaptcha = async (req, res, next) => {
  const recaptchaToken = req.body.token;

  try {
    const response = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`, {
      method: 'POST'
    });

    const data = await response.json();
    console.log(data, 'response captcha');

    if (!data.success) {
      return res.status(400).json({ message: 'RECAPTCHA validation failed.' });
    }

    // Si la validación es exitosa, continúa con la solicitud
    next();
  } catch (error) {
    console.error('Error al verificar reCAPTCHA:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
