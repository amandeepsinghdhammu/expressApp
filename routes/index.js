var express = require('express');
var omx = require('node-omxplayer');
//var omx = require('simpleomxcontrol');
var fs = require('fs');
var router = express.Router();
var player;
var productJson = {
  2447508096 :  {
     brandName : "IWC",
		 collectionName : "Pilots Mark XVIII",
		 price: "2,65,000",
     image : "iwc-iw327001.jpg",
     video : "IW327001.mp4",
     sku : "IW327001",
		 features : "Date",
		 movement : "Automatic",
		 calibre : "30110",
		 caseSize : "40 mm",
		 caseShape: "Round",
		 caseMaterial: "Steel",
		 caseBack: "Closed Case Back",
		 lugWidth: "20 mm",
		 glassMaterial: "Sapphire Crystal",
		 dialColor: "Black",
		 hands: "Alpha",
		 indexes: "Arabic Numerals",
		 strapMaterial: "Leather",
		 strapColor: "Black",
		 gender: "Men",
		 waterResistance: "60",
		 warrantyPeriod: "2 Year"	 
  },
	303848577 :  {
     brandName : "PANERAI",
		 collectionName : "Radiomir 1940",
		 price: "2,75,000",
     image : "panerai-pam00620.jpg",
     video : "PAM00620.mp4",
     sku : "PAM00620",
		 features : "Small Seconds",
		 movement : "Automatic",
		 calibre : "P 4000",
		 caseSize : "42 mm",
		 caseShape: "Round",
		 caseMaterial: "Steel",
		 caseBack: "See-through Case Back",
		 lugWidth: "22 mm",
		 glassMaterial: "Sapphire Crystal",
		 dialColor: "Black",
		 hands: "Stick",
		 indexes: "Mixed",
		 strapMaterial: "Leather",
		 strapColor: "Black",
		 gender: "Men",
		 waterResistance: "100",
		 warrantyPeriod: "2 Year"	 
  },
	2462992513 :  {
     brandName : "BAUME & MERCIER",
		 collectionName : "Clifton Club Indian Scout Edition",
     price: "2,89,000",
		 image : "baume-moa10402.jpg",
     video : "MOA10402.mp4",
     sku : "MOA10402",
		 features : "Chronograph, Date, Tachymeter",
		 movement : "Automatic",
		 caseSize : "44 mm",
		 caseShape: "Round",
		 caseMaterial: "Steel",
		 glassMaterial: "Sapphire Crystal",
		 dialColor: "Grey",
		 strapMaterial: "Calfskin",
		 strapColor: "Brown",
		 gender: "Men",
		 waterResistance: "50",
		 warrantyPeriod: "2 Year",
		 limitedEdition: "Yes"
  },
  2462992516 :  {
     brandName : "JAEGER-LECOULTRE",
		 collectionName : "Polaris",
		 price: "2,86,000",
     image : "jlc-q9008180.jpg",
     video : "Q9008180.mp4",
     sku : "Q9008180",
		 movement : "Automatic",
		 calibre : "898E/1",
		 caseSize : "41 mm",
		 caseShape: "Round",
		 caseMaterial: "Steel",
		 caseBack: "See-through Case Back",
		 glassMaterial: "Sapphire Crystal",
		 luminosity: "On Hands & Dial",
		 dialColor: "Blue",
		 hands: "Stick",
		 indexes: "Mixed",
		 strapMaterial: "Steel",
		 strapColor: "Silver",
		 claspType: "Folding Clasp",
		 gender: "Men",
		 waterResistance: "100",
		 warrantyPeriod: "2 Year"
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
  var y2 = req.params.height;
  var x2 = req.params.width;
  var x1 = 0;
  var y1 = 0;
  
  var percentage = 8;
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
