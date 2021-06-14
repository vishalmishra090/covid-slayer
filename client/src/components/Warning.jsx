import React from 'react'

function Warning({
    className = "",
    style = {},
    warn = false,
    children
}) {

    let styles = {
        visibility: warn ? "visible" : "hidden",
        ...style
    }
    return (
        <div 
        className={`warning${className && " " + className}`}
        style = {styles}
        >
            {children}
        </div>
    )
}

export default Warning
