var sandbox = require('sandbox');

var NerdieInterface = require('../nerdie_interface.js');

module.exports = Plugin;

function Plugin(parentNerdie) {
	this.pluginInterface = new NerdieInterface(parentNerdie, this);
}
Plugin.prototype.init = function () {
	this.pluginInterface.registerPattern(
		this.pluginInterface.anchoredPattern('js', true),
		this.getSandbox
	);
};

Plugin.prototype.getSandbox = function(msg) {
	s = new sandbox();
	s.run(msg.match_data[2], function(output) {
		msg.say(msg.user + ": Result is => " + output.result);
	});
};
