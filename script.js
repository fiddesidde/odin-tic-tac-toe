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

    const createSetUpView = () => {
        container.style.display = 'none';

        const setUpContainer = document.createElement('div');
        setUpContainer.id = 'setUpCont';
        const setUpCard = document.createElement('div');
        setUpCard.className = 'card';
        setUpCard.id = 'su-card';

        const p1Div = document.createElement('div');
        p1Div.id = 'winner';
        p1Div.textContent = `Player 1, enter your name:`;

        const inputP1 = document.createElement('input');
        inputP1.type = 'text';
        inputP1.maxLength = 14;

        const p2Div = document.createElement('div');
        p2Div.id = 'winner';
        p2Div.textContent = `Player 2, enter your name:`;

        const inputP2 = document.createElement('input');
        inputP2.type = 'text';
        inputP2.maxLength = 14;

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
        setUpContainer.appendChild(setUpCard);
        body.appendChild(setUpContainer);
    };

    const createFinalScoreView = () => {
        const winCardScores = document.querySelector('#win-card-scores');
        const winCardButtons = document.querySelector('#win-card-buttons');

        const players = Game.getPlayers();
        const player1Name = players[0].getName();
        const player2Name = players[1].getName();
        const player1Score = players[0].getScore();
        const player2Score = players[1].getScore();

        p1Div = document.createElement('div');
        p1Div.textContent = `${player1Name}: ${player1Score}`;
        p1Div.className = 'final-score';
        p2Div = document.createElement('div');
        p2Div.textContent = `${player2Name}: ${player2Score}`;
        p2Div.className = 'final-score';

        winCardScores.appendChild(p1Div);
        winCardScores.appendChild(p2Div);

        const buttons = createPlayAgainButtons();

        buttons.forEach(btn => winCardButtons.appendChild(btn));
    };

    const getFinalScoreDivs = () => document.querySelectorAll('.final-score');

    const resetFinalScoreView = () => {
        const winCardScores = document.querySelector('#win-card-scores');
        const winCardButtons = document.querySelector('#win-card-buttons');
        winCardScores.innerHTML = '';
        winCardButtons.innerHTML = '';
    };

    const createPlayAgainButtons = () => {
        const buttonsData = [
            {
                textC: 'Play Again',
                cls: 'once-more',
            },
            {
                textC: 'Reset',
                cls: 'once-more',
            },
        ];
        const buttons = [];

        for (btn of buttonsData) {
            let DOMButton = document.createElement('button');
            DOMButton.textContent = btn.textC;
            DOMButton.className += btn.cls;
            buttons.push(DOMButton);
        }
        buttons[0].addEventListener('click', () => {
            Game.playAgain();
        });
        buttons[1].addEventListener('click', () => {
            Game.reset();
            createSetUpView();
        });
        return buttons;
    };

    const removeSetUpView = () => {
        const cont = document.querySelector('#setUpCont');
        container.style.display = 'flex';
        body.removeChild(cont);
    };

    return {
        createSetUpView,
        createPlayAgainButtons,
        createFinalScoreView,
        getFinalScoreDivs,
        resetFinalScoreView,
    };
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
        DOM.createFinalScoreView();
    };

    const getPlayers = () => [p1, p2];

    const getCurrentPlayer = () => currentPlayer;

    const nextPlayer = () => {
        currentPlayer = currentPlayer === p1 ? p2 : p1;
        Display.setCurrentPlayerDiv();
    };

    const reset = () => {
        const players = getPlayers();
        for (const player of players) player.resetScore();
        currentPlayer = p1;
        Display.updateScore();
        Display.reset();
        Gameboard.reset();
        DOM.resetFinalScoreView();
    };

    const playAgain = () => {
        Display.reset();
        Gameboard.reset();
    };

    const endOfRound = winner => {
        if (winner === 'tie') {
            return Display.showWinner('tie');
        }
        const player = getCurrentPlayer();
        player.increaseScore();
        Display.updateScore();
        Display.showWinner(player.getName());
    };

    const addMark = e => {
        const player = getCurrentPlayer();
        Gameboard.addSymbol(player, e.target.id);
        const winner = Gameboard.checkWinState();
        if (winner) {
            endOfRound(winner);
        }
        nextPlayer();
    };

    return {
        addMark,
        getPlayers,
        getCurrentPlayer,
        createPlayers,
        reset,
        run,
        playAgain,
    };
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
    const winnerText = document.querySelector('#win-card-text');
    const asides = document.querySelectorAll('.aside');

    const setPlayerNameDisplay = () => {
        playernames[0].textContent = Game.getPlayers()[0].getName();
        playernames[1].textContent = Game.getPlayers()[1].getName();
    };

    const showWinner = playerName => {
        board.style.display = 'none';
        if (playerName === 'tie') winnerText.textContent = 'It was a tie!';
        else winnerText.textContent = `Congratulations! ${playerName} wins!`;
        winCard.style.display = 'flex';
        asides.forEach(aside => {
            aside.style.display = 'none';
        });
    };

    const updateScore = () => {
        const p1score = document.querySelector('#p1-score');
        const p2score = document.querySelector('#p2-score');
        const finalScoreDivs = DOM.getFinalScoreDivs();
        const player1 = Game.getPlayers()[0];
        const player2 = Game.getPlayers()[1];
        const player1score = player1.getScore();
        const player2score = player2.getScore();
        p1score.textContent = player1score;
        p2score.textContent = player2score;
        finalScoreDivs[0].textContent = `${player1.getName()}: ${player1score}`;
        finalScoreDivs[1].textContent = `${player2.getName()}: ${player2score}`;
    };

    const reset = () => {
        setCurrentPlayerDiv();
        board.style.display = 'flex';
        winCard.style.display = 'none';
        asides.forEach(aside => {
            aside.style.display = 'flex';
        });
    };

    const setCurrentPlayerDiv = () => {
        curPlayerDiv.textContent = Game.getCurrentPlayer().getName();
    };

    return {
        setCurrentPlayerDiv,
        showWinner,
        reset,
        setPlayerNameDisplay,
        updateScore,
    };
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
            Game.addMark(e);
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
