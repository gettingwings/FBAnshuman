const START = -1, PLAY = 1, END = 0;
var gameState = START;

var bird, birdImg, boostImg;
var bg,bgImg;

var hitSound,pointSound,wingSound;
var down,up;
var ig; 
var up1,down1,up2,down2,up3,down3,up4,down4;
var wallsGroup, coinsGroup;
var restartImg,restart;
var coinImg, coinSound;
var seedImg, seedsGroup;

var score = 0;
var vel = 0, velX = 0, velY = 0;

var hScore = 0;
var boost = false;
var flappyFont;


function preload(){

  bgImg = loadImage("background.jpg");
  
  birdImg = loadImage("bird.png");
  boostImg = loadImage("blueBird.png")
  
  up1 = loadImage("up1.jpg");
  down1 = loadImage("down1.jpg");
  up2 = loadImage("up2.jpg");
  down2 = loadImage("down2.jpg");
  up3 = loadImage("up3.jpg");
  down3 = loadImage("down3.jpg");
  up4 = loadImage("up4.jpg");
  down4 = loadImage("down4.jpg");
  
  restartImg = loadImage("restart.png");
  
  hitSound = loadSound("hitSound.mp3");
  
  coinImg = loadImage("coin.png");
  coinSound = loadSound("coinSound.wav");
  
  seedImg = loadImage("goldenSeed.png");
  seedSound = loadSound("seed.mp3");
  
  flappyFont = loadFont("FlappyBirdFull.ttf");
}


function setup() {
  createCanvas(600,450)
  
  bg = createSprite(width/2,height/2);
  bg.addImage(bgImg)
  bg.scale = 01;
  bg.x = bg.width /2;
 
  bird = createSprite(50,250,10,10);
  bird.addImage(birdImg);
  bird.scale = 0.1;
  //bird.debug = true;
  bird.setCollider("circle",0,0,100)
  
  restart = createSprite(300,height/2,10,10);
  restart.addImage(restartImg);
  restart.scale = 0.15;
  restart.visible = false;
  
  wallsGroup = new Group();
  coinsGroup = new Group();
  seedsGroup = new Group();
  
}//end of setup


function draw() {
  
  drawSprites();
  fill(0)
  textSize(20);
  textFont("Georgia");
  text(score, width-50,30);
  text("Highest Score: "+ hScore, 10, 30);
  
  if(gameState == START){
    // at the start
    push();
    textFont(flappyFont);
    textSize(90);
    textAlign(CENTER);
    fill(247,147,28);
    text("Flappy Bird", width/2, height/3);
    pop();
    
    setTimeout(()=>{gameState=PLAY},1000);
    textAlign(CENTER);
    text("Game starts in a second...", width/2, height/3+50);
    
  }else if(gameState===PLAY){
    // to play
    
    restart.visible = false;
    bg.velocityX = -vel;
    if (bg.x < 0){
      bg.x = bg.width/2;
    }
    
    if(boost == false){
      vel = 8;
      bird.addImage(birdImg);
    }else if(boost == true){
      vel = 14; 
      bird.velocityY = 0;
      bird.addImage(boostImg);
    }
    
    if (keyDown("up") || touches.length>0 ){
      bird.velocityY = -3;
      touches = [];
    }
    // add gravity
    bird.velocityY += 0.3;
    
    // down arrow active in boost mode
    if (keyDown("down") && boost == true){
      bird.velocityY = 3;
    }
    
    spawnWalls();
    spawnCoins()
    
    if((bird.isTouching(wallsGroup) || bird.y>height+100 )&& boost==false){
       
       bird.velocityY = 0;
       bird.y = height-20; 
       gameState = END;
       hitSound.play(); 
    }
    
    bird.overlap(seedsGroup,       (birdSprite,seedSprite)=>{
       seedSprite.destroy();
       seedSound.play()
       boost = true;
       score += 5;
       setTimeout(()=>{boost = false;}, 3500)
       });
    
    
    bird.overlap(coinsGroup, (birdSprite, coinSprite)=>       {
      coinSound.play()
      score++;
      coinSprite.destroy();
    });
    
  
  } else if(gameState == END){
    // WHEN GAME ENDS 
    
    bg.velocityX = 0;
    bird.visible = false;
    restart.visible = true;
    wallsGroup.destroyEach();
    coinsGroup.destroyEach();
    seedsGroup.destroyEach();
    
    if(mousePressedOver(restart) || touches.length>0){
      touches = [];
      reset();
    }  
    
    push();
    textSize(90);
    textFont(flappyFont);
    textAlign(CENTER);
    fill(247,147,28);
    text("Game Over", width/2, height/3);
    pop();
    
    
  }//end of gameState END
}// end of draw()


function reset(){
  //WHEN GAME RESTARTS
  
  gameState = START;
  restart.visible = false;
  bird.visible = true;
  bird.x = 50;
  bird.y = 250;
  bird.velocityY = -3;
  direction = "straight";
  bird.velocityY =  0;
  
  if(hScore<score){
      hScore = score;
      textAlign(CENTER);
      text("New High Score: "+ hScore, width/2, height-100); 
  }
  
  score = 0;
  
}// end of reset()


function spawnWalls(){
  
  if (frameCount%60 === 0){
    up = createSprite(610,95,5,5)
    up.velocityX = -vel;
    up.scale = 0.9;
    up.addImage(up1);
    
    down = createSprite(610,410,10,10) 
    down.velocityX = -vel;
    down.scale = 0.9;
    down.addImage(down1);
    
    var rand = Math.round(random(1,4));
      
    switch(rand) {
        case 1: up.addImage(up1);
                down.addImage(down1);
                down.y = 380;
                break;
                 
        case 2: up.addImage(up2);
                down.addImage(down2);
                break;
                 
        case 3: up.addImage(up3);
                down.addImage(down3);
                break;
                 
        case 4: up.addImage(up4);
                down.addImage(down4)  
                up.y = 50;
                down.y = 345;
                break;      
                 
        default: break;          
    }
     
    //up.debug = true;
    //down.debug = true;
    
    up.setCollider("rectangle", 
                   0, 0, up.width, up.height);
    down.setCollider("rectangle", 
                   0, 0, down.width,down.height);
    up.setLifetime = 60;
    down.setLifetime = 60;
    wallsGroup.add(up);
    wallsGroup.add(down); 
  }
}


function spawnCoins(){
  var rand = random([40,45,50,55,60,65]);
  if(frameCount%rand == 0){
    let x = width+10;
    let y = random(100,height-100);
    var coin = createSprite(x, y, 15, 15);
    
    // To destroy coin if it gets created on the wall
    if(coin.overlap(wallsGroup)){
      coin.destroy();
    }
    
    coin.velocityX = -vel;
    coin.lifetime = 100;
    //coin.debug = true;
    
    let rand = round(random([1,2,3,4,5]));
    switch(rand){
      case 1:coin.addImage(seedImg);
             coin.scale = 0.06;
             coin.setCollider("rectangle",0,0,170,160);
             seedsGroup.add(coin);
             break;
      default: 
             coin.addImage(coinImg);
             coin.scale = 0.1;
             coin.setCollider("circle",0,0,95);
             coinsGroup.add(coin);
             break;
    }//end of switch
  }//end of if
}//end of function
