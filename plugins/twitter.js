var http = require('http');

var NerdieInterface = require('../nerdie_interface.js');
module.exports = Plugin;

function Plugin(parentNerdie) {
	this.pluginInterface = new NerdieInterface(parentNerdie, this);
}
Plugin.prototype.init = function () {
	var plugin = this;
	// !twitter {}
	this.pluginInterface.registerPattern(
		this.pluginInterface.anchoredPattern('twitter', true),
		function (msg) {
			var parts = msg.match_data[2].split(' ');
			if (parts[0].match(/^[0-9]+$/)) {
				this.getStatus(parts[0], msg.say);
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
}

Plugin.prototype.getStatus = function (num, callback) {
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

Plugin.prototype.getUserStatus = function (username, index, callback) {
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

Plugin.prototype.formatTweet = function (tweet) {
	var out =  '<@' + tweet.user.screen_name + '> ' + tweet.text;
	out += ' -> http://twitter.com/' + encodeURIComponent(tweet.user.screen_name) + '/status/' + encodeURIComponent(tweet.id_str);
	return out;
};
