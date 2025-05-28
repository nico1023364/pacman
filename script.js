// Espera que el contenido del DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

    // Cargar sonidos
    const chompSound = new Audio('sounds/chomp.mp3');
    const eatGhostSound = new Audio('sounds/eat-ghost.mp3');
    const powerUp = new Audio('sounds/power-up.mp3');



    // Obtener el grid del DOM y convertirlo en array de celdas
    const grid = document.querySelector(".grid");
    const cells = Array.from(grid.querySelectorAll('div'));
    const width = 15; // Número de celdas por fila

    // Variables del estado del juego
    let pacmanIndex = 16;
    let score = 0;
    let lives = 3;
    let powerMode = false;
    let powerModeTimeout;

    // Crear y mostrar los indicadores de puntaje y vidas
    const scoreDisplay = document.createElement('h2');
    scoreDisplay.textContent = `Puntaje: ${score}`;
    document.body.insertBefore(scoreDisplay, grid);

    const livesDisplay = document.createElement('h2');
    livesDisplay.textContent = `Vidas: ${lives}`;
    document.body.insertBefore(livesDisplay, scoreDisplay);

    // Mostrar a Pac-Man en su posición inicial
    cells[pacmanIndex].classList.add("pacman");

    // ---------------------
    // Clase GHOST
    // ---------------------
    class Ghost {
        constructor(name, startIndex, className, speed = 500) {
            this.name = name;
            this.startIndex = startIndex;
            this.currentIndex = startIndex;
            this.className = className;
            this.speed = speed;
            this.timerId = null;
            this.directions = [-1, 1, -width, width]; // izquierda, derecha, arriba, abajo
            this.isVulnerable = false;
        }

        // Mostrar al fantasma en su posición
        draw() {
            const ghostCell = cells[this.currentIndex];
            ghostCell.classList.add("ghost", this.className);
            if (this.isVulnerable) {
                ghostCell.classList.add("vulnerable");
            }
        }

        // Quitar al fantasma de su posición actual
        erase() {
            const ghostCell = cells[this.currentIndex];
            ghostCell.classList.remove("ghost", this.className, "vulnerable");
        }

        // Lógica de movimiento aleatorio
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

                    // Si colisiona con Pac-Man
                    if (this.currentIndex === pacmanIndex) {
                        if (this.isVulnerable) {
                            // Fantasma es comido
                            score += 10;
                            scoreDisplay.textContent = `Puntaje: ${score}`;
                            this.erase();
                            this.currentIndex = this.startIndex;
                            this.draw();
                        } else {
                            // Pac-Man pierde vida
                            loseLife();
                        }
                    }
                }
            };

            // Mover el fantasma de forma repetida
            this.timerId = setInterval(moveGhost, this.speed);
        }
    }

    // ---------------------
    // Funciones de Pac-Man
    // ---------------------
    function drawPacman(direction) {
        cells[pacmanIndex].classList.add('pacman', direction);
    }

    function erasePacman() {
        cells[pacmanIndex].classList.remove('pacman', 'left', 'right', 'up', 'down');
    }

    function eatDot() {
        if (cells[pacmanIndex].classList.contains('dot')) {
            cells[pacmanIndex].classList.remove('dot');
            score++;
            scoreDisplay.textContent = `Puntaje: ${score}`;
            chompSound.play(); // ⬅️ reproducir sonido
            checkWin();
        }
    }

    function eatPowerPellet() {
        if (cells[pacmanIndex].classList.contains('power-pellet')) {
            cells[pacmanIndex].classList.remove('power-pellet');
            activatePowerMode();
            powerUp.play();
        }
    }

    // Activar el modo de poder (fantasmas se vuelven vulnerables)
    function activatePowerMode() {
        powerMode = true;
        document.body.classList.add("power-mode");

        ghosts.forEach(ghost => {
            ghost.isVulnerable = true;
            ghost.draw();
        });

        clearTimeout(powerModeTimeout);
        powerModeTimeout = setTimeout(() => {
            powerMode = false;
            document.body.classList.remove("power-mode");

            ghosts.forEach(ghost => {
                ghost.isVulnerable = false;
                ghost.draw();
            });
        }, 8000); // 8 segundos
    }

    // Lógica para perder una vida
    function loseLife() {
        lives--;
        livesDisplay.textContent = `Vidas: ${lives}`;
        if (lives <= 0) {
            gameOver();
        } else {
            resetPacmanPosition();
        }
    }

    // Reiniciar posición de Pac-Man después de perder vida
    function resetPacmanPosition() {
        erasePacman();
        pacmanIndex = 16;
        drawPacman();
    }

    // Lógica de movimiento de Pac-Man
    function movePacman(e) {
        let newPacmanIndex = pacmanIndex;
        let direction = '';

        // Detectar la tecla y calcular la nueva posición
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

        // Mover Pac-Man si no hay pared
        if (!cells[newPacmanIndex].classList.contains('wall')) {
            erasePacman();
            pacmanIndex = newPacmanIndex;

            eatDot();
            eatPowerPellet();

            // Verificar colisión con fantasma
            if (cells[pacmanIndex].classList.contains('ghost')) {
                const ghost = ghosts.find(g => g.currentIndex === pacmanIndex);
                if (ghost.isVulnerable) {
                    score += 10;
                    scoreDisplay.textContent = `Puntaje: ${score}`;
                    ghost.erase();
                    ghost.currentIndex = ghost.startIndex;
                    eatGhostSound.play(); // ⬅️ justo cuando suma puntos por comer fantasma
                    ghost.draw();
                } else {
                    loseLife();
                    return;
                }
            }

            drawPacman(direction);
        }
    }

    // Verificar si el jugador ha ganado
    function checkWin() {
        const remainingDots = cells.some(cell => cell.classList.contains('dot') || cell.classList.contains('power-pellet'));
        if (!remainingDots) {
            ghosts.forEach(ghost => clearInterval(ghost.timerId));
            document.removeEventListener('keydown', movePacman);
            scoreDisplay.textContent += " - ¡GANASTE! 🎉";
        }
    }

    // Lógica del final del juego
    function gameOver() {
        ghosts.forEach(ghost => clearInterval(ghost.timerId));
        document.removeEventListener('keydown', movePacman);
        scoreDisplay.textContent += " - GAME OVER 💀";
    }

    // Crear fantasmas y comenzar el juego
    const blinky = new Ghost("blinky", 40, 'red', 500);
    const pinky = new Ghost("pinky", 67, 'pink', 600);
    const ghosts = [blinky, pinky];

    ghosts.forEach(ghost => {
        ghost.draw();
        ghost.move();
    });

    document.addEventListener('keydown', movePacman);
    drawPacman();
});
