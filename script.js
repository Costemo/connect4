document.addEventListener("DOMContentLoaded", function() {
    let rows = 12;
    let cols = 14;
    let currentPlayer = 1;
    let winner = null;
    let board = [];
    let gameBoard = document.getElementById('game-board');
    let turnMessage = document.getElementById('turn-message');
    let winnerMessage = document.getElementById('winner-message');
    let resetBtn = document.getElementById('reset-btn');
    let resizeBtn = document.getElementById('resize-btn');

    // Initialize the game
    initializeBoard();

    // Add event listener for Reset button
    resetBtn.addEventListener('click', function() {
        resetBoard();
    });

    // Add event listener for Resize button
    resizeBtn.addEventListener('click', function() {
        let newRows = parseInt(prompt("Enter new number of rows (min 4, max 10):", rows));
        let newCols = parseInt(prompt("Enter new number of columns (min 4, max 10):", cols));

        if (isValidSize(newRows, newCols)) {
            rows = newRows;
            cols = newCols;
            resetBoard();
        } else {
            alert("Invalid board size! Please enter a number between 4 and 10.");
        }
    });

    function isValidSize(rows, cols) {
        return rows >= 4 && rows <= 10 && cols >= 4 && cols <= 10;
    }

    // function initializeBoard() {
    //     // Clear previous board if any
    //     gameBoard.innerHTML = '';

    //     // Initialize the board array with zeros
    //     board = [];
    //     for (let row = 0; row < rows; row++) {
    //         board[row] = Array.from({ length: cols }, () => 0);
    //     }
    
    //     // Create HTML elements for the game board
    //     for (let row = 0; row < rows; row++) {
    //         for (let col = 0; col < cols; col++) {
    //             let cell = document.createElement('div');
    //             cell.classList.add('cell');
    //             cell.dataset.row = row;
    //             cell.dataset.col = col;
    //             gameBoard.appendChild(cell);
    //         }
    //     }
    
    //     // Add event listeners to each cell for handling player moves
    //     const cells = document.querySelectorAll('.cell');
    //     cells.forEach(cell => {
    //         cell.addEventListener('click', () => {
    //             const col = parseInt(cell.getAttribute('data-col'));
    //             dropPiece(col);
    //         });
    //     });
    
    //     // Reset initial game state
    //     currentPlayer = 1;
    //     winner = null;
    //     turnMessage.textContent = `Player ${currentPlayer}'s Turn`;
    //     winnerMessage.textContent = '';
    // }

      // Function to initialize the board
      function initializeBoard() {
        // Clear existing board
        gameBoard.innerHTML = '';

        // Reset board array only on initial game start
        if (winner === null) {
            board = [];
            for (let row = 0; row < rows; row++) {
                board[row] = Array(cols).fill(0); // Initialize each row with zeros
            }
        }

        // Create HTML elements for the game board
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.setAttribute('data-row', row);
                cell.setAttribute('data-col', col);

                // Add 'used' class to cells that were used in previous rounds
                if (board[row][col] !== 0) {
                    cell.classList.add('used');
                    cell.style.backgroundColor = board[row][col] === 1 ? 'red' : 'yellow';
                }

                cell.addEventListener('click', function() {
                    const col = parseInt(cell.getAttribute('data-col'));
                    dropPiece(col);
                })

                gameBoard.appendChild(cell);
            }
        }
        
        updateBoardStyle(); // Update cell sizes based on current board dimensions

        // Add event listeners to each cell for handling player moves
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.addEventListener('click', () => {
                const col = parseInt(cell.getAttribute('data-col'));
                dropPiece(col);
            });
        });

        currentPlayer = 1;
        winner = null;
        winnerMessage.textContent = '';
        turnMessage.textContent = `Player ${currentPlayer}'s Turn`;
    }
    
      // Function to drop a piece into the specified column
      function dropPiece(col) {
        if (winner !== null) return; // Game over

        // Find the lowest available row in the specified column
        for (let row = rows - 1; row >= 0; row--) {
            if (board[row][col] === 0) {
                board[row][col] = currentPlayer;
                const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
                cell.style.backgroundColor = currentPlayer === 1 ? 'red' : 'yellow';
                cell.classList.add('used'); // Mark cell as used for current round
                if (checkForWin(row, col)) {
                    winner = currentPlayer;
                    winnerMessage.textContent = `Player ${currentPlayer} wins!`;

                    // Mark winning cells as used
                    markWinningCells(row, col, currentPlayer);

                    setTimeout(nextRound, 3000); // Proceed to next round after 3 seconds
                } else {
                    currentPlayer = currentPlayer === 1 ? 2 : 1;
                    turnMessage.textContent = `Player ${currentPlayer}'s Turn`;
                }
                return;
            }
        }
    }

        // Function to proceed to the next round
        function nextRound() {
            // Reset only the game messages and switch player
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            winner = null;
            winnerMessage.textContent = '';
            turnMessage.textContent = `Player ${currentPlayer}'s Turn`;
        }
    
    // function resetBoard() {
    //     initializeBoard();
    // }
    
    function markWinningCells(row, col, player) {
        const color = player === 1 ? 'red' : 'yellow';
        
        // Mark horizontally
        let count = 1;
        for (let i = col - 1; i >= 0 && board[row][i] === player; i--) count++;
        for (let i = col + 1; i < cols && board[row][i] === player; i++) count++;
        if (count >= 4) {
            for (let i = col - count + 1; i <= col + count - 1; i++) {
                const cell = document.querySelector(`[data-row='${row}'][data-col='${i}']`);
                cell.classList.add('used');
            }
        }
    
        // Mark vertically
        count = 1;
        for (let i = row - 1; i >= 0 && board[i][col] === player; i--) count++;
        for (let i = row + 1; i < rows && board[i][col] === player; i++) count++;
        if (count >= 4) {
            for (let i = row - count + 1; i <= row + count - 1; i++) {
                const cell = document.querySelector(`[data-row='${i}'][data-col='${col}']`);
                cell.classList.add('used');
            }
        }
    
        // Diagonal checks omitted for brevity (similar logic as horizontal and vertical)
    }

    function checkForWin(row, col) {
        const color = board[row][col];
        
        // Check horizontally
        let count = 1;
        for (let i = col - 1; i >= 0 && board[row][i] === color; i--) count++;
        for (let i = col + 1; i < cols && board[row][i] === color; i++) count++;
        if (count >= 4) return true;

        // Check vertically
        count = 1;
        for (let i = row - 1; i >= 0 && board[i][col] === color; i--) count++;
        for (let i = row + 1; i < rows && board[i][col] === color; i++) count++;
        if (count >= 4) return true;

        // Check diagonally (top-left to bottom-right)
        count = 1;
        for (let i = 1; row - i >= 0 && col - i >= 0 && board[row - i][col - i] === color; i++) count++;
        for (let i = 1; row + i < rows && col + i < cols && board[row + i][col + i] === color; i++) count++;
        if (count >= 4) return true;

        // Check diagonally (top-right to bottom-left)
        count = 1;
        for (let i = 1; row - i >= 0 && col + i < cols && board[row - i][col + i] === color; i++) count++;
        for (let i = 1; row + i < rows && col - i >= 0 && board[row + i][col - i] === color; i++) count++;
        if (count >= 4) return true;
        
        return false;
    }
});


