import {useEffect} from 'react'
import {useGame} from "./game"
import {useAuthe} from "./authe"
import {useHistory} from 'react-router-dom'
import {useUser}  from './user'

const useFetchGame = () => {
      let {user} = useUser()
      let {game, setGame} = useGame()
      let authe = useAuthe()
      let history = useHistory()
      useEffect(() => {
          (async () => {
            if (authe.login) {
                if (!game && user) {
                  let res = await fetch(process.env.REACT_APP_API_URI+"/games", {
                    headers: {
                      Authorization: authe.getAuthe(),
                    },
                  });
                  if (res.status === 200) {
                    let result = await res.json();
                    setGame(result.game);
                    result.jsToken && authe.setAuthe(result.jsToken)
                  }
                  if(res.status === 401){
                    authe.removeAuthe()
                    history.push("/")
                  }
                }
              }else{
                  authe.removeAuthe()
                  history.push("/")
              }
          })()
      }, [user])

      return {
          game,
          setGame
      }
}

export default useFetchGame