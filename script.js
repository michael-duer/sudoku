//Load boards from file or manually
const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
  ];
  const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
  ];
  const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
  ];

  //Create variables
  var   timer,
        timeCounter,
        lives,
        selectedNum,
        selectedTile,
        disableSelect;

window.onload = function() {
    //Run startGame function when bttn gets clicked
    getElementById("start-bttn").addEventListener("click", startGame);

    //Set theme when bttn gets clicked
    getElementById("theme-1").addEventListener("click", setTheme);
    getElementById("theme-2").addEventListener("click", setTheme);
    getElementById("theme-3").addEventListener("click", setTheme);

    //Add eventlistener to each number in number-container
    for (let i = 0; i < getElementById("number-container").children.length; i++) {
        getElementById("number-container").children[i].addEventListener("click", function() {
            //If selecting ist not disabled
            if (!disableSelect) {
                //If number is already selceted
                if (this.classList.contains("selected")) {
                    //Then remove selection
                    this.classList.remove("selected");
                    selectedNum = null;
                } else {
                    //Deselect all other numbers
                    for (let i = 0; i <9; i++) {
                        getElementById("number-container").children[i].classList.remove("selected");
                    }
                    //Select it and update the selectedNum variable
                    this.classList.add("selected");
                    selectedNum = this;
                    updateMove();
                }
            }
        });
    }
}

function startGame() {
    let board;
    //choose difficulty
    if (getElementById("diff-1").checked) board = easy[0];
    else if (getElementById("diff-2").checked) board = medium[0];
    else board = hard[0];

    //set lives and enable selecting numbers and tiles
    lives = 3;
    disableSelect = false;
    getElementById("lives").textContent = "Lives Remaining " + lives;

    //Create board based on difficulty
    generateBoard(board);
    //Starts timer
    startTimer();

    //Shows number-container by changing class
    getElementById("number-container").classList.remove("hidden");
    getElementById("number-container").classList.add("flex");
}

function startTimer() {
    //Sets timer for first second
    timeCounter = 0;
    getElementById("timer").textContent = timeConversion(timeCounter)
    //Sets timer to update every second
    timer = setInterval(function() {
        timeCounter ++;
        //add game over option if it takes too long?
        getElementById("timer").textContent = timeConversion(timeCounter);
    }, 1000)
}
//Converts seconds into string MM:SS format
function timeConversion(time) {
    let minutes = Math.floor(time/60);
    if (minutes < 10) minutes = "0" + minutes;
    let seconds = time % 60;
    if (seconds < 10) seconds = "0" + seconds;
    return minutes + ":" + seconds;
}

function setTheme() {
    //Sets theme based on input by first deleting previous and add the new one
    if (getElementById("theme-1").checked) {
        qs("body").classList.remove("dark");
        qs("h1").classList.remove("dark");
        qs("#difficulty-title").classList.remove("dark");
        qs("#theme-title").classList.remove("dark");
        qs("#timer").classList.remove("dark");
        qs("#lives").classList.remove("dark");

        qs("body").classList.remove("rainbow");
    } else if (getElementById("theme-2").checked) {
        qs("body").classList.remove("rainbow");

        qs("body").classList.add("dark");
        qs("h1").classList.add("dark");
        qs("#difficulty-title").classList.add("dark");
        qs("#theme-title").classList.add("dark");
        qs("#timer").classList.add("dark");
        qs("#lives").classList.add("dark");
    } else {
        qs("body").classList.remove("dark");
        qs("h1").classList.remove("dark");
        qs("#difficulty-title").classList.remove("dark");
        qs("#theme-title").classList.remove("dark");
        qs("#timer").classList.remove("dark");
        qs("#lives").classList.remove("dark");

        qs("body").classList.add("rainbow");
    }
}

