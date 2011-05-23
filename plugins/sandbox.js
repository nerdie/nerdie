var sandbox = require('sandbox');

var NerdieInterface = require('../nerdie_interface.js');

module.exports = Sandbox;

function Sandbox(parentNerdie) {
	this.pluginInterface = new NerdieInterface(parentNerdie, this);
}
Sandbox.prototype.init = function () {
	this.pluginInterface.registerPattern(
		this.pluginInterface.anchoredPattern('js', true),
		this.getSandbox
	);
};

Sandbox.prototype.getSandbox = function(msg) {
	s = new sandbox();
	s.run(msg.match_data[2], function(output) {
		msg.say(msg.user + ": Result is => " + output.result);
	});
};
