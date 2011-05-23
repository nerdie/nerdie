var walk   = require('walk')
  , jerk   = require('jerk')
  , events = require('events')
  , config = require('./configulator');

// defaults:
if (undefined === config.prefix) {
	config.prefix = '!';
}

function Nerdie() {
	this.config = config;
	events.EventEmitter.call(this);
}
Nerdie.prototype = Object.create(events.EventEmitter.prototype, {
	constructor: {
		value: Nerdie,
		enumerable: false
	}
});

var bot = jerk(function(j){
	var plugin = null
	  , nerdie = new Nerdie()
	  , loadedPlugins = {}
	  , name = null;

	walker = walk.walk('plugins', {followLinks: false});

	walker.on("file", function(root, fileStats, next) {
		var pluginLoader = null;

		if (fileStats.type == 'file' && fileStats.name.match(/.+\.js$/i)) {

			if (fileStats.name == 'index.js') {
				name = "./" + root;
			} else {
				name = "./" + root + "/" + fileStats.name.split('.').slice(0, -1).join('.');
			}
			pluginLoader = require(name);
			plugin = new pluginLoader(nerdie);

			if ('object' == typeof plugin.pluginInterface) {
				plugin.pluginInterface.addListener('registerPattern', function (pattern, callback) {
					console.log('Registered pattern: ' + pattern);
					j.watch_for(pattern, callback);
				});
			}
			loadedPlugins[name] = plugin;
			console.log('Loaded ' + name + ' plugin.');
		}
		next();
	});

	walker.on("end", function() {
		nerdie.emit('init', config, loadedPlugins);
	});

}).connect(config);
