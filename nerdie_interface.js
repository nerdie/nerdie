var emitter = require('events').EventEmitter
  , Alfred = require('alfred');

module.exports = NerdieInterface;

var db;

Alfred.open(__dirname + '/db', function (err, openedDb) {
	if (err) {
		console.log(err);
		throw err;
	} else {
		console.log('Opened database for plugins');
		db = openedDb;
	}
});

function NerdieInterface(parentNerdie, plugin, options) {
	if (undefined === options) {
		options = {};
	}
	emitter.call(this);
	this.nerdie = parentNerdie;
	this.plugin = plugin;
	myInterface = this;
	this.nerdie.addListener('init', function (config, loadedPlugins) {
		myInterface.config = config;
		if ('function' == typeof plugin.init) {
			plugin.init(loadedPlugins);
		}
	});
	plugin.addListener = this.addListener;

	var dbRegistration = function () {
		if (db) {
			plugin.gotDb(db);
			return true;
		} else {
			return false;
		}
	};
	if (undefined === options.db || !options.db) {
		// database not requested
	} else if (undefined === plugin.gotDb || 'function' !== typeof plugin.gotDb) {
		console.log("Plugin " + plugin.constructor.name + " does not implement gotDb(), so not attempting to register a dataase, even though one was requested.");
	} else {
		if (!dbRegistration()) {
			var dbTries = 1;
			var dbInterval = setInterval(function () {
				if (++dbTries < 10) {
					if (dbRegistration()) {
						clearInterval(dbInterval);
					} else {
						console.log("Could not connect to DB. Will retry.");
					}
				} else {
					console.log("Could not connect to DB. Giving up.");
					myInterface.emit("databaseConnectFail");
					clearInterval(dbInterval);
				}
			}, 1000);
		}
	}
}
NerdieInterface.prototype = Object.create(emitter.prototype, {
	constructor: {
		value: NerdieInterface,
		enumerable: false
	}
});

NerdieInterface.prototype.anchoredPattern = function (pattern, arg) {
	// TODO: escape nick
	return new RegExp(
		'^(' + this.nerdie.config.prefix + '|' +
		this.nerdie.config.nick + ':\\s)' + pattern +
		(arg ? '\\s*(.+)' : '') + '$'
	);
};
NerdieInterface.prototype.registerPattern = function (pattern, callback) {
	this.emit(
		'registerPattern',
		pattern,
		callback
	);
}

