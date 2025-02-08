import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const jwtSecret = process.env.JWT_SECRET;
const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extract Bearer token
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
    
  }

  try {
    const decoded = jwt.verify(token, jwtSecret); // Replace with your environment variable
    req.user = decoded; // Attach user data to the request
    next();
  } catch (err) {
    console.error("Token error:", err.message);
    res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

export const roleAuthentication = (roles)=>{
  return (req, res, next) => {
    if(!roles.includes(req.user.role)){
      return res.status(403).json({error: 'Forbidden'})
    }
    next();
  }
}

export default authMiddleware;