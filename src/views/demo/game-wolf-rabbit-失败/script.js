//THREEJS RELATED VARIABLES 

var scene,
  camera, fieldOfView, aspectRatio, nearPlane, farPlane,
  gobalLight, shadowLight, backLight,
  renderer,
  container,
  controls, 
  clock;
var delta = 0;
var floorRadius = 200;
var speed = 6;
var distance = 0;
var level = 1;
var levelInterval;
var levelUpdateFreq = 3000;
var initSpeed = 5;
var maxSpeed = 48;
var monsterPos = .65;
var monsterPosTarget = .65;
var floorRotation = 0;
var collisionObstacle = 10;
var collisionBonus = 20;
var gameStatus = "play";
var cameraPosGame = 160;
var cameraPosGameOver = 260;
var monsterAcceleration = 0.004;
var malusClearColor = 0xb44b39;
var malusClearAlpha = 0;
var audio = new Audio('https://s3-us-west-2.amazonaws.com/s.cdpn.io/264161/Antonio-Vivaldi-Summer_01.mp3');

var fieldGameOver, fieldDistance;

//SCREEN & MOUSE VARIABLES

var HEIGHT, WIDTH, windowHalfX, windowHalfY,
  mousePos = {
    x: 0,
    y: 0
  };

//3D OBJECTS VARIABLES

var hero;


// Materials
var blackMat = new THREE.MeshPhongMaterial({
    color: 0x100707,
    shading:THREE.FlatShading,
  });
  
var brownMat = new THREE.MeshPhongMaterial({
    color: 0xb44b39,
    shininess:0,
    shading:THREE.FlatShading,
  });

var greenMat = new THREE.MeshPhongMaterial({
    color: 0x7abf8e,
    shininess:0,
    shading:THREE.FlatShading,
  });
  
  var pinkMat = new THREE.MeshPhongMaterial({
    color: 0xdc5f45,//0xb43b29,//0xff5b49,
    shininess:0,
    shading:THREE.FlatShading,
  });
  
  var lightBrownMat = new THREE.MeshPhongMaterial({
    color: 0xe07a57,
    shading:THREE.FlatShading,
  });
  
  var whiteMat = new THREE.MeshPhongMaterial({
    color: 0xa49789, 
    shading:THREE.FlatShading,
  });
  var skinMat = new THREE.MeshPhongMaterial({
    color: 0xff9ea5,
    shading:THREE.FlatShading
  });




var PI = Math.PI;


function initScreenAnd3D() {





}




function handleMouseDown(event){
  if (gameStatus == "play") hero.jump();
  else if (gameStatus == "readyToReplay"){
    replay();
  }
}









function updateMonsterPosition(){
  monster.run();
  monsterPosTarget -= delta*monsterAcceleration;
  monsterPos += (monsterPosTarget-monsterPos) *delta;
  if (monsterPos < .56){
    gameOver();
  }
  
  var angle = Math.PI*monsterPos;
  monster.mesh.position.y = - floorRadius + Math.sin(angle)*(floorRadius + 12);
  monster.mesh.position.x = Math.cos(angle)*(floorRadius+15);
  monster.mesh.rotation.z = -Math.PI/2 + angle;
}

function gameOver(){
  fieldGameOver.className = "show";
  gameStatus = "gameOver";
  monster.sit();
  hero.hang();
  monster.heroHolder.add(hero.mesh);
  TweenMax.to(this, 1, {speed:0});
  TweenMax.to(camera.position, 3, {z:cameraPosGameOver, y: 60, x:-30});
  carrot.mesh.visible = false;
  obstacle.mesh.visible = false;
  clearInterval(levelInterval);
}

function replay(){
  
  gameStatus = "preparingToReplay"
  
  fieldGameOver.className = "";
  
  TweenMax.killTweensOf(monster.pawFL.position);
  TweenMax.killTweensOf(monster.pawFR.position);
  TweenMax.killTweensOf(monster.pawBL.position);
  TweenMax.killTweensOf(monster.pawBR.position);
  
  TweenMax.killTweensOf(monster.pawFL.rotation);
  TweenMax.killTweensOf(monster.pawFR.rotation);
  TweenMax.killTweensOf(monster.pawBL.rotation);
  TweenMax.killTweensOf(monster.pawBR.rotation);
  
  TweenMax.killTweensOf(monster.tail.rotation);
  TweenMax.killTweensOf(monster.head.rotation);
  TweenMax.killTweensOf(monster.eyeL.scale);
  TweenMax.killTweensOf(monster.eyeR.scale);
  
  //TweenMax.killTweensOf(hero.head.rotation);
  
  monster.tail.rotation.y = 0;
    
  TweenMax.to(camera.position, 3, {z:cameraPosGame, x:0, y:30, ease:Power4.easeInOut});
  TweenMax.to(monster.torso.rotation,2, {x:0, ease:Power4.easeInOut});
  TweenMax.to(monster.torso.position,2, {y:0, ease:Power4.easeInOut});
  TweenMax.to(monster.pawFL.rotation,2, {x:0, ease:Power4.easeInOut});
  TweenMax.to(monster.pawFR.rotation,2, {x:0, ease:Power4.easeInOut});
  TweenMax.to(monster.mouth.rotation,2, {x:.5, ease:Power4.easeInOut});
  
  
  TweenMax.to(monster.head.rotation,2, {y:0, x:-.3, ease:Power4.easeInOut});
  
  TweenMax.to(hero.mesh.position, 2, { x:20, ease:Power4.easeInOut});
  TweenMax.to(hero.head.rotation, 2, { x:0, y:0, ease:Power4.easeInOut});
  TweenMax.to(monster.mouth.rotation, 2, {x:.2, ease:Power4.easeInOut});
  TweenMax.to(monster.mouth.rotation, 1, {x:.4, ease:Power4.easeIn, delay: 1, onComplete:function(){
    
    resetGame();
  }});
  
}


