import { useState, useEffect } from "react";
import { useAuthe } from "./authe";
import useFetchUser from "./useFetchUser"
import useFetchGame from "./useFetchGame";

let useUserHome = () => {
  let [logoutLoader, setLogoutLoader] = useState(false)
  let [fetchStatus, setFetchStatus] = useState({
    error: "",
    success: ""
  })
  let authe = useAuthe();
  let {user} = useFetchUser()
  let {game} = useFetchGame()
  
  let handelLogout = async () => {
    setLogoutLoader(true)
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let cancel = false;
    if(logoutLoader){

      (async () => {
        let res = await fetch("/users/logout",{
          credentials:"include",
          method: "POST",
          headers: {
            'Authorization': authe.getAuthe()
          },
          signal
        })
        
        if(!cancel){
          if (res.status === 200) {
            authe.removeAuthe();
          }
          if (res.status === 500) {
            setFetchStatus((prev) => ({
                ...prev,
                error: "ServerError",
                success: ""
            }))
          }
        }
      })()
        
       return () => {
          controller.abort()
          cancel = true
       }
    }
  }, [logoutLoader])


  return {
    game,
    authe,
    user,
    fetchStatus,
    handelLogout,
    logoutLoader
  };
};

export default useUserHome
