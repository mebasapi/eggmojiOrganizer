(function() {
  'use strict';
  app.controller('eggmojisCntl', ['$scope', '$rootScope', '$timeout', 'eggmojiFirebase', function($scope, $rootScope, $timeout, eggmojiFirebase) {
    $scope.login = function() {
      $scope.loggingIn = true;

      eggmojiFirebase.login();
      $scope.user = eggmojiFirebase.getUser();
    };

    $scope.newEggmojiClicked = function() {
      $scope.selectedEggmojiId = 'new';
      $scope.selectedEggmoji = {
        'title': 'New Eggmoji',
        'description': '',
        'pictures': [],
        'currentPicture': -1,
        'status': 'unstarted'
      };
      $scope.showSaveButton = true;
    };

    $scope.addEggmoji = function(eggmojiToAdd) {
      eggmojiFirebase.addEggmoji(eggmojiToAdd);
      $scope.showSaveButton = false;

      $scope.clearSelectedEggmoji();
    };

    $scope.deleteEggmoji = function(eggmojiId) {
      eggmojiFirebase.deleteEggmoji(eggmojiId);
      $scope.clearSelectedEggmoji();
    };

    $scope.updateEggmoji = function(eggmojiId, eggmoji){
      if(!$scope.showSaveButton){
        eggmojiFirebase.updateEggmoji(eggmojiId, eggmoji);
      }
    };

    $scope.updateStatus = function(newStatus) {
      $scope.selectedEggmoji.status = newStatus;
      eggmojiFirebase.updateEggmoji($scope.selectedEggmojiId, $scope.selectedEggmoji);
      $scope.pageStatus = newStatus;
    };

    $scope.updatePageStatus = function(pageStatus) {
      $scope.pageStatus = pageStatus;
      $scope.selectedEggmojiId = '';
    };

    $scope.clearSelectedEggmoji = function() {
      $scope.selectedEggmoji = {};
      $scope.selectedEggmojiId = '';
    };

    $scope.addPictureToSelectedEggmoji = function(e, fileObjects) {
      if( typeof $scope.selectedEggmoji === 'undefined' )
        $scope.selectedEggmoji.pictures = [];

      var toAdd = 'data:' + fileObjects[0].filetype + ';base64,' + fileObjects[0].base64;
      $scope.selectedEggmoji.pictures.push(toAdd);
      $scope.selectedEggmoji.currentPicture = $scope.selectedEggmoji.pictures.length - 1;
      $scope.updateEggmoji($scope.selectedEggmojiId, $scope.selectedEggmoji);
    };

    $scope.pictureClicked = function(index) {
      $scope.overlayPictureIndex = index;
      $scope.overlayPictureSrc = $scope.selectedEggmoji.pictures[index];
      $scope.viewOverlayPicture = true;
    };

    $scope.overlayDeletePicture = function() {
      if( $scope.selectedEggmoji.currentPicture > $scope.overlayPictureIndex ){
        $scope.selectedEggmoji.currentPicture--;
      }
      $scope.selectedEggmoji.pictures.splice($scope.overlayPictureIndex, 1);

      if( $scope.selectedEggmoji.currentPicture === $scope.overlayPictureIndex){
        $scope.selectedEggmoji.currentPicture = $scope.selectedEggmoji.pictures.length - 1;
      }

      $scope.updateEggmoji($scope.selectedEggmojiId, $scope.selectedEggmoji);

      $scope.viewOverlayPicture = false;

      $scope.$apply();
    };

    $scope.overlayMakeFeaturedPicture = function() {
      $scope.selectedEggmoji.currentPicture = $scope.overlayPictureIndex;
      $scope.updateEggmoji($scope.selectedEggmojiId, $scope.selectedEggmoji);
      $scope.viewOverlayPicture = false;
    };

    $scope.overlayClicked = function() {
      $scope.viewOverlayPicture = false;
    };

    $rootScope.$on('eggmojisUpdated', function() {
      $scope.eggmojis = eggmojiFirebase.eggmojis;
      $timeout(function() {
        $scope.$apply();
      }, 0);
    });

    $rootScope.$on('eggmojiSelected', function() {
      $scope.selectedEggmojiId = $rootScope.selectedEggmojiId;
      $scope.selectedEggmoji = $rootScope.selectedEggmoji;
    });

    $rootScope.$on('userUpdated', function() {
      $scope.user = eggmojiFirebase.getUser();
    });

    function init() {
      $scope.user = eggmojiFirebase.getUser();

      $scope.pageStatus = 'unstarted';
      $scope.selectedEggmojiId = '';
      $scope.imageToUpload = {};
      $scope.addingEggmoji = false;
      $scope.viewOverlayPicture = false;
      $scope.eggmojis = eggmojiFirebase.eggmojis;
    }

    init();
  }]);
})();
