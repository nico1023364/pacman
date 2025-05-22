document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector(".grid");
    const cells = Array.from(grid.querySelectorAll('div'));
    const width = 15;
    let pacmanIndex = 16; // posición inicial del pacman
    let score = 0;

    const scoreDisplay = document.createElement('h2');
    scoreDisplay.textContent = `Puntaje: ${score}`;
    document.body.insertBefore(scoreDisplay, grid);

    function drawPacman(direction) {
        cells[pacmanIndex].classList.add('pacman', direction);
    }
    
    function erasePacman() {
        cells[pacmanIndex].classList.remove('pacman', 'left', 'right', 'up', 'down');
    }

    function movePacman(e) {
        let newPacmanIndex = pacmanIndex;
        let direction = '';
    
        switch (e.key) {
            case 'ArrowLeft':
                if (pacmanIndex % width !== 0) {
                    newPacmanIndex = pacmanIndex - 1;
                    direction = 'left';
                }
                break;
            case 'ArrowRight':
                if (pacmanIndex % width !== width - 1) {
                    newPacmanIndex = pacmanIndex + 1;
                    direction = 'right';
                }
                break;
            case 'ArrowUp':
                if (pacmanIndex - width >= 0) {
                    newPacmanIndex = pacmanIndex - width;
                    direction = 'up';
                }
                break;
            case 'ArrowDown':
                if (pacmanIndex + width < cells.length) {
                    newPacmanIndex = pacmanIndex + width;
                    direction = 'down';
                }
                break;
        }
    
        if (!cells[newPacmanIndex].classList.contains('wall')) {
            erasePacman();
            pacmanIndex = newPacmanIndex;
    
            if (cells[pacmanIndex].classList.contains('ghost')) {
                gameOver();
                return; 
            }
    
            eatDot();
            drawPacman(direction);
        }
    }
    

    function eatDot() {
        if (cells[pacmanIndex].classList.contains('dot')) {
            cells[pacmanIndex].classList.remove('dot');
            score++;
            scoreDisplay.textContent = `Puntaje: ${score}`;
            checkWin(); // Verificar si se ha ganado
        }
    }

    function checkWin() {
        const remainingDots = cells.some(cell => cell.classList.contains('dot'));
        if (!remainingDots) {
            ghosts.forEach(ghost => clearInterval(ghost.timerId));
            document.removeEventListener('keydown', movePacman);
            scoreDisplay.textContent += " - ¡GANASTE! 🎉";
        }
    }

    document.addEventListener('keydown', movePacman);
    drawPacman(); // dibuja pacman inicialmente

    // Fantasmas
    class Ghost {
        constructor(name, startIndex, className, speed = 500) {
            this.name = name;
            this.currentIndex = startIndex;
            this.className = className;
            this.speed = speed;
            this.timerId = null;
            this.directions = [-1, 1, -width, width];
        }

        draw() {
            cells[this.currentIndex].classList.add("ghost", this.className);
        }

        erase() {
            cells[this.currentIndex].classList.remove("ghost", this.className);
        }

        move() {
            const moveGhost = () => {
                const direction = this.directions[Math.floor(Math.random() * this.directions.length)];
                const nextIndex = this.currentIndex + direction;

                if (
                    !cells[nextIndex].classList.contains('wall') &&
                    !cells[nextIndex].classList.contains('ghost')
                ) {
                    this.erase();
                    this.currentIndex = nextIndex;
                    this.draw();
                } else {
                    moveGhost(); // intenta de nuevo si choca
                }

                if (this.currentIndex === pacmanIndex) {
                    gameOver();
                }
            };

            this.timerId = setInterval(moveGhost, this.speed);
        }
    }

    function gameOver() {
        ghosts.forEach(ghost => clearInterval(ghost.timerId));
        document.removeEventListener('keydown', movePacman);
        scoreDisplay.textContent += " - GAME OVER 💀";
    }

    const blinky = new Ghost("blinky", 40, 'red', 500);
    const pinky = new Ghost("pinky", 67, 'pink', 600);
    const ghosts = [blinky, pinky];

    ghosts.forEach(ghost => {
        ghost.draw();
        ghost.move();
    });
});
