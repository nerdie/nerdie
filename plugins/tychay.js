var request = require('request');

var NerdieInterface = require('nerdie_interface.js');

function Tychay(parentNerdie) {
	this.pluginInterface = new NerdieInterface(parentNerdie, this);
}
Tychay.prototype.init = function () {
	this.pluginInterface.registerPattern(/.*(?:terry\s+chay|tychay)/i, this.getChayism);
};

Tychay.prototype.getChayism = function(msg) {
	var uri = 'http://phpdoc.info/chayism/';

	request({uri: uri}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			msg.say(body);
		} else {
			msg.say('Whoops! Seems like Chuck Norris just laid the smackdown on '+uri+'.');
			return;
		}
	});
};

module.exports = Tychay;
