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

Nerdie.prototype.anchoredPattern = function (pattern, arg) {
	// TODO: escape nick
	return new RegExp('^(' + config.prefix + '|' + config.nick + ':\\s)' + pattern + (arg ? '\\s*(.+)' : '') + '$');
};

var bot = jerk(function(j){
	var plugin = null
	  , nerdie = new Nerdie()
	  , loadedPlugins = []
	  , name = null;

	walker = walk.walk('plugins', {followLinks: false});

	walker.on("file", function(root, fileStats, next) {
		if (fileStats.type == 'file' && fileStats.name.match(/.+\.js$/i)) {
			name = fileStats.name.split('.').slice(0, -1).join('.');
			var pluginLoader = require("./" + root + "/" + name);
			if (name !== 'twitter') {
				next();
				return;
			}
			plugin = new pluginLoader(nerdie);

			/*
			if (!(plugin instanceof Array)) {
				plugin = [plugin];
			}

			plugin.forEach(function(elem, idx) {
				if (undefined !== elem.init && 'function' === typeof elem.init) {
					elem.init(nerdie);
				}

				if (!elem.pattern || !elem.handler) {
					console.log('Plugin ' + name + ' is missing pattern and/or handler function.');
				} else {
					(function() {
						var pattern;
						if (elem.pattern instanceof RegExp) {
							pattern = elem.pattern;
						} else if ('function' === typeof elem.pattern) {
							pattern = elem.pattern();
						} else {
							// not a RegExp or a function; skip
							console.log("Skipping pattern: " + name + " -> " + pattern);
							return;
						}
						j.watch_for(pattern, elem.handler);
					})();
				}
			});
			*/
			loadedPlugins.push({name: name, plugin: plugin});
			console.log('Loaded ' + name + ' plugin.');
			console.log(plugin.getName());
		}
		next();
	});

	walker.on("end", function() {
		nerdie.emit('handshake', config);
		loadedPlugins.forEach(function (plugin) {
			nerdie.emit("pluginLoaded", plugin.name, plugin.plugin);
		});
	});


}).connect(config);
