

function logToConsole(message){
	
	console.log(`${message.id}: ${message.message} with stack trace ${message.trace} from ${message.source} and severity ${message.severity} in group ${message.group} was recorded at time: ${new Date(message.time)}, `)
	return;
}

function logToRemote(message, address){
	console.log("logging to remote");
	console.log(message);
}

function logToFile(message, fileAddress){
	console.log("logging to file");
	console.log(message);
}

module.exports = {
	logToConsole : logToConsole,
	logToRemote : logToRemote,
	logToFile : logToFile,
}