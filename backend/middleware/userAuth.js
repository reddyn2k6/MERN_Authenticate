import jwt from 'jsonwebtoken';

const userAuth=async(req ,res,next)=>{
    const {token}=req.cookies;

    if(!token) return res.json({success:false, msg:'Not authorized Login Again'});


    try{
    const tokenDecode=jwt.verify(token, process.env.JWT_SECRET);
 
   if(tokenDecode.id) {
    if (!req.body) req.body = {};
    req.body.userId=tokenDecode.id;
   }
   else {
    return res.json({success:false, msg:'Not authorized Login Again'});
   }
  next();
    }
    catch(err){
        res.json({success:false,msg:err.message});
    }
}

export default userAuth;