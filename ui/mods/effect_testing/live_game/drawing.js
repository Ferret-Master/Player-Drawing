model.effectPuppetArray = [];// an array containing all spawned puppets

var muteDraw = false;

model.effectPuppetObject = {// for other players lines, supports unlimited players

}

model.drawColors = [
    [176,224,230],
    [143,188,143],
    [223,168,178],
    [210,180,140],
    [151,251,152],
    [147,122,219],
    [223,140,107],
    [142,107,68],
    [100,149,237],
    [223,92,158],
    [83,119,48],
    [186,85,211],
    [113,52,165],
    [59,54,182],
    [51,151,197],
    [206,51,122],
    [210,50,44],
    [255,144,47],
    [219,217,37],
    [139,69,19],
    [223,18,129],
    [70,70,70],
    [200,200,200],
    [128,0,0],
    [223,0,0],
    [128,0,128],
    [223,0,223],
    [0,100,0],
    [0,223,0],
    [0,128,128],
    [0,223,223],
    [0,0,223]
]

model.drawColorPaths = [
	"/pa/effects/1.pfx",
	"/pa/effects/2.pfx",
	"/pa/effects/3.pfx",
	"/pa/effects/4.pfx",
	"/pa/effects/5.pfx",
	"/pa/effects/6.pfx",
	"/pa/effects/7.pfx",
	"/pa/effects/8.pfx",
	"/pa/effects/9.pfx",
	"/pa/effects/10.pfx",
	"/pa/effects/11.pfx",
	"/pa/effects/12.pfx",
	"/pa/effects/13.pfx",
	"/pa/effects/14.pfx",
	"/pa/effects/15.pfx",
	"/pa/effects/16.pfx",
	"/pa/effects/17.pfx",
	"/pa/effects/18.pfx",
	"/pa/effects/19.pfx",
	"/pa/effects/20.pfx",
	"/pa/effects/21.pfx",
	"/pa/effects/22.pfx",
	"/pa/effects/23.pfx",
	"/pa/effects/24.pfx",
	"/pa/effects/25.pfx",
	"/pa/effects/26.pfx",
	"/pa/effects/27.pfx",
	"/pa/effects/28.pfx",
	"/pa/effects/29.pfx",
	"/pa/effects/30.pfx",
	"/pa/effects/31.pfx",
	"/pa/effects/32.pfx"
]
	
model.customPlayerEffects = {
	"[BRN]Ferretmaster":"/pa/effects/ferret.pfx",
	"ThePartyDrummer":"/pa/effects/broom.pfx",
	"[ICARUS] Taiga":"/pa/effects/taiga.pfx"
}

model.currentUISettings = {//testing settings
		isUnit:false,
		path:"/pa/effects/red_line.pfx",
		scale:1,
		snap:10

}




var drawToken = _.shuffle(model.uberId()).join("");//shuffled uber id for reliable send

model.currentlyDrawing = false;
var armyColor = undefined;

model.customEffect = function(name){
	
if(model.customPlayerEffects[name] !== undefined){return model.customPlayerEffects[name]};
return undefined;
}

model.start_draw = function(){
if(drawToken == undefined){drawToken = _.shuffle(model.uberId()).join("")}
  
  if(model.currentlyDrawing == true){
	  model["clear_previous_puppet"]();model.currentlyDrawing = false;
	  var effectObject = {
		num: drawToken
	}

		var effectInfo = model.effectPuppetObject[drawToken]
		api.puppet.killPuppet(effectInfo.id)
		model.effectPuppetObject[drawToken] = undefined;
	  model.send_message("team_chat_message", {message: ("EndDrawing:"+JSON.stringify(effectObject))});

	  return;
	}
	if(armyColor == undefined){
		var armyColor = model.player().primary_color
		//if(model.isSpectator()){armyColor = _.sample(model.drawColors)}
		//if(model.player().slots.length>1){armyColor = _.sample(model.drawColors)}

for(var i = 0; i < model.drawColors.length;i++){
	if(_.isEqual(armyColor,model.drawColors[i])){model.currentUISettings.path = model.drawColorPaths[i]}
}
	}

  var customEffect = model.customEffect(model.playerName());
  if(customEffect !== undefined){model.currentUISettings.path = customEffect}
  model.currentlyDrawing = true;
  

  _.delay(model.loopedDraw,500)
  var mouseLocationPromise = model.holodeck.raycastTerrain(cursor_x,cursor_y)
    
    mouseLocationPromise.then(function(mouseLocation){
		var effectInfo = {
			planet: mouseLocation.planet || 0,
			pos:mouseLocation.pos,
			path: model.currentUISettings.path
  
		}
		var effectObject = {
			num: drawToken,
			effectInfo: effectInfo
		}
		model["spawn_puppet"](drawToken, effectInfo)   
		model.send_message("team_chat_message", {message: ("NewDrawing:"+JSON.stringify(effectObject))});
	

	})

 

}
var loopedClusterSize = 20;
var loopNum = 0;
var loopArray = [];
model.loopedDraw = function(){
  
    var mouseLocationPromise = model.holodeck.raycastTerrain(cursor_x,cursor_y)
    
    mouseLocationPromise.then(function(mouseLocation){

      
    //   var location = {
    //       planet:mouseLocation.planet || 0,
    //       pos: mouseLocation.pos,
    //      // scale:currentUISettings.scale, //unsure if I should include scale in  moving
    //       snap: currentUISettings.snap
    //   }
      mouseLocation.pos = [
		  mouseLocation.pos[0].toFixed(2),
	 	  mouseLocation.pos[1].toFixed(2),
	  	  mouseLocation.pos[2].toFixed(2)
		]
	var effectInfo = model.effectPuppetObject[drawToken]
	var newPosition = {
		planet:effectInfo.planet || 0,
		pos: mouseLocation.pos,
		scale:model.currentUISettings.scale
	}
	api.puppet.moveLastPuppet(effectInfo.id, newPosition)


	loopArray.push(mouseLocation.pos)
	loopNum = loopNum + 1;
	if(loopNum >= loopedClusterSize){

		var effectObject = {
			num: drawToken,
			pos: loopArray
		}    
		  model.send_message("team_chat_message", {message: ("Drawing:"+JSON.stringify(effectObject))});

		  loopNum = 0;
		  loopArray = [];
		  
	}
   
  
  })

    if(model.currentlyDrawing == true){_.delay(model.loopedDraw,50)}

}

