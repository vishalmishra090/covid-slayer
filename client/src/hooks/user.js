import { useContext, useState,useEffect } from "react";
import UserContext from "../contexts/UserContext";
import { useAuthe } from "./authe";


const useUserProvider = () => {

  let [user, setUser] = useState(null);
  let {login} = useAuthe()
  
   useEffect(() => {
    if(!login)
      setUser(null)

  },[login])
 
  user && localStorage.setItem('username', user.username)
  return {
    user,
    setUser,
  };
};

const useUser = () => {
  return useContext(UserContext);
};

export { useUser, useUserProvider };
