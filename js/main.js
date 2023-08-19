/* main js */
const messageHandler = ({ getGameStateMessage }) => {
    const elm = document.getElementById('message');

    return () => {
        const messageReset = () => {
            elm.textContent = '';
            elm.style.opacity = 0;
        };

        elm.textContent = getGameStateMessage();
        elm.style.opacity = 1;

        setTimeout(messageReset, 2000);
    };
};
/* DOM loaded */
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('grid-container');
    const controls = document.querySelectorAll('.controls');
    const startButton = document.getElementById('start');
    const resetButton = document.getElementById('reset');
    const game = controller();
    const displayMessage  = messageHandler(game);
    game._initGameboard(container);

    startButton.addEventListener('click', () => {
        game.startGame();
        displayMessage();
    });

    resetButton.addEventListener('click', () => {
        /* game.resetGame();
        displayMessage(); */
    });

    const renderControls = (id) => {
        return `
            <div class="input-group">
                <label for="name_${id}" class="name">Name:
                    <input type="text" name="name_${id}" id="name_${id}" class="editable" value="Player ${id}"></input>
                </label>
                <label for="player-type_${id}" class="player-select">Type:
                    <select name="player-type_${id}" id="player-type_${id}">
                        <option value="human">Human</option>
                        <option value="cpu">CPU</option>
                    </select>
                </label>
                <label for="difficulty_${id}" class="diff-select">Difficulty:
                    <select name="difficulty_${id}" id="difficulty_${id}" disabled>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </label>
                <div class="button" id="add-player_${id}">Ready</div>
            </div>
        `;
    };

    controls.forEach((control, index) => {
        const id = index + 1;
        const marker = id === 1 ? 'x' : 'o';

        control.innerHTML = renderControls(id);

        const playerName = document.getElementById(`name_${id}`);
        const playerSelect = document.getElementById(`player-type_${id}`);
        const diffSelect = document.getElementById(`difficulty_${id}`);

        playerSelect.addEventListener('change', (e) => {
            if (e.target.value === 'cpu') {
                diffSelect.removeAttribute('disabled');
            } else {
                diffSelect.setAttribute('disabled', '');
            }
        });

        control.addEventListener('click', (e) => {
            if (e.target.id === `add-player_${id}` && !e.target.classList.contains('ready')) {
                e.target.classList.add('ready');
                game.registerPlayer(playerName.value, marker, playerSelect.value);
                displayMessage();
            }
        });

    }); 

    const cells = document.querySelectorAll('.cell');

    cells.forEach(cell => {
        cell.addEventListener('click', (e) => {
            game.play(e);
            displayMessage();

            console.log(game.gameState)
        });
    });

});