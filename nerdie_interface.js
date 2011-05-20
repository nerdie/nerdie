var emitter = require('events').EventEmitter;

module.exports = NerdieInterface;

function NerdieInterface(parentNerdie, plugin) {
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

