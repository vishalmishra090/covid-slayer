export default function checkGameOver(playerHealth,covidHealth){
    if(playerHealth === 0 || covidHealth === 0){
        return true
    }

    return false
}