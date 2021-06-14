import React from 'react'
import PulseLoader from "react-spinners/PulseLoader"


function Button({
    children,
    className,
    onClick=() => {},
    disabled=false,
    type,
    name,
    form,
    style={},
    loader=false
}) {
    let styles = {
        ...style
    }
    let handelClick = (e) => {
        e.target.name = name
        onClick(e);
    }

    return (
        <button 
        className={className} 
        onClick={handelClick}
        disabled={disabled}
        style={styles}
        name={name}
        type={type}
        form={form}
        >
            <span style={{
                position: "absolute",
                left: "0",
                width: "100%",
                visibility: loader ? "visible" : "hidden"
            }}>
                <PulseLoader size="8px" color="white" loading={loader}/> 
            </span>
             <span style={{
                 visibility: !loader ? "visible" : "hidden"
             }}>
               {children}
            </span>
        </button>
    )
}

export default Button

