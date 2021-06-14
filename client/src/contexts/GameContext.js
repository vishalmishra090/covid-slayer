import React from 'react'
import {useGameProvider} from '../hooks/game'

const GameContext =  React.createContext()

export function GameProvider({children}){
    let game = useGameProvider()
    
    return (
        <GameContext.Provider value={game} >
            {children}
        </GameContext.Provider>
    )

}

export default GameContext