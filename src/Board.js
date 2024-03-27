import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 3, ncols = 3, chanceLightStartsOn = 0.5 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];

    for (let j = 0; j < nrows; j++) {
      initialBoard[j] = [];

      for (let i = 0; i < ncols; i++) {
        const isCellLit = Math.random() < chanceLightStartsOn;
        initialBoard[j].push(isCellLit);
      }
    }

    return initialBoard;
  }

  function hasWon() {
    // check the board in state to determine whether the player has won.
    return board.every( row => row.every( cell => cell === true));
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      // Make a (deep) copy of the oldBoard
      let boardCopy = oldBoard.map( row => row.map(cell => cell));

      // In the copy, flip this cell and the cells around it
      flipCell(y, x, boardCopy); // clicked cell
      flipCell(y - 1, x, boardCopy); // above
      flipCell(y + 1, x, boardCopy); // below
      flipCell(y, x - 1, boardCopy); // left
      flipCell(y, x + 1, boardCopy); // right

      // return the copy
      return boardCopy;
    });
  }

  // if the game is won, just show a winning msg & render nothing else
  // Otherwise make a table board

  const gameWon = hasWon();

  return (
    <div className="Board">
      {gameWon ? (
        <h1>You won!</h1>
      ) : (
        <table>
          <tbody>
            {board.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {row.map((cell, cellIdx) => (
                  <Cell 
                    key={`${rowIdx}-${cellIdx}`}
                    flipCellsAroundMe={() => flipCellsAround(`${rowIdx}-${cellIdx}`)} 
                    isLit={cell}
                  />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Board;