function updateObstaclePosition(){
  if (obstacle.status=="flying")return;
  
  // TODO fix this,
  if (floorRotation+obstacle.angle > 2.5 ){
    obstacle.angle = -floorRotation + Math.random()*.3;
    obstacle.body.rotation.y = Math.random() * Math.PI*2;
  }
  
  obstacle.mesh.rotation.z = floorRotation + obstacle.angle - Math.PI/2;
  obstacle.mesh.position.y = -floorRadius + Math.sin(floorRotation+obstacle.angle) * (floorRadius+3);
  obstacle.mesh.position.x = Math.cos(floorRotation+obstacle.angle) * (floorRadius+3);
  
}



function createObstacle(){
  obstacle = new Hedgehog();
  obstacle.body.rotation.y = -Math.PI/2;
  obstacle.mesh.scale.set(1.1,1.1,1.1);
  obstacle.mesh.position.y = floorRadius+4;
  obstacle.nod();
  scene.add(obstacle.mesh);
}

function createBonusParticles(){
  bonusParticles = new BonusParticles();
  bonusParticles.mesh.visible = false;
  scene.add(bonusParticles.mesh);
  
}



function checkCollision(){
  var db = hero.mesh.position.clone().sub(carrot.mesh.position.clone());
  var dm = hero.mesh.position.clone().sub(obstacle.mesh.position.clone());
  
  if(db.length() < collisionBonus){
    getBonus();
  }
  
  if(dm.length() < collisionObstacle && obstacle.status != "flying"){
    getMalus();
  }
}

function getBonus(){
  bonusParticles.mesh.position.copy(carrot.mesh.position);
  bonusParticles.mesh.visible = true;
  bonusParticles.explose();
  carrot.angle += Math.PI/2;
  //speed*=.95;
  monsterPosTarget += .025;
  
}

function getMalus(){
  obstacle.status="flying";
  var tx = (Math.random()>.5)? -20-Math.random()*10 : 20+Math.random()*5;
  TweenMax.to(obstacle.mesh.position, 4, {x:tx, y:Math.random()*50, z:350, ease:Power4.easeOut});
  TweenMax.to(obstacle.mesh.rotation, 4, {x:Math.PI*3, z:Math.PI*3, y:Math.PI*6, ease:Power4.easeOut, onComplete:function(){
    obstacle.status = "ready";
    obstacle.body.rotation.y = Math.random() * Math.PI*2;
    obstacle.angle = -floorRotation - Math.random()*.4;
    
    obstacle.angle = obstacle.angle%(Math.PI*2);
    obstacle.mesh.rotation.x = 0;
    obstacle.mesh.rotation.y = 0;
    obstacle.mesh.rotation.z = 0;
    obstacle.mesh.position.z = 0;
    
  }});
  //
  monsterPosTarget -= .04;
  TweenMax.from(this, .5, {malusClearAlpha:.5, onUpdate:function(){
    renderer.setClearColor(malusClearColor, malusClearAlpha );
  }})
}

function updateDistance(){
  distance += delta*speed;
  var d = distance/2;
  fieldDistance.innerHTML = Math.floor(d);
}



function loop(){
  delta = clock.getDelta();
  updateFloorRotation();
  
  if (gameStatus == "play"){
    
    if (hero.status == "running"){
      hero.run();
    }
    updateDistance();
    updateMonsterPosition();
    updateCarrotPosition();
    updateObstaclePosition();
    checkCollision();
  }
  
  render();  
  requestAnimationFrame(loop);
}

function render(){
  renderer.render(scene, camera);
}

window.addEventListener('load', init, false);

function init(event){
  initScreenAnd3D();
  createLights();
  createFloor()
  createHero();
  createMonster();
  createFirs();
  createCarrot();
  createBonusParticles();
  createObstacle();
  initUI();
  resetGame();
  loop();
  
  //setInterval(hero.blink.bind(hero), 3000);
}

function resetGame(){
  scene.add(hero.mesh);
  hero.mesh.rotation.y = Math.PI/2;
  hero.mesh.position.y = 0;
  hero.mesh.position.z = 0;
  hero.mesh.position.x = 0;

  monsterPos = .56;
  monsterPosTarget = .65;
  speed = initSpeed;
  level = 0;
  distance = 0;
  carrot.mesh.visible = true;
  obstacle.mesh.visible = true;
  gameStatus = "play";
  hero.status = "running";
  hero.nod();
  audio.play();
  updateLevel();
  levelInterval = setInterval(updateLevel, levelUpdateFreq);
}

function initUI(){
  fieldDistance = document.getElementById("distValue");
  fieldGameOver = document.getElementById("gameoverInstructions");
  
}