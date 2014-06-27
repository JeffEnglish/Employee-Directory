var cloudinary = require('cloudinary');
var async = require('async');
var request = require('request');

(function initialize() {
  //BUGBUG: Move this to config.json
  cloudinary.config({
    cloud_name: 'dwa4d5k5m',
    api_key: '788497184333795',
    api_secret: 'vMoV-VWd2gFcj4suLwb7R_ismUw'
  });
})();

function deleteImage(id, callback) {
  cloudinary.uploader.destroy(id, function(result) {
    console.log(result)
  }, {
    invalidate: true
  });
}

function downloadImage(url, callback) {
  request({
    uri: url,
    encoding: 'binary'
  }, function(error, response, body) {
    if (error || response.statusCode != 200) {
      return callback(error);
    }
    var data_uri_prefix = "data:" + response.headers["content-type"] + ";base64,";
    var image = new Buffer(body.toString(), 'binary').toString('base64');                                                                                                                                                                 
        image = data_uri_prefix + image;

    callback(null, image);
  });
}

function storeImage(employee, callback) {
  var imageInfo;
  async.waterfall([

      // Upload the image and apply transformations
      function(callback) {
        cloudinary.uploader.upload(employee.photo, function(result) {
          if (result.error) {
            return callback(result.error.message, employee);
          }
          imageInfo = result;
          callback(null);
        }, {
          crop: 'fill',
          gravity: 'face',
          width: 400,
          height: 400,
          eager: [{
            width: 200,
            height: 200,
            crop: 'thumb',
            gravity: 'face',
            radius: 'max'
          }, {
            width: 100,
            height: 100,
            crop: 'fill',
            gravity: 'face'
          }, {
            width: 50,
            height: 50,
            crop: 'thumb',
            gravity: 'face',
            radius: 'max'
          }]
        });
      },
      // Retrieve each image and store in the employee record
      function(callback) {
        downloadImage(imageInfo.url, callback);
      },
      function(image, callback) {
        employee.photo = image;
        downloadImage(imageInfo.eager[0].url, callback);
      },
      function(image, callback) {
        employee.photoRound = image;
        downloadImage(imageInfo.eager[1].url, callback);
      },
      function(image, callback) {
        employee.photoSmall = image;
        downloadImage(imageInfo.eager[2].url, callback);
      },
      // Delete the image
      function(image, callback) {
        employee.photoSmallRound = image;
        cloudinary.uploader.destroy(imageInfo.public_id, function(result) {
          callback(null);
        }, {
          invalidate: true
        });
      }
    ],
    function(err) {
      callback(err);
    });
}

module.exports = {
  storeImage: storeImage
};