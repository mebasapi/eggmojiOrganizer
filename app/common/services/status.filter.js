(function() {
  'use strict';
  app.filter('status', function() {
    return function(eggmojis, status) {
      var toReturn = [];

      angular.forEach(eggmojis, function(eggmoji) {
        if(eggmoji.status === status) {
          toReturn.push(eggmoji);
        }
      });

      return toReturn;
    };
  }).filter('reverse', function() {
    return function(items) {
      console.log(items);
      return items.slice().reverse();
    };
  });
})();
