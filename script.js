//Load boards from file or manually
const easy = [
    //"6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "-85329174971485326234761859362574981549618732718293465823946517197852643456137298",
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
                    //Then remove selection and theme
                    this.classList.remove("selected");
                    this.classList.remove("dark");
                    this.classList.remove("rainbow");
                    selectedNum = null;
                } else {
                    //Deselect all other numbers and removwe theme
                    for (let i = 0; i <9; i++) {
                        getElementById("number-container").children[i].classList.remove("selected");
                        getElementById("number-container").children[i].classList.remove("dark");
                        getElementById("number-container").children[i].classList.remove("rainbow");
                    }
                    //Select it, add theme and update the selectedNum variable
                    this.classList.add("selected");
                    if (isDarkmode() === true) {
                        this.classList.add("dark");
                    }
                    if (isRainbow() === true) {
                        this.classList.add("rainbow");
                    }
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
    getElementById("lives").textContent = "Lives Remaining: " + lives;

    //hide trophy
    getElementById('trophy-div').classList.add("hidden");
    getElementById("trophy-div").classList.remove("flex");

    //Create board based on difficulty
    generateBoard(board);
    //set theme
    setTheme();
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
    //create array with all elements that will change in different themes
    themeElements = ["body", "header", "h1", "#difficulty-title", "#theme-title", "#timer", "#lives", "label.custom-radio-bttn",
                    ".custom-radio-bttn .checkmark", ".custom-radio-bttn .checkmark", "#radio-title", "#start-bttn",
                     "p.selected", "p.selected.highlighted", "p", ".tile", "#number-container"]

    //Sets theme based on input by first deleting previous and add the new one
    if (getElementById("theme-1").checked) {
        //remove dark and rainbow class from each element
        for (var i = 0; i<themeElements.length; i++) {
            removeClass(themeElements[i], "dark");
            removeClass(themeElements[i], "rainbow");
        }

    } else if (getElementById("theme-2").checked) {
        //remove rainbow class from each element
        for (var i = 0; i<themeElements.length; i++) {
            removeClass(themeElements[i], "rainbow");
        }
        //add dark class for each element
        for (var i = 0; i<themeElements.length; i++) {
            addClass(themeElements[i], "dark");
        }

    } else {
         //remove dark class from each element
        for (var i = 0; i<themeElements.length; i++) {
            removeClass(themeElements[i], "dark");
        }
        //add rainbow class for each element
        for (var i = 0; i<themeElements.length; i++) {
            addClass(themeElements[i], "rainbow");
        }
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
        }
            //Add click event listener to tile
             tile.addEventListener("click", function() {
                //if selecting is not disabled
                if (!disableSelect) {
                    //if tile is already selected
                    if (tile.classList.contains("selected")) {
                        //Then remove selection and theme depending on current theme
                        tile.classList.remove("selected");
                        if (isDarkmode) {
                            tile.classList.remove("rainbow");
                        } else if (isRainbow) {
                            tile.classList.remove("dark");
                        } else {
                            tile.classList.remove("dark");
                            tile.classList.remove("rainbow");
                        }
                        //Remove highlight from tiles
                        removeHighlight();
                        selectedTile = null;
                    } else {
                        //Deselect all other tiles
                        for (let i = 0; i < 81; i++) {
                            qsa(".tile")[i].classList.remove("selected");
                        }
                        //Add selection, update variable and highlight same value tiles
                        tile.classList.add("selected");
                        if (isDarkmode() === true) {
                            tile.classList.add("dark");
                        }
                        if (isRainbow() === true) {
                            tile.classList.add("rainbow");
                        }
                        selectedTile = tile;

                        highlightTiles(selectedTile);                     
                        updateMove();
                    }
                }
            })

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
        //Set the tile to the correct number if tile is empty
        if (selectedTile.textContent === "") { 
            selectedTile.textContent = selectedNum.textContent;
        }
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

//add higlighted class to tiles with same value
function highlightTiles(selectedTile) {
    //remove previous higlight
    removeHighlight();
    let highlightValue = selectedTile.textContent;
    //Check if selected tile is not empty
    if (highlightValue != "") {
        //Check all tiles for same value
        for (let i = 0; i < 81; i++) {
            if (qsa(".tile")[i].textContent === highlightValue) {
                //add higlighted class to tiles with same value
                qsa(".tile")[i].classList.add("highlighted");
                if (isDarkmode() === true) {
                    qsa(".tile")[i].classList.add("dark");
                }
                if (isRainbow() === true) {
                    qsa(".tile")[i].classList.add("rainbow");
                }
            }
        }
    }
}

function removeHighlight() {
    //Remove highlight from tiles
    for (let i = 0; i < 81; i++) {
        qsa(".tile")[i].classList.remove("highlighted");
        //remove theme depending on current theme
   //     qsa(".tile")[i].classList.remove("dark");
   //     qsa(".tile")[i].classList.remove("rainbow");
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
        getElementById("lives").textContent = "You Lost!";
    } else {
        getElementById("lives").textContent = "You Won!";
        //show trophy svg
        getElementById('trophy-div').classList.remove("hidden");
        getElementById("trophy-div").classList.add("flex");
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

function addClass(object, classAttribute) {
    qsa(object).forEach((element) => {
        element.classList.add(classAttribute)
    });
}

function removeClass(object, classAttribute) {
    qsa(object).forEach((element) => {
        element.classList.remove(classAttribute)
    });
}

function isDarkmode() {
    return getElementById("theme-2").checked
}

function isRainbow() {
    return getElementById("theme-3").checked
}