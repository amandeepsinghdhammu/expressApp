var express = require('express');
var omx = require('node-omxplayer');
//var omx = require('simpleomxcontrol');
var fs = require('fs');
var router = express.Router();
var player;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Ethos Home page' });
});

router.get('/playVideo/:videoId', function(req, res, next) {
  console.log(req.params);
  var file = req.params.videoId;
  
  // Check If file exist=
  if (fs.existsSync("./public/videos/" + file + ".mp4")) {
    console.log("./public/videos/" + file + ".mp4");
    
    // Create an instance of the player with the source.
    player = omx("./public/videos/" + file + ".mp4");
    
    player.on("close", function (video) {
      console.log('Video ends here');
    });
    player.on("error", function (err) {
      console.log('Video error', err);
    });
    
    res.send(true);
  
  } else {
    console.log("./public/videos/" + file + ".mp4");
    console.log("File not exist");
    res.send(false);
  }

});

router.get('/stopVideo', function(req, res, next) {
  var status = (player != undefined && player != false) ? player.running : false;
  console.log('-------------------Lets stop the player---------------');
  console.log(status);
  if (status) {
    // Stop Omxplayer
    player.quit();
    console.log("Omxplayer stoped");
    res.send(true);
  } else {
    console.log('OMX player is not loaded.. so not stopped. :)');
    res.send(false);
  }
});

module.exports = router;
