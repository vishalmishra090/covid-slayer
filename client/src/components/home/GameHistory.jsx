import React from "react";
import Loader from "../Loader";
import ellipsisString from "../../utils/ellipsisString";

function GameHistory({ game = [], loading = false }) {
  return (
    <div className="game-history">
      <h4 className="title">Game History</h4>
      {
       loading ?
        <Loader /> :
        <div className="history">
          {game && game.length ? (
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Winner</th>
                </tr>
              </thead>
              <tbody>
                {game.map(({ winner, date }, i) => (
                  <tr key={i}>
                    <td className="date">
                      {new Intl.DateTimeFormat("en", {
                        dateStyle: "short",
                      }).format(new Date(date))}
                    </td>
                    <td className="winner">
                      {ellipsisString(winner,0,8)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Game History Not Available</p>
          )}
        </div>
      }
    </div>
  );
}

export default GameHistory;
