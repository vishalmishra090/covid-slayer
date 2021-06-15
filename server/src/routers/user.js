const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const resetPassword = require("../middleware/resetPassword")
const sendResetMail = require("../email/sendResetMail")
require('dotenv').config()

const jwt = require('jsonwebtoken');

// router.use((req, res, next) => {
// console.log(req.headers['x-forwarded-host'])
//    next()
// })

router.post("/users", async (req, res) => {
  try {
    const { rememberMe = false, ...rest } = req.body;
    const user = new User(rest);
    const token = await user.generateAuthToken(rememberMe);

    await user.save();

    const cookieExpire = () => {
      return !rememberMe ? { expires: 0 } : { maxAge: 30 * 24 * 3600 * 1000 };
    };

    res.cookie("httpOnlyToken", token.httpOnlyToken, {
      httpOnly: true,
      secure: process.env.CLIENT_URI ? true : false,
      sameSite: process.env.CLIENT_URI ? "None" : "",
      ...cookieExpire(),
    });
    res.status(201).send({
      user,
      jsToken: token.jsToken,
    });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const { rememberMe=false, ...rest } = req.body;
    const user = await User.findByCredentials(rest);

    if (!user) {
      throw new Error("Username or password is incorrect");
    }
    user.reset = {
      ...user.reset,
      token: 0,
      attempt: 0,
      date: new Date(0),
      emailSendCount: 0,
      status: false
    }
    await user.save()
    const token = await user.generateAuthToken(rememberMe);
   
    const cookieExpire = () => {
      return !rememberMe ? { expires: 0 } : { maxAge: 30 * 24 * 3600 * 1000 };
    };
    
    res.cookie("httpOnlyToken", token.httpOnlyToken, {
      httpOnly: true,
      secure: process.env.CLIENT_URI ? true : false,
      sameSite: process.env.CLIENT_URI ? "None" : "",
      ...cookieExpire(),
    });
    res.status(200).send({
      user,
      jsToken: token.jsToken,
    });
  } catch (e) {
    
    res.status(400).send(e);
    // console.log(e)
  }
});

router.post("/users/logout", auth, async (req, res) => {
    try{
        const { httpOnlyToken } = req.cookies;
        const dHttpOnlyToken = jwt.verify(httpOnlyToken, process.env.TOKEN_SECRET_1);
        await User.findByIdAndUpdate({_id: dHttpOnlyToken._id},{
            $pull:{tokens: {httpOnlyToken}}
        }, {new: true})

        res.cookie("httpOnlyToken", null, {
            httpOnly: true,
            secure: process.env.CLIENT_URI ? true : false,
            sameSite: process.env.CLIENT_URI ? "None" : "",
          });
        res.status(200).send()
    }catch(e){
        res.status(500).send()
        // console.log(e)
    }
    
})

router.post("/users/logout-all", auth, async (req, res) => {
    try{
        const user = req.user;
        user.tokens = [];
        user.reset = {   // this code invalidate all session httpOnlyToken
          ...user.reset,
          status: true
        }
        await user.save();
        res.clearCookie("httpOnlyToken",{
            httpOnly: true,
            secure: process.env.CLIENT_URI ? true : false,
            sameSite: process.env.CLIENT_URI ? "None" : "",
          });
        res.status(200).send()
    }catch(e){
        res.status(500).send()
        // console.log(e)
    }
})

router.get("/users/:username", auth, async (req, res) => {
  try {
    const username = req.params.username;

    if (username !== req.user.username) throw new Error("username not valid");
    
    res.status(200).send({
        user: req.user,
        jsToken: req.token?.jsToken
    });
  } catch (e) {
    res.status(401).send();
    // console.log(e);
  }
});

router.patch("/users", auth, async (req, res) => {
     try{
       const user = req.user
       const allowedUpdate = ["name","email","username"]
       const update = {...req.body}
       for(key in update){
          if(!allowedUpdate.includes(key))
              throw new Error(`Update for "${key}" not allowed`)
          
          user[key] = update[key]
       }
       await user.save()
       res.status(200).send({
         user,
         jsToken: req.token?.jsToken
       })
     }catch(e){
      res.status(406).send(e)
      //  console.log(e)
     }
})

router.delete("/users", auth, async (req, res) => {  
     try{
        const user = req.user
        await User.findByIdAndDelete({_id: user._id})
        res.status(200)
        .clearCookie("httpOnlyToken",{
          httpOnly: true,
          secure: process.env.CLIENT_URI ? true : false,
          sameSite: process.env.CLIENT_URI ? "None" : "",
        })
        .send({
          message: `Account '${user.email}' deleted successfully`
        })
     }catch(e){
      //  console.log(e)
       res.status(500).send()
     }
})

router.post("/users/forgot", resetPassword.generateResetToken, async (req, res) => {
  try{
    const user = req.user
      
      await sendResetMail(req.resetToken, user.email, req.headers['x-forwarded-host'])
      
      user.reset.emailSendCount += 1 
      await user.save()

      res.status(200)   
      .clearCookie("httpOnlyToken",{httpOnly: true,secure: process.env.CLIENT_URI ? true : false,
        sameSite: process.env.CLIENT_URI ? "None" : "",})
      .send({
        message: `A Password reset Link is send to ${user.email}`,
        email: user.email,
      })
    
  }catch(e){
    // console.log(e)
    res.status(500).send()
  }
})


router.get("/users/reset/:resetToken", resetPassword.verifyResetToken, async (req, res) => {
  
  try{
    const user = req.user
    if(!user){
      throw new Error()
    }
    
    res.status(200).send({
      message: "Reset link verified successfully"
    })
  }catch(e){
    // console.log(e)
    res.status(500).send()
  }
})

router.post("/users/reset/:resetToken", resetPassword.verifyResetToken, async (req, res) => {
    
     try{
       const user = req.user
       if(!user) throw new Error()

       const {newPassword=null} = req.body
       user.password = newPassword
       user.tokens = []
       user.reset = {
         token: 0,
         attempt: 0,
         date: new Date(0),
         emailSendCount: 0,
         status: true
       }
       await user.save()
       res.status(205)
       .clearCookie("httpOnlyToken",{httpOnly: true,secure: process.env.CLIENT_URI ? true : false,
        sameSite: process.env.CLIENT_URI ? "None" : "",})
       .send({
         message: `Password change successfully for ${user.email}`
       })
     }catch(e){
        if(e.name === "ValidationError"){
          return res.status(400).send({
            error: {
              name: e.name,
              message: "Password is not valid"
            }
          })
        }

        res.status(500).send()
     }

})


module.exports = router;
