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


const barnDoors = document.getElementById('barn-doors');
const leftDoor = document.querySelector('.barn-door.left');
const rightDoor = document.querySelector('.barn-door.right');




    gameBoard.style.display = 'none';

//     player1ScoreDiv.style.display = 'none';
// player2ScoreDiv.style.display = 'none';


    // Add event listener for Reset button
resetBtn.addEventListener('click', function() {
    resetBoard();
});


function reorganizeCellsByColor() {
    const cells = Array.from(document.querySelectorAll('.cell'));
    const gameBoard = document.getElementById('game-board'); // Ensure you get the correct element

    // Separate cells by color
    const redCells = cells.filter(cell => window.getComputedStyle(cell).backgroundColor === 'rgb(255, 0, 0)');
    const yellowCells = cells.filter(cell => window.getComputedStyle(cell).backgroundColor === 'rgb(255, 255, 0)');

    // Add pop-out class to all cells
    cells.forEach(cell => {
        cell.classList.add('pop-out');
    });

    // Wait for the pop-out animation to finish
    setTimeout(() => {
        // Clear the board
        gameBoard.innerHTML = '';

        // Re-add red cells first
        redCells.forEach(cell => {
            cell.style.backgroundColor = 'red';
            gameBoard.appendChild(cell);
        });

        // Re-add yellow cells next
        yellowCells.forEach(cell => {
            cell.style.backgroundColor = 'yellow';
            gameBoard.appendChild(cell);
        });

        // Add pop-in class to all cells
        document.querySelectorAll('.cell').forEach(cell => {
            cell.classList.add('pop-in');
        });

        // Remove pop-out and pop-in classes after animation to reset styles
        setTimeout(() => {
            document.querySelectorAll('.cell').forEach(cell => {
                cell.classList.remove('pop-out', 'pop-in');
            });
        }, 500); // Duration should match the animation duration
    }, 500); // Duration should match the pop-out animation duration
}


// function reorganizeCellsByColor() {
//     const cells = Array.from(document.querySelectorAll('.cell'));
//     const gameBoard = document.getElementById('game-board'); // Ensure you get the correct element
    
//     // Separate cells by color
//     const redCells = cells.filter(cell => window.getComputedStyle(cell).backgroundColor === 'rgb(255, 0, 0)');
//     const yellowCells = cells.filter(cell => window.getComputedStyle(cell).backgroundColor === 'rgb(255, 255, 0)');
    
//     // Clear the board
//     gameBoard.innerHTML = '';
    
//     // Re-add red cells first
//     redCells.forEach(cell => {
//         cell.style.backgroundColor = 'red';
//         cell.style.transition = 'none'; // Disable transition for immediate re-positioning
//         gameBoard.appendChild(cell);
//     });
    
//     // Re-add yellow cells next
//     yellowCells.forEach(cell => {
//         cell.style.backgroundColor = 'yellow';
//         cell.style.transition = 'none'; // Disable transition for immediate re-positioning
//         gameBoard.appendChild(cell);
//     });
    
//     // Re-enable transition after repositioning
//     setTimeout(() => {
//         document.querySelectorAll('.cell').forEach(cell => {
//             cell.style.transition = 'transform 0.3s ease';
//         });
//     }, 100);
// }






// Function to reset the game board and state
function resetBoard() {
    currentPlayer = 1;
    winner = null;
    board = [];
    usedCells = [];
    gameBoard.innerHTML = ''; // Clear the game board
    startBtn.style.display = 'block';
    player1NameInput.value = '';
    player2NameInput.value = '';


    // Reinitialize the board with new dimensions
    // initializeBoard();
    winnerMessage.textContent = '';
    updateTurnMessage();
    player1ScoreDiv.textContent = '0'; // Reset Player 1 score
    player2ScoreDiv.textContent = '0'; // Reset Player 2 score
    player1ScoreDiv.style.color = 'grey';
    player2ScoreDiv.style.color = 'grey';

    startBtn.style.opacity = '0';
        startBtn.style.display = 'block'; // Ensure button is visible before fading in

        setTimeout(() => {
            startBtn.style.transition = 'opacity 0.3s ease';
            startBtn.style.opacity = '1';
        }, 10);
}

    // Initialize the game
    initializeBoard();

    // Add event listener for Reset button
    resetBtn.addEventListener('click', function() {
        resetBoard();
    });

    function initializeBoard() {
        // Clear existing board
        gameBoard.innerHTML = '';

        

        setTimeout(() => {
            
            document.getElementById('status-board').style.display = 'block';
        }, 2000);

        // Reset board array only on initial game start
        if (winner === null) {
            board = [];
            for (let row = 0; row < rows; row++) {
                board[row] = Array(cols).fill(0); // Initialize each row with zeros
            }
        }

        usedCells = [];

  
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

     
        setTimeout(() => {
            document.querySelectorAll('.cell').forEach(cell => {
                cell.classList.add('pop'); // Add 'pop' class to animate cells
            });
        }, 100);
        
        
       

        currentPlayer = 1;
        winner = null;
        winnerMessage.textContent = '';
        turnMessage.textContent = `Player ${currentPlayer}'s Turn`;
    }

   

    let player1Name = '';
