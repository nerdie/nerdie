/**
 * Shamelessly taken from https://github.com/gf3/protobot
 */

var util = require('util');
var exec = require('child_process').exec;

function Google() {
  this.search = function(query, hollaback) {
    exec("curl -XGET 'http://ajax.googleapis.com/ajax/services/search/web?v=1.0&q=" + escape(query) + "'", function (err, stdout, stderr) {
      var results = JSON.parse(stdout)['responseData']['results'];
      results.forEach(function(x) {
        x.titleNoFormatting = x.titleNoFormatting.replace(/&#([^\s]*);/g, function(m1, m2) {
          return String.fromCharCode(m2);
        }).replace(/&(nbsp|amp|quot|lt|gt);/g, function(m1, m2) {
          return { 'nbsp': ' ', 'amp': '&', 'quot': '"', 'lt': '<', 'gt': '>' }[m2];
        });
        return x;
      });
      hollaback.call(this, results);
    });
  };
}
module.exports = Google;

//g = new Google();
//g.search('nerderati', function(result) {
	//util.puts(result.length);
	//util.puts(util.inspect(result));
//});
