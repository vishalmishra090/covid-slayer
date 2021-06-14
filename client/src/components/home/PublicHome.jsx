import React from 'react'
import LinkBtn from '../LinkBtn'


function PublicHome() {
    return (
        <div className="public-home">
          <h1 className="title">
            Play Covid Slayer Game
          </h1>
          <div className="btn-box">
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
    </div>
    )
}

export default PublicHome
