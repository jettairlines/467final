var fs = require ('fs');
var util = require('util');
var https = require('https');
var request = require('request');

module.exports = function(Flickr, flickrOptions){
	return new flickFun(Flickr, flickrOptions);
}

var counter = 5;

var flickFun = function (Flickr, flickrOptions){
	this.api_key = "9764e32563e3f4fa44b62976d85b61d1"; 
	this.Flickr = Flickr
	this.flickrOptions = flickrOptions

}

/**
 * Search through flickr
 * @param  {[type]} searchOptions [description]
 * @param  {[type]} doneCallback  [optional callback for when photos are done downloading]
 * @return {[type]}               [description]
 */
flickFun.prototype.searchFlickr = function(searchOptions, doneCallback){
	this.Flickr.tokenOnly(this.flickrOptions, function(error, flickr) {

	   flickr.photos.search(searchOptions, function(err, result) {
	        if(err) { throw new Error(err); }
	      
	        var urls = result.photos.photo.map(getUrlFromPhoto);
  	
  			console.log("downloading "+urls.length+" pictures");
	        counter = urls.length;		//However many pictures you need to download before considered finished
	        urls.forEach(function(photo, index){
	        	downloadPhoto(photo, index, urls, doneCallback); 
	        });    

	        /** For debugging purposes */
	        fs.writeFile("results", JSON.stringify(result, null, 2));    
	        fs.writeFile("links", JSON.stringify(urls, null, 2));
    });
})};

function getUrlFromPhoto(photo){
	// https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg
	var farm_id 	= photo.farm
	var server_id 	= photo.server
	var id 			= photo.id
	var secret 		= photo.secret
	var urlString 	= "https://farm"+farm_id+".staticflickr.com/"+server_id+"/"+id+"_"+secret+"_z.jpg"

	return urlString;
}

function downloadPhoto(url, urlIndex, allUrls, callback){
	var file = fs.createWriteStream(__dirname +"/public/images/pic"+urlIndex+".jpg");
	var request = https.get(url, function(response) {   
		response.pipe(file);
		response.on("finish", function	(){console.log("finished")});  
		response.on("close", function(){console.log("closed "+urlIndex)});
		
		counter = counter - 1; 
		console.log(counter);

		if(counter == 0 && callback)
			callback(allUrls);
	});

}