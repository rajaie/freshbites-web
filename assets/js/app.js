var myApp = angular.module('myApp', ['ui.router', 'angular.filter', 'ngAnimate', 'toastr']);

myApp.config(function($stateProvider, $locationProvider, $urlRouterProvider) {

    Parse.initialize("KxAs5Ob7jKiAn78k83cjllUv4BRxUFPJu0ktHZKl", "EK8a4jmt5ybAuHKTn24WVsdSeSKUeSnbqLJMH4gj");

    $locationProvider.html5Mode({
        enabled: true
    });
    $stateProvider
        .state('site', {
            abstract: true,
            url: "/",
            template: '<ui-view/>',
            controller: 'SiteController'
        })
        // ********** Home ***********
        // ***************************
        .state('site.home', {
            url: "",
            templateUrl: "views/home.html",
        })
        // ********** Reigster **********
        // ******************************
        .state('site.register', {
            url: "register",
            templateUrl: "views/register.html",
            controller: 'SessionController',
            resolve: {
                auth: function(authorizationFactory) {
                    return authorizationFactory.checkUnauthorized();
                }
            },
        })
        // ********** Login **********
        // ***************************
        .state('site.login', {
            url: "login",
            templateUrl: "views/login.html",
            controller: 'SessionController',
            resolve: {
                auth: function(authorizationFactory) {
                    return authorizationFactory.checkUnauthorized();
                }
            },
        })
        // ********** Orders **********
        // ****************************
        .state('site.orders', {
            url: "orders",
            templateUrl: "views/orders.html",
            resolve: {
                auth: function(authorizationFactory) {
                    return authorizationFactory.checkAuthorized();
                }
            },
            controller: 'OrdersController',
        })
        // ********** Payments **********
        // ******************************
        .state('site.payments', {
            url: "payments",
            templateUrl: "views/payments.html",
            resolve: {
                auth: function(authorizationFactory) {
                    return authorizationFactory.checkAuthorized();
                }
            },
        })
        // ********** Profile **********
        // *****************************
        .state('site.profile', {
            url: "profile",
            templateUrl: "views/profile.html",
            resolve: {
                auth: function(authorizationFactory) {
                    return authorizationFactory.checkAuthorized();
                }
            },
            controller: 'SessionController',
        })
        .state('site.profile.edit', {
            url: "edit",
            templateUrl: "views/profile.edit.html",
        })
        // ********** Messages **********
        // ******************************
        .state('site.messages', {
            url: "messages",
            abstract: true,
            templateUrl: "views/messages.html",
            resolve: {
                auth: function(authorizationFactory) {
                    return authorizationFactory.checkAuthorized();
                }
            },
        })
        .state('site.messages.list', {
            url: "",
            templateUrl: "views/messages.list.html",
            controller: 'MessagesController',
        })
        .state('site.messages.list.detail', {
            url: "/:customer",
            templateUrl: "views/messages.list.detail.html",
            controller: 'MessagesController',
        })
        // ********** Menus **********
        // ***************************
        .state('site.menus', {
            url: "menus",
            abstract: true,
            templateUrl: "views/menus.html",
            resolve: {
                auth: function(authorizationFactory) {
                    return authorizationFactory.checkAuthorized();
                }
            },
            controller: 'MenusController',
        })
        .state('site.menus.list', {
            url: "",
            templateUrl: "views/menus.list.html",
            controller: 'MenusController',
        })
        .state('site.menus.list.add', {
            url: "/add",
            templateUrl: "views/menus.list.add.html",
            controller: 'MenusController',
        })
        .state('site.menus.list.detail', {
            url: "/:id",
            templateUrl: "views/menus.list.detail.html",
            controller: 'MenusController'
        })
        .state('site.menus.list.edit', {
            url: "/edit/:id",
            templateUrl: "views/menus.list.edit.html",
            controller: 'MenusController'
        })
        // ********** Reviews **********
        // *****************************
        .state('site.reviews', {
            url: "reviews",
            templateUrl: "views/reviews.html",
            resolve: {
                auth: function(authorizationFactory) {
                    return authorizationFactory.checkAuthorized();
                }
            },
            controller: 'ReviewsController',
        })
        ;

    $urlRouterProvider.otherwise("/");
});
