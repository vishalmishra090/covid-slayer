import React from 'react'
import Button from '../Button'



function CreateActionBtn(actionBtnName) {

    

    return function ActionBtn({
        children,
        className = "",
        onAction,
        disabled = false,
        name = ""
    }){


       let handelAction = (e) => {
           onAction(e);
       }

       return(
           <Button 
           onClick={handelAction}
           className={`action-btn${className && " " + className}`}
           disabled= {disabled}
           name={name || actionBtnName.toLowerCase()}
           >
               {children ? children : actionBtnName}
           </Button>
       )
    }
}

const Attack = CreateActionBtn("Attack");
const Heal = CreateActionBtn("Heal");
const GiveUp = CreateActionBtn("GiveUp");
const Blast = CreateActionBtn("Blast");

export {
   Attack,
   Heal,
   GiveUp,
   Blast
}