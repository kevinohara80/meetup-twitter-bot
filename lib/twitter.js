var twitter = require('ntwitter');
var colors = require('colors');

var Twitter = function(opts) {
  this.twit = new twitter({
    consumer_key: opts.consumer_key,
    consumer_secret: opts.consumer_secret,
    access_token_key: opts.access_token_key,
    access_token_secret: opts.access_token_secret
  });
}

Twitter.prototype.getFollowedNames = function(callback) {
  
  var self = this;
  var batches = [];
  var screenNames = [];
  
  function getScreenNames() {
    if(batches && batches.length > 0) {
      var batch = batches.shift().join();
      self.twit.showUser(batch, function(err, resp) {
        if(!err) {
          for(var i=0; i<resp.length; i++) {
            screenNames.push(resp[i].screen_name);
          }
          getScreenNames();
        } else {
          callback(err, resp);
        }
      });  
    } else {
      callback(null, screenNames);
    }
  }
  
  self.twit.getFriendsIds(function(err, data) {
    if(!err) {
      var index = 0;
      var counter = 0;
      for(var i=0; i<data.length; i++) {
        if(!batches[index]) batches[index] = [];
        batches[index].push(data[i]);
        counter++;
        if(counter === 50) {
          counter = 0;
          index++;
        }
      }
      getScreenNames();
    } else {
      callback(err, resp);
    }
  });
  
}

Twitter.prototype.followNames = function(names, callback) {
  
  var self = this;
  var namesToFollow = names;
  
  function follow() {
    if(namesToFollow && namesToFollow.length > 0) {
      var name = namesToFollow.shift();
      console.log('attempting to follow user: ' + name);
      self.twit.createFriendship(name, function(err, resp) {
        if(!err) {
          console.log('success');
        } else {
          console.log('error'.red + ' ' + err.message); 
        }
        follow();
      });
    } else {
      callback(null, null);
    }
  }
  
  follow();
  
}

module.exports.createConnection = function(opts) {
  return new Twitter(opts);
}