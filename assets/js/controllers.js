// ****************
// SimpleController
// ****************
myApp.controller('SimpleController', function($scope) {
    $scope.customers = [{
        name: 'Jani',
        city: 'Norway'
    }, {
        name: 'Hege',
        city: 'Aroba'
    }, {
        name: 'Kai',
        city: 'Denmark'
    }];
    $scope.register = function() {
        newUser = {}
        newUser.email = $scope.email;
        newUser.password = $scope.password;
        //$scope.customers.push(newCustomer);

        Parse.initialize("TDDsVhxFqXCHbzAcpxHiIhUuhFTUfCvIZONdTHfY", "AMWekC7CBBsD920ROCv113qrQ1bGSjdHi0QjBfme");
        var user = new Parse.User();
        user.set("username", newUser.email);
        user.set("email", newUser.email);
        user.set("password", newUser.password);

        // other fields can be set just like with Parse.Object
        //user.set("phone", "650-555-0000");
        user.signUp(null, {
            success: function(user) {
                alert("User has been created!");
            },
            error: function(user, error) {
                // Show the error message somewhere and let the user try again.
                alert("Error: " + error.code + " " + error.message);
            }
        });
    };
});

// *****
// Menus
// *****
myApp.controller('MenusController', function($scope, toolsFactory, menusFactory, menuList, $stateParams, $state, $timeout) {
    $scope.addItem = function() {
        $scope.items.push({});
    };
    $scope.removeItem = function(itemIndex) {
        $scope.items.splice(itemIndex, 1);
    };
    $scope.addMenu = function() {
        var Menu = Parse.Object.extend("Menu");
        var menu = new Menu();
        var fileList = $("#menuPhotos")[0].files;
        // remove $$hashKey that AngularJS adds
        menuItems = JSON.parse(angular.toJson($scope.items));

        toolsFactory.uploadImages(fileList).then(
            function(uploadedImages) {
                menu.set("name", $scope.menuName);
                menu.set("price", $scope.menuPrice);
                menu.set("description", $scope.menuDescription);
                menu.set("items", menuItems);
                menu.set("menuPhotos", uploadedImages);

                menusFactory.saveMenu(menu).then(function(menu) {
                    $scope.menus.push(menu);
                    $state.go('menus.list.detail', {
                        id: menu.id
                    });
                });
            });
    };
    $scope.deleteMenu = function(menu) {
        menu.destroy().then(
            function(menu) {
                console.log("'" + menu.menuName + "' menu deleted successfully. ID: " + menu.id);
                menuIndex = $scope.menus.indexOf(menu);
                $scope.menus.splice(menuIndex, 1);
                $scope.$apply();
                $state.go('menus.list');
            },
            function(menu, error) {
                console.log('Failed to delete menu, with error code: ' + error.message);
            }
        );
    };
    $scope.updateMenu = function(menu) {
        menuItems = JSON.parse(angular.toJson($scope.items));
        menu.set("items", menuItems);

        menusFactory.saveMenu(menu).then(function(menu) {
            return menusFactory.getMenuList();
        }).then(function(results) {
            $scope.$parent.menus = results;
            $state.go('menus.list.detail', {id: menu.id});
        });
    };

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
    }

});