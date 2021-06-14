import React from 'react'
import CovidLogo from "./CovidLogo";
import {Link} from "react-router-dom"


function Header(props) {


    return (
      <header className="header">
        <Link to="/">
          <span className="header-text">
             Covid
          </span>
          <CovidLogo className="header-logo" />
          <span className="header-text">
            Slayer
          </span>
        </Link>
      </header>
    )
}

export default Header






