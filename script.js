// Player Factory
const Player = (name, symbol) => {
    let score = 0;
    const getName = () => name;
    const getSymbol = () => symbol;
    const getScore = () => score;
    const increaseScore = () => {
        score++;
    };
    const resetScore = () => {
        score = 0;
    };
    return { getName, getSymbol, getScore, increaseScore, resetScore };
};

const Game = (() => {
    const getPlayerNameFromUser = player => {
        // let answer = '';
        // do {
        //     answer = prompt(`Enter name of ${player}!`);
        // } while (!answer);
        // return answer;
        return player;
    };
    const p1 = Player(getPlayerNameFromUser('player 1'), 'X');
    const p2 = Player(getPlayerNameFromUser('player 2'), 'O');
    const players = [p1, p2];

    let currentPlayer = p1;

    const getCurrentPlayer = () => currentPlayer;

    const nextPlayer = () => {
        currentPlayer = currentPlayer === p1 ? p2 : p1;
        // if (currentPlayer === p1) currentPlayer = p2;
        // else currentPlayer = p1;
        Display.setCurrentPlayerDiv();
    };

    const reset = () => {
        currentPlayer = p1;
        Display.reset();
        Gameboard.reset();
    };

    const endOfRound = winner => {
        Display.showWinner(winner.getName());
        winner.increaseScore();
    };

    const play = e => {
        const player = getCurrentPlayer();
        Gameboard.addSymbol(player, e.target.id);
        if (Gameboard.checkWinState()) {
            endOfRound(player);
        }
        nextPlayer();
    };

    return { play, players, getCurrentPlayer, reset };
})();

const Display = (() => {
    const resetBtn = document.querySelector('#reset');
    resetBtn.addEventListener('click', () => {
        Game.reset();
    });
    const curPlayerDiv = document.querySelector('#cur-player');
    const playernames = document.querySelectorAll('.player-name');
    const board = document.querySelector('#board');
    const winCard = document.querySelector('#win-card');
    const winnerSpan = document.querySelector('#winner');
    const asides = document.querySelectorAll('.aside');

    playernames[0].textContent = Game.players[0].getName();
    playernames[1].textContent = Game.players[1].getName();

    const showWinner = playerName => {
        board.style.display = 'none';
        winnerSpan.textContent = playerName;
        winCard.style.display = 'flex';
        asides.forEach(aside => {
            aside.style.display = 'none';
        });
    };

    const reset = () => {
        setCurrentPlayerDiv();
        board.style.display = 'flex';
        winCard.style.display = 'none';
    };

    const setCurrentPlayerDiv = () => {
        curPlayerDiv.textContent = Game.getCurrentPlayer().getName();
    };
    setCurrentPlayerDiv();

    return { setCurrentPlayerDiv, showWinner, reset };
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
    };

    slots.forEach(slot => {
        slot.addEventListener('click', e => {
            Game.play(e);
        });
    });

    const checkWinState = () => {
        for (let i = 0; i < 3; i++)
            if (
                gameboardArray[i] === gameboardArray[i + 3] &&
                gameboardArray[i + 3] === gameboardArray[i + 6] &&
                gameboardArray[i] !== undefined
            )
                return gameboardArray[i];

        for (let i = 0; i < 7; i = i + 3)
            if (
                gameboardArray[i] === gameboardArray[i + 1] &&
                gameboardArray[i + 1] === gameboardArray[i + 2] &&
                gameboardArray[i] !== undefined
            )
                return gameboardArray[i];

        if (
            gameboardArray[0] === gameboardArray[4] &&
            gameboardArray[4] === gameboardArray[8] &&
            gameboardArray[0] !== undefined
        )
            return gameboardArray[0];

        if (
            gameboardArray[2] === gameboardArray[4] &&
            gameboardArray[4] === gameboardArray[6] &&
            gameboardArray[2] !== undefined
        )
            return gameboardArray[2];

        if (!gameboardArray.includes(undefined) && gameboardArray.length === 9)
            return 'tie';
    };

    return { addSymbol, reset, checkWinState };
})();
