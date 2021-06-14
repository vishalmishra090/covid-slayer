export default function getWinner(playerHealth,covidHealth, name){

    
    if(playerHealth === covidHealth){

        return null

    }else if(playerHealth > covidHealth){

       return name.playerName

    }else{

        return name.covidName
    }
}