function generateBoard(board) {
    //clear previous boards
    clearPrevious();
    //Let used to increment tile ids
    let idCount = 0;
    //Create 81 tiles
    for (let i = 0; i < 81; i++) {
        //Create a new paragraph element
        let tile = document.createElement("p");
        //if tile is not supposed to be blank
        if (board.charAt(i) != "-") {
            //Set tile text to correct number
            tile.textContent = board.charAt(i);
        } else {
            //Add click event listener to tile
            tile.addEventListener("click", function() {
                //if selecting is not disabled
                if (!disableSelect) {
                    //if tile is already selected
                    if (tile.classList.contains("selected")) {
                        //Then remove selection
                        tile.classList.remove("selected");
                        selectedTile = null;
                    } else {
                        //Deselect all other tiles
                        for (let i = 0; i < 81; i++) {
                            qsa(".tile")[i].classList.remove("selected");
                        }
                        //Add selection and update variable
                        tile.classList.add("selected");
                        selectedTile = tile;
                        updateMove();
                    }
                }
            })
        }

        //Assign tile id and increment for next tile
        tile.id = idCount;
        idCount ++;

        //Add tile class to all tiles and set borders
        tile.classList.add("tile");
        if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
            tile.classList.add("bottomBorder");
        }
        if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
            tile.classList.add("rightBorder");
        }
        //Add border around board
        if ((tile.id + 1) % 9 == 1) {
            tile.classList.add("leftBorder");
        }
        if (tile.id % 9 == 8) {
            tile.classList.add("rightBorder");
        }
        if (tile.id >= 72 && tile.id <=80) {
            tile.classList.add("bottomBorder");
        }
        if (tile.id >= 0 && tile.id <9) {
            tile.classList.add("topBorder");
        }
        //Add tile to board
        getElementById("board").appendChild(tile);
    }
}

function updateMove() {
    //if a tile and a number is selected
    if (selectedTile && selectedNum) {
        //Set the tile to the correct number
        selectedTile.textContent = selectedNum.textContent;
        //If the number matches the corresponding number in the solution keu
        if (checkCorrect(selectedTile)) {
            //Deselects the tiles
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");
            //Clear selected Variables
            selectedNum = null;
            selectedTile = null;
            //Check if board is completed
            if (checkDone()) {
                endGame();
            }

        //If the number does not match solution
        } else {
            //Disable selecting new numbers for one second
            disableSelect = true;
            //Make the tile turn red
            selectedTile.classList.add("incorrect");
            //Run in one second
            setTimeout(function() {
                //Subtract lives by one
                lives --;
                //if no lives remaining end the game
                if (lives === 0) {
                    endGame();
                } else {
                    //If lives is not equal to 0
                    //Update lives text
                    getElementById("lives").textContent = "Lives Remaining: " + lives;
                    //Renable selecting numbers and tiles
                    disableSelect = false;
                }
                //Restore tile color and remove selected from both
                selectedTile.classList.remove("incorrect");
                selectedTile.classList.remove("selected");
                selectedNum.classList.remove("selected");
                //Clear the tiles and clear selected variable
                selectedTile.textContent = "";
                selectedTile = null;
                selectedNum = null;
            }, 1000);
        }
    }
}

function checkDone() {
    let tiles = qsa(".tile");
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].textContent === "") return false;
    }
    return true;
}

function endGame() {
    //Disable moves and stop timer
    disableSelect = true;
    clearTimeout(timer);
    //Display win or loss message
    if (lives === 0) {
        getElementById("lives").textContent = "You Lost!"
    } else {
        getElementById("lives").textContent = "You Won!"
    }
}

function checkCorrect(tile) {
    //Set solution based on difficulty solution
    let solution;
    if (getElementById("diff-1").checked) solution = easy[1];
    else if (getElementById("diff-2").checked) solution = medium[1];
    else solution = hard[1];
    //If tiles numbers is equal to solutions number
    if (solution.charAt(tile.id) === tile.textContent) return true;
}

function clearPrevious() {
    //Access all of the tiles with helper function
    let tiles = qsa(".tile");
    //Remove each tile
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].remove();
    }
    //Clear previous timer
    if (timer) clearTimeout(timer);
    //Deselect any number
    for (let i = 0; i < getElementById("number-container").children.length; i++) {
        getElementById("number-container").children[i].classList.remove("selected");
    }
    //Clear selected variables
    selectedTile = null;
    selectedNum = null;
}



//helper functions
function getElementById(id) {
    return document.getElementById(id);
}

function qs(selector) {
    return document.querySelector(selector);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}