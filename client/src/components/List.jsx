import React from 'react'

function List({listItems,...rest}) {
    return (
        <ul className={rest.className}>
            {
                listItems.map((item,i) => {
                  return(
                      <li key={i}>{item}</li>
                  )
                })
            }
        </ul>
    )
}

export default List
