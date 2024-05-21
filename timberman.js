var loadProgress = 0, countSprites = 25;

// Level
var levelLoad = 0;
var levelMenu = 1;
var levelPlay = 2;
var levelGameOver = 3;
var level = levelLoad;

// Score
var levelscore = 1;
var score = 0, number = [];
var bestscore = 0;

// Trunk
var trunk = [], TrunkHeight = 243;

// Screen
openScreen("game", 0, 0, 1080, 1775);
initMouse();
initKeyboard();
resizeScreen(true);

// Load sprites
var background = loadSprite("assets/image/background.png", onReady);

// Intro
var clic = loadSprite("assets/image/clic.png", onReady);
var or = loadSprite("assets/image/or.png", onReady);
var left = loadSprite("assets/image/left.png", onReady);
var right = loadSprite("assets/image/right.png", onReady);

// Trunk
var stump = loadSprite("assets/image/stump.png", onReady);
var trunk1 = loadSprite("assets/image/trunk1.png", onReady);
var branchleft = loadSprite("assets/image/branch1.png", onReady);
var branchright = loadSprite("assets/image/branch2.png", onReady);

// Game Over
var rip = loadSprite("assets/image/rip.png", onReady);
var gameover = loadSprite("assets/image/gameover.png", onReady);
var play = loadSprite("assets/image/play.png", onReady, restartGame);

// Timberman
var man = loadSprite("assets/image/man.png", onReady);

// Score
for (var n = 0; n < 10; n++) {
    number[n] = loadSprite("assets/image/numbers.png", onReady);
}

// Progress bar
var timecontainer = loadSprite("assets/image/time-container.png", onReady);
var timebar = loadSprite("assets/image/time-bar.png", onReady);

// Load Sound
var theme = loadSound("assets/sound/theme.mp3");
var cut = loadSound("assets/sound/cut.mp3");
var death = loadSound("assets/sound/death.mp3");
var menubar = loadSound("assets/sound/menu.mp3");

function onReady() {
    loadProgress++;

    if (loadProgress == countSprites) {
        anchorSprite(man, 0.5, 0.5);
        man.x = 263;

        addAnimation(man, "breath", [2, 3], 527, 413, 350);
        addAnimation(man, "cut", [0, 1, 0], 527, 413, 15);

        trunk1.data = "trunk1";
        branchleft.data = "branchleft";
        branchright.data = "branchright";

        initTrunk();

        clipSprite(number[0], 5, 5, 66, 91);
        clipSprite(number[1], 81, 5, 50, 91);
        clipSprite(number[2], 141, 5, 66, 91);
        clipSprite(number[3], 217, 5, 66, 91);
        clipSprite(number[4], 293, 5, 66, 91);
        clipSprite(number[5], 369, 5, 66, 91);
        clipSprite(number[6], 445, 5, 66, 91);
        clipSprite(number[7], 521, 5, 66, 91);
        clipSprite(number[8], 597, 5, 66, 91);
        clipSprite(number[9], 673, 5, 66, 91);

        level = levelLoad;

        if (localStorage.bestscore) {
            bestscore = Number(localStorage.bestscore);
        }

        renderGame();
    }
}

function initTrunk() {
    trunk = [0, 0, 0, 0, 0, 0, 0];
    trunk[0] = copySprite(trunk1);
    trunk[1] = copySprite(trunk1);
    addTrunk();

    score = 0;
    timescore = 254;
    levelscore = 1;
}

function addTrunk() {
    for (var i = 1; i < 7; i++) {
        if (trunk[i] === 0) {
            if (trunk[i - 1].data == "trunk1") {
                if (Math.random() * 4 <= 1) {
                    trunk[i] = copySprite(trunk1);
                } else {
                    if (Math.random() * 2 < 1) {
                        trunk[i] = copySprite(branchleft);
                    } else {
                        trunk[i] = copySprite(branchright);
                    }
                }
            } else {
                trunk[i] = copySprite(trunk1);
            }
        }
    }
}

function restartGame() {
    playSound(menubar);
    initTrunk();
    level = levelMenu;
}

function gameOver() {
    level = levelGameOver;
    resumeSound(theme);
    playSound(death);

    if (score > bestscore) {
        bestscore = score;
        localStorage.bestscore = bestscore;
    }
}

function displaySprite(sprite, x, y, width = sprite.width, height = sprite.height) {
    context.drawImage(sprite.image, x, y, width, height);
}

