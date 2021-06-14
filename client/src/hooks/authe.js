import {useState,useContext,useEffect} from "react"
import {setData,getData,removeData} from "../db/db.js"
import AutheContext from "../contexts/AutheContext"

function useAutheProvider(){
    let [login, setLogin] = useState(false);

    if(getData("jsToken") && (login === false)){
        setLogin(true)
    }

    if(!getData("jsToken") && (login === true)){
        setLogin(false)
    }

    function setAuthe(jsToken){
        setData("jsToken",jsToken)
        setLogin(true);
    }

    function getAuthe(){
        return "Bearer " + getData("jsToken");
    }

    function removeAuthe(){
        removeData("jsToken");
        setLogin(false);
    }

    useEffect(() =>{
       function checkLocalStorage(e){
          console.log("here");
          if(!getData("jsToken")){
              window.history.pushState(null,null,"/login");
              window.location.reload();
          }
            
          window.removeEventListener("storage", checkLocalStorage);
       }
       
       if(login === true)
            window.addEventListener("storage", checkLocalStorage)
    },[login])
    
    return {login,setAuthe,getAuthe,removeAuthe}
}

function useAuthe() {
   return useContext(AutheContext);
}

export {
    useAutheProvider,
    useAuthe
} 