var express = require('express');
var omx = require('node-omxplayer');
var fs = require('fs');
var router = express.Router();

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
    var player = omx("./public/videos/" + file + ".mp4");
    
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

module.exports = router;
