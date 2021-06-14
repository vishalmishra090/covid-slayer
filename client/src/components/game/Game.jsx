import React, { useReducer, useEffect, useRef } from "react";
import "../../style/Game.scss";
import HealthBox from "./HealthBox";
import ControlBox from "./ControlBox";
import CommentaryBox from "./CommentaryBox";
import PopUp from "../PopUp";
import Button from "../Button";
import actionMethod from "../../methods/actionMethods";
import doActionReducer from "../../reducer/doActionReducer";
import Header  from "../Header";
import {useAuthe} from "../../hooks/authe"
import useFetchUser from "../../hooks/useFetchUser"
import Loader from "../Loader"
import ellipsisString from "../../utils/ellipsisString";
import {useGame} from "../../hooks/game"
let { attack, blast, heal } = actionMethod;

let initialState = {
  name:{
    playerName: "",
    covidName: "",
  },
  playerHealth: 100,
  covidHealth: 100,
  win: false,
  winner: null,
  actionList: [],
};

function Game() {
  let [gameState, gameDispatch] = useReducer(doActionReducer, initialState);
  let authe = useAuthe();
  let {user} = useFetchUser()
  let {game, setGame} = useGame()
  let popUpRef = useRef(null);
  let covidName = "Covid"

  let doAction = (actionFun, actionName) => {
    let playerActionValue = actionFun();
    let covidActionValue = actionFun();
    gameDispatch({
      type: actionName,
      payload: {
        actionName,
        playerActionValue,
        covidActionValue,
      },
    });
  };

  let handelAction = (e) => {
    switch (e.target.name) {
      case "attack":
        doAction(attack, "attack");
        break;
      case "blast":
        doAction(blast, "blast");
        break;
      case "heal":
        doAction(heal, "heal");
        break;
      case "giveup":
      case "play-again":
        gameDispatch({
          type: "giveup",
          payload: {
            ...initialState,
            name:{
              playerName: user ? user.name: "",
              covidName: covidName
            }
          },
        });
        break;

      default:
        throw new Error("SomeThing Wrong....");
    }
  };

  useEffect(() => {
    if(user && !gameState.name.playerName){

      gameDispatch({
        type: "name",
        payload:{
          playerName: user.name,
          covidName: covidName
        }
      })

    }
    
    if(gameState.win){
    (async () => {
        let res = await fetch(process.env.REACT_APP_API_URI+"/games",{
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
            'Authorization': authe.getAuthe()
          },
          body: JSON.stringify({
            winner: gameState.winner || "Tie",
            date: new Date()
          })
        })
          if(res.status === 201){
            let result = await res.json();
            if(game){
              game.length < 10 && setGame((game) => ([result.game,...game]));
              game.length >= 10 && setGame((game) => ([result.game, ...game.slice(0,game.length-1)]));
            }
            result.jsToken && authe.setAuthe(result.jsToken);
          }
          if(res.status === 401){
            authe.removeAuthe();
          }
    })()}
    let timerId = setTimeout(() => {
      if (gameState.win) {
        popUpRef.current.style.opacity = 1;
      }
    }, 400);
    return () => {
      clearTimeout(timerId);
    };
  }, [gameState.win, user]);

  return (
    <div className="page game-page">

      <Header />
      {
        !user ?
        <Loader height={70} width={6} margin={4}/> :
        <main className="game-container">

        <div className="game">
          <HealthBox
            playerName={user.name}
            covidName={covidName}
            playerHealth={gameState.playerHealth}
            covidHealth={gameState.covidHealth}
            className="item item1"
          ></HealthBox>

          <div
            className="item item2"
          >
             
          <ControlBox
            onAction={handelAction}
            disabled={gameState.win}
          />

          </div>

          <CommentaryBox
            className="item item3"
            commentaryList={gameState.actionList}
          />

          {gameState.win && (
            <PopUp className="result-pop-up" ref={popUpRef}>
              <h3 className="pop-up-text">
                {gameState.winner 
                ? `${ellipsisString(gameState.winner,0,13)} Win` 
                : "Tie"}
              </h3>

              <Button
                className="secondary-btn"
                name="play-again"
                onClick={handelAction}
              >
                Play Again
              </Button>
            </PopUp>
          )}
        </div>

      </main>

      }
      
    </div>
  );
}

export default Game;
