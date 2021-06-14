import React from 'react'

function CovidLogo({
    className="",
    style = {},
    ...rest
}) {
    return (
        <img 
        className={`covid-logo${className && " " + className}`} 
        src= "/covid.svg"
        alt="Covid Monster"  
        {...rest}/>
    )
}

export default CovidLogo
