const Player = (name, symbol) => {
    const getName = () => name;
    const getSymbol = () => symbol;
    return { getName, getSymbol };
};

const Game = (() => {
    const resetBtn = document.querySelector('#reset');
    resetBtn.addEventListener('click', () => {
        reset();
    });

    const getPlayerNameFromUser = player => {
        let answer = '';
        do {
            answer = prompt(`Enter name of ${player}!`);
        } while (!answer);
        return answer;
    };

    const p1 = Player(getPlayerNameFromUser('player 1'), 'X');
    const p2 = Player(getPlayerNameFromUser('player 2'), 'O');
    const playernames = document.querySelectorAll('.player-name');

    playernames[0].textContent = p1.getName();
    playernames[1].textContent = p2.getName();

    let currentPlayer = p1;

    const getCurrentPlayer = () => currentPlayer;

    const nextPlayer = () => {
        if (currentPlayer === p1) currentPlayer = p2;
        else currentPlayer = p1;
    };

    const reset = () => {
        currentPlayer = p1;
        Gameboard.reset();
    };

    return { getCurrentPlayer, nextPlayer, reset };
})();

const Gameboard = (() => {
    const slots = document.querySelectorAll('.slot');
    let gameboardArray = [];

    const reset = () => {
        gameboardArray = [];
        update();
    };

    const update = () => {
        for (let i = 0; i < 9; i++) {
            slots[i].textContent = gameboardArray[i];
        }
    };

    const addSymbol = (player, position) => {
        const slot = slots[position];
        const symbol = player.getSymbol();
        if (slot.textContent) return;

        slot.textContent = symbol;
        gameboardArray[position] = symbol;
        let win = checkWinState();
        console.log(win);
        console.log(gameboardArray);

        if (win) {
            alert(win);
            Game.reset();
        }

        Game.nextPlayer();
    };

    slots.forEach((slot, index) => {
        slot.addEventListener('click', e => {
            console.log(e);

            addSymbol(Game.getCurrentPlayer(), index);
        });
    });

    const checkWinState = () => {
        console.log('and here');

        for (let i = 0; i < 3; i++)
            if (
                gameboardArray[i] === gameboardArray[i + 3] &&
                gameboardArray[i + 3] === gameboardArray[i + 6]
            ) {
                console.log('here');

                return gameboardArray[i];
            }
        for (let i = 0; i < 7; i = i + 3)
            if (
                gameboardArray[i] === gameboardArray[i + 1] &&
                gameboardArray[i + 1] === gameboardArray[i + 2]
            )
                return gameboardArray[i];

        if (
            gameboardArray[0] === gameboardArray[4] &&
            gameboardArray[4] === gameboardArray[8]
        )
            return gameboardArray[0];

        if (
            gameboardArray[2] === gameboardArray[4] &&
            gameboardArray[4] === gameboardArray[6]
        )
            return gameboardArray[2];

        if (!gameboardArray.includes(undefined)) return 'tie';
    };

    return { update, addSymbol, reset, checkWinState };
})();
