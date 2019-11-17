

function logToConsole(message){
	console.log(`${message.id}: ${message.message} with stack trace ${message.trace} from ${message.source} and severity ${message.severity} in group ${message.group} was recorded at time: ${new Date(message.time)}, `)
	return;
}

function logToRemote(message, address){
	console.log("logging to remote");
	var request = require("request");
	request.post({url:address, form: message}, function(err,httpResponse,body){
		if(err){
			console.log(err);
			return false;
		}
		return body;
	})
}


function logToFile(message, fileAddress){
	var fs = require("fs");
	try{
		var data =  JSON.stringify(message) + '\n';
		fs.appendFileSync(fileAddress, data);
		return true;
	} catch(e){
		console.log(e);
		return false;
	}
}

module.exports = {
	logToConsole : logToConsole,
	logToRemote : logToRemote,
	logToFile : logToFile,
}