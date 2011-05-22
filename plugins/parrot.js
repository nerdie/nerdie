var NerdieInterface = require('../nerdie_interface.js');

var count;

function Parrot(parentNerdie) {
	this.pluginInterface = new NerdieInterface(
		parentNerdie,
		this,
		{db: true}
	);
}
Parrot.prototype.init = function () {
	/* !help: HALP */
	this.pluginInterface.registerPattern(
		this.pluginInterface.anchoredPattern('help'),
		function(msg) {
			msg.say(msg.user + ": One day, I will have a help menu. But today is not that day.");
		}
	);

	this.pluginInterface.registerPattern(
		/^(?:is)?\s+any(?:one|body)\s+(?:here|around|awake)/i,
		function(msg) {
			msg.say(msg.user + ": I'm always here. Waiting. Watching.");
		}
	);

	this.pluginInterface.registerPattern(
		/^(good)?\s?morning?/i,
		function(msg) {
			var num = 0
			, responses = [
				"It's the morning. How *good* can that really be?",
				"My kingdom for a venti non-fat, no foam, no water 6 pump extra hot chai tea latte. Is that so much to ask for?",
				"STOP YELLING, PEOPLE ARE SLEEPING."
				];

			num = Math.floor(Math.random()*responses.length);
			return msg.say(msg.user + ": " + responses[num]);
		}
	);

	this.pluginInterface.registerPattern(
		/^\:?wq?$/i,
		function(msg) {
			msg.say(msg.user + ": You might want to switch to Emacs, buddy.");
		}
	);

	this.pluginInterface.registerPattern(
		this.pluginInterface.anchoredPattern('count'),
		countHandler
	);
};
Parrot.prototype.gotDb = function (db) {
	// THIS IS REALLY BROKEN
	// I think it's something to do with Alfred, itself
	count = db.define("Parrot_count");
	//count.property('counter', 'integer');
	//count.property('name', 'string');
	count.index('lookup', function (doc) { console.log("INDEX"); if (doc) { return doc.name; }});
	var current = count.find({lookup: 'oink'});
	console.log("FIND0: ");
	console.log(current);
	current(function (err, key, value) {
		console.log("FIND1: ", err, key, value);
	});
	return;
	if (current) {
		console.log("CURRENT: " + current);
	} else {
		var counter = count.new({counter: 0, name: 'oink'});
		counter.save(function (err) {
			if (err) {
				console.log("ERR: " + err);
			} else {
				console.log("SAVED.");
			}
			console.log("REFIND: ");
			count.find({name: 'oink'})(function (err, key, value) {
				console.log(err, key, value);
			});
		});
		console.log("COUNTER: " + counter);
	}
}
var countHandler = function (msg) {
};

module.exports = Parrot;

