import {useEffect} from 'react'
import {useUser} from "./user"
import {useAuthe} from "./authe"
import {useHistory, useParams} from "react-router-dom"

let useFetchUser = (byParams = false) => {
     let {user, setUser} = useUser()
     let authe = useAuthe()
     let history = useHistory()
     let {username} = useParams()
     useEffect(() => {
        if(authe.login){
         if(!user){
            (async () => {
                let un = byParams ? username : localStorage.getItem('username')
                
                let res = await fetch(process.env.REACT_APP_API_URI+`/users/${un}`,{
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
     }, [])
     return{
         user,
         setUser
     }
}

export default useFetchUser
