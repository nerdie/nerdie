var http = require('http')
  , querystring = require('querystring');

var twitter_auth;
var bot;
var nerdie;

function Twitter(parentNerdie) {
	this.pluginInterface = new parentNerdie.iface(parentNerdie, this);
	if (parentNerdie.config.plugins.twitter && parentNerdie.config.plugins.twitter.auth) {
		twitter_auth = parentNerdie.config.plugins.twitter.auth;
	}
	bot = parentNerdie.bot;
	nerdie = parentNerdie;
}

Twitter.prototype.init = function () {
	var plugin = this;
	// !twitter {}
	this.pluginInterface.registerPattern(
		this.pluginInterface.anchoredPattern('twitter', true),
		function (msg) {
			var parts = msg.match_data[2].split(' ');
			if (parts[0].match(/^[0-9]+$/)) {
				plugin.getStatus(parts[0], msg.say);
			} else {
				if (2 == parts.length) {
					index = parts[1];
				} else {
					index = 1;
				}
				plugin.getUserStatus(parts[0], index, msg.say);
			}
		}
	);

	// URLs
	// 1) https://twitter.com/username/status/123123123123123
	// 2) https://twitter.com/#!/username/status/123123123123123
	this.pluginInterface.registerPattern(
		/https?:\/\/twitter.com\/(#!\/)?(.+?)\/status\/([0-9]+)/i,
		function (msg) {
			var num = msg.match_data[3];
			plugin.getStatus(num, msg.say);
		}
	);

	// track
	if (nerdie.config.plugins.twitter && nerdie.config.plugins.twitter.auth && nerdie.config.plugins.twitter.track) {
		this.streamTweets(nerdie.config.plugins.twitter.track);
	}
}

Twitter.prototype.getStatus = function (num, callback) {
	var plugin = this;
	var options = {
		'host': 'twitter.com',
		port: 80,
		path: '/statuses/show/' + encodeURIComponent(num) + '.json'
	};
	var data = "";
	http.get(options, function(res) {
		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on('end', function() {
			try {
				data = JSON.parse(data);
			} catch(e) {
				callback("Invalid tweet?");
			}
			if (data && undefined !== data.user) {
				callback(plugin.formatTweet(data));
			}
		});
	});
};

Twitter.prototype.getUserStatus = function (username, index, callback) {
	var plugin = this;
	index--; // zero-indexed array
	var options = {
		'host': 'twitter.com',
		port: 80,
		path: '/statuses/user_timeline/' + encodeURIComponent(username) + '.json'
	};
	var data = "";
	http.get(options, function(res) {
		res.on('data', function(chunk) {
			data += chunk;
		});
		res.on('end', function() {
			try {
				data = JSON.parse(data);
			} catch(e) {
				callback("Invalid tweet?");
			}
			if (data && undefined !== data[index] && undefined != data[index].user) {
				callback(plugin.formatTweet(data[index]));
			}
		});
	});
}

Twitter.prototype.formatTweet = function (tweet) {
	var out =  '<@' + tweet.user.screen_name + '> ' + tweet.text;
	out += ' -> http://twitter.com/' + encodeURIComponent(tweet.user.screen_name) + '/status/' + encodeURIComponent(tweet.id_str);
	return out;
};

// mostly borrowed from https://gist.github.com/433101
Twitter.prototype.streamTweets = function (track) {
	var streamTweets = this.streamTweets;
	var LINE_REGEX = /^(.+?)\r\n/;

	var input = "";

	var toTrack = [];
	for (var k in track) {
		if (track.hasOwnProperty(k)) {
			track[k].forEach(function(v) {
				if (toTrack.indexOf(v) === -1) {
					toTrack.push(v);
				}
			});
		}
	}

	var query = querystring.stringify({track: toTrack.join(',')});
	var headers = {
		'Host': 'stream.twitter.com',
		'Authorization': 'Basic ' + new Buffer(
			twitter_auth.user + ':' + twitter_auth.pass
		).toString('base64')
	};
	var client = http.createClient(80, 'stream.twitter.com');
	client.setTimeout(1000 * 60 * 5);

	var request = client.request('GET', '/1/statuses/filter.json?' + query, headers);
	request.addListener('response', function(response) {
		response.setEncoding('utf8');
		console.log('Starting twitter stream listener...');
	
		response.addListener('data', function(chunk) {
			if (chunk != "\r\n")
				input += chunk;
				
			var match, tweet, msg;
			
			while (match = input.match(LINE_REGEX)) {
				input = input.substr(match[0].length);

				try {
					tweet = JSON.parse(match[1]);
				} catch (e) {
					console.log("ERROR: invalid JSON request");
				}
				
				// Check if it's a bad retweet or if the user has less than 5 friends (might be a bot!)
				if (tweet.user.friends_count >= 5 && tweet.text.match(/(^|\s)RT @([^\s]+)/) == null && tweet.text.match(/\svia\s|via\s@(\w+)/) == null) {

					msg = ">> " + tweet.text;
					msg += ' -> http://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str;
					var said = [];
					for (var k in track) {
						if (track.hasOwnProperty(k)) {
							track[k].forEach(function(v) {
								if (said.indexOf(k) === -1 && (tweet.text + ' @' + tweet.user.screen_name).match(new RegExp(v, 'i'))) {
									said.push(k);
									bot.say(k, msg);
								}
							});
						}
					}
				}
			}
		});
	
		response.addListener('error', function(err) {
			console.log('Error while receiving tweets: ' + err);
			console.log('Restarting...');
			setTimeout(streamTweets, 3000);
		});
	
		response.addListener('end', function() {
			console.log('Twitter stream timed out. Restarting...');
			setTimeout(streamTweets, 3000);
		});
	});
	request.end();
}

module.exports = Twitter;
