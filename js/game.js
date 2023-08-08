/* game.js */
const cell = () => {
    let value = null;

    const getValue = () => value;
    const setValue = newValue => value = newValue;

    return { getValue, setValue };
};

const gameboard = (() => {

    let slots = ['col1', 'col2', 'col3'].map(col => {
        return ['row1', 'row2', 'row3'].map(row => {
            return cell();
        });
    });

    const getBoard = () => slots;

    return { slots };
})();