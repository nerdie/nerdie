var fs = require('fs')
  , properties = {}
  , configFile = process.cwd() + '/config.json';

try {
	properties = JSON.parse(fs.readFileSync(configFile, 'utf8'));	
} catch (err){
	console.log(err);
}
module.exports = properties;
