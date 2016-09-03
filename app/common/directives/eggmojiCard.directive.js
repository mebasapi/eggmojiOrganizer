(function() {
  'use strict';
  app.directive('eggmojiCard', ['eggmojiFirebase', function(eggmojiFirebase) {
    return {
      restrict: 'E',
      scope: {
        eggmoji: '=eggmoji',
        id: '=id',
        pageStatus: '=status'
      },
      controller: function($scope, $element, $attrs, $rootScope) {
        $scope.selectEggmoji = function(eggmojiId) {
          $rootScope.selectedEggmojiId = eggmojiId;
          $rootScope.selectedEggmoji = {};
          $rootScope.selectedEggmoji = $scope.eggmoji;
          $rootScope.$broadcast('eggmojiSelected');
        };
      },
      templateUrl: 'common/views/eggmojiCard.html'
    };
  }]);
})();
