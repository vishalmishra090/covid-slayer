export let createCommentaryList = (list) =>{
   return list.map(({player,covid}) => {
       return `${player.playerName} ${player.actionName} with ${player.actionValue} and ${covid.covidName} ${covid.actionName} with ${covid.actionValue}`
   })
}