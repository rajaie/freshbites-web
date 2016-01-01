myApp.factory('toolsFactory', function($location) {
    var factory = {};

    factory.uploadImage = function(file) {
        var imageFile = file;
        var imageName = file.name;
        var parseFile = new Parse.File(imageName, imageFile);
        return parseFile.save().then(function(returnedFile) {
            console.log(imageName + " uploaded successfully");
            return returnedFile;
        });
    }

    factory.uploadImages = function(fileList) {
        uploadedImages = [];
        return new Promise(function(resolve, reject) {
            if (fileList.length == 0 )
                resolve(uploadedImages);
            for (var i = 0; i < fileList.length; i++) {
                factory.uploadImage(fileList[i]).then(
                    function(uploadedImage) {
                        uploadedImages.push(uploadedImage);
                        if (uploadedImages.length === fileList.length) {
                            resolve(uploadedImages)
                        }
                    });
            }
        });
    }

    return factory;
});

// *****
// Users
// *****
myApp.factory('authorizationFactory', function($location) {
    var factory = {};
    var userAttributes = [{
        angular: 'username',
        parse: 'username'
    }];

    function GettersAndSetters(classObject) {
        attributesArray = userAttributes;
        for (var i = 0; i < attributesArray.length; i++) {
            eval('Object.defineProperty(classObject, "' + attributesArray[i].angular + '", {' + 'configurable: true, get: function() {' + 'return this.get("' + attributesArray[i].parse + '");' + '},' + 'set: function(aValue) {' + 'this.set("' + attributesArray[i].parse + '", aValue);' + '}' + '});');
        }
    }
    factory.getCurrentUser = function() {
        var parseUser = Parse.User.current();
        if (parseUser !== null)
            GettersAndSetters(parseUser);
        return parseUser;
    }

    factory.checkAuthorized = function() {
        return new Promise(function(resolve, reject) {
            if (!factory.getCurrentUser()) {
                console.log("Access denied. Not logged in.");
                $location.url('/');
                reject();
            }
            else {
                resolve();
            }
        });
    }
    factory.checkUnauthorized = function() {
        return new Promise(function(resolve, reject) {
            if (factory.getCurrentUser()) {
                console.log("Access denied. Already logged in.");
                $location.url('/');
                reject();
            }
            else {
                resolve();
            }
        });
    }

    return factory;

});

// *****
// Menus
// *****
myApp.factory('menusFactory', function() {
    var factory = {};
    var menuAttributes = [{
        angular: 'menuName',
        parse: 'name'
    }, {
        angular: 'description',
        parse: 'description'
    }, {
        angular: 'menuPhotos',
        parse: 'menuPhotos'
    }, {
        angular: 'items',
        parse: 'items'
    }, {
        angular: 'owner',
        parse: 'owner'
    }, {
        angular: 'price',
        parse: 'price'
    }];

    function GettersAndSetters(results, attributesArray) {
        for (var x = 0; x < results.length; x++) {
            classObject = results[x];
            for (var i = 0; i < attributesArray.length; i++) {
                eval('Object.defineProperty(classObject, "' + attributesArray[i].angular + '", {' + 'configurable: true, get: function() {' + 'return this.get("' + attributesArray[i].parse + '");' + '},' + 'set: function(aValue) {' + 'this.set("' + attributesArray[i].parse + '", aValue);' + '}' + '});');
            }
        }
    }
    function SetDisplayName(menus) {
        for (var i = 0; i < menus.length; i++) {
            menus[i].displayName = menus[i].get("name");
        }
    }
    // Returns a list of menu names
    factory.getMenuList = function() {
        var parseMenu = Parse.Object.extend("Menu");
        var query = new Parse.Query(parseMenu);

        query.select("name");
        query.equalTo("owner", Parse.User.current().get("username"));

        return query.find().then(
            function(menus) {
                GettersAndSetters(menus, menuAttributes);
                SetDisplayName(menus);
                return menus;
            },
            function(error) {
                console.log("Failed to getMenuList. Code: " + error.code + ". Message: " + error.message);
            }
        );
    };
    // Returns a list of menu names
    factory.getMenu = function(menu) {
        var parseMenu = Parse.Object.extend("Menu");
        var query = new Parse.Query(parseMenu);
        return menu.fetch().then(function(result) {
            // GettersAndSetters([result], menuAttributes);
            return result;
        });
    };
    factory.saveMenu = function(menu) {
        menu.set("owner", Parse.User.current().get("username"));
        result = menu.save(null).then(
            function(menu) {
                results = [menu];
                GettersAndSetters(results, menuAttributes);
                SetDisplayName(results);
                console.log("'" + menu.menuName + "' Menu saved successfully. ID: " + menu.id);
                return results[0];
            },
            function(error) {
                console.log('Failed to save Menu object. Error message: ' + error.message);
            }
        );
        return result;
    }

    return factory;
});