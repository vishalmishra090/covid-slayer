export let loginInitialState = {
  username: "",
  password: "",
  rememberMe: false
}

function loginReducer(state, {type,payload}){
   switch(type){
       case "username": return{
           ...state,
           username: payload.currentValue
       }
       
       case "password": return{
           ...state,
           password: payload.currentValue
       }
       
       case "rememberMe": return{
           ...state,
           rememberMe: payload.currentValue
       }

       default: state = {...state}
   }

   return state;
}

export default loginReducer