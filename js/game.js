/* game.js */
const player = (name, marker) => {

    const getName = () => name;
    const getMark = () => marker;
    
    return { getName, getMark };
};

const gameboard = (() => {

    const cell = () => {
        let value = null;
    
        const getValue = () => value;
        const setValue = (newValue) => {
            if (value === null) {
                value = newValue;
                return true;
            } else {
                return false;
            }
        };

        return { getValue, setValue };
    };

    let slots = ['row1', 'row2', 'row3'].map(col => {
        return ['col1', 'col2', 'col3'].map(row => {
            return cell();
        });
    });

    const cols = () => {
        return [0, 1, 2].map(col => {
            return slots.map(row => row[col].getValue());
        });
    };

    const diag = () => {
        const topLeftToBottomRight = [0, 1, 2].map((col, index) => slots[col][index].getValue());
        const topRightToBottomLeft = [2, 1, 0].map((col, index) => slots[index][col].getValue());
        return [topLeftToBottomRight, topRightToBottomLeft];
    };

    const getBoard = () => {
        return slots.map(row => row.map(cell => cell.getValue()));
    };

    const printBoard = () => console.table(getBoard());

    return { slots, cols, diag, getBoard, printBoard };
})();

const controller = () => {

    const gameState = {};

    const getGameStateMessage = () => gameState.message;
    const setGameStateMessage = (message) => gameState.message = message;

    const _initGameboard = (container) => {
        gameboard.slots.
            forEach((row, rowIndex) => {
                row.forEach((cell, cellIndex) => {
                    const div = document.createElement('div');
                        div.classList.add('cell');
                        div.setAttribute('data-row', rowIndex);
                        div.setAttribute('data-col', cellIndex);
                    
                    if (cell.getValue() !== null) div.textContent = cell.getValue();

                    container.appendChild(div);
                });
            });
    };

    const registerPlayer = (name, marker) => {
        if (!gameState.player1 && marker === 'x') {
            gameState.player1 = player(name, marker);
            if (gameState.player2) {
                setGameStateMessage('Players ready! Starting game...');
                gameState.currentPlayer = gameState.player1;
            } else {
                setGameStateMessage(`${gameState.player1.getName()}'s ready!`);
            }
        } else if (!gameState.player2 && marker === 'o') {
            gameState.player2 = player(name, marker);
            if (gameState.player1) {
                setGameStateMessage('Players ready! Starting game...');
                gameState.currentPlayer = gameState.player1;
            } else {
                setGameStateMessage(`${gameState.player2.getName()}'s ready!`);
            }
        } else {
            console.log('Invalid player registration');
        }
    };

    const switchPlayer = () => {
        let { currentPlayer, player1, player2 } = gameState;
        gameState.currentPlayer = currentPlayer === player1 ? player2 : player1; 
        setGameStateMessage(`${gameState.currentPlayer.getName()}'s turn`);
        return currentPlayer;
    }

    const checkForWin = () => {
        let { currentPlayer } = gameState;
        const check = (board) => board.some(row => row.every(cell => cell === currentPlayer.getMark()));
        return [gameboard.getBoard(), gameboard.cols(), gameboard.diag()].some(check);
    };

    const checkForTie = () => {
        let { player1, player2 } = gameState;
        const check = (board) => {
             return board.every(row => row.every(cell => cell !== null)) || 
                    board.every(row => row.includes(player1.getMark())) && 
                    board.every(row => row.includes(player2.getMark()));
        };
        return [gameboard.getBoard(), gameboard.cols(), gameboard.diag()].some(check);
    };

    const play = ({ target }) => {
        let { currentPlayer } = gameState;
        let { row, col } = target.dataset;

        if (gameState.gameOver) return getGameStateMessage();

        if (gameboard.slots[row][col].setValue(currentPlayer.getMark())) {
            target.textContent = currentPlayer.getMark();
            if (checkForWin()) {
                setGameStateMessage(`${currentPlayer.getName()} wins!`);
                gameState.winner = currentPlayer;
                gameState.gameOver = true;
            } else if (checkForTie()) {
                setGameStateMessage('Tie game!');
                gameState.gameOver = true;
            } else {
                setGameStateMessage(`${switchPlayer().getName()}'s turn`);
                gameState.gameOver = false;
            }
            
        } else {
            setGameStateMessage('Invalid move!');
        }

        return getGameStateMessage();
    };

    return { _initGameboard, registerPlayer, play, gameState, getGameStateMessage };
    
};