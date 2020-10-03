let canvas;
let canvasContext;
let ballX = 50;
let ballY = 50;
let ballSpeedX = 10;
let ballSpeedY = 4;

let player1Score = 0;
let player2Score = 0;
const WINNING_SCORE = 3;

let showingWinScreen = false;

let paddle1Y = 250;
let paddle2Y = 250;
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

function calculateMousePos(e){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = e.clientX - rect.left - root.scrollLeft;
    var mouseY = e.clientY - rect.top - root.scrollTop;
    return {
        x:mouseX,
        y:mouseY
    };

}

function handleMouseClick(){
    if(showingWinScreen){
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}

window.onload = function(){
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    let framesPerSecond = 30
    setInterval(function(){
        moveEverything();
        drawEverything();
    }, 1000/framesPerSecond);

    canvas.addEventListener('mousedown', handleMouseClick);

    canvas.addEventListener('mousemove', function(e){
        var mousePos = calculateMousePos(e);
        paddle1Y = mousePos.y-(PADDLE_HEIGHT/2);
    });
    
}

function callBoth(){
    moveEverything();
    drawEverything();
}

function ballReset(){
    if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
        showingWinScreen = true;
    }

    ballSpeedX = -ballSpeedX;
    ballX = canvas.width/2;
    ballY = canvas.height/2;
}

function computerMovement(){
    var paddle2YCenter = paddle2Y +(PADDLE_HEIGHT/2);

    if(paddle2YCenter < ballY - 35) {
        paddle2Y += 6;
    }else if(paddle2YCenter > ballY + 35){
        paddle2Y -= 6;
    }
}

function moveEverything(){
    computerMovement();

    ballX += ballSpeedX;
    ballY += ballSpeedY;
    if(ballX < 0 ){
        // ballSpeedX = -ballSpeedX;
        if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT){
            ballSpeedX = -ballSpeedX;
            
            var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * 0.35; 

        }else {
            ballReset(); // before reset
            player2Score++;
        }
    }
    if(ballX > canvas.clientWidth ){
        if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT){
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
            ballSpeedY = deltaY * 0.35; 
        }else{
            ballReset();
            player1Score++;
        }
    }
    if(ballY < 0 ){
        ballSpeedY = -ballSpeedY;
    }
    if(ballY > canvas.clientHeight ){
        ballSpeedY = -ballSpeedY;
    }
    
}

function drawNet(){
    for(let i=0; i < canvas.height; i+= 40){
        colorRect(canvas.clientWidth / 2-1, i, 2, 20, 'white');
    }
}

function drawEverything(){
    //  netx line blanks out the screen black
    colorRect(0, 0, canvas.clientWidth, canvas.clientHeight, 'black');
    
    if(showingWinScreen){
        canvasContext.fillStyle = 'white';
        if(player1Score >= WINNING_SCORE){
            canvasContext.fillText("LEFT PLAYER WIN!", 350, 200);
        }else if( player2Score >= WINNING_SCORE ){
            canvasContext.fillText("RIGHT PLAYER WIN!", 350, 200);
        }
        canvasContext.fillText("Click To Continue", 350, 500);
        return;
    }

    drawNet();

    // this is left player paddle
    colorRect(0, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
    // this is left player2 / computer paddle
    colorRect(canvas.clientWidth-PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
    //  next line draws the ball
    colorCircle(ballX, ballY, 10, 'white');

    canvasContext.fillText(player1Score, 100, 100);
    canvasContext.fillText(player2Score, canvas.clientWidth-100, 100);
}

function colorCircle(centerX, centerY, radius, drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI*2, true);
    canvasContext.fill();
}

function colorRect(leftX, topY, width, height, drawColor){
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);

}