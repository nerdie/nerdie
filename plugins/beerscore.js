var http = require('http');

var NerdieInterface = require('../nerdie_interface.js');

function Beerscore(parentNerdie) {
	this.pluginInterface = new NerdieInterface(parentNerdie, this);
}
Beerscore.prototype.init = function () {
	this.pluginInterface.registerPattern(
		this.pluginInterface.anchoredPattern('beerscore', true),
		this.getBeerscore
	);
};

Beerscore.prototype.getBeerscore = function(msg) {
	var options = {
		'host': 'caedmon.net',
		port: 80,
		'path': '/beerscore/' + encodeURIComponent(msg.match_data[2])
	};
	var data = ""
		, out  = ""
		, beers = []
		, scoreString = ""
		, score = ""
		, styleScore = ""
		, url  = ""
		, num  = 0;

	http.get(options, function(res) {
		res.on('data', function(chunk) {
			data += chunk;
		});

		res.on('end', function() {
			try {
				data = JSON.parse(data);
			} catch(e) {
				return msg.say(msg.user + ": 404 BEER NOT FOUND");
			}

			if ("type" in data && data['type'] === 'REFINE') {
				return msg.say(msg.user + ": Be more specific. That's like " + data['num'] + " different beers.");
			}

			if (!("beer" in data)) {
				return msg.say(msg.user + ": Something went horribly, horribly wrong.");
			}

			out = msg.user + ": ";
			out += data['num'] + " result" + ((data['num'] === 1) ? '' : 's') + " => ";

			data['beer'].forEach(function(elem, idx) {
				url = "("+elem['url']+")";
				if (elem['score'] == undefined) {
					scoreString = "[Not Rated]";
				} else {
					score = (elem['score'] != undefined) ? elem['score'] : 'Not rated';
					styleScore = (elem['stylescore'] != undefined) ? elem['stylescore'] : 'Not rated';
					scoreString = "[" + score + "/" + styleScore + "]";
				}

				beers[idx] = "\"" + elem['name'] + "\"" + " " + scoreString + " " + url;
			});
			msg.say(out + beers.join(', '));
		});
	});
};

module.exports = Beerscore;
