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

        usedCells = [];

        // Create HTML elements for the game board
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.setAttribute('data-row', row);
                cell.setAttribute('data-col', col);

                // Add 'used' class to cells that were used in previous rounds
                if (isCellUsed(row, col)) {
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

        // Function to check if a cell was used in previous rounds
        function isCellUsed(row, col) {
            return usedCells.some(cell => cell.row === row && cell.col === col);
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
                // cell.classList.add('used'); // Mark cell as used for current round
                if (checkForWin(row, col)) {
                    winner = currentPlayer;
                    winnerMessage.textContent = `Player ${currentPlayer} wins!`;

                    markWinningCells(row, col);
                    // markAllCellsUsed();
                    markLosingCells()

                    setTimeout(nextRound, 3000); // Proceed to next round after 3 seconds
                } else {
                    currentPlayer = currentPlayer === 1 ? 2 : 1;
                    turnMessage.textContent = `Player ${currentPlayer}'s Turn`;
                }
                return;
            }
        }
    }

    let previousWinningCells = [];

        // Function to proceed to the next round
        function nextRound() {
            // Reset only the game messages and switch player
            markAllCellsUsed();
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            winner = null;
            winnerMessage.textContent = '';
            turnMessage.textContent = `Player ${currentPlayer}'s Turn`;

            previousWinningCells = [];
        }
    
    // function resetBoard() {
    //     initializeBoard();
    // }
    
        // Function to mark winning cells with animation and change losing cells
function markWinningCells(row, col) {
    const color = currentPlayer === 1 ? 'red' : 'yellow';
    const winningSequence = findWinningSequence(row, col);

    if (winningSequence) {
        // Sequentially apply animation to winning cells
        for (let i = 0; i < winningSequence.length; i++) {
            setTimeout(() => {
                const { row, col } = winningSequence[i];
                const cellElement = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
                cellElement.style.backgroundColor = color;
                cellElement.style.transform = 'scale(1.2)';
                cellElement.style.transition = 'transform 0.3s ease';
                if (i === winningSequence.length - 1) {
                    setTimeout(() => {
                        markLosingCells();
                        setTimeout(nextRound, 1000); // Proceed to next round after a delay
                    }, 300);
                }
            }, i * 200);
        }
    }
}

function markLosingCells() {
    // Change color of losing cells to the winning player's color
    const winningColor = currentPlayer === 1 ? 'red' : 'yellow';
    const losingColor = currentPlayer === 1 ? 'yellow' : 'red';

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            if (board[row][col] !== currentPlayer && board[row][col] !== 0 && !isCellUsed(row, col)) {
                const cellElement = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
                // Check if the cell was used in the current round
                if (!cellElement.classList.contains('used')) {
                    // Apply pop animation and change color to winning color
                    setTimeout(() => {
                        cellElement.style.transform = 'scale(1.2)';
                        cellElement.style.transition = 'transform 0.3s ease';
                        cellElement.style.backgroundColor = winningColor;
                    }, 200); // Adjust delay as needed for proper animation timing
                }
            }
        }
    }
}



// Function to mark losing cells from the current round
// function markLosingCells() {
//     // Change color of losing cells to the winning player's color
//     const winningColor = currentPlayer === 1 ? 'red' : 'yellow';
//     const losingColor = currentPlayer === 1 ? 'yellow' : 'red';

//     for (let row = 0; row < rows; row++) {
//         for (let col = 0; col < cols; col++) {
//             if (board[row][col] !== currentPlayer && board[row][col] !== 0) {
//                 const cellElement = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
//                 // Apply pop animation and change color to winning color
//                 setTimeout(() => {
//                     cellElement.style.transform = 'scale(1.2)';
//                     cellElement.style.transition = 'transform 0.3s ease';
//                     cellElement.style.backgroundColor = winningColor;
//                 }, 100); // Adjust delay as needed for proper animation timing
//             }
//         }
//     }
// }


    // Function to mark all used cells after the round
    function markAllCellsUsed() {
        // Mark all cells used in the current round
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (board[row][col] !== 0) {
                    usedCells.push({ row, col }); // Track this cell as used
                }
            }
        }

        // Apply 'used' class to cells that were used in previous rounds
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            const row = parseInt(cell.getAttribute('data-row'));
            const col = parseInt(cell.getAttribute('data-col'));
            if (isCellUsed(row, col)) {
                cell.classList.add('used');
            }
        });
    }

    function checkForWin(row, col) {
        const color = board[row][col];
    
        // Check horizontally
        let count = 1;
        for (let i = col - 1; i >= 0 && board[row][i] === color && !document.querySelector(`[data-row='${row}'][data-col='${i}']`).classList.contains('used'); i--) count++;
        for (let i = col + 1; i < cols && board[row][i] === color && !document.querySelector(`[data-row='${row}'][data-col='${i}']`).classList.contains('used'); i++) count++;
        if (count >= 4) return true;
    
        // Check vertically
        count = 1;
        // Check above
        for (let i = row - 1; i >= 0 && board[i][col] === color && !document.querySelector(`[data-row='${i}'][data-col='${col}']`).classList.contains('used'); i--) count++;
        // Check below
        for (let i = row + 1; i < rows && board[i][col] === color && !document.querySelector(`[data-row='${i}'][data-col='${col}']`).classList.contains('used'); i++) count++;
        if (count >= 4) return true;
    
        // Check diagonally (top-left to bottom-right)
        count = 1;
        for (let i = 1; row - i >= 0 && col - i >= 0 && board[row - i][col - i] === color && !document.querySelector(`[data-row='${row - i}'][data-col='${col - i}']`).classList.contains('used'); i++) count++;
        for (let i = 1; row + i < rows && col + i < cols && board[row + i][col + i] === color && !document.querySelector(`[data-row='${row + i}'][data-col='${col + i}']`).classList.contains('used'); i++) count++;
        if (count >= 4) return true;
    
        // Check diagonally (top-right to bottom-left)
        count = 1;
        for (let i = 1; row - i >= 0 && col + i < cols && board[row - i][col + i] === color && !document.querySelector(`[data-row='${row - i}'][data-col='${col + i}']`).classList.contains('used'); i++) count++;
        for (let i = 1; row + i < rows && col - i >= 0 && board[row + i][col - i] === color && !document.querySelector(`[data-row='${row + i}'][data-col='${col - i}']`).classList.contains('used'); i++) count++;
        if (count >= 4) return true;
    
        return false;
    }
    
        // Function to find the winning sequence of cells
        function findWinningSequence(row, col) {
            const color = board[row][col];
            const directions = [
                { row: 0, col: 1 },  // Horizontal
                { row: 1, col: 0 },  // Vertical
                { row: 1, col: 1 },  // Diagonal \
                { row: -1, col: 1 }  // Diagonal /
            ];
    
            for (let dir of directions) {
                let count = 1;
                let sequence = [{ row, col }];
    
                // Check one direction
                for (let delta = -1; delta <= 1; delta += 2) {
                    let r = row + delta * dir.row;
                    let c = col + delta * dir.col;
                    while (r >= 0 && r < rows && c >= 0 && c < cols && board[r][c] === color) {
                        count++;
                        sequence.push({ row: r, col: c });
                        r += delta * dir.row;
                        c += delta * dir.col;
                    }
                }
    
                if (count >= 4) {
                    return sequence;
                }
            }
    
            return null;
        }


});



