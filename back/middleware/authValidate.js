import jwt from "jsonwebtoken";

export function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token" });

  const token = header.split(" ")[1];

  try {
    const userData = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = userData;  
    next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
}
