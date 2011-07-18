var request = require('request')
  , querystring = require('querystring');

var NerdieInterface = require('nerdie_interface.js');
var key = null
  , config = null;

function Weather(parentNerdie) {
	config = (parentNerdie.config.weather) ? parentNerdie.config.weather : {};

	this.pluginInterface = new NerdieInterface(parentNerdie, this);
}
Weather.prototype.init = function () {
	this.pluginInterface.registerPattern(
		this.pluginInterface.anchoredPattern('weather', true),
		this.getWeather
	);
};

Weather.prototype.getWeather = function(msg) {
	if (!config || !config.key) {
		msg.say('You need a weather API key. Get one here: http://worldweatheronline.com');
		return;
	}
	key = config.key;
	var q = querystring.stringify({"q": msg.match_data[2], "format": "json", "num_of_days": 0, "key": key});
	var uri = 'http://free.worldweatheronline.com/feed/weather.ashx?'+q;
	var response = ""
	  , conditions = {};

	request({uri: uri}, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			try {
				body = JSON.parse(body);
			} catch (e) {
				msg.say("Argh. Could not parse response from " + uri + " .");
				return;
			}
			if (body.data && body.data.error) {
				msg.say("Whoops, there were some errors with that query:");
				body.data.error.forEach(function(value, index) {
					msg.say("[ERROR]: " + value.msg);
				});
				return;
			}

			conditions = body.data.current_condition[0];

			response  = conditions.weatherDesc[0].value + ", ";
			response += conditions.temp_C + "C [" + conditions.temp_F + "F] ";
			response += "with " + conditions.humidity + "% humidity ";
			response += "for " + body.data.request[0].query;

			msg.say(msg.user + ": " + response);
		} else {
			msg.say("Whoops! I had some trouble with the weather API for " + loc + ". Sorry :-/.");
			return;
		}
	});
};

module.exports = Weather;
