ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity'
)
.defines(function(){
	EntityPlayer = ig.Entity.extend({
		animSheet: new ig.AnimationSheet('media/MarchMaze/16char.png', 16, 16),
		size: {x: 14, y:14},
		offset: {x: 1, y: 1},
		maxVel: {x: 96, y: 96},

		init: function(x, y, settings){
			this.parent(x, y, settings);
			this.addAnim('idle', 1, [0]);
			this.currentAnim = this.anims.idle;

			ig.input.bind(ig.KEY.A, 'left');
			ig.input.bind(ig.KEY.D, 'right');
			ig.input.bind(ig.KEY.W, 'up');
			ig.input.bind(ig.KEY.S, 'down');
		},

		update: function(){
			this.vel = {x: 0, y: 0};
		
			if(ig.input.state('up')){
				this.vel.y += -this.maxVel.y;
			}

			if(ig.input.state('right')){
				this.vel.x += this.maxVel.x;
			}

			if(ig.input.state('down')){
				this.vel.y += this.maxVel.y;
			}

			if(ig.input.state('left')){
				this.vel.x += -this.maxVel.x;
			}


			this.parent();
		}
	});
});