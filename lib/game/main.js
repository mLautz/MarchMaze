ig.module( 
	'game.main' 
)
.requires(
	'impact.debug.debug',
	'impact.game',
	'impact.font',

	'plugins.mazeConverter',
	'plugins.mazeGenerator'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	font: new ig.Font( 'media/04b03.font.png' ),
	
	
	init: function() {
		// Initialize your game here; bind keys etc.
		mazeGrid = generateMaze(60,30);
		newLevel = convertMaze(mazeGrid, 32);

		//grab game window dimensions and set buffer sizes
		this.deadZoneX = ig.system.width/2 - ig.system.width/15;
		this.screenWidth = ig.system.width;
		this.deadZoneY = ig.system.height/2 - ig.system.width/20;
		this.screenHeight = ig.system.height;

		this.loadLevel(newLevel);
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		//updating screen to follow player
			var player = this.getEntitiesByType(EntityPlayer)[0];
			if(player){
				//Horizontal Dead Zone
				var camX = this.screen.x;
				if((player.pos.x - camX) > (this.screenWidth - this.deadZoneX)){ this.screen.x = camX + (player.pos.x - camX) - (this.screenWidth - this.deadZoneX);}
				else if((player.pos.x - camX) < this.deadZoneX){ this.screen.x = camX + (player.pos.x - camX) - this.deadZoneX;}

				//Vertical Dead Zone
				var camY = this.screen.y;
				if((player.pos.y - camY) > (this.screenHeight - this.deadZoneY)){ this.screen.y = camY + (player.pos.y - camY) - (this.screenHeight - this.deadZoneY);}
				else if((player.pos.y - camY) < this.deadZoneY){ this.screen.y = camY + (player.pos.y - camY) - this.deadZoneY;}

				//Stop camera at left/right level bounds
				if(this.screen.x <= 0){ this.screen.x = 0;}
				else if(this.screen.x >= ig.game.backgroundMaps[0].pxWidth - this.screenWidth){ this.screen.x = ig.game.backgroundMaps[0].pxWidth - this.screenWidth;}

				//Stop camera at top/bottom level bounds
				if(this.screen.y <= 0){ this.screen.y = 0;}
				else if(this.screen.y >= ig.game.backgroundMaps[0].pxHeight - this.screenHeight){ this.screen.y = ig.game.backgroundMaps[0].pxHeight - this.screenHeight;}
			}
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 640, 480, 1);

});
