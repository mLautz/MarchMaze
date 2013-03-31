//Converts a maze grid into an impactJS level
//Requires: mazeGenerator plugin

ig.module(
	'plugins.mazeConverter'
)
.requires(
	'game.entities.player',
	'game.entities.levelExit'
)
.defines(function(){
	convertMaze = function(grid, dimensions){ //dimensions should be divisble by 4
		console.log("Converting maze to level! --------------------------------------------------");

		var newLevel = {
			entities: [],
			layer: []
		};

		//determine general level area (Each grid block is broken into 16 pieces)
		console.log("Grid size = "+grid.length+", "+grid[0].length);
		console.log("Piece size = "+dimensions/4+" (1/16th of a grid block)");
		console.log("Total level dimensions = "+grid.length*dimensions+", "+grid[0].length*dimensions+" with "+dimensions+"x"+dimensions+" size blocks.");

		//entity generation
		//----------------------------------------------------------------------
		newLevel.entities[0] = {
			type: 'EntityPlayer',
			x:dimensions/4,
			y:dimensions/4,
			settings: {}
		};

		newLevel.entities[1] = {
			type: 'EntityLevelExit',
			x: grid.length * dimensions - (dimensions/4) - (dimensions/2),
			y: grid[0].length * dimensions - (dimensions/4) - (dimensions/2),
			settings: {}
		};



		//collision and background map generation
		//----------------------------------------------------------------------
		
		//predefined maze chunks
		var NtE = [[1,0,0,1],[1,0,0,0],[1,0,0,0],[1,1,1,1]]; //doubles for EtN
		var NtS = [[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,0,0,1]]; //doubles for StN
		var NtW = [[1,0,0,1],[0,0,0,1],[0,0,0,1],[1,1,1,1]]; //doubles for WtN

		var EtW = [[1,1,1,1],[0,0,0,0],[0,0,0,0],[1,1,1,1]]; //doubles for WtE
		var EtS = [[1,1,1,1],[1,0,0,0],[1,0,0,0],[1,0,0,1]]; //doubles for StE

		var StW = [[1,1,1,1],[0,0,0,1],[0,0,0,1],[1,0,0,1]]; //doubles for WtS

		var Nt0 = [[1,0,0,1],[1,0,0,1],[1,0,0,1],[1,1,1,1]]; //North only
		var Et0 = [[1,1,1,1],[1,0,0,0],[1,0,0,0],[1,1,1,1]]; //East only
		var St0 = [[1,1,1,1],[1,0,0,1],[1,0,0,1],[1,0,0,1]]; //South only
		var Wt0 = [[1,1,1,1],[0,0,0,1],[0,0,0,1],[1,1,1,1]]; //East only

		var WNE = [[1,0,0,1],[0,0,0,0],[0,0,0,0],[1,1,1,1]];
		var NES = [[1,0,0,1],[1,0,0,0],[1,0,0,0],[1,0,0,1]];
		var ESW = [[1,1,1,1],[0,0,0,0],[0,0,0,0],[1,0,0,1]];
		var SWN = [[1,0,0,1],[0,0,0,1],[0,0,0,1],[1,0,0,1]];

		var NESW = [[1,0,0,1],[0,0,0,0],[0,0,0,0],[1,0,0,1]]; //all directions

		var NONE = [[1,1,1,1],[1,1,1,1],[1,1,1,1],[1,1,1,1]]; //full block, no connections


		//expand the current grid to a binary grid
		var collisionData = new Array(grid.length * 4);
		for(var i = 0; i < collisionData.length; i++){
			collisionData[i] = new Array(grid[0].length * 4);
		}

		for(var i = 0; i < grid[0].length; i++){
			var xIndex = i*4;

			for(var j = 0; j < grid.length; j++){
				var yIndex = j*4;

				var chunk;
				var block = grid[j][i];
				//console.log(JSON.stringify(grid[i][j], null, 4));

				if(block['N']==1 && block['E']==1 && block['S']==1 && block['W']==1){
					chunk = NESW;
				}else if(block['W']==1 && block['N']==1 && block['E']==1){
					chunk = WNE;
				}else if(block['N']==1 && block['E']==1 && block['S']==1){
					chunk = NES;
				}else if(block['E']==1 && block['S']==1 && block['W']==1){
					chunk = ESW;
				}else if(block['S']==1 && block['W']==1 && block['N']==1){
					chunk = SWN;
				}else if(block['N']==1 && block['E']==1){
					chunk = NtE;
				}else if(block['N']==1 && block['S']==1){
					chunk = NtS;
				}else if(block['N']==1 && block['W']==1){
					chunk = NtW;
				}else if(block['E']==1 && block['W']==1){
					chunk = EtW;
				}else if(block['E']==1 && block['S']==1){
					chunk = EtS;	
				}else if(block['S']==1 && block['W']==1){
					chunk = StW;
				}else if(block['N']==1){
					chunk = Nt0;
				}else if(block['E']==1){
					chunk = Et0;
				}else if(block['S']==1){
					chunk = St0;
				}else if(block['W']==1){
					chunk = Wt0;
				}else{
					console.log("ERROR: No mathching grid conversion found! " + JSON.stringify(block, null, 4));
					chunk = NONE;
				}

				for(var h = 0; h < 4; h++){
					for(var w = 0; w < 4; w++){
						collisionData[xIndex + w][yIndex + h] = chunk[w][h];
					}
				}
			}
		}


		//add the generated collision map to the level
		newLevel.layer[1] = {
			name: 'collision',
			distance: 1,
			tilesize: dimensions/4,
			data: collisionData
		};


		//set background to match the collision map
		var bgData = new Array(collisionData.length);
		for(var i = 0; i < bgData.length; i++){
			bgData[i] = new Array(collisionData[i].length);
			for(var j = 0; j < bgData[0].length; j++){
				bgData[i][j] = collisionData[i][j] + 1;
			}
		}

		//add the newly generated background layer to the level
		newLevel.layer[0] = {
			name: 'background',
			tilesetName: 'media/MarchMaze/mazeTiles.png',
			repeat: false,
			distance: 1,
			tilesize: dimensions/4,
			foreground: false,
			preRender: true,
			data: bgData
		};

		return newLevel;
	};
});