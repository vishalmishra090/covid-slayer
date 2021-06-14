import React,{useState, useEffect} from 'react'
import {Redirect} from 'react-router-dom'

function NotFound({
    className=null,
    code = 404,
    message = "Not Found",
    redirectLink = null,
    redirectLinkName=null,
    redirectTime = 6
}) {

    let [time, setTime] = useState(redirectTime)
  
    useEffect(() => {
        console.log("effect run...");
        if(time > 0 && redirectLink){
           let timeId = setTimeout(() => {
                setTime((redirectTime) => {
                    return redirectTime - 1
                })
            },1000)

            return () => {
                clearTimeout(timeId)
            }
        }
    },[time,redirectLink])
    
    return (
        <div className={className && className}>
            <div className="not-found">
                <h1>{code}</h1>
                <h3>{message}</h3>
                {
                   redirectLink && <p>Redirect to {
                    redirectLinkName ? `"${redirectLinkName}"`:  `"${window.location.origin}${redirectLink}"`
                       } in {time} sec</p>
                }
                {
                    !time && <Redirect to={redirectLink} />
                }
            </div>
        </div>
    )
}

export default NotFound
