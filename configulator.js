var fs = require('fs')
  , properties = {}
  , configFile = process.cwd() + '/config.json';

try {
	properties = JSON.parse(fs.readFileSync(configFile, 'utf8'));	
} catch (err){
	console.log('Your configuration file contains a syntax error. Aborting.');
	process.exit(0);
}
module.exports = properties;
