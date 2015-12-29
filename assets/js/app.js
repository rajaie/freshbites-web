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
    })
    .state('register', {
        url: "/register",
        templateUrl: "views/register.html",
        controller: 'SessionController',
    })
    .state('login', {
        url: "/login",
        templateUrl: "views/login.html",
        controller: 'SessionController',
    })
    .state('orders', {
        url: "/orders",
        templateUrl: "views/orders.html",
    })
    .state('payments', {
        url: "/payments",
        templateUrl: "views/payments.html",
    })
    .state('profile', {
        url: "/profile",
        templateUrl: "views/profile.html",
    })
    .state('profile.edit', {
        url: "/edit",
        templateUrl: "views/profile.edit.html",
    })
    .state('messages', {
      url: "/messages",
      templateUrl: "views/messages.html",
    })
    // ********** Menus **********
    .state('menus', {
        url: "/menus",
        abstract: true,
        templateUrl: "views/menus.html",
        resolve: {
            menuList: function(menusFactory){
                return menusFactory.getMenuList();
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
    .state('menus.list.edit', {
        url: "/edit/:id",
        templateUrl: "views/menus.list.edit.html",
        controller: 'MenusController'
    });

    $urlRouterProvider.otherwise("/");
});


