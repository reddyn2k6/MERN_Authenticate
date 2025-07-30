import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js'
import transporter from '../config/nodemailer.js';

export const register=async(req,res)=>{
       const {name,email,password}=req.body;

    if(!name || !email || !password) {
        return res.status(300).json({success:false,msg:'Details missing'});
    }  

    try{ 
        
        const existingUser= await userModel.findOne({email});
        if(existingUser) return res.json({success:false,msg:"User ALready Exists"});


     const hashedPassword= await bcrypt.hash(password,10);

     const user=new userModel({name,email,password:hashedPassword});

     await user.save();
      
     const token=jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

     res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite: process.env.NODE_ENV==='production'?'none':'strict',
        maxAge: 7*24*60*60*1000,
     });

    const mailOptions={
        from:process.env.SENDER_EMAIL,
        to:email,
        subject:'Welcome to our community',
        text:`Welcome to our community, ${name}. Your account has ben created with ${email}`
    }
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
res.json({success:false,msg:err.message});
  } else {
res.json({success:true,msg:"Sign In Successful"});  }
});

     
    }

    catch(err) {
        res.json({success:false,msg:err.message});
    }
       
}

export const login=async(req,res)=>{
    const {email,password}=req.body;

    if(!email || !password) {
        return res.json({success:false,msg:"Email and passwords are required"});
    }
    try{
        const user = await userModel.findOne({email});

        if(!user) return res.json({success:false,msg:"User doesnot exists"});

        const isMatched=await bcrypt.compare(password,user.password);
        
        if(!isMatched) {
             return res.json({success:false,msg:"Invalid password or email"});
        }

    const token=jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'});

     res.cookie('token',token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite: process.env.NODE_ENV==='production'?'none':'strict',
        maxAge: 7*24*60*60*1000,
     }); 

     return res.json({success:true,msg:"User Logged in succesfully"});
    }
    catch(err) {
        res.json({success:false,msg:"Login Failed"});
    }
}


export const logout=async(req,res)=>{
   try{
       res.clearCookie('token',{
         httpOnly:true,
        secure:process.env.NODE_ENV==='production',
        sameSite: process.env.NODE_ENV==='production'?'none':'strict',
       });
       return res.json({success:true,msg:"Logged Out"});
   }
   catch(err){
            res.json({success:false,msg:err.message});
   }
}


export const sendVerifyOtp=async(req,res)=>{
    try{
       const {userId}=req.body;

      const user=await userModel.findById(userId);

      if(user.isAccountVerified) {
        return res.json({success:false,msg:"Account already verified"});
      }

      const otp= String(Math.floor(100000+ Math.random()*900000)); 
   

      user.verifyOtp=otp;
      user.verifyOtpExpireAt=Date.now()+24*60*60*1000;

      await user.save();

      const mailOptions={
        from:process.env.SENDER_EMAIL,
        to:user.email,
        subject:'Account verification OTP',
        text:`Your OTP is ${otp}. Verify your account using this OTP`,
    }
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
res.json({success:false,msg:err.message});
  } else {
res.json({success:true,msg:info.response});  }
});



    }
    catch(err){
        res.json({success:false,msg:err.message});
    }
}



export const verifyEmail=async(req,res)=>{
    const {userId,otp}=req.body;

    if(!userId || !otp) {
        return res.json({success:false,msg:"Missing Details"});
    }
  try{
 const user=await userModel.findById(userId);

   if(!user ) {
    return res.json({success:false,msg:"User not found"});
   }

   if(user.verifyOtp===' ' || user.verifyOtp!==otp) {
    return res.json({success:false,msg:"Invalid OTP"});
   }

   if(user.verifyOtpExpireAt<Date.now()) {
    return res.json({success:false,msg:"OTP expired"});
   }
 
   user.verifyOtp=' ';
   user.verifyOtpExpireAt=0;
   user.isAccountVerified=true;


   await user.save();




   
   return res.json({success:true,msg:"email verified successfully"});

  }
  catch(err){
res.json({success:false,msg:err.message});
  }
}


export const isAuthenticated=async(req,res)=>{
    try{

        res.json({success:true});

    }
    catch(err) {
        res.json({success:false,msg:err.message});
    }
}


export const sendResetOtp=async(req,res)=>{
    const {email}=req.body;
    if(!email){
        return res.json({success:false,msg:"Missing Details"});
    }
    try{
    const user=await userModel.findOne({email});
if(!user) {
    return res.json({success:false,msg:"User not found"});
}


const otp= String(Math.floor(100000+ Math.random()*900000)); 
   

      user.resetOtp=otp;
      user.resetOtpExpireAt=Date.now()+15*60*60*1000;

      await user.save();

      const mailOptions={
        from:process.env.SENDER_EMAIL,
        to:user.email,
        subject:'Password Reset Otp',
        text:`Your OTP is ${otp}. Reset your password using this OTP`,
    }
transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
res.json({success:false,msg:err.message});
  } else {
res.json({success:true,msg:"Otp sent successfully"});  }
});


    }
    catch(err) {
        return res.json({success:false,msg:err.message});
    }
}


export const resetUserPassword=async(req,res)=>{
    const {email,otp,newpassword}=req.body;
    if(!email||!otp||!newpassword){
        return res.json({success:false,msg:"Missing Details"});
    }
    try{
        const user=await userModel.findOne({email});

   if(!user ) {
    return res.json({success:false,msg:"User not found"});
   }

   if(user.resetOtp===' ' || user.resetOtp!==otp) {
    return res.json({success:false,msg:"Invalid OTP"});
   }

   if(user.resetOtpExpireAt<Date.now()) {
    return res.json({success:false,msg:"OTP expired"});
   }
   
   const hashedPassword=await bcrypt.hash(newpassword,10);

   user.password=hashedPassword;
  user.resetOtp='';
  user.resetOtpExpireAt=0;

await user.save();

return res.json({success:true,msg:"Password Changed"});
    }
    catch(err){
        return res.json({success:false,msg:err.message});
    }
}
