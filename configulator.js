var fs = require('fs')
  , properties = {}
  , configFile
  , configFileContents;

if (process.argv[2]) {
	try {
		configFile = process.argv[2];
		configFileContents = fs.readFileSync(configFile, 'utf8');
	} catch (e) {
		console.log("Can't load custom config file:", configFile);
		process.exit(1);
	}
} else {
	try {
		configFile = process.cwd() + '/config.json';
		configFileContents = fs.readFileSync(configFile);
	} catch (e) {
		console.log("Can't load default config file:", configFile);
	}
}

try {
	properties = JSON.parse(configFileContents);
} catch (err){
	console.log('Your configuration file (%s) contains a syntax error. Aborting.', configFile);
	process.exit(1);
}
module.exports = properties;