function renderGame() {
    var p = 0, m = 0;
    clearScreen("black");

    // Display Background - scale to screen size
    displaySprite(background, 0, 0, screenWidth(), screenHeight());

    // Display Trunk in 2/3 right part of the screen
    var gameAreaWidth = screenWidth() * 2 / 3;
    var gameAreaX = screenWidth() - gameAreaWidth;

    displaySprite(stump, gameAreaX + 352, 1394);
    for (var i = 0; i < 6; i++) {
        displaySprite(trunk[i], gameAreaX + 37, stump.y - TrunkHeight * (i + 2) + TrunkHeight);
    }

    // Display Timberman    
    if (level == levelPlay) {
        displaySprite(man, gameAreaX + man.x, 1270);
    }

    // Display Level Load 
    if (level == levelLoad) {
        displaySprite(man, gameAreaX + man.x, 1270);
        displaySprite(left, gameAreaX + 250, 1020);
        displaySprite(or, gameAreaX + 450, 1300);
        displaySprite(right, gameAreaX + 580, 1020);
        displaySprite(clic, gameAreaX + 300, 1500);
    }

    // Display Level Game Over
    if (level == levelGameOver) {
        displaySprite(rip, gameAreaX + man.x, 1240);
        displaySprite(gameover, gameAreaX + 110, -250);
        displaySprite(play, gameAreaX + 350, 900);

        for (var i = 0; i < bestscore.toString().length; i++) {
            p = bestscore.toString().substring(i, i + 1);
            m = gameAreaX + screenWidth() / 2 - 35 * bestscore.toString().length;
            displaySprite(number[p], m + 67 * i, 480);
        }
    }

    // Display Progress Bar
    if (level == levelPlay) {
        if (timescore > 0) {
            timescore -= levelscore / 10;
        } else {
            gameOver();
            level = levelGameOver;
        }
        displaySprite(timecontainer, gameAreaX + 255, 100);
        displaySprite(timebar, gameAreaX + 285, 130, timescore);
    }

    // Display Score
    for (var i = 0; i < score.toString().length; i++) {
        p = score.toString().substring(i, i + 1);
        m = gameAreaX + screenWidth() / 2 - 35 * score.toString().length;
        displaySprite(number[p], m + 67 * i, 220);
    }

    // Events clavier et souris 
    if (keyboardReleased(KEY_LEFT) && level != levelGameOver) {
        man.data = "left";
        man.x = 263;
        flipSprite(man, 1, 1);
        man.action = true;
    }

    if (keyboardReleased(KEY_RIGHT) && level != levelGameOver) {
        man.data = "right";
        man.x = 800;
        flipSprite(man, -1, 1);
        man.action = true;
    }

    if (keyboardReleased(KEY_ENTER) && level == levelGameOver) {
        restartGame();
        level = levelLoad;
    }

    if (mouseButton() == true) {
        switch (level) {
            case levelMenu:
                level = levelLoad;
                break;

            case levelLoad:
                man.action = true;
                break;

            case levelPlay:
                if (mouseX() <= screenWidth() / 2) {
                    man.data = "left";
                    man.x = 263;
                    flipSprite(man, 1, 1);
                } else {
                    man.data = "right";
                    man.x = 800;
                    flipSprite(man, -1, 1);
                }
                man.action = true;
                break;
        }
    }

    // Action
    if (man.action == true) {
        if (level == levelLoad) {
            playSound(theme, true);
            level = levelPlay;
        }

        // Joue le son "cut"
        playAnimation(man, "cut");
        playSound(cut);

        // Est ce une branche qui pourrait heurter le bucheron
        if (man.data == "left" && trunk[0].data == "branchleft" || man.data == "right" && trunk[0].data == "branchright") {
            gameOver();
        }

        // Mise à jour du scrore 
        score++;
        if (score % 20 == 0) {
            levelscore++;
        }

        if (timescore < 508) {
            timescore += 10;
        }

        // Chaque tronçon de l'arbre descend d'un niveau
        for (var i = 0; i < 6; i++) {
            trunk[i] = trunk[i + 1];
        }

        // Suppression du tronçon le plus haut
        trunk[6] = 0;

        // Ajout d'un nouveau tronçon
        addTrunk();

        // Une fois le tronc coupé, on vérifie si le tronc qui retombe n'est pas une branche qui pourrait heurter le bucheron
        if (man.data == "left" && trunk[0].data == "branchleft" || man.data == "right" && trunk[0].data == "branchright") {
            gameOver();
        }
        man.action = false;
    }
    requestAnimationFrame(renderGame);
}
