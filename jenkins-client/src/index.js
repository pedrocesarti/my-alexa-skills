var APP_ID = undefined;

var AlexaSkill = require('./AlexaSkill');
var jenkinsapi = require ('jenkins');

var jenkins = require ('jenkins') ({baseUrl: "http://" + process.env.USER + ":" + process.env.TOKEN + "@" + process.env.ADDRESS + ":" + process.env.PORT, crumbIssuer: true});

var Fact = function () {
	AlexaSkill.call(this, APP_ID);
};

Fact.prototype = Object.create(AlexaSkill.prototype);
Fact.prototype.constructor = Fact;

Fact.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
	handleListJobs(response);
};

Fact.prototype.intentHandlers = {
	"ListJobsJenkinsIntent": function (intent, session, response) {
		handleListJobs(response);
	},
	"BuildJobJenkinsIntent": function (intent, session, response) {
		handleBuildJob(response);
	},
	"AMAZON.HelpIntent": function (intent, session, response) {
		response.ask("Ask if letisea agrees with Pedro.");
	},
	"AMAZON.StopIntent": function (intent, session, response) {
		var speechOutput = "Goodbye";
		response.tell(speechOutput);
	},
	"AMAZON.CancelIntent": function (intent, session, response) {
		var speechOutput = "Goodbye";
		response.tell(speechOutput);
	}
};

// List jobs
function handleListJobs(response) {
	return jenkins.job.list(function(err, data){
		var jobsJ = [];
		for (var i=0; i<data.length; i++){
			jobsJ.push(data[i].name);
		}

		var speechOutput = "The jobs found are:  " + jobsJ.join(', and ,');
		var cardTitle = "Return!";
		response.tellWithCard(speechOutput, cardTitle, speechOutput);
	});
}

// Build jobs
function handleBuildJob(response){
	var speechOutput;
	var cardTitle;

	return jenkins.job.build('test', function(err, data){
		speechOutput = "Success starting job."
		if (err){speechOutput = "Error starting job."}
		cardTitle = "Return!";
		response.tellWithCard(speechOutput, cardTitle, speechOutput);
	}
})

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
	var fact = new Fact();
	fact.execute(event, context);
};

