var emitter = require('events').EventEmitter
  , Tiny = require('node-tiny');

var dbPath = __dirname + '/db/';

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

	if (options.db && typeof plugin.gotDb == 'function') {
		Tiny(dbPath + plugin.constructor.name + '.tiny', function (err, db) {
			if (err) {
				console.log("Failed to load database: " + plugin.constructor.name);
				return false;
			}
			plugin.gotDb(db);
			return true;
		});
	}
}
NerdieInterface.prototype = Object.create(emitter.prototype, {
	constructor: {
		value: NerdieInterface,
		enumerable: false
	}
});

NerdieInterface.prototype.anchoredPattern = function (pattern, arg) {
	// escape mechanism borrowed from Simin Willison:
	//  http://simonwillison.net/2006/Jan/20/escape/
	var nick = this.nerdie.config.nick.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

	return new RegExp(
		'^(' + this.nerdie.config.prefix + '|' +
		nick + ':\\s)' + pattern +
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

module.exports = NerdieInterface;
