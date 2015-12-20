// A RESTful factory for retrieving sample data
myApp.factory('menusFactory', function() {
    var factory = {};

    function GettersAndSetters(classObject, attributesArray) {
        for (var i = 0; i < attributesArray.length; i++) {
            eval('Object.defineProperty(classObject, "' + attributesArray[i].angular + '", {' + 'configurable: true, get: function() {' + 'return this.get("' + attributesArray[i].parse + '");' + '},' + 'set: function(aValue) {' + 'this.set("' + attributesArray[i].parse + '", aValue);' + '}' + '});');
        }
        return classObject;
    }

    factory.getAllMenus = function() {
        var parseMenu = Parse.Object.extend("Menu");
        var query = new Parse.Query(parseMenu);
        var menus = query.find().then(
            function(results) {
                console.log("Successfully retrieved " + results.length + " results.");
                /////////////
                for (var i = 0; i < results.length; i++) {
                    newobject = GettersAndSetters(results[i], [{
                            angular: 'menuName',
                            parse: 'name'
                        }, {
                            angular: 'description',
                            parse: 'description'
                        }, {
                            angular: 'price',
                            parse: 'price'
                        }
                    ]);
                }
                /////////////
                return results;
            }
        )
        return menus;
    };
    factory.getMenu = function(menuId) {

    };
    return factory;
});