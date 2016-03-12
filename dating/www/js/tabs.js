angular.module('ionicApp', ['ionic'])

.config(function($stateProvider, $urlRouterProvider) {

  console.log("bullbulllllllllll");
  $stateProvider
    .state('tabs', {
      url: "/tab",
      abstract: true,
      templateUrl: "templates/tabs.html"
    })
    .state('tabs.basicInfo', {
      url: "/basicInfo",
      views: {
        'home-tab': {
          templateUrl: "templates/basicInfo.html",
          controller: 'basicInfoCtrl'
        }
      }
    })
    .state('tabs.interests', {
      url: "/interests",
      views: {
        'interests': {
          templateUrl: "templates/interests.html"
        }
      }
    })
    .state('tabs.lookingFor', {
      url: "/lookingfor",
      views: {
        'lookingFor': {
          templateUrl: "templates/lookingFor.html"
        }
      }
    })

   $urlRouterProvider.otherwise("/tab/basicInfo");

})

.controller('basicInfoCtrl', function(){
  console.log("got in");

})