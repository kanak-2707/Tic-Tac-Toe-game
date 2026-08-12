const cells = document.querySelectorAll(".cell");

const turnText = document.getElementById("turnText");
const message = document.getElementById("message");

const newGameBtn = document.getElementById("newGameBtn");
const resetScoreBtn = document.getElementById("resetScoreBtn");

const scoreX = document.getElementById("scoreX");
const scoreO = document.getElementById("scoreO");

const xName = document.getElementById("xName");
const oName = document.getElementById("oName");

const themeBtn = document.getElementById("themeBtn");

const modeButtons = document.querySelectorAll(".mode-btn");

const winnerModal = document.getElementById("winnerModal");
const winnerTitle = document.getElementById("winnerTitle");
const winnerSubtitle = document.getElementById("winnerSubtitle");
const modalBtn = document.getElementById("modalBtn");


// GAME VARIABLES

let board = ["", "", "", "", "", "", "", "", ""];

let currentPlayer = "X";

let gameActive = true;

let gameMode = "friend";


// LOAD SAVED SCORE

let xScore = Number(localStorage.getItem("ticTacToeX")) || 0;

let oScore = Number(localStorage.getItem("ticTacToeO")) || 0;


scoreX.textContent = xScore;
scoreO.textContent = oScore;


// WINNING PATTERNS

const winningPatterns = [

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]

];


// CELL CLICK

cells.forEach(cell => {

    cell.addEventListener("click", () => {

        const index = Number(cell.dataset.index);

        if (!gameActive) {
            return;
        }

        if (board[index] !== "") {
            return;
        }

        // Computer ki turn mein human click nahi karega
        if (gameMode === "computer" && currentPlayer === "O") {
            return;
        }

        makeMove(index, currentPlayer);

    });

});


// MAKE MOVE

function makeMove(index, player) {

    if (board[index] !== "") {
        return;
    }

    board[index] = player;

    cells[index].textContent = player;

    cells[index].classList.add(
        player.toLowerCase()
    );


    const result = checkWinner();

    if (result) {

        finishGame(result);

        return;
    }


    if (!board.includes("")) {

        finishDraw();

        return;
    }


    currentPlayer =
        currentPlayer === "X" ? "O" : "X";


    updateTurn();


    // COMPUTER MOVE

    if (
        gameMode === "computer" &&
        currentPlayer === "O" &&
        gameActive
    ) {

        turnText.textContent =
            "Computer is thinking...";

        setTimeout(computerMove, 500);

    }

}


// CHECK WINNER

function checkWinner() {

    for (const pattern of winningPatterns) {

        const a = board[pattern[0]];
        const b = board[pattern[1]];
        const c = board[pattern[2]];

        if (
            a !== "" &&
            a === b &&
            b === c
        ) {

            return {
                player: a,
                pattern: pattern
            };

        }

    }

    return null;

}


// FINISH GAME

function finishGame(result) {

    gameActive = false;

    result.pattern.forEach(index => {

        cells[index].classList.add("winner");

    });


    if (result.player === "X") {

        xScore++;

        scoreX.textContent = xScore;

        localStorage.setItem(
            "ticTacToeX",
            xScore
        );

    } else {

        oScore++;

        scoreO.textContent = oScore;

        localStorage.setItem(
            "ticTacToeO",
            oScore
        );

    }


    if (
        gameMode === "computer" &&
        result.player === "O"
    ) {

        winnerTitle.textContent =
            "🤖 Computer Wins!";

        winnerSubtitle.textContent =
            "Better luck next time!";

    } else {

        winnerTitle.textContent =
            `🎉 Player ${result.player} Wins!`;

        winnerSubtitle.textContent =
            "Congratulations!";

    }


    message.textContent =
        `Player ${result.player} won the game!`;


    setTimeout(() => {

        winnerModal.classList.add("show");

    }, 450);

}


// DRAW

