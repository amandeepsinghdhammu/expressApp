var express = require('express');
var omx = require('node-omxplayer');
//var omx = require('simpleomxcontrol');
var fs = require('fs');
var router = express.Router();
var player;
var productJson = {
  2447508096 :  {
     name : "RADO Centrix",
     image : "/images/watch-img.jpg",
     video : "/videos/1234567890.mp4",
     videoThumb : "/images/thumb1.jpg",
     sku : "R30934712",
     price: "91,800",
     description: "From day one Rado has turned visions into concrete realities. Pushing the boundaries of material technology and continually introducing the unexpected, Rado has gone from strength to strength in the field of fine Swiss timekeeping since 1957 and has produced one revolutionary watch after another.",
     movement: {
       features : "Date",
       movement : "Quartz"
     },
     case : {
       size : "38 mm",
       material: "Steel",
       shape: "Round",
       glassMaterial: "Sapphire Crystal"
     },
     dial : {
       color: "Black" 
     },
     other:{
       gender: "Men",
       waterResistance: "30",
       warrantyPeriod: "2 Years"
     }
  },
  303848577 :  {
     name : "CELLINI MOONPHASE",
     image : "/images/m50535-0002.png",
     video : "/videos/7894561230.mp4",
     videoThumb : "/images/thumb2.jpg",  
     sku : "R30934712",
     price: "1,694,500",
     description: "The Cellini collection is a contemporary celebration of classicism and the eternal elegance of traditional timepieces, combining the best of Rolex know-how and its high standards of perfection with an approach that heightens watchmaking heritage in its most timeless form.",
     movement: {
       features : "Date",
       movement : "Perpetual, mechanical, self-winding"
     },
     case : {
       size : "39 mm",
       material: "Steel",
       shape: "Round",
       glassMaterial: "Sapphire Crystal"
     },
     dial : {
       color: "White" 
     },
     other:{
       gender: "Men",
       waterResistance: "50",
       warrantyPeriod: "2 Years"
     }
  },
  2462992513 :  {
     name : "DAY-DATE 40",
     image : "/images/m228235-0002.png",
     video : "/videos/1111111111.mp4",
     videoThumb : "/images/thumb3.jpg",
     sku : "R228235",
     price: "2,378,500",
     description: "The Rolex Day-Date made its debut in 1956. Available only in 18 ct gold or platinum, it was the first wristwatch chronometer to display the date and day of the week spelt out in full in a window on the dial. With the President bracelet, originally created specially for it, the Day-Date continues to be the watch par excellence of influential people.",
     movement: {
       features : "Date",
       movement : "Perpetual, mechanical, self-winding"
     },
     case : {
       size : "40 mm",
       material: "Steel",
       shape: "Round",
       glassMaterial: "Sapphire Crystal"
     },
     dial : {
       color: "Everose gold" 
     },
     other:{
       gender: "Men",
       waterResistance: "100",
       warrantyPeriod: "2 Years"
     }
  },
  2462992516 :  {
     name : "PEARLMASTER 34",
     image : "/images/m81318-0005.png",
     video : "/videos/2222222222.mp4",
     videoThumb : "/images/thumb3.jpg",
     sku : "R81318",
     price: "2,292,200",
     description: "From day one Rado has turned visions into concrete realities. Pushing the boundaries of material technology and continually introducing the unexpected, Rado has gone from strength to strength in the field of fine Swiss timekeeping since 1957 and has produced one revolutionary watch after another.",
     movement: {
       features : "Date",
       movement : "Perpetual, mechanical, self-winding"
     },
     case : {
       size : "34 mm",
       material: "Steel",
       shape: "Round",
       glassMaterial: "Sapphire Crystal"
     },
     dial : {
       color: "Yellow gold and diamonds" 
     },
     other:{
       gender: "Men",
       waterResistance: "30",
       warrantyPeriod: "2 Years"
     }
  }
};
    


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Ethos Home page' });
});

router.get('/singleProduct/:productId', function(req, res, next) {
  var productId = req.params.productId;
  if(productJson[productId] == undefined){
    return false;
  }	
  res.render('singleProduct', { productJson: productJson, productId: productId });
});

router.get('/twoProduct/:productId1/:productId2', function(req, res, next) {
  var productId1 = req.params.productId1;
  var productId2 = req.params.productId2;
  if(productJson[productId1] == undefined && productJson[productId2] == undefined){
    return false;
  }
  if(productJson[productId1] != undefined && productJson[productId2] == undefined){
    res.render('singleProduct', { productJson: productJson, productId: productId1 });
    return;
  }
  if(productJson[productId1] == undefined && productJson[productId2] != undefined){
    res.render('singleProduct', { productJson: productJson, productId: productId2 });
    return;
  }	
  res.render('twoProduct', { productJson: productJson, productId1: productId1, productId2: productId2 });
});

router.get('/playVideo/:videoId/:width/:height', function(req, res, next) {
  console.log(req.params);
  var file = req.params.videoId;
  var y2 = req.params.height;
  var x2 = req.params.width;
  var x1 = 0;
  var y1 = 0;
  
  var percentage = 10;
  y2 = y2 - (y2 * percentage / 100); // 68
  
  // Check If file exist=
  if (fs.existsSync("./public/videos/" + file + ".mp4")) {
    console.log("./public/videos/" + file + ".mp4");
    
    // Create an instance of the player with the source.
    player = omx("./public/videos/" + file + ".mp4", "hdmi", false, x1 + ' ' + y1 + ' ' + x2 + ' ' + y2, 'letterbox');
    
    player.on("close", function (video) {
      console.log('Video ends here');
      req.app.io.emit('player', 'stop');
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
