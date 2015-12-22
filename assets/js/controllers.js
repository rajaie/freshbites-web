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
myApp.controller('MenusController', function($scope, menusFactory, loadedMenus, $stateParams, $state) {
    $scope.clearScopes = function() {
        console.log("Clearing scopez");
        // $scope.menus.push({id: "34343", menuName: "lool"});
        $scope.menus.length = 0;
        //$scope.$apply();
    }
    $scope.reloadMenus = function() {
        // $scope.menus.length = 0;
        console.log("Reloading menus");
        menusFactory.getAllMenus().then(
            function(menus) {
                console.log("Settings menus in scope..");
                $scope.menus.length = 0;
                testArray = menus;
                $scope.menus = menus.slice();
                // console.log(menus);
                // $scope.menus = menus;
                // $scope.$apply();
            }
        );
    }
    $scope.addItem = function() {
        newId = $scope.items[$scope.items.length - 1].id + 1;
        $scope.items.push({
            id: newId
        });
        console.log($scope.items);
    }
    $scope.removeItem = function(itemIndex) {
        $scope.items.splice(itemIndex, 1);
    }
    $scope.newMenu = function() {
        var parseMenu = Parse.Object.extend("Menu");
        var parseMenu = new parseMenu();

        parseMenu.set("name", $scope.menuName);
        parseMenu.set("price", $scope.menuPrice);
        parseMenu.set("description", $scope.menuDescription);

        menusFactory.newMenu(parseMenu).then(
            function(menu) {
                $scope.menus.push(menu);
                $state.go('menus.list.detail',{id: menu.id});
            });
    };
    $scope.deleteMenu = function(menuObject) {
        if (menuObject === undefined) {
            menuObject = $scope.menu;
        }
        menuObject.destroy().then(
            function(menu) {
                console.log('Menu has been deleted');
                menuIndex = $scope.menus.indexOf(menu);
                $scope.menus.splice(menuIndex, 1);
                $state.go('menus.list');
            },
            function(menu, error) {
                alert('Failed to delete menu, with error code: ' + error.message);
            }
        );
    }

    // Load all menus into scope
    $scope.menus = loadedMenus;
    // Default items array. Used for adding new menu
    $scope.items = [{
        id: 0
    }];
    // Load an individual menu object into scope
    menuId = $stateParams.id;
    if (menuId !== "undefined") {
        for (var i = 0; i < loadedMenus.length; i++) {
            if (loadedMenus[i].id == menuId) {
                $scope.menu = loadedMenus[i];
                break;
            }
        }
    }

});