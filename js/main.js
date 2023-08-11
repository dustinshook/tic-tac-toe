/* main js */
/* DOM loaded */

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('grid-container');
    const controls = document.getElementById('controls');

    const game = controller();
    game._initGameboard(container);

    controls.innerHTML = `
        <div class="button" id="play">Let's Play!</div>
    `;

    

});