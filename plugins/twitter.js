var http = require('http');

var nerdie;
var init = function (parentNerdie) {
	nerdie = parentNerdie;
};

var exports = [];

var getStatus = function (num, callback) {
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
				callback(formatTweet(data));
			}
		});
	});
};

var getUserStatus = function (username, index, callback) {
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
				callback(formatTweet(data[index]));
			}
		});
	});
}

var formatTweet = function (tweet) {
	var out =  '<@' + tweet.user.screen_name + '> ' + tweet.text;
	out += ' -> http://twitter.com/' + encodeURIComponent(tweet.user.screen_name) + '/statuses/' + encodeURIComponent(tweet.id_str);
	return out;
};

var patternHandler = function (msg) {
	var parts = msg.match_data[2].split(' ');
	if (parts[0].match(/^[0-9]+$/)) {
		getStatus(parts[0], msg.say);
	} else {
		if (2 == parts.length) {
			index = parts[1];
		} else {
			index = 1;
		}
		getUserStatus(parts[0], index, msg.say);
	}
};

var urlHandler = function (msg) {
	var num = msg.match_data[3];
	getStatus(num, msg.say);
}

// !twitter {}
exports.push({
	init: init,
	pattern: function () { return nerdie.anchoredPattern('twitter', true); },
	handler: patternHandler
});

// URLs
// 1) https://twitter.com/username/status/123123123123123
// 1) https://twitter.com/#!/username/status/123123123123123
exports.push({
	pattern: /https?:\/\/twitter.com\/(#!\/)?(.+?)\/status\/([0-9]+)/i,
	handler: urlHandler
});

module.exports = exports;
/*
var handler = function(msg) {
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
*/
