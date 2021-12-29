const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var canvas;
var archer
var Arrows = [];
var board;
var numberOfArrows = 100;

var score = 0;

function preload() {
  backgroundImg = loadImage("background.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;

  base = new Base(300, 500, 180, 150);
  
  archer = new Archer(300,base.body.position.y - 80,120,120);

  board = new Board(width - 300, 330, 50, 200);
}

function draw() {
  background(backgroundImg);

  Engine.update(engine);

  base.display();
  archer.display();

  board.display();

  for (var i = 0; i < Arrows.length; i++) {
    if (Arrows[i] !== undefined) {
      Arrows[i].display();

      var boardCollision = Matter.SAT.collides(
        board.body,
        Arrows[i].body
      );

      if (boardCollision.collided) {
        score += 5;
      }

      var posX = Arrows[i].body.position.x;
      var posY = Arrows[i].body.position.y;

      if (posX > width || posY > height) {
        if (Arrows[i].isRemoved) {
          Arrows[i].remove(i);
        } else {
          Arrows[i].trajectory = [];
        }
      }
    }
  }

  fill("#FFFF");
  textAlign("center");
  textSize(40);
  text("ARCHERY", width / 2 , height - 650);

  fill("#FFFF");
  textAlign("center");
  textSize(30);
  text("Score " + score, width - 200, 100);

  fill("#FFFF");
  textAlign("center");
  textSize(30);
  text("Remaining Arrows : " + numberOfArrows, 200, 100);

  if(board.body.position.y > height - 700){
    board.velocityY = 0.5;
  }

  if(board.body.position.y < height - 100){
    board.velocityY = -0.5
  }

  if (numberOfArrows == 0) {
    gameOver();
  }

}

function keyPressed() {
  if (keyCode === 32) {
    if (numberOfArrows > 0) {
      var posX = archer.body.position.x;
      var posY = archer.body.position.y;
      var angle = archer.body.angle;

      var arrow = new Arrow(posX, posY, 100, 10, angle);

      arrow.trajectory = [];
      Matter.Body.setAngle(arrow.body, angle);
      Arrows.push(arrow);
      numberOfArrows -= 1;
    }
  }
}

function keyReleased() {
  if (keyCode === 32) {
    if (Arrows.length) {
      var angle = archer.body.angle;
      Arrows[Arrows.length - 1].shoot(angle);
    }
  }
}

