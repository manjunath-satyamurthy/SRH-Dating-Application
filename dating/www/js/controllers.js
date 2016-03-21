'use strict';

angular.module('controllers', ['ionic.contrib.ui.tinderCards', 'ionic'])

.factory('dbConn', function() {
    return {
        getDB: function() {
            var db = window.sqlitePlugin.openDatabase({name: "app.db", location: 1});
            return db;
        },

        createUserTable: function(db){
            db.executeSql("create table userDetails (userId char(25), password char(25), \
                firstName char(25), lastName char(25), age int,  sex char(25), \
                height float, weight int, bodyType char(25), ethnicity char(25), \
                music char(25), foodHabits char(25), drinking boolean, \
                smoking boolean, photo blockb)", [],
                function (result) {
                },
                function(error) {
                })
        },

        insertLoginData: function (db, userId, password){
            db.executeSql("insert into userDetails (userId, password) values \
                ("+userId+", "+password+");", [], 
                function (result){
                },
                function (error){
                })
        },

        isUserLoggedIn: function (db, callback){
            var validity = false;
            db.executeSql("select * from userDetails", [], 
                function (result){
                    if (result.rows.length > 0){
                        validity = true;
                    }
                    else {
                        validity = false;
                    }
                    callback(validity);
                },
                function (error){
                    callback("create");
                })
        }

    };
})

.controller('AppCtrl', function($scope, $rootScope, $ionicModal, $ionicPopover, $timeout, $window) {

    $scope.hash = $window.location.hash;
    $scope.loginData = {};
    $scope.isExpanded = false;
    $scope.hasHeaderFabLeft = false;
    $scope.hasHeaderFabRight = false;

    var navIcons = document.getElementsByClassName('ion-navicon');
    for (var i = 0; i < navIcons.length; i++) {
        navIcons.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    }

    $scope.hideNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'none';
    };

    $scope.showNavBar = function() {
        document.getElementsByTagName('ion-nav-bar')[0].style.display = 'block';
    };

    $scope.noHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }
    };

    $scope.setExpanded = function(bool) {
        $scope.isExpanded = bool;
    };

    $scope.setHeaderFab = function(location) {
        var hasHeaderFabLeft = false;
        var hasHeaderFabRight = false;

        switch (location) {
            case 'left':
                hasHeaderFabLeft = true;
                break;
            case 'right':
                hasHeaderFabRight = true;
                break;
        }

        $scope.hasHeaderFabLeft = hasHeaderFabLeft;
        $scope.hasHeaderFabRight = hasHeaderFabRight;
    };

    $scope.hasHeader = function() {
        var content = document.getElementsByTagName('ion-content');
        for (var i = 0; i < content.length; i++) {
            if (!content[i].classList.contains('has-header')) {
                content[i].classList.toggle('has-header');
            }
        }

    };

    $scope.hideHeader = function() {
        $scope.hideNavBar();
        $scope.noHeader();
    };

    $scope.showHeader = function() {
        $scope.showNavBar();
        $scope.hasHeader();
    };

    $scope.clearFabs = function() {
        var fabs = document.getElementsByClassName('button-fab');
        if (fabs.length && fabs.length > 1) {
            fabs[0].remove();
        }
    };
})


.controller('FindMatchCtrl', function($scope, $ionicSideMenuDelegate, $ionicHistory) {
    $scope.$parent.showHeader();
    // $ionicHistory.clearHistory();
    $ionicSideMenuDelegate.canDragContent(true)

    var cardTypes = [
        { image: 'https://pbs.twimg.com/profile_images/696212819570655232/UJYdhVYj.jpg' },
        { image: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg' },
        { image: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png' },
        { image: 'https://pbs.twimg.com/profile_images/692904108424982528/0PESpDwT.jpg'}
    ];

    $scope.cards = Array.prototype.slice.call(cardTypes, 0);

    $scope.cardDestroyed = function(index) {
        console.log("cards are destroyed")
        $scope.cards.splice(index, 1);
    };

    $scope.addCard = function() {
        var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
        newCard.id = Math.random();
        $scope.cards.push(angular.extend({}, newCard));
    }

    $scope.cardSwipedLeft = function(index) {
    // $scope.addCard();
    };
    $scope.cardSwipedRight = function(index) {
    // $scope.addCard();
    };

    $("#like").on("click", function (){
        var topCard = $("td-cards").find("td-card")[0];
        $(topCard).remove()
    });

    $("#nope").on('click', function(){
        var topCard = $("td-cards").find("td-card")[0];
        $(topCard).remove()
    })

})


.controller('LoginCtrl',["$state", 'dbConn','$ionicPlatform', '$scope', '$timeout',
    'ionicMaterialInk', '$ionicSideMenuDelegate', '$location', "$ionicHistory",
    function($state, dbConn,$ionicPlatform, $scope, $timeout, ionicMaterialInk, 
    $ionicSideMenuDelegate, $location, $ionicHistory) {
    
    $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
    });
    $ionicSideMenuDelegate.canDragContent(false)
    $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();

    document.addEventListener('deviceready', function(){
        var db = dbConn.getDB();
        dbConn.isUserLoggedIn(db, function (user) {
            if (user == true){
                $state.go('app.find')
                $scope.$apply()
            }

            else if (user == "create"){
                dbConn.createUserTable(db);
            }
        });
    });

}])

