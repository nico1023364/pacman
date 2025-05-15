document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector(".grid");
    const cells = Array.from(grid.querySelectorAll('div'));
    const width = 10;
    let pacmanIndex = 11;

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


        move(){
            const moveGhost = () => {
            const directions = this.directions[Math.floor(Math.random() * this.directions.length)];
            const nextIndex = this.currentIndex + directions;
 
            if(
                !cells[nextIndex].classList.contains('wall') &&
                !cells[nextIndex].classList.contains('ghost')
            ) {
                this.erase();
                this.currentIndex = nextIndex;
                this.draw();
            } else {
                moveGhost(); // intenta moverse si choca
            }
            };
 
            this.timerId = setInterval(moveGhost, this.speed);
        }

    }

    const blinky = new Ghost("blinky", 40, 'red', 500);
    const pinky = new Ghost("pinky", 67, 'pink', 600);
    const ghosts = [blinky, pinky];

    ghosts.forEach(ghost => {

        ghost.draw();
        ghost.move();
    })





})