var path = require('path');
var archive = require('../helpers/archive-helpers');
var request = require('request');
var fs = require('fs');

// require more modules/folders here!

exports.handleRequest = function(req, res) {
  if (req.method === 'POST') {
    var msg = '';
    req.on('data', function(data) {
      msg += data;
    });

    req.on('end', function() {
      fs.appendFile(archive.paths.list, JSON.parse(msg).url + "\n", function(err, data) {
        if (err) {
          throw err;
        } else {
          res.writeHead(302, {'Content-Type': 'text/plain'});
          res.end('Moved Temporarily');
        }
      });
    });
  } else if (req.url === '/') {
    fs.readFile(archive.paths.index, function(err, data) {
      if (err) throw err;
      res.end(data.toString());
    });
  } else {
    var reqUrl = archive.paths.archivedSites + req.url;
    fs.access(reqUrl, fs.R_OK, function(err, data) {
      if (err) {
        // return 404
        res.writeHead(404, {'Content-Type': 'text/plain'});
        res.end('Not found');
      } else {
        fs.createReadStream(reqUrl).pipe(res);
      }
    });
  }

    // request.get('http:/' + req.url).pipe(fs.createWriteStream(req.url));
    // request.get('http:/' + req.url).pipe(res);

  //res.end(archive.paths.list);
};