.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab(false);

    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    ionicMaterialMotion.fadeSlideInRight();
    ionicMaterialInk.displayEffect();
})

.controller('ProfileCtrl', function($ionicSideMenuDelegate, $scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    $ionicSideMenuDelegate.canDragContent(true)
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    $timeout(function() {
        ionicMaterialMotion.slideUp({
            selector: '.slide-up'
        });
    }, 300);

    $timeout(function() {
        ionicMaterialMotion.fadeSlideInRight({
            startVelocity: 3000
        });
    }, 700);

    ionicMaterialInk.displayEffect();

    $('.ageselect').on('click', function (e){
        $('.ageselect').removeClass('selectedAge');
        $('#'+e.currentTarget.id).addClass('selectedAge');
    });

    $('.age').on('click', function (e){
        var action = e.currentTarget.id;
        var ageId = '#'+$('.selectedAge')[0].id;
        var ageValue = parseInt($(ageId).html());

        if (action == 'subtract'){
            ageValue = ageValue - 1;
            $(ageId).empty().append(ageValue);
        }

        if (action == 'add'){
            ageValue = ageValue + 1;
            $(ageId).empty().append(ageValue);
        }
    });

    $('.partner').on('click', function (e){
        var action = e.currentTarget.id;
        console.log(action);

        if (action == 'partnerLeft'){
            var value = $('#partner').html()
            console.log(value);
            if (value == 'Female'){
                $('#partner').empty().html("Male");
            }
            else {
                $('#partner').empty().html("Female");   
            }
        }
        else {
            console.log("else")
            var value = $('#partnerValue').html()
            console.log(value);
            if (value == 'Female'){
                $('#partnerValue').empty().html("Male");
            }
            else {
                $('#partnerValue').empty().html("Female");   
            }
        }
    });

    $('.height').on('click', function (e){
        var action = e.currentTarget.id;
        var heightValue = parseFloat($("#heightValue").html());
        if (action == 'heightSub'){
            $('#heightValue').empty().html(heightValue - 0.5);
        }
        else {
            $('#heightValue').empty().html(heightValue + 0.5);
        }

    });


    $('.complexion').on('click', function (e){
        var action = e.currentTarget.id;
        var values = ['Fair', 'Black', 'Brown'];
        var index = values.indexOf($('#complexionValue').html())

        if (action == 'complexionLeft'){
            if (index == 0){
                $('#complexionValue').empty().html(values[2]);
            }
            else {
                $('#complexionValue').empty().html(values[index - 1]);
            }
        }
        else {
            if (index == 2){
                $('#complexionValue').empty().html(values[0]);
            }
            else {
                $('#complexionValue').empty().html(values[index + 1]);
            }
        }
    });

    $('.body').on('click', function (e){
        var action = e.currentTarget.id;
        var values = ['Slim', 'Athletic', 'Average', 'Heavy'];
        var index = values.indexOf($('#bodyValue').html())

        if (action == 'bodyLeft'){
            if (index == 0){
                $('#bodyValue').empty().html(values[3]);
            }
            else {
                $('#bodyValue').empty().html(values[index - 1]);
            }
        }
        else {
            if (index == 3){
                $('#bodyValue').empty().html(values[0]);
            }
            else {
                $('#bodyValue').empty().html(values[index + 1]);
            }
        }
    });

    var successCallback = function (data){
        console.log("done");
        $('.hero').css("background-image", "url('data:image/jpeg;base64,"+data+"')");  
    }

    var errorCallback = function (error){
        alert(error);
        console.log("not done");
    }

    $("#editImage").on('click', function(){
        navigator.camera.getPicture(successCallback, errorCallback, 
            {
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,

            }
        );
    });

})

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

})

.controller('validateLogin',['dbConn', '$scope', '$http', '$location', function(dbConn, $scope, $http, $location) {

    var sc = this;

    $scope.validate = function (userId, password){
        var fdata = JSON.stringify({'userId':userId, 'password':password})
        var login = false;
        console.log("called")
        $.ajax({
            url: 'http://192.168.0.14:8080/login',
            method: 'post',
            data: {'data': fdata},
            complete: function(result, status) {
                if (JSON.parse(result.responseText)['status'] == 'success'){
                    var db = dbConn.getDB();
                    dbConn.insertLoginData(db, userId, password);
                    $location.path('/app/find')
                    $scope.$apply()
                }
            }
        });

    }

    $("#loginBTN").on('click', function(){
        if (sc.userId && sc.password){
            $scope.validate(sc.userId, sc.password)
        }
    });

}])

.controller('customTabs', function (){
    $('.custom-tabs').on('click', function(e){
        e.preventDefault();
        $('.custom-tabs').removeClass('tabSelected');
        $(e.currentTarget).addClass('tabSelected');
        $('.tabviews').hide();
        $('.'+e.currentTarget.id).show()
    });
})