/**
 * Main application file
 */

'use strict';

var express = require('express'),
    path = require('path'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    appRoot = require('app-root-path'),
    fs = require('fs'),
    appRootPath = appRoot.toString();

// Load config
var config = require('./config/index');

var search = require("./azuresearch");

// Setup server
console.log('Launching express server from %s', appRootPath);
var app = express();
var server = require('http').createServer(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.set('appPath', __dirname + '/public');

// add auth if it's enabled, in production, settings are set via environment variables
if (config.aad && config.aad.enabled) {
    app.use(require('./adauth')(config.aad));
}

// All undefined asset or api routes should return a 404
app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(function (req, res) {
        var err = new Error('Not Found');
        err.status = 404;
        res.render('error', {message:err.message, error:err});
    });

// All search grpah routes should redirect to the graph.jade
app.route('/:url(graph)/*')
.get(function (req, res) {
  fs.readFile('./public/alchemy/contributors.json', 'utf8', function (err, data) {
    if (err) throw err;
    var obj = JSON.stringify(data);
    console.log("Contributors: ", obj);

    res.render('graph', { title: 'Azure Resource Graph Explorer', scenarios: ["Get subscription graph response", "Get cluster changes"], scenario: obj});
  });
})

// All map routes should redirect to the map.jade
app.route('/:url(map|MAP)/*')
    .get(function (req, res) {
        res.render('map', { title: 'Azure Resource Graph Analytics', scenarios: ["Top 10 Machines ranking based on VM's", "Top 10 Customer regions ranking based on support tickets"]});
    });

app.route('/:url(searchgraph)/*')
  .get(function (req, res){
    var query = req.query ? req.query.q : '';
    console.log("query: ", query);

    if (query){
      search.query(query, function(err, results){
        if (err)
          next()

        var str = JSON.stringify(results, null, 4);
        console.log("results: ", str);

        res.status(201).send(str);
      });
    }
  });

// All other routes should redirect to the index.jade
app.route('/*')
    .get(function (req, res) {
        var query = req.query ? req.query.q||'toyota' : '';
        var userName = 'IC';
        if (req.user)
        {
            userName = req.user.givenName+' '+req.user.familyName;
        }
        console.log("query: ", query);

        search.query(query, function(err, results){
          if (err)
            next()

          var str = JSON.stringify(results, null, 4);
          console.log("results: ", str);

          res.render('index', { title: 'Azure Resource Graph Search', query: query, results: results});
        });
    });

// Start server
app.set('port', config.PORT);
server.listen(app.get('port'), null, function () {
    console.log('Express server listening on port %d', server.address().port);
});

// Expose app
exports = module.exports = app;
