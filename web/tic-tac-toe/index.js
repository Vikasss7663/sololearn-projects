const gameBoard = document.getElementById('gameBoard');
let board = [];
let currentPlayer = 'X'; // Player starts as X
let difficulty = 'easy';

function startGame(selectedDifficulty) {
    difficulty = selectedDifficulty;
    board = Array(9).fill(null);
    currentPlayer = 'X'; // Player always starts as X
    gameBoard.innerHTML = ''; // Clear the board

    // Create board cells
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.addEventListener('click', () => playerMove(i));
        gameBoard.appendChild(cell);
    }
}

function playerMove(index) {
    // Only allow move if cell is empty and game is not won
    if (!board[index] && !checkWin()) {
        board[index] = currentPlayer; // Set the cell to X
        updateBoard();
        if (!checkWin() && !isBoardFull()) {
            currentPlayer = 'O'; // Change to computer's turn
            setTimeout(computerMove, 500); // Computer makes a move after a delay
        }
    }
}

function computerMove() {
    // Check if the game is already won or the board is full
    if (checkWin() || isBoardFull()) {
        return;
    }

    let index;
    // Difficulty based move decision
    if (difficulty === 'easy') {
        index = easyMove();
    } else if (difficulty === 'medium') {
        index = mediumMove();
    } else {
        index = hardMove();
    }

    if (index !== undefined) {
        board[index] = currentPlayer; // Set the cell to O for computer
        updateBoard();
        currentPlayer = 'X'; // Change back to player's turn
    }
}

function easyMove() {
    let index;
    do {
        index = Math.floor(Math.random() * 9);
    } while (board[index]);
    return index;
}

// Placeholder functions for medium and hard moves
function mediumMove() {
    // Implement medium difficulty logic
    let index;

    // Check for a winning move
    index = findWinningMove('O');
    if (index !== undefined) return index;

    // Block player's winning move
    index = findWinningMove('X');
    if (index !== undefined) return index;

    // Make a random move
    return easyMove();
}

function hardMove() {
    // Implement hard difficulty logic
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < board.length; i++) {
        if (!board[i]) {
            board[i] = 'O'; // Computer's move
            let score = minimax(board, 0, false);
            board[i] = null; // Undo move

            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    return move;
}

function minimax(board, depth, isMaximizing) {
    if (checkWin()) {
        return isMaximizing ? -10 : 10;
    } else if (isBoardFull()) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;

        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = null;
                bestScore = Math.max(score, bestScore);
            }
        }

        return bestScore;
    } else {
        let bestScore = Infinity;

        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = null;
                bestScore = Math.min(score, bestScore);
            }
        }

        return bestScore;
    }
}

function updateBoard() {
    board.forEach((cell, index) => {
        gameBoard.children[index].textContent = cell;
    });

    if (checkWin()) {
        setTimeout(() => alert(`${currentPlayer} wins!`), 100);
        setTimeout(startGame.bind(null, difficulty), 2000); // Restart the game with the same difficulty
    } else if (isBoardFull()) {
        setTimeout(() => alert("It's a tie!"), 100);
        setTimeout(startGame.bind(null, difficulty), 2000); // Restart the game with the same difficulty
    }
}

function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    return winPatterns.some(pattern => {
        const firstCell = board[pattern[0]];
        return firstCell && pattern.every(index => board[index] === firstCell);
    });
}

function isBoardFull() {
    return board.every(cell => cell !== null);
}

startGame('easy'); // Start the game with easy difficulty by default
