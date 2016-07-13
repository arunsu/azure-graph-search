exports.query = function (query, cb) {
    var AzureSearch = require('azure-search'),
        async = require('async');

    var client = AzureSearch({
        url: "https://arg.search.windows.net",
        key:"6BDDF0E8DC8959B985436A5F6905823B"
    });

    // Call Azure search to get indexes
    client.listIndexes(function (err, schemas) {
        if (err) {
            cb(err);
        }

        console.log("schemas: ", schemas.length);

        var iterator = function(schema, callback) {
          console.log("schema name: ", schema.name);
          client.search(schema.name, { search: query, top: 4 }, function (err, results) {
              if (err) {
                  return;
              }
              var indexResults = {
                index: schema.name,
                results: results
              }
              callback(null, indexResults);
          });
        };

        async.map(schemas, iterator, function(err, results) {
            cb(null, results);
        });
    });
}
