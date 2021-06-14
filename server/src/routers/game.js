const express = require('express')
const router = express.Router()
const Game = require('../models/game')
const auth = require('../middleware/auth')

router.use(auth)

router.post('/games', auth, async (req, res) => {
    
    try{
       const user = req.user;
       const game = new Game({owner: user._id, ...req.body});
       await game.save()
       res.status(201).send({
           game,
           jsToken: req.token?.jsToken
       })

    }catch(e){
       res.status(400).send(e);
    //    console.log(e)
    }
})

router.get('/games', auth, async (req, res) => {
    
     try{
        
        const user = req.user;
        const {game} = await user.populate({ path: 'game', options: { sort: {_id: -1},limit: 10 }}).execPopulate()
        
        if(!game){
            throw new Error("Game not available")
        }
        
        res.status(200).send({
            game,
            jsToken: req.token?.jsToken
        });

     }catch(e){
        res.status(401).send({
            
        });
        // console.log(e)
     }
})


module.exports = router;
