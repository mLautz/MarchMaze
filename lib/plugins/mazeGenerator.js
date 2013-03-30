//Maze generation algorithm adapted from ruby exmaple here:
//http://weblog.jamisbuck.org/2010/12/27/maze-generation-recursive-backtracking

ig.module(
	'plugins.mazeGenerator'
)
.requires(

)
.defines(function(){
	generateMaze = function(width, height){
		var shuffle = function(array) {
		    var tmp, current, top = array.length;

		    if(top) while(--top) {
		        current = Math.floor(Math.random() * (top + 1));
		        tmp = array[current];
		        array[current] = array[top];
		        array[top] = tmp;
		    }

		    return array;
		}

		var opposite = function(direction) {
			if(direction == 'N'){
				return 'S';
			}

			if(direction == 'S'){
				return 'N';
			}

			if(direction == 'E'){
				return 'W';
			}

			if(direction == 'W'){
				return 'E';
			}
		}

		console.log("Generating maze with dimensions: ["+width+","+height+"]");

		//Create 2 dimensional grid
		var mazeGrid = new Array(width);

		for(var i = 0; i < width; i++){
			mazeGrid[i] = new Array(height);
			for(var j = 0; j < height; j++){
				mazeGrid[i][j] = {'N':0, 'S':0, 'E':0, 'W':0, 'Touched':0};
			}
		}


		//Create constants
		var dirs = [ 'N', 'W', 'E', 'S' ];
		var DX = { 'N': 0, 'S':0, 'E':1, 'W':-1 };
		var DY = { 'N':-1, 'S':1, 'E':0, 'W': 0 };


		//Recursive algorithm portion
		function carve_passages_from(cx, cy, grid){
			//console.log("At block "+cx+","+cy);
			dirs = shuffle(dirs);
			//console.log("Shuffled dirs: "+dirs);

			for(var i = 0; i < dirs.length; i++){
				//console.log("DIR: "+dirs[i]);
				direction = dirs[i];
				nx = cx + DX[direction];
				//console.log("NX = "+nx);
				ny = cy + DY[direction];
				//console.log("NY = "+ny);

				if((nx>=0 && nx<grid.length) && (ny>=0 && ny<grid[nx].length) && grid[nx][ny]['Touched'] == 0){
					grid[cx][cy][direction] = 1;
					grid[nx][ny][opposite(direction)] = 1;
					grid[cx][cy]['Touched'] = 1;
					carve_passages_from(nx,ny, grid);
				}
			}

			return -1;
		}

		carve_passages_from(0, 0, mazeGrid);

		//log the ascii maze
		var top = " ";
		for(i = 0; i < width; i++){
			top += "_ ";
		}

		console.log(top);

		for(i = 0; i < height; i ++){
			var row = "|";

			for(j = 0; j < width; j++){
				row += (mazeGrid[j][i]['S'] == 0 ? "_" : " ");
				row += (mazeGrid[j][i]['E'] == 0 ? "|" : " ");
			}

			console.log(row);
		}


		//return the final grid
		return mazeGrid;
	};
});