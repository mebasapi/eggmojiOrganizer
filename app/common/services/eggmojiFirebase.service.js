(function() {
  'use strict';
  app.service('eggmojiFirebase', ['$rootScope', '$location', '$firebaseAuth', '$firebaseObject', function EggmojiFirebase($rootScope, $location, $firebaseAuth, $firebaseObject){
    var eggmojiFirebase = this;

    var config = {
      apiKey: "",
      authDomain: "",
      databaseURL: "",
      storageBucket: ""
    };

    firebase.initializeApp(config);
    var auth = firebase.auth();

    var db = firebase.database();
    var ref = db.ref('eggmojis');

    eggmojiFirebase.login = function() {
      var provider = new firebase.auth.GoogleAuthProvider();
      if( auth.currentUser === null ){
        auth.signInWithRedirect(provider);
      } else {
        $location.path('/eggmojis');
      }
    };

    firebase.auth().getRedirectResult().then(function(result) {
      $location.path('/eggmojis');
    }).catch(function(error) {
      console.log(error);
    });

    eggmojiFirebase.getUser = function() {
      console.log(auth.currentUser);
      return auth.currentUser;
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
