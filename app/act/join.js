module.exports = {
	init : function(trac, mods){
		var p2pvs   = mods.p2pvs,
			monitor = mods.monitor; 
		trac.on('connection', function(uid){
			p2pvs.join(uid, function(opponent){
				trac.sendTo([uid,opponent], 'join');
			}, function(){
				trac.sendTo(uid, 'timeout');
				trac.close(uid, 4408, 'timeout');
			});

			monitor.out('join', {uid : uid});
		});
	}
}