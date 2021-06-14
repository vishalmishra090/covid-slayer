export function setData(key,value,storage="l"){
    if(typeof value === "object"){
        value = JSON.stringify(value)
    }
    storage === "l" ? 
    localStorage.setItem(key,value) :
    sessionStorage.setItem(key,value);
   
}

export function getData(key,valueType,storage="l"){

    if(valueType === "object"){
     let value =  storage === "l" ? 
     localStorage.getItem(key) : 
     sessionStorage.getItem(key);
     return JSON.parse(value)
    }

    return localStorage.getItem(key)
}

export function removeData(key,storage="l"){
    storage==="l" ? 
    localStorage.removeItem(key) : 
    sessionStorage.removeItem(key)
}

export function removeAllData(storage="l"){
    storage==="l" ? 
    localStorage.clear() :
    sessionStorage.clear();
}

let db = {
    setData,
    getData,
    removeData,
    removeAllData
}

export default db