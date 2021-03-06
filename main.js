const GRAVITY = 0.8;
const numBirds = 10;

let frames = 0;
let pipes = [];
let birds = [];
let deadBirds = [];
let gen;
let scoreboard;
let slider;

function preload() {
  bgImg = loadImage("images/background.jpg");
  birdImg = loadImage("images/bird.png");
  pipeImg = loadImage("images/pipe.png");
}

function setup() {
  angleMode(DEGREES);

  const canvas = createCanvas(800, 600);
  canvas.parent("canvas");
  slider = createSlider(1, 10, 1);
  slider.id("slider");

  gen = new Gen();
  scoreboard = new Scoreboard();

  // Add Birds
  for (let i = 0; i < numBirds; i++) birds.push(new Bird());
}

function draw() {
  for (let n = 0; n < slider.value(); n++) {
    // Add pipes
    if (frames % 120 == 0) {
      pipes.push(new Pipe());
    }
    frames++;

    // Update Pipes
    for (let i = 0; i < pipes.length; i++) {
      pipes[i].update();

      // Check for dead birds
      for (let j = 0; j < birds.length; j++)
        if (pipes[i].hits(birds[j])) deadBirds.push(birds.splice(j, 1)[0]);

      // Check for pipes off screen
      if (pipes[i].isOffScreen()) pipes.splice(i);
    }

    // Update Birds
    for (let i = 0; i < birds.length; i++) {
      if (birds[i].isOffScreen()) deadBirds.push(birds.splice(i, 1)[0]);
    }
    for (let bird of birds) {
      // Decide whether to jump or not
      bird.think(pipes);

      bird.update();
    }

    // Are all birds dead?
    if (birds.length == 0) {
      nextGeneration();
      frames = 0;
      pipes = [];
    }
  }

  // Draw
  background(bgImg);
  for (let bird of birds) bird.draw();
  for (let pipe of pipes) pipe.draw();

  let pipeScore = Math.floor((birds[0].score - 100) / 120) < 0
  ? 0
  : Math.floor((birds[0].score - 100) / 120);
  textSize(48);
  textStyle(BOLD);
  textAlign(RIGHT);
  textFont("Electrolize");
  text(pipeScore, width-20, 50);
}
