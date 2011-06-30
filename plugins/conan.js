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
	this.pluginInterface.registerPattern(
		/(strong.+steel)|(steel.+strong)|(steel.+strength)|(strength.+steel)/i,
		this.getRiddleOfSteel
	);
};

Conan.prototype.getBestInLife = function(msg) {
	msg.say('To crush your enemies, see them driven before you, and to hear the lamentation of their women.');
};
Conan.prototype.getRiddleOfSteel = function(msg) {
	msg.say('Steel isn\'t strong, boy, flesh is stronger! What is steel compared to the hand that wields it?');
};

module.exports = Conan;
