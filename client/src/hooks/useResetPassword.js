import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const useResetPassword = () => {
  let [loader, setLoader] = useState(true)
  let [fetchStatus, setFetchStatus] = useState({
      error: "",
      success: "",
      message: ""
  });
  let [fetchMethod, setFetchMethod] = useState("GET");
  let [warn, setWarn] = useState(false)
  let [newPassword, setNewPassword] = useState("");
  let [formSubmit, setFormSubmit] = useState(false)
  let { resetToken } = useParams();


  const handelChange = (e) => {
      let value = e.target.value
      setNewPassword(value)
      if(value.length < 7){
        setWarn(true)
      }else{
        setWarn(false)
      }
  }

  const handelSubmit = (e) => {
    e.preventDefault()
    setFormSubmit(true)
    setFetchMethod("POST")
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let cancel = false;
    (async () => {
      if (fetchMethod === "GET") {
        let res = await fetch(process.env.REACT_APP_API_URI+`/users/reset/${resetToken}`, { 
          credentials: "include",
          signal 
        });

        if (!cancel) {
          if (res.status === 200) {
            setLoader(false);
          }

          if(res.status === 400 || res.status === 404){
              let result = await res.json()
              setLoader(false);
              setFetchStatus({
                  error: result.error.name,
                  message: result.error.message,
                  success: ""
              })
          }

          if(res.status === 500){
            setLoader(false);
            setFetchStatus({
                error: "ServerError",
                message: "Something goes wrong, try after some time.",
                success: ""
            })
          }
        }
      }

      if(fetchMethod === "POST") {
        let res = await fetch(process.env.REACT_APP_API_URI+`/users/reset/${resetToken}`, { 
            method: "POST",
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                newPassword: newPassword
            }),
            signal 
        });

        if (!cancel) {
          if (res.status === 205) {
            setFetchStatus({
               error: "",
               success: "ResetDone",
               message: ""
            })
          }

          console.log(res.status)
        }
      }
    })();

    return () => {
      controller.abort();
      cancel = true;
    };
  }, [fetchMethod]);

  return {
    loader,
    fetchStatus,
    warn,
    newPassword,
    formSubmit,
    handelChange,
    handelSubmit
  };
};


export default useResetPassword