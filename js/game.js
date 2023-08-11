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

    const rows = () => {
        return slots.map(row => row.map(cell => cell.getValue()));
    };

    const cols = () => {
        return [0, 1, 2].map(col => {
            return slots.map(row => row[col].getValue());
        });
    };

    const diag = () => {
        const topLeftToBottomRight = [0, 1, 2].map((col, index) => slots[col][index].getValue());
        const topRightToBottomLeft = [0, 1, 2].map((col, index) => slots[col][2 - index].getValue());
        return [topLeftToBottomRight, topRightToBottomLeft];
    };

    const getBoard = () => {
        return slots.map(row => row.map(cell => cell.getValue()));
    };

    const printBoard = () => console.table(getBoard());

    return { slots, rows, cols, diag, getBoard, printBoard };
})();

const controller = () => {

    const gameState = {};

    const registerPlayer = (name, marker) => {
        if (!gameState.player1) {
            gameState.player1 = player(name, marker);
            gameState.currentPlayer = gameState.player1;
        } else if (!gameState.player2) {
            gameState.player2 = player(name, marker);
        } else {
            console.log('Cannot register more than 2 players');
        }
    };

    const switchPlayer = () => {
        let { currentPlayer, player1, player2 } = gameState;
        gameState.currentPlayer = currentPlayer === player1 ? player2 : player1; 
    }

    const checkForWin = () => {
        let { currentPlayer } = gameState;
        const check = (row) => row.every(cell => cell === currentPlayer.getMark());
        return [gameboard.rows(), gameboard.cols(), gameboard.diag(), gameboard.diag()].some(check);
    };

    const checkForTie = () => {
        let { player1, player2 } = gameState;
        const check = (board) => {
            return board.every(row => row.every(cell => cell !== null)) || board.includes(player1.getMark()) && board.includes(player2.getMark());
        };
        return [gameboard.rows(), gameboard.cols(), gameboard.diag(), gameboard.diag()].some(check);
    };

    const play = (row, col) => {
        let { currentPlayer } = gameState;

        if (gameboard.slots[row][col].setValue(currentPlayer.getMark())) {
            
            if (checkForWin()) {
                console.log(`${currentPlayer.getName()} wins!`);
                return gameboard.printBoard();
            } else if (checkForTie()) {
                console.log('Tie game!');
                return gameboard.printBoard();
            } else {
                switchPlayer();
                console.log(`${currentPlayer.getName()}'s turn`);
                return gameboard.printBoard();
            }
            
        } else {
            console.log('Invalid move');
        }
    };

    return { registerPlayer, play, gameState };
    
};