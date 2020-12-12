var dog,sadDog,happyDog, database;
var foodS,foodStock;
var fedTime,lastFed;
var feed,addFood;
var foodObj;
var gameState;
var bedroom,garden,washroom;

function preload(){
sadDog=loadImage("Images/Dog.png");
happyDog=loadImage("Images/happy dog.png");
bedroom=loadImage("Images/Bed Room.png")
washroom=loadImage("Images/Wash Room.png")
garden=loadImage("Images/Garden.png")
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  readState=database.ref('gameState')
readState.on("value",function(data){
  gameState=data.val();
})
}

function draw() {
  background(46,139,87);
  foodObj.display();

 
 
  fill(255,255,254);
  textSize(15);
  
 if(gameState!="Hungry"){
   feed.hide();
   addFood.hide()
   dog.remove();
 }else{
   feed.show()
   addFood.show()
   dog.addImage(sadDog)
 }
 currentTime=hour();
 if(currentTime===(lastFed+1)){
   update("Playing");
   foodObj.garden();
 }else if(currentTime===(lastFed+2)){
   update("sleeping");
   foodObj.bedroom()
 }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
   update("Bathing")
   foodObj.washroom();
 }else{
   update("Hungry")
   foodObj.display();
 }
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}
function update(state){
  database.ref('/').update({
    gameState:state
  })
}