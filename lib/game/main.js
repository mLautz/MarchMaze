ig.module( 
	'game.main' 
)
.requires(
	'game.entities.levelExit',

	'impact.debug.debug',
	'impact.game',
	'impact.font',

	'plugins.mazeConverter',
	'plugins.mazeGenerator'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	statText: new ig.Font( 'media/04b03.font.png' ),
	statMatte: new ig.Image('media/MarchMaze/stat-matte.png'),
	runTimer: null,
	
	
	init: function() {
		this.runTimer = new ig.Timer();

		//grab game window dimensions and set buffer sizes
		this.deadZoneX = ig.system.width/2 - ig.system.width/15;
		this.screenWidth = ig.system.width;
		this.deadZoneY = ig.system.height/2 - ig.system.width/20;
		this.screenHeight = ig.system.height;

		ig.input.bind(ig.KEY.SPACE, 'continue');
		ig.input.bind(ig.KEY.R, 'reload');

		this.loadNewMaze();
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		// //updating screen to follow player
		// var player = this.getEntitiesByType(EntityPlayer)[0];
		// if(player){
		// 	//Horizontal Dead Zone
		// 	var camX = this.screen.x;
		// 	if((player.pos.x - camX) > (this.screenWidth - this.deadZoneX)){ this.screen.x = camX + (player.pos.x - camX) - (this.screenWidth - this.deadZoneX);}
		// 	else if((player.pos.x - camX) < this.deadZoneX){ this.screen.x = camX + (player.pos.x - camX) - this.deadZoneX;}

		// 	//Vertical Dead Zone
		// 	var camY = this.screen.y;
		// 	if((player.pos.y - camY) > (this.screenHeight - this.deadZoneY)){ this.screen.y = camY + (player.pos.y - camY) - (this.screenHeight - this.deadZoneY);}
		// 	else if((player.pos.y - camY) < this.deadZoneY){ this.screen.y = camY + (player.pos.y - camY) - this.deadZoneY;}

		// 	//Stop camera at left/right level bounds
		// 	if(this.screen.x <= 0){ this.screen.x = 0;}
		// 	else if(this.screen.x >= ig.game.backgroundMaps[0].pxWidth - this.screenWidth){ this.screen.x = ig.game.backgroundMaps[0].pxWidth - this.screenWidth;}

		// 	//Stop camera at top/bottom level bounds
		// 	if(this.screen.y <= 0){ this.screen.y = 0;}
		// 	else if(this.screen.y >= ig.game.backgroundMaps[0].pxHeight - this.screenHeight){ this.screen.y = ig.game.backgroundMaps[0].pxHeight - this.screenHeight;}
		// }

		if(this.showStats){
			if(ig.input.pressed('continue')){
				this.loadNewMaze();
				this.showStats = false;
			}
		}

		if(ig.input.pressed('reload')){
			this.loadNewMaze();
		}
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();

		if(this.showStats){
			this.statMatte.draw(0,0);
			var x = ig.system.width/2;
			var y = ig.system.height/3;

			this.statText.draw('Level Complete', x, y, ig.Font.ALIGN.CENTER);

			var levelTime = '';
			if(this.runTimer.delta()/60 >= 1){
				levelTime += Math.round(this.runTimer.delta()/60) + ' minutes ';
			}
			levelTime += Math.round(this.runTimer.delta()%60) + ' seconds.';

			this.statText.draw('Level Time: ' + levelTime, x, y + 50, ig.Font.ALIGN.CENTER);
			this.statText.draw('Press space to continue.', x, y + 150, ig.Font.ALIGN.CENTER);
		}
	},

	loadLevel: function(level){
		this.parent(level);
		this.runTimer.reset();
	},

	toggleStats: function(){
		this.showStats = true;
	},

	loadNewMaze: function(){
		mazeGrid = generateMaze(20,15);
		newLevel = convertMaze(mazeGrid, 32);
		this.loadLevel(newLevel);
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 640, 480, 1);

});
