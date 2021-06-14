import React from 'react'

let  PopUp = React.forwardRef(({
    children,
    className = "",
    style = {},
    show = false,
    ...rest
},ref) => {

    let styles = {
        ...style,
        display: show ? "flex" : "none"
    }
    return (
        <div 
        className={`pop-up${className && " " + className}`}
        style = {styles}
        ref={ref}
        {...rest}
        >
            {children}
        </div>
    )
})

export default PopUp
