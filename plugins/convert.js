var request = require('request');

var NerdieInterface = require('nerdie_interface.js');

function Convert(parentNerdie) {
	this.pluginInterface = new NerdieInterface(parentNerdie, this);
}
Convert.prototype.init = function () {
	this.pluginInterface.registerPattern(
		this.pluginInterface.anchoredPattern('convert', true),
		this.getConversion
	);
};

Convert.prototype.getConversion = function(msg) {
	var toConvert = msg.match_data[2].split('to');

	if (toConvert.length !== 2) {
		toConvert = msg.match_data[2].split('in');

		if (toConvert.length !== 2) {
			msg.say('Invalid conversion request. Example usage: 1 USD to GBP');
			return;
		}
	}

	var data = {'from': toConvert[0], 'to': toConvert[1]};
	var uri = 'http://google.com/ig/calculator?q=' + encodeURIComponent(data['from']) + '=?' + encodeURIComponent(data['to']);

	request({uri: uri}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			try {
				body = JSON.parse(body.replace(/(\w+):/g, "\"$1\":"));
			} catch (except) {
				msg.say("Argh. Could not parse response from " + uri + " .");
				return;
			}

			if (body.error !== "") {
				msg.say('Whoops! I had some trouble converting that. Sorry :-/.');
				return;
			}
			msg.say(msg.user + ": " + body.lhs + " is " + body.rhs);
		} else {
			msg.say('Whoops! I had some trouble converting that. Sorry :-/.');
			return;
		}
	});
};


module.exports = Convert;
