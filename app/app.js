'use strict';

var app = angular.module('eggmojiOrganizer', [
    'ngRoute',
    'ngAnimate',
    'ngResource',
    'firebase',
    'naif.base64'
]);

app.config(function($routeProvider, $locationProvider) {
  $routeProvider
  .when('/eggmojis', {
    templateUrl: 'components/eggmojis/eggmojis.html',
    controller: 'eggmojisCntl'
  })
  .otherwise({
    redirectTo:'/eggmojis'
  });
});
