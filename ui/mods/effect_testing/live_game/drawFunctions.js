//clone of puppet stuff from scenarios
var moveDuration = 0.2;
function init_puppet_control(api) {
    api.puppet = {
    createPuppet: function(puppetName, location,animation,effectsType,color,pingDuration){ //takes in name of unit in file, and contextual info then generates the rest of create puppet
            
    
        
        color.push(0.99)
            puppetName+=".json";
            var chosenUnit;
            var config = [{}];
            unitKeys = _.keys(model.unitSpecs);
            for(var i = 0;i<unitKeys.length;i++){
                
                if(unitKeys[i].endsWith(puppetName)){
                    chosenUnit = unitKeys[i];
                }
            }
            if(!chosenUnit.length>1){return}
            $.getJSON("coui://"+chosenUnit).then(function(data){
                
                unitJSON = data;
            
                if(effectsType != undefined){config[0].fx_offsets =  
                    
                        {
                          "type": "energy",
                          "filename": "/pa/effects/scenario_specs/"+effectsType+".pfx",
                          "offset": [
                            0,
                            0,
                            0
                          ],
                          "orientation": [
                            0,
                            0,
                            0
                          ]
                        }
                      
                }
                config[0].model = unitJSON.model;
                if(Array.isArray(config[0].model)){
                    config[0].model = config[0].model[0]
                }
                if(animation.length>1){config[0].animate = {"anim_name":animation};}
                config[0].location = location;
                config[0].material = { 
                "shader":"pa_unit_ghost",
                "constants":{
                   "GhostColor":color ,
                   "BuildInfo":[
                      0,
                      0,
                      0,
                      0
                   ]
                },
                "textures":{
                   "Diffuse":"/pa/effects/textures/diffuse.papa"
                }}
            
                api.getWorldView(0).puppet(config, true).then((function(result){
                    
                    setTimeout(function() { killPuppet(result[0].id); }, pingDuration*1000);
                    return result[0].id;
                }));
            
            
        });
    },
    createEffect: function(effectName, location,duration, snap){
            
                if(snap == true){location.snap = true}
                if(duration == undefined || duration == 0){duration = 21600}//set to 6 hours if unspecified
                var config = [{}];
                config[0].fx_offsets =  
                    
                        {
                          "type": "energy",
                          "filename": "/pa/effects/scenario_specs/"+effectName+".pfx",
                          "offset": [
                            0,
                            0,
                            -2
                          ],
                          "orientation": [
                            0,
                            0,
                            0
                          ]
                        }
                      
                
                
            
                config[0].location = location;
                config[0].material = { //unsure if needed for just effect
                "shader":"pa_unit_prelight",
                "constants":{
                   "Color":[0,0,0,0] ,
                   "BuildInfo":[
                      0,
                      0,
                      0,
                      0
                   ]
                },
                "textures":{
                   "Diffuse":"/pa/effects/textures/diffuse.papa"
                }}
            
                return api.getWorldView(0).puppet(config, true).then((function(result){
                    setTimeout(function() { api.puppet.killPuppet(result[0].id); }, duration*1000);
                    return result[0].id;
                }));
    
    
    
    },
    
        killPuppet:function (puppetid){
          
        api.getWorldView(0).unPuppet(puppetid);
    },
    moveLastPuppet:function (puppetid,location){
      

    api.getWorldView(0).movePuppet(puppetid,location,moveDuration);
    },
    
    createEffectVanilla: function(effectName, location,duration, snap){
      if(snap == undefined){snap = 10}
      

      
        if(snap !== undefined){location.snap = snap}
        if(duration == undefined || duration == 0){duration = 21600}//set to 6 hours if unspecified
        var config = [{}];
        config[0].fx_offsets =  
            
                {
                  "type": "energy",
                  "filename": effectName,
                  "offset": [
                    0,
                    0,
                    0
                  ],
                  "orientation": [
                    0,
                    0,
                    0
                  ]
                }
              
        
        
    
        config[0].location = location;
        config[0].material = { //unsure if needed for just effect
        "shader":"pa_unit_ghost",
        "constants":{
           "GhostColor":[0,0,0,0] ,
           "BuildInfo":[
              0,
              0,
              0,
              0
           ]
        },
        "textures":{
           "Diffuse":"/pa/effects/textures/diffuse.papa"
        }}
    
        return api.getWorldView(0).puppet(config, true).then((function(result){
            setTimeout(function() { api.puppet.killPuppet(result[0].id); }, duration*1000);
            return result[0].id;
        }));
    
    
    
    },

    
    killPuppet:function (puppetid){
 
    api.getWorldView(0).unPuppet(puppetid);
    },
    // var mutePings = false; may need to be re added
    
        
    
    
    
    playAudio: function(filename){
        api.audio.playSoundFromFile(filename);
    },
    killAllPuppets:function(){
        
        
        if(model.maxEnergy() > 0){
            
            api.getWorldView(0).clearPuppets();
            return;
        }
        else{setTimeout(killAllPuppets, 1000);
        return;}
        
        
        }
    
    };
    }
    init_puppet_control(window.api);

    var guiScale = api.settings.value('ui', "ui_scale");
    //Hotkey functions
    var cursor_x = -1;
    var cursor_y = -1;
    document.onmousemove = function(event)
    {
    
    cursor_x = event.pageX*guiScale;
    cursor_y = event.pageY*guiScale;
    }


    
//     action_sets.gameplay["spawn_puppet"] = function(){
//         var currentUISettings = model.currentUISettings;
//         var mouseLocationPromise = model.holodeck.raycastTerrain(cursor_x,cursor_y)
//         mouseLocationPromise.then(function(mouseLocation){
          
               
//             var location = {
//                 planet:mouseLocation.planet || 0,
//                 pos: mouseLocation.pos,
//                 scale:currentUISettings.scale
//             }
//             if(currentUISettings.isUnit){
//                 var puppetIdPromise = api.puppet.createPuppet(currentUISettings.path, location,currentUISettings.anim_name,undefined,color,undefined)
//                 puppetIdPromise.then(function(result){
//                     var puppetObject = {}
//                     puppetObject.id = result;
//                     puppetObject.UIEffectSettings = currentUISettings
    
//                 })
//             }
//             else{
//                 var puppetIdPromise = api.puppet.createEffectVanilla(currentUISettings.path, location,undefined, currentUISettings.snap)
//                 puppetIdPromise.then(function(result){
//                     $.getJSON("coui://"+currentUISettings.path).then(function(data){
//                         console.log(data)
//                     var puppetObject = {}
//                     puppetObject.id = result;
//                     puppetObject.string = JSON.stringify(data)
//                     puppetObject.UIEffectSettings = currentUISettings
//                     puppetObject.isUnit = false;
//                     puppetObject.location = location;
//                     model.effectPuppetArray.push(puppetObject)
    
//                 })
//             })
            
//         }
//         })
       
// }
//     action_sets.gameplay["clear_all_puppets"] = function(){
    
//         api.puppet.killAllPuppets();
//         model.effectPuppetArray = [];
    
//     }
//     action_sets.gameplay["clear_previous_puppet"] = function(){
    
//         if(model.effectPuppetArray.length>0){
//             api.puppet.killPuppet(model.effectPuppetArray[model.effectPuppetArray.length-1].id)
//             model.effectPuppetArray.splice(-1,1)
//         }
        
    
//     }