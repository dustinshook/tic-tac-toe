/* game.js */
const player = (name, marker, type) => {
    const getName = () => name;
    const getMark = () => marker;
    const isHuman = () => type === 'human';

    const opponent = getMark() === 'x' ? 'o' : 'x';

    const move = () => {
        const board = gameboard.getBoard();
    
        const cols = () => {
            return [0, 1, 2].map(col => {
                return board.map(row => row[col]);
            });
        };

        const diag = () => {
            const topLeftToBottomRight = [0, 1, 2].map((col, index) => board[col][index]);
            const topRightToBottomLeft = [2, 1, 0].map((col, index) => board[index][col]);
            return [topLeftToBottomRight, topRightToBottomLeft];
        };

        const evaluate = () => {
            if (board.some(row => row.every(cell => cell === getMark()))) return 10;
            if (board.some(row => row.every(cell => cell === opponent))) return -10;
            if (cols().some(col => col.every(cell => cell === getMark()))) return 10;
            if (cols().some(col => col.every(cell => cell === opponent))) return -10;
            if (diag().some(diag => diag.every(cell => cell === getMark()))) return 10;
            if (diag().some(diag => diag.every(cell => cell === opponent))) return -10;
            return 0;
        };

        const hasEmptySpaces = () => {
            return board.some(row => row.includes(null));
        };

        const minimax = (depth, isMax) => {
            let score = evaluate();

            if (score === 10) return score - depth;
            if (score === -10) return score + depth;
            if (!hasEmptySpaces()) return 0;

            const scores = [];

            board.forEach((row, rowIndex) => {
                row.forEach((cell, colIndex) => {
                    if (cell === null) {
                        board[rowIndex][colIndex] = isMax ? getMark() : opponent;
                        scores.push(minimax(depth + 1, !isMax));
                        board[rowIndex][colIndex] = null;
                    }
                });
            });

            return isMax ? Math.max(...scores) : Math.min(...scores);
        };

        const findBestMove = () => {
            let bestScore = -Infinity;
            let bestMove = { row: null, col: null };

            board.forEach((row, rowIndex) => {
                row.forEach((cell, colIndex) => {
                    if (cell === null) {
                        board[rowIndex][colIndex] = getMark();
                        let score = minimax(0, false);
                        board[rowIndex][colIndex] = null;

                        if (score > bestScore) {
                            bestScore = score;
                            bestMove = { row: rowIndex, col: colIndex };
                        }
                    }
                });
            });

            return bestMove;
        };

        return findBestMove();
    };

    return { getName, getMark, isHuman, move };
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

        const reset = () => value = null;

        return { getValue, setValue, reset };
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

    const registerPlayer = (name, marker, type) => {
        if (!gameState.player1 && marker === 'x') {
            gameState.player1 = player(name, marker, type);
            setGameStateMessage(`${gameState.player1.getName()}'s ready!`);
        } else if (!gameState.player2 && marker === 'o') {
            gameState.player2 = player(name, marker, type);
            setGameStateMessage(`${gameState.player2.getName()}'s ready!`);
        } else {
            setGameStateMessage('Already registered!');
        }
    };

    const emulateClickForCpuPlayer = ({ row, col }) => {
        let cell = gameboard.slots[row][col];
        setTimeout(() => cell.el.click(), 500);
    };

    const startGame = () => {
        if (gameState.player1 && gameState.player2) {
            gameState.currentPlayer = gameState.player1;
            setGameStateMessage(`${gameState.currentPlayer.getName()}'s turn`);
            if (!gameState.currentPlayer.isHuman()) {
                let move = gameState.currentPlayer.move();
                emulateClickForCpuPlayer(move);
            }
        } else {
            setGameStateMessage('Register players first!');
        }
    };

    const switchPlayer = () => {
        let { currentPlayer, player1, player2 } = gameState;
        gameState.currentPlayer = currentPlayer === player1 ? player2 : player1; 
        setGameStateMessage(`${gameState.currentPlayer.getName()}'s turn`);

        if (!gameState.currentPlayer.isHuman()) {
            let move = gameState.currentPlayer.move();
            emulateClickForCpuPlayer(move);
        }
    }

    const checkForWin = () => {
        let { currentPlayer } = gameState;
        const check = (board) => board.some(row => row.every(cell => cell === currentPlayer.getMark()));
        return [gameboard.getBoard(), gameboard.cols(), gameboard.diag()].some(check);
    };

    const checkForTie = () => {
        const check = (board) => {
             return board.every(row => row.every(cell => cell !== null)); 
        };
        return [gameboard.getBoard(), gameboard.cols()].some(check);
    };

    const play = ({ row, col }) => {
        let { currentPlayer, gameOver } = gameState;
    
        if (gameOver) return false;

        if (gameboard.slots[row][col].setValue(currentPlayer.getMark())) {
            
            if (checkForWin()) {
                setGameStateMessage(`${currentPlayer.getName()} wins!`);
                gameState.winner = currentPlayer;
                gameState.gameOver = true;
            } else if (checkForTie()) {
                setGameStateMessage('Tie game!');
                gameState.gameOver = true;
            } else {
                switchPlayer();
                gameState.gameOver = false;
            }
            
        } else {
            setGameStateMessage('Invalid move!');
        }

        return getGameStateMessage();
    };

    return { registerPlayer, play, gameState, getGameStateMessage, startGame };
    
};