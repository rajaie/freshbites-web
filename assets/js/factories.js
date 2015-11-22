// A RESTful factory for retrieving sample data
myApp.factory('menusFactory', function ($http) {
  var path = 'assets/json/menus.json';
  var menus = $http.get(path).then(function (resp) {
    return resp.data.menus;
  });

  var factory = {};
  factory.all = function () {
    return menus;
  };
  return factory;
});