let player2Name = '';



function startGame() {
    player1Name = player1NameInput.value.trim();
    player2Name = player2NameInput.value.trim();
    
    if (player1Name === '' || player2Name === '') {
        alert("Please enter names for both players.");
        return;
    }

    // Hide the setup section
    
    document.getElementById('status-board').style.display = 'block';

    barnDoors.classList.add('open');
    
        setTimeout(() => {
            barnDoors.style.display = 'none'; // Hide barn doors after animation
            gameBoard.style.display = 'grid';
            document.getElementById('status-board').style.display = 'block'; // Show status board
            turnMessage.style.opacity = '1'; // Show turn message
        }, 1000); 

    // Transition start button into turn message
    startBtn.style.transition = 'opacity 0.3s ease';
    startBtn.style.opacity = '0'; // Fade out the start button

    setTimeout(() => {
        startBtn.style.display = 'none'; // Hide the button after fading out
        turnMessage.style.opacity = '1'; // Ensure turn message is visible
    }, 300); // Match this timing with the CSS transition duration

    initializeBoard();
    updateTurnMessage();
}

function updateTurnMessage() {
    if (currentPlayer === 1) {
        turnMessage.textContent = `${player1Name}`;
        turnMessage.style.backgroundColor = 'red';
    } else {
        turnMessage.textContent = `${player2Name}`;
        turnMessage.style.backgroundColor = 'yellow';
    }
}


    // function startGame() {
    //     player1Name = player1NameInput.value.trim();
    //     player2Name = player2NameInput.value.trim();
        
    //     if (player1Name === '' || player2Name === '') {
    //         alert("Please enter names for both players.");
    //         return;
    //     }
    
    //     // Hide the setup section
        
    //     gameBoard.style.display = 'grid';
    //     document.getElementById('status-board').style.display = 'block';
        
    //     // Transition start button into turn message
    //     startBtn.style.transition = 'opacity 0.3s ease';
    //     startBtn.style.opacity = '0'; // Fade out the start button
    
    //     setTimeout(() => {
    //         startBtn.style.display = 'none'; // Hide the button after fading out
    //         turnMessage.style.opacity = '1'; // Ensure turn message is visible
    //     }, 300); // Match this timing with the CSS transition duration
    
    //     initializeBoard();
    // }
    

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
                    winnerMessage.textContent = `${currentPlayer === 1 ? player1Name : player2Name} Connected 4!`;
    
                    markWinningCells(row, col);
                    updateScores();
                    return;
                } else if (isBoardFull()) {
                    // Board is full and no winner
                    const scores = calculateScores();
                    const winner = scores.player1 > scores.player2 ? 'Player 1' : 'Player 2';
                    const scoreText = scores.player1 === scores.player2 ? 'It\'s a tie!' : `${winner} wins!`;
                    winnerMessage.textContent = `Game Over! ${scoreText}`;
                    cell.style.opacity = '1';
                    reorganizeCellsByColor();
                    updateScores();
                    player1ScoreDiv.style.display = 'block'; // Show the player scores
                    player1ScoreDiv.style.color = 'white';
                player2ScoreDiv.style.display = 'block';
                    player2ScoreDiv.style.color = 'white';
                    return;
                } else {
                    currentPlayer = currentPlayer === 1 ? 2 : 1;
                    turnMessage.textContent = `Player ${currentPlayer}'s Turn`;
                    updateTurnMessage();
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
        player1ScoreDiv.textContent = `${scores.player1}`;
        player2ScoreDiv.textContent = `${scores.player2}`;
    }
    
  
    let previousWinningCells = [];

        // // Function to proceed to the next round
        function nextRound() {
            
            markAllCellsUsed();
            
            
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            winner = null;
            winnerMessage.textContent = '';
            // turnMessage.textContent = `Player ${currentPlayer}'s Turn`;

            previousWinningCells = [];
            usedCells = [];

            updateTurnMessage();
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
                        const cellElement = document.querySelector(`[data-row='${row}'][data-col='${col}']`);
                        if (!cellElement.classList.contains('used')) {
                            unusedLosingCells.push({ row, col });
                        }
                    }
                }
            }
        
            // Track ongoing animations
            let animationCount = unusedLosingCells.length;
        
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



