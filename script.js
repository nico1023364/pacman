document.addEventListener('DOMContentLoaded' , () => {
    const grid = document.querySelector(".grid");
    const cells = Array.from(grid.querySelectorAll('div'));
    const width = 10;
    let pacmanIndex = 11;

    class Ghost{

        constructor(name, startIndex, className, speer = 500){
            this.name = name;
            this.currentIndex = startIndex;
            this.className = className;
            this.speed = this.speed;
            this.timerId = null;
            this.directions = [-1, 1, -width, width];
        }

    }


    const blinky = new Ghost("blinky", 35, 'red', 500);
    const pinky = new Ghost("pinky", 36, 'pink', 600);
    const ghosts = [blinky, pinky];


})