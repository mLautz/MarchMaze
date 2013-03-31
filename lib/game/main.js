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
		mazeGrid = generateMaze(30,30);
		newLevel = convertMaze(mazeGrid, 32);
		this.loadLevel(newLevel);
	},
	
	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		
		// Add your own, additional update code here
	},
	
	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
	}
});


// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', MyGame, 60, 320, 240, 2 );

});
