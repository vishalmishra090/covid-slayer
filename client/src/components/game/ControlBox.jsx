import React from 'react'
import {
    Attack,
    Heal,
    GiveUp,
    Blast
  } from './ActionsBtn'

function ControlBox(
    {
        className="",
         onAction,
        disabled = false
    }) {
    let handelAction = (e) => {
        onAction(e);
    }
    return (
        <div className={`control-box${className && " " + className}`}>
            <Attack onAction={handelAction} disabled={disabled}/>
            <Blast onAction={handelAction} disabled={disabled}/>
            <Heal onAction={handelAction} disabled={disabled}/>
            <GiveUp onAction={handelAction} disabled={disabled}/>
        </div>
    )
}

export default ControlBox
