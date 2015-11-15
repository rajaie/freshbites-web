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

// *****
// Menus
// *****
myApp.controller('MenusController', function($scope, menus) {
    $scope.menus = menus;
});