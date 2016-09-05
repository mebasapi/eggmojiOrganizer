'use strict';

var app = angular.module('eggmojiOrganizer', [
    'ngRoute',
    'ngAnimate',
    'ngResource',
    'firebase',
    'naif.base64'
]);

app.constant('creds', {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    storageBucket: ""
});

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/', {
    templateUrl: 'components/eggmojis/eggmojis.html',
    controller: 'eggmojisCntl'
  })
  .otherwise({
    redirectTo:'/'
  });
});
