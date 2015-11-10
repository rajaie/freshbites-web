var myApp = angular.module('myApp', ['ui.router']);


// ******
// Routes
// ******
myApp.config(function ($stateProvider, $locationProvider, $urlRouterProvider) {

    $locationProvider.html5Mode({
        enabled: true
    });

    $urlRouterProvider.otherwise("/");

    $stateProvider
    .state('default', {
      url: "/",
      templateUrl: "views/home.html",
      controller: 'SimpleController',
    })
    .state('register', {
      url: "/register",
      templateUrl: "views/register.html",
      controller: 'SimpleController',
    })
    .state('login', {
      url: "/login",
      templateUrl: "views/login.html",
      controller: 'SimpleController',
    })
    .state('orders', {
      url: "/orders",
      templateUrl: "views/orders.html",
      controller: 'SimpleController',
    })
    .state('payments', {
      url: "/payments",
      templateUrl: "views/payments.html",
      controller: 'SimpleController',
    })
    .state('profile', {
      url: "/profile",
      templateUrl: "views/profile.html",
      controller: 'SimpleController',
    })
    .state('profile.edit', {
      url: "/edit",
      templateUrl: "views/profile.edit.html",
      controller: 'SimpleController',
    })
    .state('menus', {
      url: "/menus",
      templateUrl: "views/menus.html",
      controller: 'SimpleController',
    })
    .state('menus.detail', {
      url: "/detail",
      templateUrl: "views/menus.detail.html",
      controller: 'SimpleController',
    });
});


// ****************
// SimpleController
// ****************
myApp.controller('SimpleController', function($scope) {
    $scope.customers = [
        {name:'Jani',city:'Norway'},
        {name:'Hege',city:'Aroba'},
        {name:'Kai',city:'Denmark'}
    ];

    $scope.register = function() {
        newCustomer = {}
        newCustomer.name = $scope.newName;
        newCustomer.city = $scope.newCity;
        $scope.customers.push(newCustomer);
    };
});