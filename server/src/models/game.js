const { Schema, model } = require("mongoose");


const gameSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },

  winner: {
    type: String,
    required: true,
    minLength: 1,
    trim: true,
  },

  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
});

// Middleware

gameSchema.pre('save', async function(next){
    const newGame = this
    const count = await Game.find({owner: newGame.owner}).countDocuments();
    
    if(count === 10){
        await Game.deleteOne({owner: newGame.owner}).sort({_id: 1})
    }

    next();
})

const Game = model("Game", gameSchema);

module.exports = Game;
