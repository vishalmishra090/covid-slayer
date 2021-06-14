import React,{useEffect} from 'react'
import {useUserProvider} from '../hooks/user'
import {useAuthe} from '../hooks/authe'

const UserContext = React.createContext();

export const UserProvider = ({children}) => {
    let {login} = useAuthe()
    let user = useUserProvider()   
    useEffect(() => {
      if(!login){
        user.setUser(null)
      }
    }, [login,user])  
    return(
        <UserContext.Provider value={user}>
          {children}
        </UserContext.Provider>
    )
}

export default UserContext


