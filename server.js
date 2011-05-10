require('./vendor/Jerk/lib/strftime');

var walk   = require('walk')
  , jerk   = require('./vendor/Jerk/lib/jerk')
  , config = require('./configulator');

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
				if (!elem.pattern || !elem.handler) {
					console.log('Plugin ' + name + ' is missing pattern and/or handler function.');
				} else {
					(function() {
						j.watch_for(elem.pattern, elem.handler);
					})();
				}
			});
			console.log('Loaded ' + name + ' plugin.');
		}
		next();
	});


}).connect(config);