model.drawPlayerLine = function(playerNum, position){
	var delayAmount = 0;
	if(muteDraw){return}
	var effectInfo = model.effectPuppetObject[playerNum]
	if(effectInfo == undefined){return}
	for(var i = 0; i< position.length; i++){
		currentPosition = position[i]

		var newPosition = {
			planet:effectInfo.planet || 0,
			pos: currentPosition,
			scale:model.currentUISettings.scale
		}
	
		_.delay(api.puppet.moveLastPuppet,delayAmount,effectInfo.id, newPosition)
		delayAmount = delayAmount + 50;

	}
	

	//api.puppet.moveLastPuppet(effectInfo.id, newPosition);
}

model.killPlayerLine = function(playerNum)
{
	var effectInfo = model.effectPuppetObject[playerNum]
	api.puppet.killPuppet(effectInfo.id)
	model.effectPuppetObject[playerNum] = undefined;
	_.delay(api.puppet.killPuppet,1000, effectInfo.id)
}

model.spawn_puppet = function(playerNumber, effectInfo){

  var currentUISettings = model.currentUISettings;
  if(playerNumber !== undefined){// if it is another players line we cannot use mouse or raycast
if(muteDraw){return}
	var location = {
		planet:effectInfo.planet || 0,
		pos: effectInfo.pos,
		scale:currentUISettings.scale
	}

	var puppetIdPromise = api.puppet.createEffectVanilla(effectInfo.path, location,undefined, currentUISettings.snap)
	puppetIdPromise.then(function(result){
		$.getJSON("coui://"+effectInfo.path).then(function(data){
	
		var puppetObject = {};
		puppetObject.id = result;
		puppetObject.effectInfo = effectInfo;
		puppetObject.location = location;
		model.effectPuppetObject[playerNumber] = puppetObject;

	})
})
  }
  //-------------------------------------------------------------------------------------------------------------------------------------
  else{
  var mouseLocationPromise = model.holodeck.raycastTerrain(cursor_x,cursor_y)
  mouseLocationPromise.then(function(mouseLocation){
    
         
      var location = {
          planet:mouseLocation.planet || 0,
          pos: mouseLocation.pos,
          scale:currentUISettings.scale
      }
   
          var puppetIdPromise = api.puppet.createEffectVanilla(currentUISettings.path, location,undefined, currentUISettings.snap)
          puppetIdPromise.then(function(result){
              $.getJSON("coui://"+currentUISettings.path).then(function(data){
 
              var puppetObject = {}
              puppetObject.id = result;
              puppetObject.string = JSON.stringify(data)
              puppetObject.UIEffectSettings = currentUISettings
              puppetObject.isUnit = false;
              puppetObject.location = location;
              model.effectPuppetArray.push(puppetObject)

          })
      })
      
  
  })
}
 
}
model.clear_all_puppets = function(){

  api.puppet.killAllPuppets();
  model.effectPuppetArray = [];

}
model.clear_previous_puppet = function(){

  if(model.effectPuppetArray.length>0){
      api.puppet.killPuppet(model.effectPuppetArray[model.effectPuppetArray.length-1].id)
      model.effectPuppetArray.splice(-1,1)
  }
  

}
			
handlers.player_draw = function(payload){
	payload = JSON.parse(payload);
    if(payload.num == drawToken){return}
	model.drawPlayerLine(payload.num, payload.pos)
}

handlers.player_end_draw = function(payload){
	payload = JSON.parse(payload);
	if(payload.num == drawToken){return}
	model.killPlayerLine(payload.num)
 }

handlers.player_new_draw = function(payload){ 
	payload = JSON.parse(payload);
	if(payload.num == drawToken){return}
	model.spawn_puppet(payload.num, payload.effectInfo)
}

handlers.muteDraw = function(){muteDraw = !muteDraw;}


var pingtime = 0;
var keyDownMap = {18: false, 88: false};

$(document).keydown(function(e) {

	if (e.keyCode in keyDownMap) {
		keyDownMap[e.keyCode] = true;
		var currentTime = new Date().getTime()/1000;
		
		var timeSinceLastPing = (currentTime-pingtime)
		if (keyDownMap[18] && keyDownMap[88]) {
			
		   model.start_draw();
		   pingtime = new Date().getTime()/1000;
		}
	}
}).keyup(function(e) {
	if (e.keyCode in keyDownMap) {
		_.delay(function(){keyDownMap[e.keyCode] = false},500);
	}
});