const User = require("../models/user");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const resetPassword = {
  async generateResetToken(req, res, next) {
    try {
      var user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(400)
          .send({ 
            error:{
              name: "EmailValueError",
              message: `Email-Id ${req.body?.email} is not registered` 
            },
            email: req.body?.email
          });
      }
      let lastSendTime = (Date.now() - user.reset.date)/1000
      let resendTime = 60
      if(lastSendTime  < resendTime){
        return res.status(429).send({
          error:{
            name: "ResendError",
            message: `Already password reset link is send to ${user.email}. For resend please wait for ${Number.parseInt(resendTime - lastSendTime + 3)} sec`,
            time: Number.parseInt(resendTime - lastSendTime + 3)
          }
        })
      }
      var {resetToken} = await user.generateResetToken();

      req.resetToken = resetToken
      req.user = user;
      next();
    } catch (e) {
      if (e.name === "ResetAttemptEnd") {
        return res.status(429).send({
          error: {
            message: `${user.email} ${e.message}`,
            name: e.name,
          },
        });
      }
      res.status(500).send();
    }
  },

  async verifyResetToken(req, res, next) {
    try {
      const {resetToken=null} = req.params;
    
      var user = await User.findOne({"reset.token":resetToken})
     
      if(!user){
        let e = new Error("Link not found")
        e.name = "LinkNotFoundError"
        throw e
      }

      try{

        jwt.verify(resetToken, process.env.RESET_TOKEN_SECRET);

      }catch(e){
        // console.log(e)
        user.reset.attempt += 1
        await user.save()
        let err = new Error("Link is expire.")
        err.name = "LinkExpireError"
        throw err
      }
     
      req.user = user;
      next()

    } catch (e) {
      
    
      if(e.name === "LinkNotFoundError"){
        return res.status(404).send({
          error:{
            name: e.name,
            message: e.message
          }
        })
      }

      if(e.name === "LinkExpireError"){
        return res.status(400).send({
          error:{
            name: e.name,
            message: e.message
          }
        })
      }
      
      console.log(e)
      res.status(500).send()

    }
  }
};

module.exports = resetPassword;
