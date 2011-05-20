var NerdieInterface = require('../nerdie_interface.js');

module.exports = Plugin;

function Plugin(parentNerdie) {
	this.pluginInterface = new NerdieInterface(parentNerdie, this);
}
Plugin.prototype.init = function () {
	/* !help: HALP */
	this.pluginInterface.registerPattern(
		this.pluginInterface.anchoredPattern('help'),
		function(msg) {
			msg.say(msg.user + ": One day, I will have a help menu. But today is not that day.");
		}
	);

	this.pluginInterface.registerPattern(
		/^(?:is)?\s+any(?:one|body)\s+(?:here|around|awake)/i,
		function(msg) {
			msg.say(msg.user + ": I'm always here. Waiting. Watching.");
		}
	);

	this.pluginInterface.registerPattern(
		/^(good)?\s?morning?/i,
		function(msg) {
			var num = 0
			, responses = [
				"It's the morning. How *good* can that really be?",
				"My kingdom for a venti non-fat, no foam, no water 6 pump extra hot chai tea latte. Is that so much to ask for?",
				"STOP YELLING, PEOPLE ARE SLEEPING."
				];

			num = Math.floor(Math.random()*responses.length);
			return msg.say(msg.user + ": " + responses[num]);
		}
	);

	this.pluginInterface.registerPattern(
		/^\:?wq?$/i,
		function(msg) {
			msg.say(msg.user + ": You might want to switch to Emacs, buddy.");
		}
	);

};

