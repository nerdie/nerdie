require('./vendor/Jerk/lib/strftime');

var walk   = require('walk')
  , jerk   = require('./vendor/Jerk/lib/jerk')
  , config = require('./configulator');

// defaults:
if (undefined === config.prefix) {
	config.prefix = '!';
}

var nerdie = {
	config: config,
	anchoredPattern: function (pattern) {
		// TODO: escape nick
		return new RegExp('^(' + config.prefix + '|' + config.nick + ':\\s)' + pattern + '\\s+(.+)');
	}
};

var bot = jerk(function(j){
	var plugin = null
	  , name = null;

	walker = walk.walk('plugins', {followLinks: false});

	walker.on("file", function(root, fileStats, next) {
		if (fileStats.type == 'file' && fileStats.name.match(/.+\.js$/i)) {
			name = fileStats.name.split('.').slice(0, -1).join('.');
			plugin = require("./" + root + "/" + name);

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
						if (elem.pattern.exec && elem.pattern.test) {
							// pattern is a RegExp object
							pattern = elem.pattern;
						} else {
							// pattern is a Function
							pattern = elem.pattern();
						}
						j.watch_for(pattern, elem.handler);
					})();
				}
			});
			console.log('Loaded ' + name + ' plugin.');
		}
		next();
	});


}).connect(config);
