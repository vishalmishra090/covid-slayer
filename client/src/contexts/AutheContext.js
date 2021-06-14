import React from "react"
import {useAutheProvider} from "../hooks/authe"


const AutheContext = React.createContext();


export let AutheProvider = ({children}) => {
   let authe = useAutheProvider();

   return(
       <AutheContext.Provider value={authe}>
         {children}
       </AutheContext.Provider>
   )
}

export let AutheConsumer = AutheContext.Consumer

export default AutheContext;



