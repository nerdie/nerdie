var exports = [];

var nerdie;
var init = function (parentNerdie) {
	nerdie = parentNerdie;
}

/* !help: HALP */
exports.push({
	init: init,
	pattern: function() { return nerdie.anchoredPattern('help'); },
	handler: function(msg) {
		msg.say(msg.user + ": One day, I will have a help menu. But today is not that day.");
	}
});

exports.push({
	pattern: /^(?:is)?\s+any(?:one|body)\s+(?:here|around|awake)/i,
	handler: function(msg) {
		msg.say(msg.user + ": I'm always here. Waiting. Watching.");
	}
});

exports.push({pattern: /^(good)?\s?morning?/i, handler: function(msg) {
	var num = 0
	  , responses = [
		"It's the morning. How *good* can that really be?",
		"My kingdom for a venti non-fat, no foam, no water 6 pump extra hot chai tea latte. Is that so much to ask for?",
		"STOP YELLING, PEOPLE ARE SLEEPING."
	    ];

	num = Math.floor(Math.random()*responses.length);
	return msg.say(msg.user + ": " + responses[num]);
}});

exports.push({pattern: /^\:?wq?$/i, handler: function(msg) {
	msg.say(msg.user + ": You might want to switch to Emacs, buddy.");
}});

module.exports = exports;
