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
        console.log('orders', orders);
        $scope.orders = orders.sort((a, b) => b.createdAt - a.createdAt);
        $scope.$apply();
    }, function(error) {
        console.log("Failed to get orders list");
    });

    $scope.fulfill = function fulfill(order) {
        if (order.fulfilled) {
            alert("Already fulfilled!");
            return;
        }

        order.set("fulfilled", true);
        order.save().then(function(order) {
            alert("successfully fulfilled order!");
        }, function(error) {
            console.log('Failed to save Order object. Error message: ' + error.message);
        });
    }

});

// ****************
// ReviewsController
// ****************
myApp.controller('ReviewsController', function($scope, $rootScope, $state, reviewsFactory, $location) {
    reviewsFactory.getReviewsWithMenuNames().then(function(reviews) {
        $scope.reviews = reviews;
        $scope.menuFilter = "";
        $scope.$apply();
    }, function(error) {
        console.log("Failed to get reviews list");
    });

    $scope.getIconClass = function(starOrNah) {
        return starOrNah ? 'fa-star' : 'fa-star-o'
    }

    $scope.getNumStars = function(numStars) {
        var stars = [];
        for (var i = 0; i < 5; i++) {
            stars.push((--numStars) > 0);
        }

        return stars;
    }
});

// *****************
// SessionController
// *****************
myApp.controller('SessionController', function($scope, $state, authorizationFactory, $rootScope) {
    $scope.register = function() {
        var user = new Parse.User();
        user.set("username", $scope.username);
        user.set("password", $scope.password);
        user.set("userRole", "caterer");

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
        user.set("email", $scope.email);

        user.save().then(function(user) {
            alert("User profile updated successfully");
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
        $scope.email = Parse.User.current().get("email");
    }
});

// ***************
// MessagesController
// ***************
myApp.controller('MessagesController', function($scope, $rootScope, $state, $stateParams, messagesFactory, $location) {
    function getConversation() {
        return messagesFactory.getMessageList($stateParams.customer).then(function(messages) {
            $scope.messages = messages;
            $scope.messageId = messages[0].messageId;
            $scope.$apply();
        });
    };

    /* Set up long polling to check for new messages
       call longPoll recursively in the callback
       this ensures that the previous call has completed
       before a new call is issued, preventing out-of-order
       delivery of messages. We use setTimeout to limit the polling
       rate, else the TCP stack would blow up */
    function longPoll() {
        setTimeout(function() {
            $scope.refreshConversation(function() {
                console.log("got server response!");
                longPoll();
            });
        }, 1000);
    };

    $scope.getClassByUserType = function(user) {
        var isCurrentUser = (user === $rootScope.currentUser.username);
        return isCurrentUser ? ["pull-right", "chat-message-odd"] : ["pull-left", "chat-message-even"];
    }

    $scope.refreshConversation = function(cb) {
        getConversation().then(cb);
    };

    $scope.sendMessage = function() {
        Message = Parse.Object.extend("Messages");
        message = new Message();

        message.set("from", Parse.User.current().get("username"));
        message.set("to", $stateParams.customer);
        message.set("content", $scope.reply);
        message.set("messageId", $scope.messageId);

        result = message.save(null).then(
            function(message) {
                console.log("Message sent successfully");
                getConversation();
                $scope.reply = "";
            },
            function(error) {
                console.log('Failed to save Message object. Error message: ' + error.message);
            }
        );
    };

    messagesFactory.getUniqueCustomerContacts().then(function(customers) {
        $scope.customers = customers;
        $scope.$apply();
    }, function(error) {
        console.log("Failed to get customers list");
    });

    $scope.customerName = $stateParams.customer;
    customer = $stateParams.customer;

    if (customer !== undefined) {
        getConversation().then(longPoll);
    }

});

// ***************
// MenusController
// ***************
myApp.controller('MenusController', function($scope, $location, authorizationFactory, toolsFactory, menusFactory, $stateParams, $state, $timeout) {
    $scope.isSelectedMenu = function(menuId) {
        return $location.path().split("/")[2] === menuId;
    };
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
        menu.set("menuCover", $scope.menu.menuPhotos[0]);

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
