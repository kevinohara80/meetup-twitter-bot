var request = require('request');

var Meetup = function(key) {
  this.apiKey = (key) ? key : null;
}

Meetup.prototype.getMemberTwitterIds = function(group, callback) {
  
  var self = this;
  var totalMemberCount;
  var members = [];
  
  function getMemberPage(offset) {
    
    var opts = {
      uri: 'https://api.meetup.com/2/members',
      method: 'GET',
      qs: {
        key: self.apiKey,
        sign: 'true',
        group_urlname: group,
        page: 20
      }
    }
    
    opts.qs.offset = (offset) ? offset : 0;
    
    request(opts, function(err, res, body) {
      if(!err) {
        body = JSON.parse(body);
        for(var i=0; i<body.results.length; i++) {
          members.push(body.results[i]);
        }
        if(body.meta.total_count > members.length) {
          getMemberPage(offset + 1);
        } else {
          var results = [];
          for(var i=0; i<members.length; i++) {
            var mem = members[i];
            if(mem.other_services && mem.other_services.twitter && mem.other_services.twitter.identifier) {
              results.push(mem.other_services.twitter.identifier.substring(1));
            }
          }
          callback(null, results);
        }
      } else {
        callback(err, null);
      }
    });
    
  }
  
  getMemberPage(0);
  
}

module.exports.createConnection = function(opts) {
  return new Meetup(opts);
}