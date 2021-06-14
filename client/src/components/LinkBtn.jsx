import React from 'react'
import {Link} from 'react-router-dom'

function LinkBtn({
    children,
    className = "",
    href = "",
    to = "",
    target = "_self",
    style = {},
    onClick = () => {},
    ...rest
}) {

    let handelClick = (e) => {
        onClick(e);
    }
    if(!!href){
        return (
            <a href={href}  target = {target}
            className= {`link-btn${className && " " + className}`}
            style={{...style}}
            onClick={handelClick}
            >
               {children} 
            </a>
        )
    }
    
    if(!!to){
        return (
        <Link to={to} className= {`link-btn${className && " " + className}`}
        style={{...style}}
        onClick={handelClick}
        {...rest}>
           {children}  
        </Link>
        )
    }
  
}

export default LinkBtn
