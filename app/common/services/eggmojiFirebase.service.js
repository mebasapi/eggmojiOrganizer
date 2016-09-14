(function() {
  'use strict';
  app.service('eggmojiFirebase', ['$rootScope', '$location', '$firebaseAuth', '$firebaseObject', '$firebaseArray', 'creds', function EggmojiFirebase($rootScope, $location, $firebaseAuth, $firebaseObject, $firebaseArray, creds){
    var eggmojiFirebase = this;

    var config = {
      apiKey: creds.apiKey,
      authDomain: creds.authDomain,
      databaseURL: creds.databaseURL,
      storageBucket: creds.storageBucket
    };

    var user = {};
    firebase.initializeApp(config);
    var auth = firebase.auth();

    var storageRef = firebase.storage().ref();
    var db = firebase.database();
    var ref = db.ref('eggmojis');
    eggmojiFirebase.eggmojis = $firebaseArray(ref);
    eggmojiFirebase.eggmojis.$loaded()
    .then(function(x){
      console.log(x);
    });

    eggmojiFirebase.login = function() {
      var provider = new firebase.auth.GoogleAuthProvider();
      if( user === null ){
        auth.signInWithRedirect(provider);
      } else {
        $location.path('/');
      }
    };


    firebase.auth().getRedirectResult().then(function(result) {
      user = auth.currentUser;
      $rootScope.$emit('userUpdated');
    }).catch(function(error) {
      console.log(error);
    });


    eggmojiFirebase.getUser = function() {
      user = auth.currentUser;
      return user;
    };


    eggmojiFirebase.addEggmoji = function(eggmojiToAdd) {
      var pictures = eggmojiToAdd.pictures;
      eggmojiToAdd.pictures = [];
      eggmojiToAdd.currentPicture = "";

      eggmojiFirebase.eggmojis.$add(eggmojiToAdd)
      .then(function(ref){
        angular.forEach(pictures, function(picture){
          eggmojiFirebase.addPicture(ref.key, eggmojiToAdd, picture);
        });
      });
    };


    eggmojiFirebase.deleteEggmoji = function(eggmojiId) {
      eggmojiFirebase.eggmojis.$remove(
        eggmojiFirebase.eggmojis.$indexFor(eggmojiId));
    };


    eggmojiFirebase.updateEggmoji = function(eggmojiId, eggmoji) {
      var indexToSave = eggmojiFirebase.eggmojis.$indexFor(eggmojiId);
      eggmojiFirebase.eggmojis.$save(indexToSave);
    };


    eggmojiFirebase.addPicture = function(eggmojiId, eggmoji, picture) {
      if( eggmojiId === 'new' ){
        eggmoji.pictures.push(picture);
        eggmoji.currentPicture = picture;
      } else {
        var currentPath = 'images/' + eggmojiId + '/' + Date.now();
        storageRef.child( currentPath ).put( dataURItoBlob( picture ) )
        .on(firebase.storage.TaskEvent.STATE_CHANGED, null, null,
          function() {
            storageRef.child( currentPath ).getDownloadURL()
            .then( function(data) {
              eggmoji.pictures.push(data);
              eggmoji.currentPicture = data;

              eggmojiFirebase.updateEggmoji(eggmojiId, eggmoji);
            });
          }
        );
      }
    };


    eggmojiFirebase.updatePictures = function(eggmojiId, eggmoji) {
      angular.forEach(eggmoji.pictures, function(picture, index) {
        var currentPath = 'images/' + eggmojiId + '/' + Date.now();

        storageRef.child( currentPath ).put( dataURItoBlob( picture ) )
        .on(firebase.storage.TaskEvent.STATE_CHANGED, null, null,
          function() {
            storageRef.child( currentPath ).getDownloadURL()
            .then( function(data) {
              eggmoji.pictures[index] = data;
              eggmoji.currentPicture = data;

              eggmojiFirebase.updateEggmoji(eggmojiId, eggmoji);
            });
          }
        );
      });
    };


    function dataURItoBlob(dataURI) {
        // convert base64/URLEncoded data component to raw binary data held in a string
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to a typed array
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], {type:mimeString});
    }
  }]);
})();
