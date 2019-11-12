
var logger = require("./lib/logger");

var options = {
	destination:{type:"file", address:"errors.log"},
	group:"basics",
	environment: "dev",
	notifications : {
		"1":[],
		"2":[],
		"3":[],
		"4":[],
		"5":[]
	}
}
function Logger(options){
	var defaultDestination = {type:"console"};
	var defaultGroup = "people";
	var defaultEnvironment = "dev";
	this.destination = options ? options.destination ? options.destination : defaultDestination : defaultDestination;
	this.group = options ? options.group ? options.group : defaultGroup : defaultGroup;
	this.environment = options ? options.environment ? options.environment : defaultEnvironment : defaultEnvironment;
	this.notifications = options ? options.notifications ? options.notifications : {} : {};
	this.store = [];
	this.getLogs = getLogs;
	this.log = logger.log;
}

/**

var options = {
	group: string,
	from: date,
	to: date,
	severity: number,
	source: string,
}

*/

function getLogs(options){
	var logs = this.store.filter(function(log){
		if(options && options.group){
			if(log.group === options.group){
				return true;
			}
			return false;
		}
		return true;
	})
	logs = logs.filter(function(log){
		if(options && options.from){
			if(log.from >= options.from){
				return true;
			}
			return false;
		}
		return true;
	});
	logs = logs.filter(function(log){
		if(options && options.to){
			if(log.to <= options.to){
				return true;
			}
			return false;
		}
		return true;
	});
	logs = logs.filter(function(log){
		if(options && options.severity){
			if(log.severity === options.severity){
				return true;
			}
			return false;
		}
		return true;
	});
	logs = logs.filter(function(log){
		if(options && options.source){
			if(log.source === options.source){
				return true;
			}
			return false;
		}
		return true;
	})
	return logs;
}

var logger = new Logger();
logger.log("helllo",{group:"emeka"});
logger.log("hiiii");
logger.log("emeka!!");
console.log(logger.getLogs({group:"emeka"}));