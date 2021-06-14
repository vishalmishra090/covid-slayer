import React from 'react'
import {ScaleLoader} from 'react-spinners'

function Loader({
    color = "#f600ff",
    height = 35,
    width = 4,
    radius = 2,
    margin = 2
}) {
    return (
        <div className="loader">
            <ScaleLoader {...{color, width, height, radius, margin}} />
        </div>
    )
}

export default Loader
