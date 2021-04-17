var FLICKR_API_KEY="b678e9cf491cb4d970664f5c243e6b3a";
var Flickr = require('flickr-sdk');
var flickr = new Flickr(FLICKR_API_KEY);

module.exports = class ImagePull {

    // Find images
    // Uses flickr-sdk api

    async getImageLinks(searchText){
        let imageArray=await this.searchImage(searchText);
       
        let linksArray=new Array();
        for (var i=0;i<imageArray.length;i++){
            var id=imageArray[i].id;
            var secret=imageArray[i].secret;
            var server=imageArray[i].server;
            var farm=imageArray[i].farm;
            linksArray.push(this.constructURL(farm,server,id,secret));
        }

        return linksArray;
    }
    async searchImage(searchText) {
        return new Promise((resolve, reject) => {
            flickr.photos.search(
                {
                text: searchText,
                sort: 'relevance'
            }
            ).then(function (res) {
                //console.log(res.body.photos.photo);
                return resolve(res.body.photos.photo);
            }).catch(function (err) {
                console.error('Error', err);
                return reject(null);
              });;

        });
    }

    constructURL(farm,server,id,secret){
        return "https://farm"+farm+".staticflickr.com/"+server+"/"+id+"_"+secret+".jpg";
        //return "https://live.staticflickr.com/"+server+"/"+id+"_"+secret+".jpg";
    }
}