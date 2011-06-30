var request = require('request');

var NerdieInterface = require('../nerdie_interface.js');

function Conan(parentNerdie) {
	this.pluginInterface = new NerdieInterface(parentNerdie, this);
}
Conan.prototype.init = function () {
	this.pluginInterface.registerPattern(
		/what is best in life/i,
		this.getBestInLife
	);
};

Conan.prototype.getBestInLife = function(msg) {
	msg.say('To crush your enemies, see them driven before you, and to hear the lamentation of their women.');
};

module.exports = Conan;
