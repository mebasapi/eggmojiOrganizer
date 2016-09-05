(function() {
  'use strict';
  app.service('eggmojiFirebase', ['$rootScope', '$location', '$firebaseAuth', '$firebaseObject', 'creds', function EggmojiFirebase($rootScope, $location, $firebaseAuth, $firebaseObject, creds){
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

    var db = firebase.database();
    var ref = db.ref('eggmojis');

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
      $rootScope.$apply();
    }).catch(function(error) {
      console.log(error);
    });

    // firebase.auth().onAuthStateChanged(user, function(error) {
    //   console.log(error);
    // });

    eggmojiFirebase.getUser = function() {
      user = auth.currentUser;
      return user;
    };

    ref.on('value', function(snapshot) {
      eggmojiFirebase.eggmojis = snapshot.val();
      $rootScope.$emit('eggmojisUpdated');
    });

    eggmojiFirebase.addEggmoji = function(eggmojiToAdd) {
      ref.push(eggmojiToAdd);
    };

    eggmojiFirebase.deleteEggmoji = function(eggmojiId) {
      ref.child(eggmojiId).remove();
    };

    eggmojiFirebase.updateEggmoji = function(eggmojiId, eggmoji) {
      ref.child(eggmojiId).update(eggmoji);
    };
  }]);
})();
