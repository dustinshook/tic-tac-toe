/* main js */
/* DOM loaded */

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('grid-container');
    const controls = document.querySelectorAll('.controls');

    const displayMessage = (text) => {
        const messageReset = () => {
            message.textContent = '';
            message.style.opacity = 0;
        };

        message.textContent = text;
        message.style.opacity = 1;

        setTimeout(messageReset, 3000);
    };

    const game = controller();
    game._initGameboard(container);

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
        const message = document.getElementById('message');

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
                game.registerPlayer(playerName.value, marker);
                displayMessage(game.getGameStateMessage());
            }
        });

    }); 

    const cells = document.querySelectorAll('.cell');

    cells.forEach(cell => {
        cell.addEventListener('click', (e) => {
            displayMessage(game.play(e));
        });
    });

});