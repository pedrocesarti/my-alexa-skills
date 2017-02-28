var APP_ID = undefined;

var FACTS = "Pedro Cesar."

var AlexaSkill = require('./AlexaSkill');

var Fact = function () {
    AlexaSkill.call(this, APP_ID);
};

Fact.prototype = Object.create(AlexaSkill.prototype);
Fact.prototype.constructor = Fact;

Fact.prototype.eventHandlers.onLaunch = function (launchRequest, session, response) {
    handleNewFactRequest(response);
};

Fact.prototype.intentHandlers = {
    "GetBoyFriendIntent": function (intent, session, response) {
        handleNewFactRequest(response);
    },
    "AMAZON.HelpIntent": function (intent, session, response) {
        response.ask("Ask who is the best boyfriend in the world and be surprise.");
    }
};

function handleNewFactRequest(response) {
    var myFact = FACTS;

    // Create speech output
    var speechOutput = "The best boyfriend in the world is: " + myFact;
    var cardTitle = "Your Answer";
    response.tellWithCard(speechOutput, cardTitle, speechOutput);
}

// Create the handler that responds to the Alexa Request.
exports.handler = function (event, context) {
    var fact = new Fact();
    fact.execute(event, context);
};
