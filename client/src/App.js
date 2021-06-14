import React, { useState, useEffect } from "react";
import { AutheProvider } from "./contexts/AutheContext";
import Game from "./components/game/Game";
import Home from "./components/home/Home.jsx";
import Profile from "./components/profile/Profile";
import { UserProvider } from "./contexts/UserContext";
import {GameProvider}  from "./contexts/GameContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import NotFound from "./components/NotFound"


function App() {
  let [theme, setTheme] = useState("dark");

  const changeTheme = () => {
    setTheme((currentTheme) => (currentTheme === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    let bodyElement = document.getElementsByTagName("body");

    bodyElement[0].className = theme;
  }, [theme]);

  return (
    <>
      <div className="theme-changer" onClick={changeTheme}>
        {theme === "dark" ? "🌜" : "🌞"}
      </div>
      <AutheProvider>
        <UserProvider>
          <GameProvider>
          <Router>
            <Switch>
              <Route exact path="/game">
                <Game />
              </Route>

              <Route exact path={["/", "/login", "/signup", "/forgot", "/reset/:resetToken"]}>
                <Home />
              </Route>

              <Route exact path="/:username">
                <Profile />
              </Route>

              <Route path="*" >
                <NotFound className="page"/>
              </Route>

            </Switch>
          </Router>
          </GameProvider>
        </UserProvider>
      </AutheProvider>
    </>
  );
}

export default App;
