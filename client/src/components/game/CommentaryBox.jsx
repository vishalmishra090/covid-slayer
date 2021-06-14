import React,{useRef,useEffect} from 'react'
import List from '../List'
import {createCommentaryList} from '../../methods/createCommentaryList'


function CommentaryBox({
    className = "",
    commentaryList
}) {
    const boxRef = useRef(null);


    useEffect(() => {
        let element = boxRef.current
        element.scrollTop = element.scrollHeight;
    })

    let list = createCommentaryList(commentaryList)

    return (

        <div 
        className={`commentary-box${className && " " + className}`}>
            <h4 className="title">Commentary</h4>
            <div 
            ref={boxRef}
            className= "commentary">
            {
                list.length ? 
                <List 
                  className="list"
                  listItems = {[...list]} 
                /> :
                <p
                  style={{padding: "10px"}}
                >No Logs..</p>
            }
            
            </div>
            
        </div>
    )
}

export default CommentaryBox
