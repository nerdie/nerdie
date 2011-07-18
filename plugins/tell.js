var NerdieInterface = require('nerdie_interface.js');

var db;
var publicReminders = 3;
var myInterface;

function Tell(parentNerdie) {
	this.pluginInterface = new NerdieInterface(
		parentNerdie,
		this,
		{db: true}
	);
	myInterface = this.pluginInterface;
}
Tell.prototype.init = function () {
	this.pluginInterface.registerPattern(
		'.',
		activityHandler
	);
	this.pluginInterface.registerPattern(
		this.pluginInterface.anchoredPattern('tell', true),
		tellHandler
	);
	this.pluginInterface.registerPattern(
		this.pluginInterface.anchoredPattern('ask', true),
		tellHandler
	);
};
Tell.prototype.gotDb = function (incomingDb) {
	db = incomingDb;
}
var isChannel = function (source) {
	// check source (# or & means it's a channel)
	var first = source.substr(0, 1);
	if ('#' === first || '&' === first) {
		return true;
	}
	return false;
};
var tellHandler = function (msg) {
	if (!isChannel(msg.source)) {
		msg.say('You must user reminders within the channel where they will be relayed.');
		return;
	}
	var txt = msg.match_data[2];
	var tellNick = txt.substr(0, txt.indexOf(' '));
	var tellMsg = txt.substr(txt.indexOf(' ') + 1);
	if (!tellNick || !tellMsg) {
		// no nick or message supplied
		return
	}
	db.set(
		myInterface.uniqueId(),
		{
			recipient: tellNick,
			source: msg.source,
			msg: {
				time: Date.now(),
				sender: msg.user,
				content: tellMsg
			}
		},
		function (err) {
			if (err) {
				msg.say("Unable to save message: " + err);
			} else {
				msg.say("Ok, " + msg.user + ". Message stored.");
			}
		}
	);
};
var ago = function (ts) {
	var timeDiff = (Date.now() - ts) / 1000;

	var days = Math.floor(timeDiff / 86400);
	if (days > 0) {
		return days + ' day' + (days > 1 ? 's' : '');
	}

	var hours = Math.floor(timeDiff / 3600);
	if (hours > 0) {
		return hours + ' hour' + (hours > 1 ? 's' : '');
	}

	var minutes = Math.floor(timeDiff / 60);
	if (minutes > 0) {
		return minutes + ' minute' + (minutes > 1 ? 's' : '');
	}

	return 'seconds';
};
var activityHandler = function (msg) {
	if (!isChannel(msg.source)) {
		return; // early; nothing to see here
	}
	db.fetch({},
		function (doc, key) {
			if (doc.source == msg.source && doc.recipient == msg.user) {
				return true;
			}
		},
		function (err, results) {
			if (err) {
				if ('No Records' !== err.message) {
					throw err;
				}
				return;
			}
			results.forEach(function (data) {
				msg.say(msg.user + ": (from: " + data.msg.sender + ", " + ago(data.msg.time) + " ago) " + data.msg.content);
				db.remove(data._key, function () {})
			});
		}
	);
}

module.exports = Tell;

