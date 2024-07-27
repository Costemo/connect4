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
    let startBtn = document.getElementById("start-btn");
    let player1ScoreDiv = document.getElementById('player-1-score');
    let player2ScoreDiv = document.getElementById('player-2-score');
    let player1NameInput = document.getElementById('player1-name');
let player2NameInput = document.getElementById('player2-name');



    gameBoard.style.display = 'none';

    // Add event listener for Reset button
resetBtn.addEventListener('click', function() {
    resetBoard();
});



// Function to reset the game board and state
function resetBoard() {
    currentPlayer = 1;
    winner = null;
    board = [];
    usedCells = [];
    gameBoard.innerHTML = ''; // Clear the game board

    // Reinitialize the board with new dimensions
    initializeBoard();
    winnerMessage.textContent = '';
    turnMessage.textContent = `Player ${currentPlayer}'s Turn`;
}

    // Initialize the game
    initializeBoard();

    // Add event listener for Reset button
    resetBtn.addEventListener('click', function() {
        resetBoard();
    });

    // Add event listener for Resize button
    // resizeBtn.addEventListener('click', function() {
    //     let newRows = parseInt(prompt("Enter new number of rows (min 4, max 10):", rows));
    //     let newCols = parseInt(prompt("Enter new number of columns (min 4, max 10):", cols));

    //     if (isValidSize(newRows, newCols)) {
    //         rows = newRows;
    //         cols = newCols;
    //         resetBoard();
    //     } else {
    //         alert("Invalid board size! Please enter a number between 4 and 10.");
    //     }
    // });

    // function isValidSize(rows, cols) {
    //     return rows >= 4 && rows <= 10 && cols >= 4 && cols <= 10;
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

     
        
        
        
        // updateBoardStyle(); // Update cell sizes based on current board dimensions

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

    function startGame() {
        player1Name = player1NameInput.value.trim();
        player2Name = player2NameInput.value.trim();
        
        if (player1Name === '' || player2Name === '') {
            alert("Please enter names for both players.");
            return;
        }
    
        // Hide the setup section
        
        gameBoard.style.display = 'grid';
        document.getElementById('status-board').style.display = 'block';
        
        // Transition start button into turn message
        startBtn.style.transition = 'opacity 0.3s ease';
        startBtn.style.opacity = '0'; // Fade out the start button
    
        setTimeout(() => {
            startBtn.style.display = 'none'; // Hide the button after fading out
            turnMessage.style.opacity = '1'; // Ensure turn message is visible
        }, 300); // Match this timing with the CSS transition duration
    
        initializeBoard();
    }
    

        // Function to check if a cell was used in previous rounds
        function isCellUsed(row, col) {
            return usedCells.some(cell => cell.row === row && cell.col === col);
        }

        startBtn.addEventListener('click', startGame);

    function dropPiece(col) {
        if (winner !== null) return; // Game over
    
        // Check if the column is valid and not full
        if (col < 0 || col >= cols || board[0][col] !== 0) {
            return; // Invalid move or column is full
        }
    
        // Find the lowest available row in the specified column
        for (let row = rows - 1; row >= 0; row--) {
            if (board[row][col] === 0) {
                board[row][col] = currentPlayer;
                const cell = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
                cell.style.backgroundColor = currentPlayer === 1 ? 'red' : 'yellow';
                cell.classList.add('clicked');
                
                console.log(`Player ${currentPlayer} placed a piece at (${row}, ${col})`);

                if (checkForWin(row, col)) {
                    winner = currentPlayer;
                    winnerMessage.textContent = `Player ${currentPlayer} wins!`;
    
                    markWinningCells(row, col);
                    updateScores();
                    return;
                } else if (isBoardFull()) {
                    // Board is full and no winner
                    const scores = calculateScores();
                    const winner = scores.player1 > scores.player2 ? 'Player 1' : 'Player 2';
                    const scoreText = scores.player1 === scores.player2 ? 'It\'s a tie!' : `${winner} wins!`;
                    winnerMessage.textContent = `Game Over! ${scoreText}`;
                    updateScores();
                    return;
                } else {
                    currentPlayer = currentPlayer === 1 ? 2 : 1;
                    turnMessage.textContent = `Player ${currentPlayer}'s Turn`;
                }
                return;
            }
        }
    }
    
    

    function isBoardFull() {
        return board.every(row => row.every(cell => cell !== 0));
    }

    function calculateScores() {
        let player1Score = 0;
        let player2Score = 0;
        
        // Iterate over all cells and count based on their current background color
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            const color = window.getComputedStyle(cell).backgroundColor;
            if (color === 'rgb(255, 0, 0)') { // red
                player1Score++;
            } else if (color === 'rgb(255, 255, 0)') { // yellow
                player2Score++;
            }
        });
    
        console.log(`Player 1 Score: ${player1Score}`);
        console.log(`Player 2 Score: ${player2Score}`);
        
        return { player1: player1Score, player2: player2Score };
    }

    function updateScores() {
        const scores = calculateScores();
        player1ScoreDiv.textContent = `Player 1 Score: ${scores.player1}`;
        player2ScoreDiv.textContent = `Player 2 Score: ${scores.player2}`;
    }
    
  
    let previousWinningCells = [];

        // // Function to proceed to the next round
        function nextRound() {
            // Reset only the game messages and switch player
            markAllCellsUsed();
            
            
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            winner = null;
            winnerMessage.textContent = '';
            turnMessage.textContent = `Player ${currentPlayer}'s Turn`;

            previousWinningCells = [];
            usedCells = [];
        }
    

        function markWinningCells(row, col) {
            const color = currentPlayer === 1 ? 'red' : 'yellow';
            const winningSequence = findWinningSequence(row, col);
        
            if (winningSequence) {
                let index = 0;
                const interval = setInterval(() => {
                    if (index >= Math.min(winningSequence.length, 4)) {
                        clearInterval(interval); // Stop the interval after glowing cells three times
                        markLosingCells(() => {
                            setTimeout(nextRound, 1000); // Proceed to next round after all losing cells have changed color
                        });
                        return;
                    }
        
                    const { row, col } = winningSequence[index];
                    const cellElement = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
        
                    // Glow effect
                    cellElement.style.backgroundColor = color;
                    cellElement.style.boxShadow = `0 0 20px ${color}, 0 0 20px ${color}, 0 0 20px ${color}`;
                    cellElement.style.transition = 'box-shadow 0.5s ease';
                    setTimeout(() => {
                        cellElement.style.boxShadow = 'none';
                    }, 500);
        
                    index++;
                }, 200); // Adjust interval timing (200 ms) as needed
            }
        }

        function markLosingCells(callback) {
            // Change color of losing cells to the winning player's color
            const winningColor = currentPlayer === 1 ? 'red' : 'yellow';
            const losingColor = currentPlayer === 1 ? 'yellow' : 'red';
        
            // Filter out cells that were already marked as used in the current round
            const unusedLosingCells = [];
            for (let row = 0; row < rows; row++) {
                for (let col = 0; col < cols; col++) {
                    if (board[row][col] !== currentPlayer && board[row][col] !== 0 && !isCellUsed(row, col)) {
                        unusedLosingCells.push({ row, col });
                    }
                }
            }
        
            // Track ongoing animations
            animationCount = unusedLosingCells.length;
        
            // Apply animation to each losing cell one by one
            unusedLosingCells.forEach((cell, index) => {
                setTimeout(() => {
                    const cellElement = document.querySelector(`[data-row='${cell.row}'][data-col='${cell.col}']`);
                    // Apply pop animation and change color to winning color
                    cellElement.style.transform = 'scale(1.2)';
                    cellElement.style.transition = 'transform 0.3s ease';
                    cellElement.style.backgroundColor = winningColor;
        
                    // After animation completes, decrease animation count
                    cellElement.addEventListener('transitionend', () => {
                        animationCount--;
                        if (animationCount === 0 && typeof callback === 'function') {
                            callback(); // Trigger the callback when all animations are complete
                        }
                    }, { once: true }); // Ensure the event listener is fired only once
                }, index * 200); // Adjust delay (200 ms) as needed for proper animation timing
            });
        }
        
    

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



