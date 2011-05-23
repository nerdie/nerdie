var NerdieInterface = require('../nerdie_interface.js')
  , config = null;

module.exports = Plugin;

function Plugin(parentNerdie) {
	this.pluginInterface = new NerdieInterface(parentNerdie, this);
	config = (parentNerdie.config.admins) ? parentNerdie.config.admins : [];
}

Plugin.prototype.init = function () {
	this.pluginInterface.registerPattern(
		this.pluginInterface.anchoredPattern('reload', true),
		this.reload
	);
};

Plugin.prototype.reload = function(msg) {
	if (config.admins.indexOf(msg.user) === -1) {
		msg.msg('You do not have permissions for reloading.');
		return;
	}
	try {
		require('supervisor');
	} catch(e) {
		msg.msg('You need to install node-supervisor (`npm install -g supervisor`).');
		return;
	}
	process.exit(0);
};
