import checkGameOver from '../methods/checkGameOver'
import getWinner from '../methods/getWinner'
import ellipsisString from '../utils/ellipsisString'

export default function doActionReducer(state,{type,payload}){

    let newPlayerHealth = null
    let newCovidHealth = null

    if(type === "attack" || type ==="blast"){
        newPlayerHealth = state.playerHealth - payload.covidActionValue;

        newCovidHealth = state.covidHealth - payload.playerActionValue;
        
        (newPlayerHealth < 0) && (newPlayerHealth = 0);
        (newCovidHealth < 0) && (newCovidHealth = 0);
    }
    if(type === "heal"){
        newPlayerHealth = state.playerHealth + payload.playerActionValue - payload.covidActionValue;
        
        newCovidHealth = state.covidHealth;

        (newPlayerHealth < 0) && (newPlayerHealth = 0);
        (newPlayerHealth > 100) && (newPlayerHealth = 100);
    }
    
    switch(type) {
        case "attack":
        case "blast": 
              return {
                  ...state,
                  playerHealth: newPlayerHealth,
                  covidHealth:newCovidHealth,
                  win: checkGameOver(newPlayerHealth,newCovidHealth),
                  winner: getWinner(newPlayerHealth,newCovidHealth, {...state.name}),
                  actionList: modifyActionList([...state.actionList],payload,{...state.name})
              }
        case "heal":
            return {
                ...state,
                playerHealth: newPlayerHealth,
                covidHealth: newCovidHealth,
                win: checkGameOver(newPlayerHealth,newCovidHealth),
                winner: getWinner(newPlayerHealth,newCovidHealth,{...state.name}),
                actionList: modifyActionList([...state.actionList],payload,{...state.name})
            }
        
        case "giveup": 
           return {
              ...payload
            }

        case "name":
            return {
                ...state,
                name: {...payload}
            }

        default:
           return state
    }

}

function modifyActionList(currentList,payload,name){

     return [
        ...currentList,
        {
          player: {
              actionName: payload.actionName,
              actionValue:payload.playerActionValue ,
              playerName: ellipsisString(name.playerName,0,13)
          },
          covid: {
              actionName: payload.actionName === "heal" ? "attack" : payload.actionName,
              actionValue: payload.covidActionValue ,
              covidName: ellipsisString(name.covidName,0,13)
          }
      }
    ]
}
