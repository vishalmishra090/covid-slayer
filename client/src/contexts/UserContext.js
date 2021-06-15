import React from 'react'
import {useUserProvider} from '../hooks/user'


const UserContext = React.createContext();

export const UserProvider = ({children}) => {
    let user = useUserProvider()   
    return(
        <UserContext.Provider value={user}>
          {children}
        </UserContext.Provider>
    )
}

export default UserContext


