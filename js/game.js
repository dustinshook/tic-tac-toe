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

    const getBoard = () => {
        return slots.map(row => row.map(cell => cell.getValue()));
    };

    const printBoard = () => console.table(getBoard());

    return { slots, getBoard, printBoard };
})();

const controller = (player1, player2) => {

    let currentPlayer = player1;
    
    const switchPlayer = () => {
        currentPlayer = (currentPlayer === player1) ? player2 : player1;
    }

    const getMark = () => currentPlayer.getMark();

    const getName = () => currentPlayer.getName();

    const checkWin = () => {
        const values = gameboard.getBoard();
        const checkRow = (row) => row.every(cell => cell === currentPlayer.getMark());
        const checkCol = (col) => values.map(row => row[col]).every(cell => cell === currentPlayer.getMark());
        const checkDiag = () => {
            const diag1 = [values[0][0], values[1][1], values[2][2]];
            const diag2 = [values[0][2], values[1][1], values[2][0]];
            return diag1.every(cell => cell === currentPlayer.getMark()) || diag2.every(cell => cell === currentPlayer.getMark());
        };
        return values.some(checkRow) || values.some(checkCol) || checkDiag();
    };

    const play = (row, col) => {
        if (gameboard.slots[row][col].setValue(currentPlayer.getMark())) {
            
            if (checkWin()) {
                console.log(`${currentPlayer.getName()} wins!`);
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

    return { play };
    
};