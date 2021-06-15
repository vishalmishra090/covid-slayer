const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user")

async function auth(req, res, next) {
  try {

    const { httpOnlyToken } = req.cookies;
    const  jsToken  = req.header("Authorization").replace('Bearer ','');

    const dHttpOnlyToken = jwt.verify(httpOnlyToken, process.env.TOKEN_SECRET_1);

    const dJsToken = jwt.verify(jsToken, process.env.TOKEN_SECRET_2);
    
    //  console.log(dHttpOnlyToken)
    //  console.log(dJsToken)

    if(dHttpOnlyToken.jti !== dJsToken.jti) throw new Error("jwtId not match");
    
    if(dJsToken.iat + 5 * 60 * 1000 < Date.now()){
        
        var user = await User.findByIdAndUpdate({_id: dHttpOnlyToken._id},{
            $pull:{tokens: {httpOnlyToken}}
        }, {new: true})

        var token = await user.generateAuthToken(dHttpOnlyToken.rememberMe)

    }else{
       if(dHttpOnlyToken.rememberMe){

        var user = await User.findOne({_id: dHttpOnlyToken._id, 'tokens.httpOnlyToken': httpOnlyToken});
        if(!user) throw new Error("user not find");

       }else{

        var user = await User.findOne({_id: dHttpOnlyToken._id});
        if(!user) throw new Error("user not find");

       }
        var token = null
    }
    
    // Password reset
    if(user.reset.status){
      throw new Error()
    }

    req.token = token;

    if(token){
        const cookieExpire = () => {
            return !dHttpOnlyToken.rememberMe ? { expires: 0 } : { maxAge: 30 * 24 * 3600 * 1000 };
          };
        
          res.cookie("httpOnlyToken", token.httpOnlyToken, {
            httpOnly: true,
            secure: process.env.CLIENT_URI ? true : false,
            sameSite: "None",
            ...cookieExpire(),
          });
    }
    
    await user.save()
    req.user = user;
    next();

  } catch (e) {
 
    res.status(401)
    .clearCookie("httpOnlyToken",{httpOnly: true,secure: process.env.CLIENT_URI ? true : false,
      sameSite: "None",})
    .send()
    // console.log(e);
  }
}

module.exports = auth;


