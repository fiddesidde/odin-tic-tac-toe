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

const DOM = (() => {
    const container = document.querySelector('#container');
    const body = document.querySelector('body');
    const inputP1 = document.createElement('input');
    const inputP2 = document.createElement('input');

    const createSetUpView = () => {
        container.style.display = 'none';

        const setUpCont = document.createElement('div');
        setUpCont.id = 'setUpCont';
        const setUpCard = document.createElement('div');
        setUpCard.className = 'card';
        setUpCard.id = 'su-card';

        const p1Div = document.createElement('div');
        p1Div.id = 'winner';
        p1Div.textContent = `Player 1, enter your name:`;
        inputP1.type = 'text';

        const p2Div = document.createElement('div');
        p2Div.id = 'winner';
        p2Div.textContent = `Player 2, enter your name:`;
        inputP2.type = 'text';

        const submitBtn = document.createElement('button');
        submitBtn.textContent = 'GO!';
        submitBtn.style.display = 'block';
        submitBtn.addEventListener('click', () => {
            Game.run([inputP1.value, inputP2.value]);
            removeSetUpView();
        });

        setUpCard.appendChild(p1Div);
        setUpCard.appendChild(inputP1);
        setUpCard.appendChild(p2Div);
        setUpCard.appendChild(inputP2);
        setUpCard.appendChild(submitBtn);
        setUpCont.appendChild(setUpCard);
        body.appendChild(setUpCont);
    };

    const removeSetUpView = () => {
        const cont = document.querySelector('#setUpCont');
        container.style.display = 'flex';
        body.removeChild(cont);
    };

    return { createSetUpView };
})();

const Game = (() => {
    let p1 = '';
    let p2 = '';
    let currentPlayer = null;

    const createPlayers = nameArray => {
        p1 = Player(nameArray[0], 'X');
        p2 = Player(nameArray[1], 'O');
    };

    const run = nameArray => {
        createPlayers(nameArray);
        currentPlayer = p1;
        Display.setCurrentPlayerDiv();
        Display.setPlayerNameDisplay();
    };

    const getPlayers = () => [p1, p2];

    const getCurrentPlayer = () => currentPlayer;

    const nextPlayer = () => {
        currentPlayer = currentPlayer === p1 ? p2 : p1;
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

    return { play, getPlayers, getCurrentPlayer, createPlayers, reset, run };
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

    const setPlayerNameDisplay = () => {
        playernames[0].textContent = Game.getPlayers()[0].getName();
        playernames[1].textContent = Game.getPlayers()[1].getName();
    };

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

    return { setCurrentPlayerDiv, showWinner, reset, setPlayerNameDisplay };
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

DOM.createSetUpView();
