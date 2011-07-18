var sandbox = require('sandbox')
  , codepad = require('codepad');

var NerdieInterface = require('nerdie_interface.js');

module.exports = Sandbox;

function Sandbox(parentNerdie) {
	this.pluginInterface = new NerdieInterface(parentNerdie, this);
}
Sandbox.prototype.init = function () {
	this.pluginInterface.registerPattern(
		this.pluginInterface.anchoredPattern('js', true),
		this.getJsSandbox
	);

	this.pluginInterface.registerPattern(
		this.pluginInterface.anchoredPattern('eval', true),
		this.getEval
	);
};

Sandbox.prototype.getJsSandbox = function(msg) {
	s = new sandbox();
	s.run(msg.match_data[2], function(output) {
		msg.say(msg.user + ": Result is => " + output.result);
	});
};

Sandbox.prototype.getEval = function(msg) {
	var txt = msg.match_data[2];
	var evalLang = txt.substr(0, txt.indexOf(' '));
	var evalCode = txt.substr(txt.indexOf(' ') + 1);
	if (!evalLang || !evalCode) {
		// no language or code supplied
		return
	}

	try {
		codepad.eval(evalLang, evalCode, function (err, data) {
			if (err) {
				msg.say(msg.user + ": codepad error.");
				return;
			}
			var out = data.output.trim().split("\n");
			msg.say(msg.user + ": " + out[0])
			var txt = msg.user + ": ";
			if (out.length > 1) {
				txt += "+" + (out.length - 1) + " more line";
				if (out.length > 2) {
					txt += "s";
				}
				txt += " ";
				msg.say(txt + "-> " + data.url);
			}
		}, true, 'nerdie');
	} catch (e) {
		msg.say(msg.user + ": " + e);
	}

};

