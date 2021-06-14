import React from 'react'

function Name({
    className = "",
    children
}) {

    return (
        <h3 className={`name${className && " " + className}`}>
            {children}
        </h3>
    )
}

export default Name
