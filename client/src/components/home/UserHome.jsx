import React from "react";
import LinkBtn from "../LinkBtn";
import Button from "../Button";
import GameHistory from "./GameHistory";
import useUserHome from "../../hooks/useUserHome";
import Loader from "../Loader"
import ellipsisString from "../../utils/ellipsisString";



function UserHome() {
  let { game, user, fetchStatus,handelLogout, logoutLoader} = useUserHome();
 
  return (
    <>
      {  !user ?
          <Loader height={70} width={6} margin={4}/>
         :
        <div className="user-home">
          <div className="item item1">
            <h2>{ellipsisString(user.name,0,13)}</h2>
            <LinkBtn to="/game" className="primary-btn">
              Start Game
            </LinkBtn>
            <div>
              <Button className="secondary-btn" onClick={handelLogout}
               loader={logoutLoader}
               disabled={logoutLoader}
              >
                Log out
              </Button>
              <LinkBtn to={`/${user.username}`} className="secondary-btn">
                Profile
              </LinkBtn>
            </div>
          </div>
          <div className="item item2">
              {fetchStatus.error === "ServerError"? 
              <p>Some thing goes wrong, Game history not load</p> :
              <GameHistory game={game ? game : []} loading={game ? false : true}/>}
          </div>
        </div>
      }
    </>
  );
}

export default UserHome;
