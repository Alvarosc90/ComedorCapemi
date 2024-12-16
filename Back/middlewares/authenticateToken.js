//authenticateToken
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'clave_super_secreta';

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }

    req.user = user; // Guardar los datos del token en req.user
    next();
  });
};

module.exports = authenticateToken;
