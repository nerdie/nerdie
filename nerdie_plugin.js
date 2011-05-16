var emitter = require('events').EventEmitter;

module.exports = NerdiePlugin;

function NerdiePlugin(parentNerdie) {
	emitter.call(this);
	this.nerdie = parentNerdie;
	console.log("parent called.");
}
NerdiePlugin.prototype = Object.create(emitter.prototype, {
	constructor: {
		value: NerdiePlugin,
		enumerable: false
	}
});
NerdiePlugin.prototype.getName = function () {
	return this.name;
};

