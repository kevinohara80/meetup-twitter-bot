var argv = require('optimist').argv
var colors = require('colors');
var meetup = require('./lib/meetup');
var twitter = require('./lib/twitter');
var Cache = require('./lib/cache');
var async = require('async');

var pollMinutes = (argv.p) ? argv.p : 60;

var twit = new twitter.createConnection({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var meet = meetup.createConnection(process.env.MEETUP_API_KEY);

function run() {
  var cache = new Cache();
  console.log('contacting meetup.com');
  console.log('requesting twitterIds for group: ' + process.env.MEETUP_GROUP_NAME);
  meet.getMemberTwitterIds(process.env.MEETUP_GROUP_NAME, function(err, resp) {
    if(!err) {
      console.log('retreived ' + resp.length + ' twitter ids from meetup');
      for(var i=0; i<resp.length; i++) {
        cache.add('meetup', resp[i]);
      }
      console.log('contacting twitter.com');
      twit.getFollowedNames(function(err, resp) {
        if(!err) {
          console.log('retreived ' + resp.length + ' twitter ids from twitter');
          for(var i=0; i<resp.length; i++) {
            cache.add('twitter', resp[i]);
          }
          var diff = cache.diff();
          if(diff.length > 0) {
            console.log('attempting to follow ' + diff.length + ' twitter names (' + diff.join() + ')');
            twit.followNames(diff, function(err, resp) {
              if(!err) {
                console.log('done!')
              } else {
                console.log('error'.red + ' ' + err.message); 
              }
            });
          } else {
            console.log('nobody to follow');
          }
        } else {
          console.log('error'.red + ' ' + err.message); 
          console.log(err.message);
        }
      });
    } else { 
      console.log('error'.red + ' ' + err.message); 
    }
  });
}

var poll = setInterval(run, pollMinutes * 60000);

run();


