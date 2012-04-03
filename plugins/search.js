var Google = require('../vendor/google/google')
  , g = new Google();

function Search(parentNerdie) {
	this.pluginInterface = new parentNerdie.iface(parentNerdie, this);
}
Search.prototype.init = function () {
	this.pluginInterface.registerPattern(
		this.pluginInterface.anchoredPattern('g(?:oogle)?', true),
		getGoogle
	);
};

var getGoogle = function(msg) {
	g.search(msg.match_data[2], function(results) {
		var out = results[0].titleNoFormatting + " - " + results[0].unescapedUrl;
		if (results.length) {
			msg.say(out);
		}
		else msg.say(msg.user + ": Sorry, no results for '" + q + "'");
	});
};

module.exports = Search;