function finishDraw() {

    gameActive = false;

    message.textContent =
        "🤝 It's a Draw!";

    winnerTitle.textContent =
        "🤝 It's a Draw!";

    winnerSubtitle.textContent =
        "Nobody won this round.";

    setTimeout(() => {

        winnerModal.classList.add("show");

    }, 350);

}


// COMPUTER

function computerMove() {

    if (!gameActive) {
        return;
    }


    let move = findBestMove();


    if (move !== -1) {

        makeMove(move, "O");

    }

}


// SMART COMPUTER

function findBestMove() {

    // 1. Computer winning move

    for (let i = 0; i < 9; i++) {

        if (board[i] === "") {

            board[i] = "O";

            if (checkWinner()) {

                board[i] = "";

                return i;

            }

            board[i] = "";

        }

    }


    // 2. Block Player X

    for (let i = 0; i < 9; i++) {

        if (board[i] === "") {

            board[i] = "X";

            if (checkWinner()) {

                board[i] = "";

                return i;

            }

            board[i] = "";

        }

    }


    // 3. Center

    if (board[4] === "") {

        return 4;

    }


    // 4. Corners

    const corners = [
        0,
        2,
        6,
        8
    ];


    const availableCorners =
        corners.filter(
            index => board[index] === ""
        );


    if (availableCorners.length > 0) {

        return availableCorners[
            Math.floor(
                Math.random() *
                availableCorners.length
            )
        ];

    }


    // 5. Any empty cell

    const available =
        board
            .map((value, index) =>
                value === "" ? index : null
            )
            .filter(index => index !== null);


    if (available.length > 0) {

        return available[
            Math.floor(
                Math.random() * available.length
            )
        ];

    }


    return -1;

}


// TURN UPDATE

function updateTurn() {

    if (
        gameMode === "computer" &&
        currentPlayer === "O"
    ) {

        turnText.textContent =
            "Computer's Turn";

    } else {

        turnText.textContent =
            `Player ${currentPlayer}'s Turn`;

    }

}


// NEW GAME

function newGame() {

    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];

    currentPlayer = "X";

    gameActive = true;


    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove(
            "x",
            "o",
            "winner"
        );

    });


    message.textContent = "";

    winnerModal.classList.remove("show");

    updateTurn();

}


// RESET SCORE

resetScoreBtn.addEventListener(
    "click",
    () => {

        xScore = 0;

        oScore = 0;

        scoreX.textContent = "0";

        scoreO.textContent = "0";


        localStorage.removeItem(
            "ticTacToeX"
        );

        localStorage.removeItem(
            "ticTacToeO"
        );


        newGame();

    }
);


// NEW GAME BUTTON

newGameBtn.addEventListener(
    "click",
    newGame
);


// MODAL PLAY AGAIN

modalBtn.addEventListener(
    "click",
    newGame
);


// MODE BUTTONS

modeButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            modeButtons.forEach(btn => {

                btn.classList.remove("active");

            });


            button.classList.add("active");


            gameMode =
                button.dataset.mode;


            if (gameMode === "computer") {

                xName.textContent =
                    "You";

                oName.textContent =
                    "Computer";

            } else {

                xName.textContent =
                    "Player X";

                oName.textContent =
                    "Player O";

            }


            newGame();

        }
    );

});


// DARK / LIGHT MODE

themeBtn.addEventListener(
    "click",
    () => {

        document.body.classList.toggle("dark");


        if (
            document.body.classList.contains("dark")
        ) {

            themeBtn.textContent = "☀️";

            localStorage.setItem(
                "ticTacToeTheme",
                "dark"
            );

        } else {

            themeBtn.textContent = "🌙";

            localStorage.setItem(
                "ticTacToeTheme",
                "light"
            );

        }

    }
);


// LOAD THEME

const savedTheme =
    localStorage.getItem(
        "ticTacToeTheme"
    );


if (savedTheme === "dark") {

    document.body.classList.add("dark");

    themeBtn.textContent = "☀️";

}