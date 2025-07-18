// Add event listeners for player selection
document.getElementById('X').addEventListener('click', function() {
    selectPlayer('X');
});
document.getElementById('O').addEventListener('click', function() {
    selectPlayer('O');
});

let playerSymbol = null;
let computerSymbol = null;
let currentSymbol = 'X'; // Track whose turn it is
let gameOver = false; // Track if the game is over
let x_score = 0;
let o_score = 0;
let winner = null;

function selectPlayer(symbol) {
    playerSymbol = symbol;

    if (symbol === 'X') {
        computerSymbol = 'O';
    } else {
        computerSymbol = 'X';
    }
    currentSymbol = 'X'; // X always starts
    document.getElementById('player-selection').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
    document.getElementById('turn-message').innerText = `Player X's turn`;
    // If computer is X, let it play first
    if (computerSymbol === 'X') {
        setTimeout(computerMove, 500);
    }
}

// Update cell with player's symbol when clicked
function cellClicked(cell) {
    if (gameOver) return;
    if (cell.innerHTML !== '') return;
    if (currentSymbol !== playerSymbol) return; // Only allow player to play their turn
    cell.innerHTML = playerSymbol;
    if (checkWinner()) return;
    switchTurn();
    // Computer's turn
    if (!gameOver && currentSymbol === computerSymbol) {
        setTimeout(computerMove, 500);
    }
}
// Automatically switch turns
function switchTurn() {
    if (currentSymbol === 'X') {
        currentSymbol = 'O';
    } else {
        currentSymbol = 'X';
    }
    document.getElementById('turn-message').innerHTML = `Player ${currentSymbol}'s turn`;
}
// Add event listeners to each cell
const cells = document.getElementsByClassName('cell');
for (let cell of cells) {
    cell.addEventListener('click', function () {
        cellClicked(this);
    });
}
// Checking for a winner
function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (let combination of winningCombinations) {
        const [a, b, c] = combination;
        if (
            cells[a].innerHTML !== '' &&
            cells[a].innerHTML === cells[b].innerHTML &&
            cells[b].innerHTML === cells[c].innerHTML
        ) {
            winner = cells[a].innerHTML;
            document.getElementById('message').innerHTML = `Player ${winner} wins!`;
            document.getElementById('message').style.display = 'block';
            gameOver = true;
            updateScoreBoard();
            return true;
        }
    }
    // Check for a draw
    let isDraw = true;
    for (let cell of cells) {
        if (cell.innerHTML === '') {
            isDraw = false;
            break;
        }
    }
    if (isDraw) {
        winner = null;
        document.getElementById('message').innerHTML = "It's a draw!";
        document.getElementById('message').style.display = 'block';
        gameOver = true;
        updateScoreBoard();
        return true;
    }
    return false;
}
function resetGame() {
    for (let cell of cells) {
        cell.innerHTML = '';
    }
    gameOver = false;
    currentSymbol = 'X';
    document.getElementById('message').style.display = 'none';
    document.getElementById('turn-message').innerHTML = "Player X's turn";
    // If computer is X, let it play first after reset
    if (computerSymbol === 'X') {
        setTimeout(computerMove, 500);
    }
}
// Computer player logic
function computerMove() {
    if (gameOver) return;

    //Try to win
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].innerHTML === '') {
            cells[i].innerHTML = computerSymbol;
            if (checkWinner()) return;
            cells[i].innerHTML = '';
        }
        
    }
    // Try to block the player
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].innerHTML === '') {
            cells[i].innerHTML = playerSymbol;
            let win = false;
            // Check if this move would win for the player
            const winningCombinations = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8],
                [0, 3, 6], [1, 4, 7], [2, 5, 8],
                [0, 4, 8], [2, 4, 6]
            ];
            for (let combination of winningCombinations) {
                const [a, b, c] = combination;
                if (
                    cells[a].innerHTML === playerSymbol &&
                    cells[b].innerHTML === playerSymbol &&
                    cells[c].innerHTML === playerSymbol
                ) {
                    win = true;
                    break;
                }
            }
            cells[i].innerHTML = '';
            if (win) {
                cells[i].innerHTML = computerSymbol;
                checkWinner();
                switchTurn();
                return;
            }
        }
    }
    // Take any available cell
    let emptyCells = [];
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].innerHTML === '') emptyCells.push(i);
    }
    if (emptyCells.length > 0) {
        const move = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        cells[move].innerHTML = computerSymbol;
        checkWinner();
        switchTurn();
    }
}
function updateScoreBoard() {
    if (winner === 'X') {
        x_score++;
    } else if (winner === 'O') {
        o_score++;
    }
    document.getElementById('x-score').innerHTML = x_score;
    document.getElementById('o-score').innerHTML = o_score;
}

