myApp.controller('SiteController', function($scope, $rootScope, $state, authorizationFactory, $location) {

    $rootScope.currentUser = authorizationFactory.getCurrentUser();
    $rootScope.logout = function() {
        Parse.User.logOut().then(function() {
            console.log("Logged out successfully");
            $rootScope.currentUser = authorizationFactory.getCurrentUser();
            $state.go('site.home');
            $scope.$apply();
        }, function(error) {
            console.log("Failed to log out. Code: " + error.code + ". Message: " + error.message);
        });
    }
});

// ****************
// OrdersController
// ****************
myApp.controller('OrdersController', function($scope, $rootScope, $state, ordersFactory, $location) {
    ordersFactory.getOrdersWithMenuNames().then(function(orders) {
        $scope.orders = orders;
        $scope.$apply();
    }, function(error) {
        console.log("Failed to get orders list");
    });
});

// *****************
// SessionController
// *****************
myApp.controller('SessionController', function($scope, $state, authorizationFactory, $rootScope) {
    $scope.register = function() {
        var user = new Parse.User();
        user.set("username", $scope.username);
        user.set("password", $scope.password);

        user.signUp().then(
            function(user) {
                console.log("User '" + user.get("username") + "' has been created!");
                console.log(user);
                $rootScope.currentUser = authorizationFactory.getCurrentUser();
                $state.go('site.home');
                $scope.$apply();
            },
            function(user, error) {
                console.log("Error: " + error.code + " " + error.message);
            }
        );
    }
    $scope.login = function() {
        Parse.User.logIn($scope.username, $scope.password).then(
            function(user) {
                console.log("Logged in successfully");
                console.log(user);
                $state.go('site.home');
                $rootScope.currentUser = authorizationFactory.getCurrentUser();
                $scope.username = "";
                $scope.password = "";
                $rootScope.$apply();
            },
            function(error) {
                console.log(error);
                alert("Invalid username/password combination");
            });
    }
    $scope.updateProfile = function() {
        var user = Parse.User.current();
        // user.set("password", $scope.password);
        user.set("name", $scope.firstlastname);
        user.set("address", $scope.address);
        user.set("phone", $scope.phone);

        user.save().then(function(user) {
            console.log("User profile updated successfully");
            console.log(JSON.stringify(user));
            // $state.go('site.home')
        //     Parse.User.logOut().then(function() {
        //         $rootScope.currentUser = authorizationFactory.getCurrentUser();
        //         $state.go('site.home')
        //         $scope.$apply();
        //     });
        });
    }
    if (Parse.User.current()) {
        $scope.firstlastname = Parse.User.current().get("name");
        $scope.address = Parse.User.current().get("address");
        $scope.phone = Parse.User.current().get("phone");
    }
});

// *****
// Menus
// *****
myApp.controller('MenusController', function($scope, authorizationFactory, toolsFactory, menusFactory, $stateParams, $state, $timeout) {
    $scope.addItem = function() {
        $scope.items.push({});
    };
    $scope.removeItem = function(itemIndex) {
        $scope.items.splice(itemIndex, 1);
    };
    $scope.addImage = function() {
        console.log($scope.menu);
        var fileList = $("#menuPhotos")[0].files;
        toolsFactory.uploadImages(fileList).then(function(uploadedImages) {
            $scope.menu.menuPhotos = $scope.menu.menuPhotos.concat(uploadedImages);
            $("#menuPhotos").val(null); // clear file input form
            $scope.$apply();
        });
    }
    $scope.removeImage = function(image) {
        imageIndex = $scope.menu.menuPhotos.indexOf(image);
        $scope.menu.menuPhotos.splice(imageIndex, 1);
    }
    $scope.addMenu = function() {
        // remove $$hashKey keys that AngularJS adds when ng-repeat used
        // http://stackoverflow.com/questions/18826320/what-is-the-hashkey-added-to-my-json-stringify-result
        menuItems = JSON.parse(angular.toJson($scope.items));

        menu.set("name", $scope.menuName);
        menu.set("price", $scope.menuPrice);
        menu.set("description", $scope.menuDescription);
        menu.set("items", menuItems);
        menu.set("menuPhotos", $scope.menu.menuPhotos);

        menusFactory.saveMenu(menu).then(function(menu) {
            $scope.$parent.menus.push(menu);
            $state.go('site.menus.list.detail', {
                id: menu.id
            });
            $scope.$parent.$apply();
        });
    };
    $scope.deleteMenu = function(menu) {
        menu.destroy().then(
            function(menu) {
                console.log("'" + menu.menuName + "' menu deleted successfully. ID: " + menu.id);
                menuIndex = $scope.menus.indexOf(menu);
                $scope.menus.splice(menuIndex, 1);
                $scope.$apply();
                $state.go('site.menus.list');
            },
            function(menu, error) {
                console.log('Failed to delete menu, with error code: ' + error.message);
            }
        );
    };
    $scope.updateMenu = function(menu) {
        // remove $$hashKey keys that AngularJS adds when ng-repeat used
        var menuItems = JSON.parse(angular.toJson($scope.items));
        menu.set("items", menuItems);

        menusFactory.saveMenu(menu).then(function(menu) {
            return menusFactory.getMenuList();
        }).then(function(results) {
            $scope.$parent.menus = results;
            $state.go('site.menus.list.detail', {
                id: menu.id
            });
        });
    };
    $scope.secureMenu = function(menu) {
        var menuItems = JSON.parse(angular.toJson($scope.items));
        menu.set("items", menuItems);

        var menuACL = new Parse.ACL(Parse.User.current());
        menuACL.setPublicReadAccess(true);
        menu.setACL(menuACL);
    };

    menusFactory.getMenuList().then(function(menuList) {
        // Default items array. Used for adding new menu items.
        $scope.items = [{}];
        // Bind selected menu object into scope
        menuId = $stateParams.id;

        if (menuId !== undefined) {
            for (var i = 0; i < menuList.length; i++) {
                if (menuList[i].id == menuId) {
                    menusFactory.getMenu(menuList[i]).then(function(menu) {
                        $scope.menu = menu;
                        $scope.items = menu.items;
                        $scope.$apply();
                    });
                    break;
                }
            }
        } else {
            $scope.menus = menuList;
            $scope.$apply();
            // Menu object for use in 'Add Menu' page
            if ($state.current.name === 'site.menus.list.add') {
                Menu = Parse.Object.extend("Menu");
                menu = new Menu();
                menu.menuPhotos = [];
                $scope.menu = menu;
            }
        }
    });
});