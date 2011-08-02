var emitter = require('events').EventEmitter
  , Tiny = require('tiny');

var dbPath = __dirname + '/db/';

function NerdieInterface(parentNerdie, plugin, options) {
	if (undefined === options) {
		options = {};
	}
	emitter.call(this);
	parentNerdie.setMaxListeners(0);
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
				console.log("Failed to load database: " + plugin.constructor.name + " -> " + err);
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
	// escape mechanism borrowed from Simon Willison:
	//  http://simonwillison.net/2006/Jan/20/escape/
	var nick = this.nerdie.config.nick.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");

	return new RegExp(
		'^(' + this.nerdie.config.prefix + '|' +
		nick + '[:,]?\\s)' + pattern +
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
NerdieInterface.prototype.uniqueId = function () {
	// borrowed from:
	//  http://comments.gmane.org/gmane.comp.lang.javascript.nodejs/2378
	var rand
	  , i
	  , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	  , ret = ''
	  , bits = 256;
	// in v8, Math.random() yields 32 pseudo-random bits
	while (bits > 0) {
		rand = Math.floor(Math.random()*0x100000000) // 32-bit integer
		// base 64 means 6 bits per character,
		// so we use the top 30 bits from rand to give 30/6=5 characters.
		for (i=26; i>0 && bits>0; i-=6, bits-=6) {
			ret += chars[0x3F & rand >>> i]
		}
	}
	return ret;
} 

module.exports = NerdieInterface;
