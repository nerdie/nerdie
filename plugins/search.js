var Google = require('../vendor/google/google')
  , g = new Google();

/* !g[oogle] !s[earch]: Google Searches */
var pattern = /^!g(?:oogle)?\s+(.+)/i;

var handler = function(msg) {
	g.search(msg.match_data[1], function(results) {
		var out = results[0].titleNoFormatting + " - " + results[0].unescapedUrl;
		if (results.length) {
			msg.say(out);
		}
		else msg.say(msg.user + ": Sorry, no results for '" + q + "'");
	});

};

module.exports = {pattern: pattern, handler: handler};
