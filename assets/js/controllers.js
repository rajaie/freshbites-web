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
myApp.controller('MenusController', function($scope, menus) {
    $scope.menus = menus;
    $scope.addMenu = function() {
        Parse.initialize("TDDsVhxFqXCHbzAcpxHiIhUuhFTUfCvIZONdTHfY", "AMWekC7CBBsD920ROCv113qrQ1bGSjdHi0QjBfme");
        var parseMenu = Parse.Object.extend("Menu");
        var parseMenu = new parseMenu();

        parseMenu.set("name", $scope.menuName);
        parseMenu.set("price", $scope.menuPrice);
        parseMenu.set("description", $scope.menuDescription);

        parseMenu.save(null, {
          success: function(menu) {
            alert('New object created with objectId: ' + menu.id);
          },
          error: function(menu, error) {
            alert('Failed to create new object, with error code: ' + error.message);
          }
        });

    };
});