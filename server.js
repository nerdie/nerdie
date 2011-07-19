var jerk   = require('jerk')
  , events = require('events')
  , fs = require('fs')
  , config = require('./configulator');

// defaults:
if (undefined === config.prefix) {
	config.prefix = '!';
}

// error handler
process.on('uncaughtException', function (err) {
	console.log('Caught exception: ' + err);
	console.log(err.stack);
});

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

Nerdie.prototype.bot = jerk(function(j){
	var plugin = null
	  , nerdie = new Nerdie()
	  , loadedPlugins = {}
	  , name = null;

	require.paths.push(__dirname);
	var loadPlugin = function (prefix, filename) {
		name = prefix + filename.split('.').slice(0, -1).join('.');
		var pluginLoader = require(name);
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

	var loadedCore = false, loadedUser = false;
	var doInit = function () {
		if (loadedCore && loadedUser) {
			nerdie.emit('init', config, loadedPlugins);
		}
	};

	// core plugins:
	fs.readdir('plugins', function(err, files) {
		if (err) {
			throw err;
		}
		files.forEach(function (filename) {
			var prefix = __dirname + '/plugins/';
			if (fs.statSync(prefix + filename).isFile()
				&& filename.match(/.+\.js$/i)) {
				loadPlugin(prefix, filename);
			}
		});
		loadedCore = true;
		doInit();
	});

	fs.readdir('plugins/user', function(err, files) {
		if (err) {
			throw err;
		}
		files.forEach(function (filename) {
			var prefix = __dirname + '/plugins/user/'
			var stat = fs.statSync(prefix + filename);
			if (stat.isFile() && filename.match(/.+\.js$/i)) {
				loadPlugin(__dirname + '/plugins/user/', filename);
			} else if (stat.isDirectory()) {
				// plugins/user/{pluginname}/
				prefix = __dirname + '/plugins/user/' + filename + '/';
				// check pluginname/index.js
				try {
					fs.statSync(prefix + 'index.js');
					loadPlugin(prefix, 'index.js');
					return; // forEach iteration
				} catch (e) {}
				// check pluginname/pluginname.js
				try {
					fs.statSync(prefix + filename + '.js');
					loadPlugin(prefix, filename + '.js');
					return; // forEach iteration
				} catch (e) {}
			}
		});
		loadedUser = true;
		doInit();
	});

}).connect(config);
