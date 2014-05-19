var Elon = require('elon');

var app = new Elon();
app.run(9999).then(function(d){
	console.log('Start!');
}).catch(function(err){
	console.log('err', err);
});

/**-- module config demo
{
	"test" : {
		"file" : "./app/mod/duizhan.js"
	}
}
--**/