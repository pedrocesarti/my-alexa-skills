var APP_ID = undefined;

var AlexaSkill = require('./AlexaSkill');
var jenkinsapi = require ('jenkins-api');

var jenkins = jenkinsapi.init("http://" + process.env.USER + ":" + process.env.TOKEN + "@" + process.env.ADDRESS + ":" + process.env.PORT);

var Fact = function () {
	AlexaSkill.call(this, APP_ID);
};

Fact.prototype = Object.create(AlexaSkill.prototype);
Fact.prototype.constructor = Fact;

Fact.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
	handleNewFactRequest(response);
};

Fact.prototype.intentHandlers = {
	"GetJenkinsIntent": function (intent, session, response) {
		handleNewFactRequest(response);
	},
	"AMAZON.HelpIntent": function (intent, session, response) {
		response.ask("Ask who is the person that agrees.");
	}
};

function handleNewFactRequest(response) {
	return jenkins.all_jobs(function(err, data){
		var jobsJ = [];
		for (var i=0; i<data.length; i++){
			jobsJ.push(data[i].name);
		}

		var speechOutput = "The jobs found are:  " + jobsJ.join(', and ,');
		var cardTitle = "Your Answer";
		response.tellWithCard(speechOutput, cardTitle, speechOutput);
	});


}
// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
	var fact = new Fact();
	fact.execute(event, context);
};
