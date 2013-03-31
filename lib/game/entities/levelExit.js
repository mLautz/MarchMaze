ig.module(
	'game.entities.levelExit'
)
.requires(
	'impact.entity'
)
.defines(function(){

    EntityLevelExit = ig.Entity.extend({
        _wmDrawBox: true,
        _wmBoxColor: 'rgba(0, 0, 255, 0.7)',
        animSheet: new ig.AnimationSheet('media/MarchMaze/levelExit.png', 16, 16),

        size: {x: 16, y: 16},
        checkAgainst: ig.Entity.TYPE.A,

        init: function(x, y, settings){
            this.addAnim('idle', 0.3, [0,1,2]);
            this.currentAnim = this.anims.idle;

            this.parent(x, y, settings);
        },

        check: function( other ) {
        	if(other instanceof EntityPlayer){
                ig.game.runTimer.pause();
        		ig.game.toggleStats(this);
        	}
        }
    });
});