const canvas = document.getElementById('Snek game');
const ctx = canvas.getContext('2d');

const c = 30; //width of each cell
let snake = [[10, 9, 1], [10, 10, 1], [10, 8, 1]]; //coordinates of each cell in snake
let dir = 1;
let foodPos = generatePos();
let eat = false;
let turns = []; //-1 for left, 1 for right
let dirnbuffer = [];
var gameOver = false;
var score = 0;


const head = new Image();
const body = new Image();
const tail = new Image();
const bend = new Image();
head.src = 'images/SnakeHead.png';
body.src = 'images/SnakeBody.png';
tail.src = 'images/SnakeTail.png';
bend.src = 'images/SnakeBend.png';

var refreshId = setInterval(draw, 100);

function draw() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);



    moveSnek();

    if (snake[0][0] == foodPos[0] && snake[0][1] == foodPos[1]) {
        eat = true;
        score += 1;
        foodPos = generatePos();
    }
    else eat = false;

    ctx.beginPath();

    ctx.fillStyle = "#FF0000";
    ctx.rect(foodPos[0] * c, foodPos[1] * c, c, c);
    ctx.fill();
    ctx.closePath();

    drawSnek();

    ctx.fillStyle = "#000";
    ctx.font = '20px Arial';
    ctx.fillText("Score: " + score, 20, 20);



    gameOver = checkCol();
    ctx.font = '50px serif';
    if (gameOver) {
        clearInterval(refreshId);
        ctx.fillStyle = "#000";
        ctx.fillText("lol you lose. Score: " + score, 100, 100);
    }
}

function drawSnek() {
    const dirns = snake.map(p => p[2]);


    const bodybits = [];
    for (i = 1; i < snake.length - 1; i++) {
        if (dirns[i - 1] == dirns[i]) {
            if (dirns[i] == 0 || dirns[i] == 2) bodybits.push(0);
            else bodybits.push(1);
        }
        else {
            const a = (dirns[i - 1] + dirns[i]) % 4;
            switch (a) {
                case 1:
                    if (dirns[i] == 0 || dirns[i] == 3) bodybits.push(2);
                    else bodybits.push(4);
                    break;
                case 3:
                    if (dirns[i] == 1 || dirns[i] == 0) bodybits.push(3);
                    else bodybits.push(5);
                    break;

            }
        }
    }


    ctx.beginPath();
    for (i = 0; i < snake.length; i++) {
        ctx.save();
        if (i == 0) {
            ctx.translate((snake[0][0] + 0.5) * c, (snake[0][1] + 0.5) * c);
            ctx.rotate(dir * Math.PI / 2);

            ctx.drawImage(head, -c / 2, -c / 2);
        }

        else if (i == snake.length - 1) {
            ctx.translate((snake[i][0] + 0.5) * c, (snake[i][1] + 0.5) * c);
            const tdir = snake[i - 1][2];
            ctx.rotate(tdir * Math.PI / 2);

            ctx.drawImage(tail, -c / 2, -c / 2);
        }
        else {
            ctx.translate((snake[i][0] + 0.5) * c, (snake[i][1] + 0.5) * c);
            switch (bodybits[i - 1]) {
                case 0:
                    ctx.drawImage(body, -c / 2, -c / 2);
                    break;
                case 1:
                    ctx.rotate(Math.PI / 2);
                    ctx.drawImage(body, -c / 2, -c / 2);
                    break;
                case 2:
                    ctx.rotate(Math.PI);
                    ctx.drawImage(bend, -c / 2, -c / 2);
                    break;
                case 3:
                    ctx.rotate(-Math.PI / 2);
                    ctx.drawImage(bend, -c / 2, -c / 2);
                    break;
                case 4:
                    ctx.rotate(0);
                    ctx.drawImage(bend, -c / 2, -c / 2);
                    break;
                case 5:
                    ctx.rotate(Math.PI / 2);
                    ctx.drawImage(bend, -c / 2, -c / 2);
                    break;
            }

        }
        ctx.restore();

    }




    ctx.closePath();
}

function checkCol() {
    /*return snake.slice(1).some(p => {
        p[0] == snake[0][0] && p[1] == snake[0][1];
        //console.log(p[0] == snake[0][0] && p[1] == snake[0][1]);
    }); */
    var col = false;
    snake.slice(1).forEach(p => {
        if (p[0] == snake[0][0] && p[1] == snake[0][1]) col = true;
    });
    return col;
}

function generatePos() {
    const x = Math.random() * canvas.width / c | 0;
    const y = Math.random() * canvas.height / c | 0;
    var valid = true;
    snake.forEach(p => {
        if (p[0] == x && p[1] == y) valid = false;
    })
    if (valid) return ([x, y]);
    else return generatePos();
}


function moveSnek() {
    if (snake[0][0] * c >= canvas.width) snake[0][0] = 0;
    if (snake[0][0] * c < 0) snake[0][0] = canvas.width / c | 0;
    if (snake[0][1] * c >= canvas.height) snake[0][1] = 0;
    if (snake[0][1] * c < 0) snake[0][1] = canvas.height / c - 1 | 0;
    if (dirnbuffer.length != 0) {
        dir = dirnbuffer[0];
        dirnbuffer.shift();
    }
    switch (dir) {
        case 1:
            snake.unshift([snake[0][0], snake[0][1] - 1, 1]);
            break;
        case 2:
            snake.unshift([snake[0][0] + 1, snake[0][1], 2]);
            break;
        case 3:
            snake.unshift([snake[0][0], snake[0][1] + 1, 3]);
            break;
        case 0:
            snake.unshift([snake[0][0] - 1, snake[0][1], 0]);
            break;
        default:
    }
    if (!eat) snake.pop();

}

document.querySelector('html').onkeydown = function (event) {
    var prevDefault = true;
    var ndir = 0;
    switch (event.code) {
        case "ArrowUp":
            ndir = 1;
            break;
        case "ArrowRight":
            ndir = 2;
            break;
        case "ArrowDown":
            ndir = 3;
            break;
        case "ArrowLeft":
            ndir = 0;
            break;
        default:
            prevDefault = false;
    }
    if ((dirnbuffer.length == 0 && Math.abs(dir - ndir) % 2 == 1) || Math.abs(dirnbuffer.slice(-1).pop() - ndir) % 2 == 1 && dirnbuffer.length < 2) dirnbuffer.push(ndir);
    if (prevDefault) event.preventDefault();
}

function mod4(n) {
    if (n >= 0 && n <= 3) return n;
    else if (n > 4) return mod4(n - 4);
    else return mod4(n + 4);
}