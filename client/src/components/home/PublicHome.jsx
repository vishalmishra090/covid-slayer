import React from 'react'
import LinkBtn from '../LinkBtn'
import {Link} from 'react-router-dom'


function PublicHome() {
    return (
        <div className="public-home">
          <h1 className="title">
            Play Covid Slayer Game
          </h1>
          <div className="btn-box">
            <div className="row row1">
            <LinkBtn 
            className="primary-btn" 
            to="/login">
              Log In
            </LinkBtn>
            <LinkBtn 
            className="primary-btn" 
            to="/signup">
              Sign Up
            </LinkBtn>
            </div>
            <div className="row row2">
              Or
            </div>
            <div className="row row3">
              <Link to="/game?as=guest">Play as guest</Link>
            </div>
            
          </div>
    </div>
    )
}

export default PublicHome
