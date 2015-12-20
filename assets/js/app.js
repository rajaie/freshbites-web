var myApp = angular.module('myApp', ['ui.router']);

// ******
// Routes
// ******
myApp.config(function ($stateProvider, $locationProvider, $urlRouterProvider) {

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
            menus: function(menusFactory){
                return menusFactory.getAllMenus();
            }
        },
        controller: 'MenusController',
    })
    .state('menus.list', {
        url: "",
        templateUrl: "views/menus.list.html",
    })
    .state('menus.list.add', {
        url: "/add",
        templateUrl: "views/menus.list.add",
        controller: 'MenusController',
    })
    .state('menus.list.detail', {
        url: "/:id",
        templateUrl: "views/menus.list.detail.html",
        controller: function ($scope, $stateParams) {
            menuId = $stateParams.id;
            menus = $scope.menus;
            for (var i = 0; i < menus.length; i++) {
                if (menus[i].id == menuId) {
                    $scope.menu = menus[i];
                    break;
                }
            }
        }
    })
    .state('messages', {
      url: "/messages",
      templateUrl: "views/messages.html",
      controller: 'SimpleController',
    });

    $urlRouterProvider.otherwise("/");
});


