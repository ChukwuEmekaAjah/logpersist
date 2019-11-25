
/** Message interface

Message = {
	source:String,
	message:String,
	time:Date,
	name:String,
	group:String,
	severity:Number,
	trace:String
}

Option = {
	destination:String,
	notification:[String] | String,
}

*/

var destinations = require("./destinations");
var notifications = require("./notifications");
var environment = this === global ? "server" :"client"

/**
@params message = message input can be a string or an instance of error object
@params options = used to specify the details of the message object

*/

function createMessage(message, options){
	if(typeof(message) === 'string'){
		var info = {} // message object
		info.id = (Date.now()).toString(16);
		info.message = message;
		info.time = Date.now();
		info.severity = options ? options.severity ? options.severity : 1 : 1;
		info.name = options ? options.name ? options.name : "Status Check" : "Status Check";
		info.group = options.group ;
		info.trace = options ? options.trace ? options.trace : "Breakpoint message" : "Breakpoint message";
		if(environment === "server"){
			var path = require("path");
			var source = path.basename(__filename);
			info.source = source;
		} else {
			info.source = "index.js";
		}
		return info;
	}
	if(message instanceof Error){
		var info = {};
		info.id = (Date.now()).toString(16);
		info.message = message.message;
		info.time = Date.now();
		info.severity = options ? options.severity ? options.severity : 2 : 2;
		info.name = options ? options.name ? options.name : message.name : message.name;
		info.group = options ? options.group ? options.group : this.group : this.group;
		info.trace = options ? options.trace ? options.trace : message.stack : message.stack;
		var errorStackParts = message.stack.split("\n");
		info.source = (errorStackParts.length > 1) ? errorStackParts[1] : "index.js";
		return info;
	}
}

function log(message, options){
	if(arguments.length === 0){
		return;
	}
	if(options && !options.group){
		options.group = this.group;
	}
	var message = createMessage(message, options);
	this.store.push(message);
	if(arguments.length == 1){
		if(this.destination){
			switch(this.destination.type){
				case 'file':
					destinations.logToFile(message, this.destination.address);
					break;
				case 'remote':
					destinations.logToRemote(message, this.destination.address);
					break;
				default:
					destinations.logToConsole(message)
			}
			return;
		}
		destinations.logToConsole(message);
		return;
	}
	let notificationService = options.notificationService ? options.notificationService : this.notificationService ? this.notificationService : null;
	if(notificationService && typeof(notificationService) === 'function'){
		let messageSeverity = String(message.severity);
		let severityResponders = this.notifications ? this.notifications[messageSeverity] ? this.notifications[messageSeverity] : [] : [];
		if(severityResponders.length > 0){
			notificationService(severityResponders);
		}
	}
	if(options.destination){
		switch(options.destination.type){
			case 'file':
				destinations.logToFile(message, options.destination.address);
				break;
			case 'remote':
				destinations.logToRemote(message, options.destination.address);
				break;
			default:
				destinations.logToConsole(message)
		}
		return;
	} else {
		switch(this.destination.type){
			case 'file':
				destinations.logToFile(message, this.destination.address);
				break;
			case 'remote':
				destinations.logToRemote(message, this.destination.address);
				break;
			default:
				destinations.logToConsole(message)
		}
		return;
	}
}

/*
let message = {
	id: (Date.now()).toString(16),
	source:"index.js",
	message:"There was an error",
	time:Date.now(),
	name:"hello",
	group:"general",
	severity:2,
	trace:"what is this?"
}

let options = {
	destination:{type:"file", address:"errors.log"},
} */

module.exports =  {
	log:log,
}