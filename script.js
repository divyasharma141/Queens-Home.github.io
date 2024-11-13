// on loading the site i want the game name to be shown 


// HEADER FUNCTIONALITY 
// fetch elements 
const header= this.document.querySelector('header');

const controls= document.getElementById('controls')
const gridContainer= document.getElementById('gridContainer');
const next= document.getElementById('next-btn');
const refreshButton = document.getElementById('refresh-btn');

document.addEventListener('DOMContentLoaded', function(){

    const video = document.getElementById("rules-vid");
    const content= document.querySelector('.rule-container');
    
    // initially except queen name all will be invisble
    video.style.opacity = '0';
    content.style.opacity='0';
    next.style.opacity='0';
    controls.style.opacity='0';
    gridContainer.style.opacity = '0';
    refreshButton.style.opacity='0';

    setTimeout(function(){

        // After animation, take the game name to top
        video.style.opacity='1';
        video.muted = true;
        video.play();

    },2490);

    
    video.addEventListener('timeupdate', function() {
        const videoDuration = video.duration;
        const currentTime = video.currentTime;

        // If the video is 2 seconds from the end
        if (videoDuration - currentTime <= 3.2) {
            // Trigger animation            
            content.style.animation = 'fade-in 5.6s forwards'; 
            
            setTimeout(function(){

                next.style.opacity=1;
        
            },1500);
        }
    });

    // pause on ending 
    video.addEventListener("ended", () => {
        video.pause();        
    });

});


// next logic
next.addEventListener('click', function(){
    const rules= document.getElementById('rules');

    rules.style.animation= 'sweep-out 1s forwards';

    next.style.animation = 'fade-out 0.5s forwards';

    setTimeout(() => {
        controls.style.animation = 'slide-up 1s forwards';
    }, 1000);
});

// controls function
controls.addEventListener('change', function(){
    gridContainer.style.opacity='1';
    gridContainer.style.animation = 'fade-in 1s forwards';
    refreshButton.style.opacity='1';
});


// GRID LOGIC AND FUNCTIONALITY

// size 
let size= 1;

// board representation 
let board=[];


document.getElementById("grid_size").addEventListener("change", function(){
    // fetch the value from drop down
    size= parseInt(this.value);

    // function calling
    initializeGrid(size);
});


function initializeGrid(size){
    // clear any existing grid 
    gridContainer.innerHTML='';

    // create a 2d array to maintain position of queen
    board = Array.from({ length: size }, () => Array(size).fill(''));
    
    // set up the grid template based on given size
    gridContainer.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

    if(size>=4 && size<=5){
        gridContainer.style.top='38%';
        gridContainer.style.left='40%';
    }

    if(size>=6 && size<=8){
        gridContainer.style.top='38%';
        gridContainer.style.left='38%';
    }

    if(size>=9){
        // margin
        gridContainer.style.top='38%';
        gridContainer.style.left='30%';
    }

    // looping 
    for(let i=0; i<size*size; i++){
        
        // taking it as the refrnece for the intems of the grid
        const gridItem= document.createElement("div");
        gridItem.classList.add("grid-item");
        gridContainer.appendChild(gridItem);

        // calculate row and column
        // from 1D iteration to 2D matrix   
        const row= Math.floor(i/size);
        const col= i%size;


        // clicks and queen placement 
        // on single click mark x 
        // ON DOUBLE CLICK or twice click place the queen
        gridItem.addEventListener('click', function(){
            
            // First click, initially empty
            if(!gridItem.state){
                gridItem.textContent='';
                crossPlacement(gridItem);
                gridItem.state='x';
            }   

            else if(gridItem.state==='x'){
                queenPlacement(gridItem, row, col);
                win(board);
                gridItem.state='queen';
            }

            else if(gridItem.state==='queen'){
                gridItem.textContent='';
                board[row][col]='';
                gridItem.state = null;
            }
            
        });
          
    }
}


function queenPlacement(gridItem, row, col){
    
    if(isSafe(row, col)){
        gridItem.textContent='';
        queenImage(gridItem);
        board[row][col]='Q';
    }
    else{
        // error

        // beep sound
        const beep = new Audio("effects/beep-05.mp3");
        
        
        gridItem.textContent='';
        queenImage(gridItem);
        board[row][col]='Q';
        gridItem.style.backgroundColor= '#ff0000';
        beep.play();


        gridItem.addEventListener('click', function errorHandler(){
            beep.pause();
            
            // First click: clear the cell
                board[row][col]='';
                gridItem.style.backgroundColor = '';           

            // Remove the error handler after correction to restore normal click behavior
            gridItem.removeEventListener('click', errorHandler);
            
        });
    }
}


// if placing the queen is safe or not 
function isSafe(row, cols ){

    let i,j;
    // check row
    for( i=row,j=0;j< size ;j++)
    {
        if(board[i][j]==='Q'){
            return false;
        }
    }
    
    // check col
    for( i=0,j=cols;i<size;i++)
    {
        if(board[i][j]==='Q'){
            return false;
        }
    }

    // check left up diagonal
    for(i=row,j=cols; i>=0&&j>=0; i--,j--)
    {
        if(board[i][j]==='Q'){
            return false;
        }
    }

    // check left down diagonal
    for(i=row,j=cols;i<size && j>=0;i++,j--)
    {
        if(board[i][j]==='Q'){
            return false;
        }
    }

    // check right up diagonal
    for(i=row,j=cols;i>=0 && j<size; i--,j++)
    {
        if(board[i][j]==='Q'){
            return false;
        }
    }

    // check right down diagonal
    for(i=row,j=cols; i<size  &&j<size; i++,j++)
    {
        if(board[i][j]==='Q'){
            return false;
        }
    }


    return true;


}


function queenImage(gridItem) {
    const img = document.createElement("img");
    img.src = "effects/queen.png";  // Path to the queen image
    img.alt = "Q"; 
    gridItem.appendChild(img);
}


function crossPlacement(gridItem){
    const img= document.createElement("img");
 
    img.src="effects/cross.png";
    img.alt='X';
    img.style.height="25px"; 
    gridItem.appendChild(img);
 
}


// now if all the rows have a queen placement == game finished correctly

function win(board){
    
    for(let i=0;i<board.length;i++){
        let queenCount=0;

        for(let j=0;j<board.length;j++){
            if(board[i][j]==='Q'){
                queenCount++;
            }
        }

        if(queenCount!=1){
            console.log("game not finished");
            return;
        }
    }

    console.log("game finished");
    triggerRippleEffect(); 
    launchConfetti();
    
    // win cheer
    const cheer = new Audio("effects/win.wav"); 
    cheer.play();
}


// ripple effect
function triggerRippleEffect() {
    const gridItems = document.querySelectorAll(".grid-item");
    let delay =0;

    gridItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add("ripple-effect");

            setTimeout(() => {
                item.classList.remove("ripple-effect");
            }, 1000); 
        }, delay);

        delay += 50;
    });
}

function launchConfetti() {
    // Include canvas-confetti via CDN in your HTML file:
    const canvas= document.querySelector('#confetti'); 

    const jsConfetti = new JSConfetti();

    jsConfetti.addConfetti({
        confettiRadius: 7,
        confettiNumber: 600,
        confettiColors: ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7'],
    });
}

// refresh button 
refreshButton.addEventListener('click', () => {
    // Refresh the grid
    initializeGrid(size);
});
