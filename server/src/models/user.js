const { Schema, model } = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {v4: uuid} = require('uuid')
const validator = require('validator');
const msToTime = require('../../utils/msToTime')
const Game = require('./game')
require("dotenv").config();

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
          throw new Error('Email is invalid')
      }
  }
  },
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 1,
    trim: true,
    validate(value) {
      if(!/^[\w\d]+$/gi.test(value)){
        throw new Error('can only contain a-z, A-Z and 0-9')
      }
    }
  },
  password: {
    type: String,
    required: true,
    minLength: 8,
  },

  tokens: [
    {
      httpOnlyToken: {
        type: String,
        required: true,
      },
    },
  ],

  reset:{
    token:{
      type:String,
      default: ""
    },
    attempt:{
      type: Number,
      default: 0
    },
    date:{
      type: Date,
      default: new Date(0)
    },
    emailSendCount:{
      type: Number,
      default: 0
    },
    status:{
      type: Boolean,
      default: false
    }
  }
});

// Virtual Field

userSchema.virtual("game",{
   ref: 'Game',
   localField: '_id',
   foreignField: 'owner'
})

// Function on documents
userSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password, 
  delete userObject.tokens,
  delete userObject.__v;
  delete userObject.reset;

  return userObject;
};

userSchema.methods.generateAuthToken = async function (rememberMe = false) {
  const user = this;
  const jti = uuid(); 

  const httpOnlyToken = jwt.sign(
    { _id: user._id.toString(), rememberMe, jti },
    process.env.TOKEN_SECRET_1,
    { expiresIn: rememberMe ? "28d" : "12h"}
  );

  const jsToken = jwt.sign(
    { _id: user._id.toString(), username: user.username, iat: Date.now(), jti },
    process.env.TOKEN_SECRET_2
  );

  const token = {
    httpOnlyToken,
    jsToken,
  };
  if(rememberMe){
    user.tokens = [...user.tokens, { httpOnlyToken }];
    
     await user.save();
  }
       
  return token;
};

userSchema.methods.generateResetToken = async function(){
  const user = this;

  let attemptEndTime = Date.now() - new Date(user.reset.date);
  let attemptEndRevokeTime = 6*3600*1000

  if((user.reset.attempt > 4 || user.reset.emailSendCount > 4) && attemptEndTime < attemptEndRevokeTime){
      let e = new Error(`reach at maximum attempt, try after ${msToTime(attemptEndRevokeTime - attemptEndTime)}`)
      e.name = "ResetAttemptEnd"
      throw e
  }

  if((user.reset.attempt > 4 || user.reset.emailSendCount > 4) && attemptEndTime > attemptEndRevokeTime){
    user.reset = {
      ...user.reset,
      token: "",
      attempt:0,
      date: Date.now(),
      emailSendCount: 0,
    }
  }

  const resetToken = jwt.sign({sub: "reset"},process.env.RESET_TOKEN_SECRET,{
    expiresIn:"30m"
  })
  user.reset = {
    ...user.reset,
    token: resetToken,
    date: Date.now()
  }
  await user.save()

  return {
    resetToken,
  }

}
// Function on collection
userSchema.statics.findByCredentials = async function ({ username, password }) {
  const user = await User.findOne({ username });

  if (!user) {
    throw new Error("Username or password incorrect");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new Error("Username or password incorrect");
  }

  return user;
};

// Middleware on documents
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

userSchema.post("findOneAndDelete", async function() {
     const query = this
     let {deletedCount} = await Game.deleteMany({owner: query.getFilter()._id})
    //  console.log(deletedCount)
    
})

const User = model("User", userSchema);


// const newUser = new User({
//     name: "test",
//     email: "test@test.com",
//     username: "test090",
//     password: "test0",
//     tokens: [{
//         httpOnlyToken: "123456789"
//     },{
//         httpOnlyToken: "987654321"
//     }]
// })

// async function run(){
//     let res = await User.findByIdAndDelete({_id: <id>})
//     console.log(res)
// }

// run();



module.exports = User;
