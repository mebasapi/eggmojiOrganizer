(function() {
    'use strict';
    app.service('eggmojiFirebase', ['$rootScope', '$firebaseAuth', '$firebaseObject', function EggmojiFirebase($rootScope, $firebaseAuth, $firebaseObject){
        var eggmojiFirebase = this;

        var config = {
            apiKey: "",
            authDomain: "",
            databaseURL: "",
            storageBucket: ""
        };

        firebase.initializeApp(config);
        var auth = firebase.auth();

        var provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).then(function(result) {
            var uid = result.user.uid;
        }).catch(function(error) {
            // An error occurred
        });

        var db = firebase.database();
        var ref = db.ref('eggmojis');

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
