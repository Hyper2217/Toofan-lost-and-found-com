const jwt = require("jsonwebtoken");

module.exports = (req,res,next)=>{
  const token = req.headers.authorization;

  if(!token) return res.json({msg:"No token"});

  try{
    const decoded = jwt.verify(token,process.env.JWT_SECRET);
    req.user = decoded;
    next();
  }catch(err){
    res.json({msg:"Invalid token"});
  }
};
