export let signupInitialState = {
    name: "",
    email: "",
    username: "",
    password: "",
    rememberMe: false
  }
  
  function signupReducer(state, {type,payload}){
     switch(type){
         case "name": state = {
             ...state,
             name: payload.currentValue
         }
         break;
  
         case "email": state = {
             ...state,
             email: payload.currentValue
         }
         break;

         case "username": state = {
            ...state,
            username: payload.currentValue
        }
        break;

        case "password": state = {
            ...state,
            password: payload.currentValue
        }
        break;

        case "rememberMe": state = {
            ...state,
            rememberMe: payload.currentValue
        }
        break;

        case "reset": state ={
            ...state,
            ...payload
        }
        break;
  
         default: state = {...state}
     }
  
     return state;
  }

  export default signupReducer;