import {useEffect} from 'react'
import {useUser} from "./user"
import {useAuthe} from "./authe"
import {useHistory, useParams} from "react-router-dom"

let useFetchUser = (byParams = false) => {
     let authe = useAuthe()
     let {user, setUser}= useUser()
     let history = useHistory()
     let {username} = useParams()
     
     useEffect(() => {
        if(authe.login){
         if(!user){
            (async () => {
                let un = byParams ? username : localStorage.getItem('username')
                
                let res = await fetch(`/users/${un}`,{
                    credentials:"include",
                    headers:{
                        'Authorization': authe.getAuthe()
                    }
                })
                if(res.status === 200){
                  let result = await res.json()
                  setUser(result.user)
                  result.jsToken && authe.setAuthe(result.jsToken)
                }

                if(res.status === 401){
                    authe.removeAuthe()
                    history.push("/login")
                }
             })()

          }
         }else{
            history.push("/login") 
         }
     }, [user])
     return{
         user,
         setUser
     }
}

export default useFetchUser
