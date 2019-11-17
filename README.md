<h1 align="center">Logpersist</h1>


Logpersist is a JavaScript logger library for error and log messages with provisions for console, file and remote logging of program status information. It also makes provision for grouping logs, assigning severity as well as triggering notifications based on severity levels. 

## Motivation
Logpersist was built because I needed a persistent way to record and query error and log messages while my program is in production environment and I believe other developers would have same issues too. 

## What you get
- The ability to persistently log messages to any of console, file or remote API. 
- Grouping of messages and assigning of severity levels
- Possibility of triggering notifications based on specified severity levels
- Recording of stack trace from exceptions thrown within the program

## How to use
```bash
npm install --save logpersist
```

```js
const Logger = require('logpersist');
let configOptions = {
	destination:{type:"file", address:"messages.log"},
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
const consoleLogger = new Logger(configOptions);
consoleLogger.log("User just signed up"); // logs the message to the file messages.log
let err = new Error("Failed to authenticate user");
consoleLogger.log(err); // logs the error to the file messages.log

let logOptions = {
	destination:{type:"file", address:"messages.log"},
	group: "basics",
	from: Date.now(),
	to: Date.now(),
	severity: 2,
	source: "index.js",
}
consoleLogger.getLogs(logOptions); // returns an array of message objects
/*
	[
		{
			source:String,
			message:String,
			time:Date,
			name:String,
			group:String,
			severity:Number,
			trace:String
		}
	]
*/
```
You can create multiple logger objects and if an <b> option </b> argument is not provided at instantiation time, it uses the default configuration which is:
```js
	let configOptions = {
		destination:{type:"file", address:"errors.log"},
		group:"general",
		environment: "dev",
		notifications : {
			"1":[],
			"2":[],
			"3":[],
			"4":[],
			"5":[]
		}
	}
	// notification keys are severity levels and the value is an array of email addresses of people to notify
```

## API 
Methods on the logger object
- Logger.log()
- Logger.getLogs()


## Example usage for the API 
The log method can take a second options argument which can be used to specify any of the group, severity, name and destination of the log message. If any of the options list of properties is absent, the defaults from the Logger object are used and if the options argument is absent, the defaults from the logger object at instantiation time are used. 
```js
	let fileLogger = new Logger();
	fileLogger.log("User just signed in");

	function findUser(userId, function(err,user){
		if(err){
			fileLogger.log(err, {
				group:"userSearchErrors",
				severity:2,
				name:"user search",
				destination:{type:"file", address:"usersearch.log"}
			})
			return err;
		}
		return user;
	});

	

```

The getLogs method can take no argument wherein in uses the object instantiation configuration options to search for logs or it takes a single argument which can be a number (in this case it get logs based on the specified severity), a string (in this case it get logs based on their group name) or an object (in this case it gets the logs based on a set of retrieval options) 

```js
	fileLogger.getLogs(); // returns an array of logged messages
	let retrievalOptions = {
		destination:{type:"file", address:"messages.log"},
		source:"index.js",
		severity: 2,
		group:"userSearchErrors",
		from: Date.now(),
		to: (new Date("2/2/2020")).getTime()
	}
	fileLogger.getLogs("userSearchErrors");
	fileLogger.getLogs(2);
	fileLogger.getLogs(retrievalOptions)
```

## Contributing
In case you have any ideas, features you would like to be included or any bug fixes, you can send a PR.

(Requires Node v6 or above)
- Clone the repo

```bash
git clone https://github.com/ChukwuEmekaAjah/logpersist.git
```
