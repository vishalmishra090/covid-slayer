import { useContext, useState } from "react";
import UserContext from "../contexts/UserContext";


const useUserProvider = () => {

  let [user, setUser] = useState(null);
 
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
