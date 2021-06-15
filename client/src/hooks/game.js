import { useContext, useState, useEffect } from "react";
import GameContext from "../contexts/GameContext";
import {useAuthe} from "./authe"


const useGameProvider = () => {

  let [game, setGame] = useState(null);
  let {login} = useAuthe()

  useEffect(() => {
    if(!login)
      setGame(null)

  },[login])

  return {
    game,
    setGame,
  };
};

const useGame = () => {
  return useContext(GameContext);
};

export { useGame, useGameProvider };