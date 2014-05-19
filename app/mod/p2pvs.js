var Users = {},
	waitingUser = '',
	t = {};

function userPair(uid){
	Users[waitingUser] = uid;
	Users[uid]         = waitingUser;
	clearTimeout(t[uid]);
	clearTimeout(t[waitingUser]);
	delete t[uid];
	delete t[waitingUser];
	waitingUser = '';
	return Users[uid];
}

var p2pvs = {
	join : function(uid, cbOk, cbTimeout){
		if(waitingUser && waitingUser != uid){
			var opponent = userPair(uid);
			cbOk(opponent);
		} else {
			waitingUser = uid;
			t[uid] = setTimeout(function(){
				cbTimeout();
			}, 6000);
		}
	},
	getOpponent : function(uid){
		return Users[uid];
	},
	off : function(uid, opponent){
		if(waitingUser == uid){
			clearTimeout(t[uid]);
			waitingUser = '';
		} else {
			delete Users[uid];
		}
		if(opponent){
			delete Users[opponent];
		}
	}
};

module.exports = p2pvs;