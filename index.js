
var logger = require("./lib/logger");

function Logger(options){
	var defaultDestination = {type:"file", address:"errors.log"};
	var defaultGroup = "general";
	var defaultEnvironment = "dev";
	this.destination = options ? options.destination ? options.destination : defaultDestination : defaultDestination;
	this.group = options ? options.group ? options.group : defaultGroup : defaultGroup;
	this.environment = options ? options.environment ? options.environment : defaultEnvironment : defaultEnvironment;
	this.notifications = options ? options.notifications ? options.notifications : {} : {};
	this.store = [];
	this.getLogs = getLogs;
	this.log = logger.log;
}


function getLogs(options){
	var logs;
	if(options && typeof(options) === "number"){
		logs = this.store;
		logs = logs.filter(function(log){
			if(log.severity === options){
				return true;
			}
			return false;
		});
		return logs;
	} else if(options && typeof(options) === "string"){
		logs = this.store;
		logs = logs.filter(function(log){
			if(log.group === options){
				return true;
			}
			return false;
		})
		return logs;
	}
	
	if(options && options.destination && options.destination.type && options.destination.type === "file"){
		var fs = require("fs");
		try{
			logs = fs.readFileSync(options.destination.address).toString().split('\n');
			logs = logs.slice(0, logs.length - 1);
			logs = logs.map(function(log){
				return JSON.parse(log);
			})
		} catch (e){
			console.log(e);
			return false;
		}
	} else {
		logs = this.store;
	}
	logs = logs.filter(function(log){
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



module.exports = Logger;