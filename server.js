require('./vendor/Jerk/lib/strftime')

var sys = require('sys')
  , http  = require('http')
  , jerk  = require('./vendor/Jerk/lib/jerk')
  , path  = require('path')
  , fs  = require('fs')
  , Google = require('./vendor/google/google');

var options = {
	server: 'irc.freenode.net',
	nick: 'deceptabot',
	channels: ['#individualdigital 19w44', '#deceptabot'],
	user: {
		username: 'deceptabot',
		realname: 'Megatron'
	},
	logs: 'logs',
	delayAfterConnect: 1500
};

var google = new Google();

/**
 * Determine recipient.
 */
function to(message) {
	return !!message.match_data[1] ? message.match_data[1].trim() : message.user;
}


var bot = jerk(function(j){

	/* !g[oogle] !s[earch]: Google Searches */
	j.watch_for(/^!g(?:oogle)?\s+(.+)/i, function(msg) {
		google.search(msg.match_data[1], function(results) {
			var out = results[0].titleNoFormatting + " - " + results[0].unescapedUrl;
			if (results.length) {
				msg.say(out);
			}
			else msg.say(to(msg) + ": Sorry, no results for '" + q + "'");
		});
		
	});

	/* !help: HALP */
	j.watch_for(/^!help$/i, function(msg) {
		msg.say(to(msg) + ": It's hard to find good help these days... COBRA!");
	});

	j.watch_for(/^(?:is)?\s+any(?:one|body)\s+(?:here|around|awake)/i, function(msg) {
		msg.say(to(msg) + ": I'm always here. Waiting. Watching.");
	});

	j.watch_for(/^(good)?\s?morning?/i, function(msg) {
		var responses = [
			"It's the morning. How *good* can that really be?",
			"My kingdom for a venti non-fat, no foam, no water 6 pump extra hot chai tea latte. Is that so much to ask for?",
			"STOP YELLING, PEOPLE ARE SLEEPING."
		];
		var num = 0;

		if (msg.user.match(/^coogle/)) {
			return msg.say(msg.user + ": Good morning? You can't come up with a more original greeting?");
		}
		num = Math.floor(Math.random()*responses.length + 1);
		return msg.say(msg.user + ": " + responses[num]);
	});


	j.watch_for(/^\:?wq?$/i, function(msg) {
		msg.say(to(msg) + ": You might want to switch to Emacs, buddy.");
	});

	j.watch_for(/^!beerscore\s+(.+)/i, function(msg) {
		var options = {
			'host': 'caedmon.net',
			port: 80,
			'path': '/beerscore/' + encodeURIComponent(msg.match_data[1])
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
	});

}).connect(options);
