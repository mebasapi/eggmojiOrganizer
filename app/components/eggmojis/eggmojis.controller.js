(function() {
  'use strict';
  app.controller('eggmojisCntl', ['$scope', '$rootScope', '$timeout', '$window', 'eggmojiFirebase', function($scope, $rootScope, $timeout, $window, eggmojiFirebase) {

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
        console.log('calling' + eggmojiId);
        eggmojiFirebase.updateEggmoji(eggmojiId, eggmoji);
      }
    };


    $scope.updateStatus = function(newStatus) {
      $scope.selectedEggmoji.status = newStatus;
      $scope.updateEggmoji($scope.selectedEggmojiId, $scope.selectedEggmoji);
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
        $scope.selectedEggmoji = {};

      if( typeof $scope.selectedEggmoji.pictures === 'undefined' )
        $scope.selectedEggmoji.pictures = [];

      var toAdd = 'data:' + fileObjects[0].filetype + ';base64,' + fileObjects[0].base64;

      eggmojiFirebase.addPicture($scope.selectedEggmojiId, $scope.selectedEggmoji, toAdd);
      $scope.updateEggmoji($scope.selectedEggmojiId, $scope.selectedEggmoji);
    };


    $scope.pictureClicked = function(picture) {
      $scope.overlayPictureSrc = picture;
      $scope.viewOverlayPicture = true;
    };


    $scope.overlayDeletePicture = function() {
      var indexToRemove = $scope.selectedEggmoji.pictures.indexOf($scope.overlayPictureSrc);
      $scope.selectedEggmoji.pictures.splice(indexToRemove, 1);

      if( $scope.selectedEggmoji.currentPicture === $scope.overlayPictureSrc){
        if( $scope.selectedEggmoji.pictures.length === 0 ){
          $scope.selectedEggmoji.currentPicture = -1;
        } else {
          $scope.selectedEggmoji.currentPicture = $scope.selectedEggmoji.pictures[$scope.selectedEggmoji.pictures.length - 1];
        }
      }

      $scope.updateEggmoji($scope.selectedEggmojiId, $scope.selectedEggmoji);
      $scope.viewOverlayPicture = false;
    };


    $scope.overlayMakeFeaturedPicture = function() {
      $scope.selectedEggmoji.currentPicture = $scope.overlayPictureSrc;
      $scope.updateEggmoji($scope.selectedEggmojiId, $scope.selectedEggmoji);
      $scope.viewOverlayPicture = false;
    };


    $scope.overlayClicked = function() {
      $scope.overlayPictureSrc = "";
      $scope.viewOverlayPicture = false;
    };


    $scope.updateEggmojiPictures = function(eggmojiToUpdateId, eggmoji){
      eggmojiFirebase.updatePictures(eggmojiToUpdateId, eggmoji);
    };


    $rootScope.$on('eggmojisUpdated', function() {
      console.log('eggmojis-updated-controller');
      $scope.eggmojis = eggmojiFirebase.eggmojis;
      $timeout(function() {
        $scope.$apply();
      }, 0);
    });


    $rootScope.$on('eggmojiSelected', function() {
      $window.scrollTo(0, 80);

      $scope.showSaveButton = false;
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
