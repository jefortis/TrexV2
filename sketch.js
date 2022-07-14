var PLAY=1;
var END=0;
var gameState=PLAY;


var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud, cloudImage, cloudGroup;
var obstacle,obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6, obtaclesGroup;
var gameOver,restart, Hscore;


function preload(){
  //Precargar la imagen del fondo
   backgroundImg = loadImage("backgroundImg.png")
  sunAnimation = loadImage("sun.png");
  //Precargar imagen del trex corriendo
  trex_running = loadAnimation("trex_1.png","trex_2.png","trex_3.png");
  trex_collided = loadAnimation("trex_collided-1.png");
  
  //Precargar imagen del suelo
  groundImage = loadImage("ground.png");
  
  //Precargar imagen de las nubes
  cloudImage = loadImage("cloud-1.png");
  
  //Precargar imagenes de los obstaculos
  obstacle1 = loadImage("obstacle1-1.png");
  obstacle2 = loadImage("obstacle2-1.png");
  obstacle3 = loadImage("obstacle3-1.png");
  obstacle4 = loadImage("obstacle4-1.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  //Precargar las imagenes de gameOver y Restart
   gameOverImg = loadImage("gameOver-1.png");
  restartImg = loadImage("restart-1.png");
  
  //precargar sonidos
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
 
}

function setup() {
  
  createCanvas(windowWidth, windowHeight);

   Hscore = 0;
  
  sun = createSprite(width-50,100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.1
 
  //Crea el Sprite del trex
  trex = createSprite(50,height-70,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided",trex_collided);
  trex.scale = 0.08; 
  
  //crea el Sprite del suelo
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2;
  trex.depth = ground.depth;
  trex.depth = trex.depth + 1;
   

  //crea el suelo invisible
  invisibleGround = createSprite(width/2,height-0,width,125);
  //invisibleGround.visible = true;
  invisibleGround.shapeColor = "#f4cbaa";
  
  //crea obstaculos y grupos de nubes
  obstaclesGroup = new Group();
  cloudsGroup = new Group();
  
  //crear radio de colisión
  trex.setCollider("circle",0,0,350);
  trex.debug=false;
  
  //crea sprites de gameOver y restart
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  restart.scale = 0.1;
  restart.visible = false;
  
  
  score = 0;
  
}

function draw() {
    background(backgroundImg);
  

  fill("midnightblue");
  stroke("white");
  textSize(20);
  text("Puntuación: " + score, 50,50);
 // text("Puntuación más alta:" + Hscore, 419,70);
 
  //console.log("this is", gameState);
  
    if(gameState === PLAY){ 
      
      //mueve el piso
      ground.velocityX = -(6+score/1000);
            
      //puntuación
      score = score + Math.round(getFrameRate()/60);
            
      //Poner sonido cada 100 puntos
      if(score>0 && score%100 === 0){
       checkPointSound.play() 
      }
      
      //piso
     if (ground.x < 0){
    ground.x = ground.width/2;
    }
      
      //salta cuando preciono la barra espaciadora
    if(touches.length > 0 || keyDown("space")&& trex.y >= height-120) {
      trex.velocityY = -10; 
      jumpSound.play(); 
      touches = [];
    }
      
      
      // agrega gravedad
      trex.velocityY = trex.velocityY + 0.5 
      
      //aparece las nubes
      spawnClouds();
  
  
       //aparece obstáculos en el suelo
      spawnObstacles();
      
      if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play();
      }
              
  }
  else if(gameState === END){
    
    //detiene el suelo (CREA)
    ground.velocityX = 0;
    trex.velocityY=0;
    
    //cambiar la animación del trex
    trex.changeAnimation("collided",trex_collided);
    
    
    //establecer un ciclo de vida a los objetos para que nunca sea destruido.
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    //detener las nubes y los obstáculos
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //mostrar imagenes de gameOver y restart
    gameOver.visible=true;
    restart.visible=true;
    
   if(touches.length>0 || keyDown("SPACE") || mousePressedOver(restart)){
        reset();
        touches = [];
      }     
    
   }
 
  //salta cuando se presiona la barra espaciadora
 // if(keyDown("space") && trex.y>=160) {
  //  trex.velocityY = -10;
  //  jumpSound.play ();
 // }
  
    
  trex.collide(invisibleGround);
  

  drawSprites();
}

function spawnObstacles(){
  if (frameCount % 60 === 0){
   obstacle = createSprite(width,height-95,20,30 );
   obstacle.setCollider('circle',0,0,45); 
   obstacle.debug = false;
    obstacle.velocityX= ground.velocityX;
    
    //añade cada obstáculo al grupo
    obstaclesGroup.add(obstacle);

    
    
    //generar obstáculos al azar
    rand = Math.round(random(1,2));
    switch(rand){
        case 1: obstacle.addImage(obstacle1);
        break;
        case 2: obstacle.addImage(obstacle2);
        break;
        //case 3: obstacle.addImage(obstacle3);
        //break;
        //case 4: obstacle.addImage(obstacle4);
        //break;
        //case 5: obstacle.addImage(obstacle5);
        //break;
        //case 6: obstacle.addImage(obstacle6);
        //break;
        default:break;
    }
    //asigna escala y ciclo de vida al obstaculo           
    obstacle.scale = 0.3;
    obstacle.lifetime = 300;
    obstacle.depth = trex.depth;
    trex.depth +=1;
    
  }
 
}

function spawnClouds() {
  //escribe el código aquí para aparecer las nubes
  if (frameCount % 60 === 0) {
    cloud = createSprite(width+20,height-300,40,10);
    cloud.addImage(cloudImage)
    cloud.y = Math.round(random(100,220));
    cloud.scale = 0.6;
    cloud.velocityX = ground.velocityX;
    
    //asigna un ciclo de vida a la variable
    cloud.lifetime = 700;

    
    //ajusta la profundidad
    cloud.depth = trex.depth
    trex.depth = trex.depth + 1;
    
    //añade cada nube al grupo
    cloudsGroup.add(cloud);

    }

}

  function reset(){
    
    gameState = PLAY;
    gameOver.visible = false;
    restart.visible = false;
    obstaclesGroup.destroyEach();
    cloudsGroup.destroyEach();
    trex.changeAnimation("running",trex_running);
    
    if (score > Hscore ){
      Hscore = score;
    }
    score = 0;
    
  }