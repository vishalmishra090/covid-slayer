
import genrRndmNo from '../utils/generateRandomNo.js'

let gameAction = {
    attack(){
        return genrRndmNo(1,10)
    },
    heal(){
      return genrRndmNo(1,10)
    },
    blast(){
        return genrRndmNo(10,25)
    },
    giveUp(){
        return true
    }
}

export default gameAction