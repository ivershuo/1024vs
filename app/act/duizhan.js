module.exports = {
	messageHandles : function(){
		var trac  = this.trac,
			p2pvs = this.mods.p2pvs,
			getOpponent = p2pvs.getOpponent;

		trac.on('clientClose', function(uid){
			var opponent = getOpponent(uid);
			if(opponent){
				trac.close(opponent, 4410, 'opponent offline');				
			}
			p2pvs.off(uid, opponent);
		});

		trac.on('message', function(msg){
			var opponent = getOpponent(msg.cid);
			opponent && trac.sendTo(opponent, msg.msg);
		});
	},
	init : function(trac, mods, proxy){
		this.trac  = trac;
		this.mods  = mods;
		this.proxy = proxy;

		this.messageHandles();		
	}
}