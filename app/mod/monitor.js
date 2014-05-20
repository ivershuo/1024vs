var fs     = require('fs'),
	Musk = require('musk'),
	Server = Musk.Server.Sock,
	Client = Musk.Client.Sock;

var sockFile = '/tmp/onezerotwofour_monitor.sock';

if (require.main == module) {
	process.stdin.setEncoding('utf8');
	var writeout = function(str){
		process.stdout.write(Array.prototype.join.call(arguments, ' ') + '\n');
	}
	var getLogs = function(data){
		writeout([data.method, JSON.stringify(data.params)].join('->'));
	}	
	
	writeout('connecting to monitir ...');
	var client = new Client(sockFile);

	writeout('connected to monitir ...');
	writeout(new Array(20).join('=='));
	client.send('startTime').then(function(data){
		writeout('start time : ', data);
		process.stdout.write('input order:');
	});

	function exit(){
		writeout('\nready to exit...');
		client.close(function(){
			writeout('exit!');
			process.exit();
		});
	}

	var isLoging = false,
		isDoing  = false;
	process.stdin.on('readable', function() {
		var chunk = process.stdin.read();
		if (chunk !== null && !isDoing) {
			var order = chunk.trim();
			isDoing = true;
			if(order === 'log'){
				client.on('request', getLogs);
				isLoging = true;
			} else if(order === 'exit') {
				exit();
			} else {
				client.send(order).then(function(data){
					console.log(data);
				}).catch(function(err){
					console.log(err.message);
				}).finally(function(){
					isDoing = false;
					process.stdout.write('\ninput order:');
				});
			}
		}
	});	

	process.on('SIGINT', function(){
		if(isLoging){
			client.removeListener('request', getLogs);
			isLoging = false;
			isDoing  = false;
			process.stdout.write('\ninput order:');
		} else {
			exit();
		}
	});	
} else {
	if(fs.existsSync(sockFile)){
		fs.unlinkSync(sockFile);
	}

	var time = new Date;

	var monitor = {
		startTime : function(){
			return time.toLocaleString();
		},
		mem : function(){
			return process.memoryUsage();
		}
	}

	var monitirSrv = new Server(monitor, sockFile);
	module.exports = monitor;
}