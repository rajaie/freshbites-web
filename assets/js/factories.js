// A RESTful factory for retrieving sample data
myApp.factory('menusFactory', function() {
    var factory = {};

    function GettersAndSetters(results, attributesArray) {
        for (var x = 0; x < results.length; x++) {
            classObject = results[x];
            for (var i = 0; i < attributesArray.length; i++) {
                eval('Object.defineProperty(classObject, "' + attributesArray[i].angular + '", {' + 'configurable: true, get: function() {' + 'return this.get("' + attributesArray[i].parse + '");' + '},' + 'set: function(aValue) {' + 'this.set("' + attributesArray[i].parse + '", aValue);' + '}' + '});');
            }
        }
    }
    var menuAttributes = [{
        angular: 'menuName',
        parse: 'name'
    }, {
        angular: 'description',
        parse: 'description'
    }, {
        angular: 'price',
        parse: 'price'
    }];

    factory.getAllMenus = function() {
        var parseMenu = Parse.Object.extend("Menu");
        var query = new Parse.Query(parseMenu);
        var menus = query.find().then(
            function(results) {
                GettersAndSetters(results, menuAttributes);
                return results;
            }
        );
        return menus;
    };

    factory.newMenu = function(parseObject) {
        result = parseObject.save(null).then(
            function(menu) {
                results = [menu];
                GettersAndSetters(results, menuAttributes);
                console.log('Menu has been added with Id: ' + menu.id);
                return results[0];
            },
            function(menu, error) {
                alert('Failed to create new object, with error code: ' + error.message);
            }
        );
        return result;
    }

    return factory;
});