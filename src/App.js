import './App.css';
import { useState } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

function App() {

  const [mode, setMode] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('X');
  const [gameBoard, setGameBoard] = useState(Array(9).fill(''));
  const { width, height } = useWindowSize()
  // const [showPopup, setShowPopup] = useState(false);



  const handleCellClick = (index) => {
    if (gameBoard[index] === '' && mode !== null) {
      const newBoard = [...gameBoard];
      newBoard[index] = currentPlayer;
      setGameBoard(newBoard);
      const status = checkGameStatus(newBoard);
      if (status === 'Game in progress') {
        if (mode === 'human') {
          setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
        } else if (mode === 'ai' && currentPlayer === 'X') {
          setCurrentPlayer('O');
          setTimeout(() => {
            handleAIMove(newBoard); // Pass the current board to handleAIMove
          }, 500); // Adjust timing as needed
        }
      }
    }
  };
  
  const handleAIMove = (currentBoard) => {
    const emptyCells = currentBoard.reduce((acc, cell, index) => {
      if (cell === '') {
        acc.push(index);
      }
      return acc;
    }, []);
  
    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const aiMoveIndex = emptyCells[randomIndex];
  
      const newBoard = [...currentBoard];
      newBoard[aiMoveIndex] = 'O';
      setGameBoard(newBoard);
      checkGameStatus(newBoard);
      setCurrentPlayer('X');
    }
  };

  const handleHumanMode = () => {
    setMode('human');
    setCurrentPlayer('X');
    setGameBoard(Array(9).fill(''));
  };

  const handleAIMode = () => {
    setMode('ai');
    setCurrentPlayer('X');
    setGameBoard(Array(9).fill(''));
  };

  const handleBackToMenu = () => {
    setMode(null);
    setCurrentPlayer('X');
    setGameBoard(Array(9).fill(''));
  };

  const handleReset = () => {
    setGameBoard(Array(9).fill(''));
    setCurrentPlayer('X');
    // setShowPopup(false);
  };

  // Function to check game status (win/draw)
  const checkGameStatus = (board) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
  
    // Check for a winner
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        // setShowPopup(true);
        return `Player ${board[a]} wins!`; // Return the winner
      }
    }
  
    // Check for a draw
    if (!board.includes('')) {
      // setShowPopup(true);
      return 'It\'s a draw!';
    }
  
    // Game is still in progress
    return 'Game in progress';
  };

  const gameStatus = checkGameStatus(gameBoard);
  let statusColor = null,fontWeight=null,fontSize=null;
  if (gameStatus.includes('wins')) {
    statusColor = 'green';
    fontWeight= 'bold';
    fontSize="1.4rem"
  } else if (gameStatus.includes('draw')) {
    statusColor = 'yellow';
    fontWeight= 'bold';
    fontSize="1.4rem"
  }

  return (
    <div className="App">
      
    <h2>Naveena's Tic Tac Toe</h2>
    {mode === null ? (

    <div className="options">
      <button onClick={handleHumanMode}>Play with Friend</button>
      <button onClick={handleAIMode}>Play with AI/Bot</button>
    </div>
     ) : (
      <div>
        <p>{mode === 'human' ? 'Playing with Friend' : 'Playing with AI'}</p>
        <button onClick={handleBackToMenu}>Back to Menu</button>
        <button onClick={handleReset}>Reset</button>
        <p style={{ color: statusColor, fontWeight: fontWeight,fontSize: fontSize}}>Game Status: {gameStatus}</p>
        {gameStatus.includes('wins') && (
          <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Confetti
            width={width} // Specify the width of the container for confetti
            height={height} // Specify the height of the container for confetti
            recycle={false} 
          />
        </div>
        )}
        <p>Current Player: {currentPlayer}</p>
        <div className="game-board">
          {gameBoard.map((cell, index) => (
            <div key={index} className="cell" onClick={() => handleCellClick(index)}>
              {cell}
            </div>
          ))}
        </div>
        
      </div>
    )}
  </div>
  );
}

export default App;
