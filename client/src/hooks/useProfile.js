import { useState, useReducer, useEffect } from "react";
import useFetchUser from "./useFetchUser";
import signupReducer from "../reducer/signupReducer";
import {useAuthe}  from "../hooks/authe"
import {useHistory} from "react-router-dom"

let useProfile = () => {
  let authe = useAuthe()
  let history = useHistory()
  let [edit, setEdit] = useState(false);
  let [save, setSave] = useState(false);
  let { user, setUser } = useFetchUser(true);
  let [warn, setWarn] = useState({
    status: false,
    message: "Edit Profile"
  });
  let [editProfile, editProfileDispatch] = useReducer(signupReducer, {
    name: "",
    email: "",
    username: "",
  });
 
  let [logoutAll, setLogoutAll] = useState(false)
  let [deleteAccount, setDeleteAccount] = useState(false)
  let [popup, setPopup] = useState(false)
  let [fetchStatus, setFetchStatus] = useState({
    error: "",
    success: ""
  })

  function handelChange(e){
    let value = e.target.value;
    if(e.target.name === "username"){
      !/^[\w\d]+$/gi.test(value) && setWarn({
        status: true,
        message: "Username must only contain a-z, A-Z, and 0-9"
      });
     
      /^[\w\d]+$/gi.test(value) && warn.status && setWarn({
        status: false,
        message: "Edit Profile"
      });
    }
    editProfileDispatch({
      type: e.target.name,
      payload: {
        currentValue: value
      }
    })
    
    !/username/.test(e.target.name) && warn.status &&
    setWarn({
      status: false,
      message: "Edit Profile",
    });

  }

  function handelEdit() {
    setWarn({
      status: false,
      message: "Edit Profile"
    })
    if (edit) {
      editProfileDispatch({
        type: "reset",
        payload: {
          name: user.name,
          email: user.email,
          username: user.username,
        },
      });
    }
    edit ? setEdit(false) : setEdit(true);
  }

  function handelLogoutAll(){
      setLogoutAll(true)
  }

  function handelDeleteAccount(e){
    let targetName = e.target.name
     console.log(targetName)
    if(targetName === "deleteAccount")
         setPopup(true)
    if(targetName === "cancel")
        setPopup(false)
    if(targetName === "delete")
         setDeleteAccount(true)
  }

  async function handelSave(e){
    e.preventDefault();
    
    setSave(true);

    let res = await fetch('/users', {
      method: 'PATCH',
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authe.getAuthe()
      },
      body: JSON.stringify({
        name: editProfile.name,
        email: editProfile.email,
        username: editProfile.username
      })
    })

    

    if(res.status === 200){
      let result = await res.json()
        setUser(result.user)
        setSave(false)
        setEdit(false)
        result.jsToken && authe.setAuthe(result.jsToken)
        history.replace(`/${result.user.username}`)
    }
    if(res.status === 406){
      setWarn({
        status: true,
        message: "Email or username already registered"
      })
      setSave(false)
    }
  }

  useEffect(() => {

    let cancel = false

    if(user && !logoutAll){
      editProfileDispatch({
        type: "reset",
        payload: {
         name: user.name,
         email: user.email,
         username: user.username
        }
      })
    }

    if(logoutAll){
      (async () => {

        let res = await fetch("/users/logout-all",{
          method: "POST",
          credentials: "include",
          headers: {
            'Authorization': authe.getAuthe()
          }
        })
  
        if(res.status === 200){
          authe.removeAuthe()
          history.push("/")
        }
        if(res.status === 500 && !cancel){
          setLogoutAll(false)
          setFetchStatus({
            error: "ServerError",
            success: ""
          })
        }

      })()
    }

    if(popup && deleteAccount){
      ( async () => {
        let res = await fetch("/users",{
          method: 'DELETE',
          credentials: "include",
          headers: {
           'Authorization': authe.getAuthe()
          }
        })
  
        if(res.status === 200){
          authe.removeAuthe()
          history.push("/")
        }
        if(res.status === 500 && !cancel){
          setPopup(false)
          setDeleteAccount(false)
          setFetchStatus({
            error: "ServerError",
            success: ""
          })
        }
      })()
    }

    return () => {
       cancel = true
    }
 }, [user, logoutAll,deleteAccount])
  return {
    edit,
    save,
    user,
    warn,
    editProfile,
    logoutAll,
    popup,
    deleteAccount,
    fetchStatus,
    handelEdit,
    handelLogoutAll,
    handelSave,
    handelChange,
    handelDeleteAccount
  };
};

export default useProfile;

