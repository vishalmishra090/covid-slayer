import React, {useReducer,useState,useEffect} from "react";
import { Link,useHistory} from "react-router-dom";
import loginReducer,{loginInitialState} from "../../reducer/loginReducer"
import {useAuthe} from "../../hooks/authe"
import Button from "../Button"
import Warning from "../Warning"
import Form, {FormInput} from "../Form"
import {useUser} from "../../hooks/user"

function LoginBox() {
  
  let [warn, setWarn] = useState(false)
  let [loader, setLoader] = useState(false)
  let authe = useAuthe();
  let history = useHistory()
  let {setUser} = useUser();

  let [loginInput, loginInputDispatch] = useReducer(loginReducer,loginInitialState)

  function handelSubmit(e){
     e.preventDefault();
     setLoader(true);
  }

  function handelChange(e){
    let value = e.target.value;
    
    if(e.target.name === "rememberMe"){
      value = e.target.checked;
    }

    loginInputDispatch({
      type: e.target.name,
      payload: {
        currentValue: value
      }
    })

    warn && setWarn(false);
  }

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let cancel = false
    if(loader){
      (async function() {    
        setWarn(false);
          let res = await fetch(process.env.REACT_APP_API_URI+"/users/login",{
            method: 'POST',
            credentials: "include",
            headers: {
             'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              password: loginInput.password,
              username: loginInput.username,
              rememberMe: loginInput.rememberMe
            }),
            signal
         })
          
         if(!cancel){

          if(res.status === 200){
            let result = await res.json();
            setUser(result.user)
            authe.setAuthe(result.jsToken)
            history.push()
   
          }
          if(res.status === 400){
           setLoader(false);
           setWarn(true)
          }

         }
      })();

      return () => {
        controller.abort()
        cancel = true
      }
    }
  },[loader])

  return (
    <div className="login-home">
    <div className="authe-form">

        <Warning warn = {warn}>
          Username or Password Incorrect
        </Warning>

        <Form  onSubmit={handelSubmit}>
              <FormInput
                type="text"
                id="userId"
                name="username"
                placeholder="Username"
                onChange = {handelChange}
                value = {loginInput.username}
                required = {true}
              />
              <FormInput
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                onChange = {handelChange}
                value = {loginInput.password}
              />
              <Button
               type="submit" 
               className="secondary-btn submit-btn"
               loader = {loader}
              > 
                 Log In
              </Button>
              
              <FormInput 

                type="checkbox"
                onChange={handelChange}
                label="Remember Me"
                name="rememberMe"
                value={loginInput.rememberMe}
                id="rememberMe"
                checked={loginInput.rememberMe}
                className="remember-me"
              />
          
        </Form>
        
        <div className="other-link">
           <Link to="/signup">
                Create New Account
           </Link>
           <Link to="/forgot">
               Forgot Password
           </Link>
        </div>
     </div>
    </div>
  );
}

export default LoginBox;
