const authorizeRole = (requiredRole) => (req, res, next) => {
    const { role } = req.user;
  
    if (role !== requiredRole) {
      return res.status(403).json({ message: 'Acceso denegado: permiso insuficiente' });
    }
  
    next();
  };
  
  module.exports = authorizeRole;
  