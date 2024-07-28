let playerNames = JSON.parse(localStorage.getItem("playerNames")) || [];
let input1 = document.getElementById("inp1");
let input2 = document.getElementById("inp2");
let button = document.getElementById("button1");
let gameModeSelect = document.getElementById("gameMode");
let gameMode = "twoPlayers"; // default game mode
let isgameover = "false";
let turn = "X";
let ting = new Audio("ting.mp3");
let gameover = new Audio("gameover.mp3");
let user = "";
let reset = document.getElementById("reset");
let exit = document.getElementById("exit");

gameModeSelect.addEventListener("change", () => {
    gameMode = gameModeSelect.value;
    if (gameMode === "singlePlayer") {
        input2.style.display = "none";
        document.getElementById("labelPlayer2").style.display = "none";
    } else {
        input2.style.display = "block";
        document.getElementById("labelPlayer2").style.display = "block";
    }
});

button.addEventListener("click", names);

function names() {
    if (input1.value === "" || (input2.value === "" && gameMode === "twoPlayers")) {
        alert("Please enter players' names");
    } else {
        const player1 = input1.value;
        const player2 = gameMode === "singlePlayer" ? "AI" : input2.value;
        playerNames = [{ name1: player1, name2: player2 }];
        saveToLocalStorage();
        document.getElementById("abc").style.display = "none";
        document.getElementById("game").style.display = "block";
        document.getElementsByClassName("info")[0].innerHTML = "Turn for " + playerNames[0].name1;
        input1.value = "";
        input2.value = "";
    }
}

function saveToLocalStorage() {
    localStorage.setItem("playerNames", JSON.stringify(playerNames));
}

gameLogic();

function gameLogic() {
    if (isgameover === "false") {
        logic1();
    }

    const changeTurn = () => {
        return turn === "X" ? "O" : "X";
    }

    const userName = () => {
        return user === playerNames[0].name2 ? playerNames[0].name1 : playerNames[0].name2;
    }

    function logic1() {
        let boxes = document.getElementsByClassName("box");
        Array.from(boxes).forEach(element => {
            let boxtext = element.querySelector(".boxtext");
            element.addEventListener("click", () => {
                if (boxtext.innerText === "" && isgameover === "false") {
                    boxtext.innerText = turn;
                    turn = changeTurn();
                    if (turn === "X") {
                        boxtext.style.color = "#fff";
                    } else {
                        boxtext.style.color = "pink";
                    }
                    ting.play();
                    checkWin();
                    if (isgameover === "false") {
                        if (gameMode === "singlePlayer" && turn === "O") {
                            setTimeout(aiMove, 500); // AI makes move after a short delay
                        } else {
                            user = userName();
                            document.getElementsByClassName("info")[0].innerText = "Turn for " + user;
                        }
                    }
                }
            });
        });
    }

    const aiMove = () => {
        let boxes = document.getElementsByClassName("boxtext");
        let availableBoxes = [];
        for (let i = 0; i < boxes.length; i++) {
            if (boxes[i].innerText === "") {
                availableBoxes.push(i);
            }
        }
        if (availableBoxes.length > 0) {
            let randomIndex = Math.floor(Math.random() * availableBoxes.length);
            boxes[availableBoxes[randomIndex]].innerText = "O";
            boxes[availableBoxes[randomIndex]].style.color = "pink";
            turn = changeTurn();
            ting.play();
            checkWin();
            if (isgameover === "false") {
                document.getElementsByClassName("info")[0].innerText = "Turn for " + playerNames[0].name1;
            }
        }
    }

    const checkWin = () => {
        let boxtext = document.getElementsByClassName("boxtext");
        let win = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        win.forEach(e => {
            if ((boxtext[e[0]].innerText === boxtext[e[1]].innerText) && (boxtext[e[2]].innerText === boxtext[e[1]].innerText) && (boxtext[e[0]].innerText !== "")) {
                if (boxtext[e[0]].innerText === "X") {
                    document.getElementsByClassName("info")[0].innerText = playerNames[0].name1 + " won";
                } else {
                    document.getElementsByClassName("info")[0].innerText = playerNames[0].name2 + " won";
                }
                isgameover = "true";
                boxtext[e[0]].style.color = "black";
                boxtext[e[1]].style.color = "black";
                boxtext[e[2]].style.color = "black";
                gameover.play();
                return;
            }
        });
        checkDraw(); // Check for draw if no winner
    }

    const checkDraw = () => {
        let boxtext = document.getElementsByClassName("boxtext");
        let filledBoxes = 0;
        for (let i = 0; i < boxtext.length; i++) {
            if (boxtext[i].innerText !== "") {
                filledBoxes++;
            }
        }
        if (filledBoxes === 9 && isgameover === "false") {
            document.getElementsByClassName("info")[0].innerText = "It's a draw!";
            isgameover = "true";
            gameover.play();
        }
    }

    reset.addEventListener("click", () => {
        resetGame();
    });

    exit.addEventListener("click", () => {
        localStorage.clear();
        document.getElementById("abc").style.display = "block";
        document.getElementById("game").style.display = "none";
        document.getElementsByClassName("info")[0].innerHTML = "";
        isgameover = "false";
    });

    function resetGame() {
        let boxtexts = document.querySelectorAll(".boxtext");
        Array.from(boxtexts).forEach(element => {
            element.innerText = "";
            element.style.color = "#fff";
        });
        turn = "X";
        isgameover = "false";
        user = playerNames[0].name1;
        document.getElementsByClassName("info")[0].innerText = "Turn for " + user;
    }
}
