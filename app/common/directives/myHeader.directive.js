(function() {
    'use strict';
    app.directive('myHeader', ['$location', function($location) {
        return {
            restrict: 'E',
            templateUrl: 'common/views/myHeader.html'
        };
    }]);
})();
