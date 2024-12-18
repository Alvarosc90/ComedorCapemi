// middlewares/authorizeRole.js
const authorizeRole = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return res.status(403).json({ message: 'Acceso denegado. No tienes permisos suficientes.' });
    }
    next();
  };
};

module.exports = authorizeRole;
