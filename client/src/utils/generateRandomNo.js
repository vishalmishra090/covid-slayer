let generateRandomNo = (min,max) => {
    try{
        if(min < max){
          return Math.floor(Math.random() * (max-min+1) + min)
        }else{
            throw Error
        }
    }catch{
        console.log("Must be min > max")
    }
}

generateRandomNo(2,5)

export default generateRandomNo