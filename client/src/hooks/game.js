import { useContext, useState } from "react";
import GameContext from "../contexts/GameContext";


const useGameProvider = () => {

  let [game, setGame] = useState(null);

  return {
    game,
    setGame,
  };
};

const useGame = () => {
  return useContext(GameContext);
};

export { useGame, useGameProvider };