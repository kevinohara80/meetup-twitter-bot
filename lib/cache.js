module.exports = function() {
  var tids = {}
  var mids = {}
  this.diff = function() {
    var results = [];
    for(var key in mids) {
      if(!tids[key]) results.push(key);
    }
    return results;
  }
  this.add = function(type, id) {
    id = id.trim().toLowerCase();
    if(type === 'twitter') {
      tids[id] = true;
    } else if(type === 'meetup') {
      mids[id] = true;
    }
  }
  this.reset = function() {
    tids = {}
    mids = {}
  }
}