var myApp = angular.module('myApp', ['ui.router']);

myApp.config(function ($stateProvider, $locationProvider, $urlRouterProvider) {

    Parse.initialize("TDDsVhxFqXCHbzAcpxHiIhUuhFTUfCvIZONdTHfY", "AMWekC7CBBsD920ROCv113qrQ1bGSjdHi0QjBfme");

    $locationProvider.html5Mode({
        enabled: true
    });

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
    // ********** Menus **********
    .state('menus', {
        url: "/menus",
        abstract: true,
        templateUrl: "views/menus.html",
        resolve: {
            loadedMenus: function(menusFactory){
                return menusFactory.getAllMenus();
            }
        },
        controller: 'MenusController',
    })
    .state('menus.list', {
        url: "",
        templateUrl: "views/menus.list.html",
        controller: 'MenusController',
    })
    .state('menus.list.add', {
        url: "/add",
        templateUrl: "views/menus.list.add.html",
        controller: 'MenusController',
    })
    .state('menus.list.detail', {
        url: "/:id",
        templateUrl: "views/menus.list.detail.html",
        controller: 'MenusController'
    })
    .state('messages', {
      url: "/messages",
      templateUrl: "views/messages.html",
      controller: 'SimpleController',
    });

    $urlRouterProvider.otherwise("/");
});


