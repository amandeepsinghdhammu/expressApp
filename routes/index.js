var express = require('express');
var omx = require('node-omxplayer');
//var omx = require('simpleomxcontrol');
var fs = require('fs');
var router = express.Router();
var player;
var productJson = {
  2447508096 :  {
     name : "RADO Centrix",
     image : "watch-img.jpg",
     video : "Rado-Centrix-Men's-watch-with-8-diamonds.mp4",
     videoThumb : "thumb1.jpg",
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
     name : "OMEGA De Ville Prestige",
     image : "omega-prestige.jpg",
     video : "OMEGA-from-a-movement-to-a-brand-name.mp4",
     videoThumb : "maxresdefault.jpg",  
     sku : "424.55.37.20.52.002",
     price: "18,06,600",
     description: "Since its launch in 1967, the De Ville Collection by Omega has been synonymous with modern elegance and fashion. This collection has been a major example of the avant-garde watch making technology used by the brand. The first watch to be equipped with the exclusive Omega Co-Axial escapement in 1999 was a De Ville.",
     movement: {
       features : "Date",
       movement : "Automatic"
     },
     case : {
       size : "36.8 mm",
       material: "Yellow Gold",
       shape: "Round",
       glassMaterial: "Sapphire Crystal"
     },
     dial : {
       color: "Silver" 
     },
     other:{
       gender: "Men",
       waterResistance: "30",
       warrantyPeriod: "5 Years"
     }
  },
  2462992513 :  {
     name : "OMEGA De Ville Prestige",
     image : "omega.jpg",
     video : "OMEGA-from-a-movement-to-a-brand-name.mp4",
     videoThumb : "maxresdefault.jpg",
     sku : "424.13.33.20.53.001",
     price: "2,11,500",
     description: "Since its launch in 1967, the De Ville Collection by Omega has been synonymous with modern elegance and fashion. This collection has been a major example of the avant-garde watch making technology used by the brand. The first watch to be equipped with the exclusive Omega Co-Axial escapement in 1999 was a De Ville.",
     movement: {
       features : "Date",
       movement : "Automatic"
     },
     case : {
       size : "32.7 mm",
       material: "Steel",
       shape: "Round",
       glassMaterial: "Sapphire Crystal"
     },
     dial : {
       color: "Blue" 
     },
     other:{
       gender: "Women",
       waterResistance: "30",
       warrantyPeriod: "5 Years"
     }
  },
  2462992516 :  {
     name : "ORIS Aviation Artelier Calibre 111",
     image : "oris.jpg",
     video : "Oris-110th-Year-Celebration.mp4",
     videoThumb : "oris-thumb.jpg",
     sku : "01 111 7700 4065-SET 1 23 87FC",
     price: "4,16,900",
     description: "The machinery inside a watch that keeps things ticking is called the movement or a calibre. A synonym of size, the word ‘calibre’, first used as a watchmaking term in 1715, originally referred to the build of a watch movement—the layout, dimensions, shape and size of the wheels, barrels, bridges and so on.",
     movement: {
       features : "Date, Power Reserve Indicator, Small Seconds",
       movement : "Manual Winding"
     },
     case : {
       size : "43 mm",
       material: "Steel",
       shape: "Round",
       glassMaterial: "Sapphire Crystal"
     },
     dial : {
       color: "Blue" 
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

router.get('/playVideo/:videoName/:width/:height', function(req, res, next) {
  console.log(req.params);
  var file = req.params.videoName;
  var y2 = 1080;//req.params.height;
  var x2 = 1920; //req.params.width;
  var x1 = 0;
  var y1 = 0;
  
  var percentage = 10;
  y2 = y2 - (y2 * percentage / 100); // 68
  
  // Check If file exist=
  if (fs.existsSync("./public/videos/" + file)) {
    console.log("./public/videos/" + file);
    
    // Create an instance of the player with the source.
    player = omx("./public/videos/" + file, "hdmi", false, x1 + ' ' + y1 + ' ' + x2 + ' ' + y2, 'letterbox');
    
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
