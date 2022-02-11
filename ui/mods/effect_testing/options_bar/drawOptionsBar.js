
//currently this is just for adding a button to mute the draw effects
var drawArray = ["drawing_on","drawing_off"];
var counter = 0;
var defaultDraw = drawArray[counter];
var Draw_bar = (function () {
		var Draw_bar = {};
		Draw_bar.chosenState = ko.observable(defaultDraw);

	    return Draw_bar;
})();

base_path = "coui://ui/mods/effect_testing/icons/"


var draw_source = ko.computed(function(){
	
	return base_path +  Draw_bar.chosenState() + ".png";

}, self);

(function () {
    //adds a toggle for sounds to live_game action bar
	$(".div_ingame_options_bar_cont").prepend("<div class=\"btn_ingame_options div_ping_bar_cont\"><a href=\"#\" data-bind=\"click: function () {if(counter<drawArray.length-1){counter++}else{counter = 0};Draw_bar.chosenState(drawArray[counter]);api.Panel.message(api.Panel.parentId, 'muteDraw','');}\"><img data-bind='attr : {src: draw_source()}' /></a></div>");
	
})();
