var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
  index: path.join(__dirname, '../web/public/index.html'),
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(callback) {
  fs.readFile(exports.paths.list, function(err, data) {
    if (err) {
      throw err;
    } else {
      callback(data.toString().split('\n'));
    }
  })
};

exports.isUrlInList = function(url, callback) {
  fs.readFile(exports.paths.list, function(err, data) {
    if (err) {
      throw err;
    } else {
      callback(data.toString().split('\n').indexOf(url) !== -1);
    }
  })
};

exports.addUrlToList = function(url, callback) {
  exports.isUrlInList(url, function(is) {
    if (!is) {
      fs.appendFile(exports.paths.list, url + '\n', function(err, data) {
        if (err) {
          throw err;
        } else {
          callback && callback(data);
        }
      });
    }
  });

};

exports.isUrlArchived = function(url, callback) {
  fs.access(exports.paths.archivedSites + url, fs.R_OK, function(err, data) {
    if (err) {
      callback(false);
    } else {
      callback(true)
    }
  });
};

exports.downloadUrls = function(urls) {
  _.each(urls, function(url) {
    exports.isUrlArchived(url, function(data) {
      if (!data) {
        exports.isUrlInList(url, function(is) {
          if (!is) {
            exports.addUrlToList(url);
          }
          request.get('http://' + url).pipe(fs.createWriteStream(exports.paths.archivedSites + '/' + url));
        })
      }
    });
  });
};


