'use strict';

var path = require('path');
var nconf = require('nconf');

console.log('Environment %s', process.env.NODE_ENV);
var env = process.env.NODE_ENV || "development";
var file = "config."+env+".json";
console.log('file %s', file);

nconf.use('memory').argv().env().file(path.join(__dirname, file)).defaults({
    PORT:3100
});

module.exports = nconf.get();
