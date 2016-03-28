'use strict';

angular.module('controllers', ['ionic.contrib.ui.tinderCards', 'ionic', 'ngCordova'])

.factory('dbConn', function() {
    return {
        getDB: function() {
            var db = window.sqlitePlugin.openDatabase({name: "app.db", location: 1});
            return db;
        },

        createUserTable: function(db){
            // alert('create table called')
            db.executeSql("create table userDetails (userId char(25), password char(25), \
                firstName char(25), lastName char(25), age int,  sex char(25), \
                height float, bodyType char(25), fromAge int, toAge int, partner char(25), \
                partnerHeight float, partnerBodyType char(25), photo char(50))", [],
                function (result) {
                    // alert('success creating')
                },
                function(error) {
                    alert(error.message)
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
                    // alert('success function')
                    if (result.rows.length > 0){
                        validity = true;
                    }
                    else {
                        validity = false;
                    }
                    callback(validity);
                },
                function (error){
                    // alert('creating')
                    callback("create");
                })
        },

        logout: function (db, callback){
            db.executeSql("delete from userDetails", [], 
                function (result){
                    callback();
                },
                function (error){
                    alert(error.message)
            })
        },

        updatePhoto: function (db, photoUrl){
            db.executeSql("update userDetails set photo='"+photoUrl+"';", [], 
                function (result){
                    console.log("done")
                },
                function (error){
                    alert(error.message)
            })
        },

        getPhotoUrl: function (db, callback){
            db.executeSql("select * from userDetails;", [], 
                function (result){
                    var photoUrl = result.rows.item(0).photo
                    callback(photoUrl);
                },
                function (error){
                    alert(error.message)
            })
        },

        getUserDetails: function (db, callback){
            db.executeSql("select * from userDetails;", [], 
                function (result){
                    var userId = result.rows.item(0).userId
                    var password = result.rows.item(0).password
                    // alert('userId')
                    callback(userId);
                },
                function (error){
                    alert(error.message)
            })
        },

        dropTable: function(db, callback){
            // alert('drop table called')
            db.executeSql("drop table userDetails;", [],
                function  (result){
                    // alert('drop table success')
                    callback()
                },
                function (error){
                    // alert(error.message)
                    callback()
                })
        },

        updateUserDetails: function (db, firstName, lastName, age, sex, height,
            bodyType, fromAge, toAge, partner, partnerHeight, partnerBodyType,
            callback){
            var query;
            if (firstName == null){
                query = "update userDetails set age='"+age+"', sex='"+sex+
                "', height="+height+", bodyType='"+bodyType+"', fromAge="+
                fromAge+", toAge="+toAge+", partner='"+partner+"', "+
                "partnerHeight="+partnerHeight+", partnerBodyType='"+
                partnerBodyType+"';"
            }

            else {
                query = "update userDetails set firstName='"+firstName+
                "', lastName='"+lastName+"', age="+age+", sex='"+sex+
                "', height="+height+", bodyType='"+bodyType+"', fromAge="+
                fromAge+", toAge="+toAge+", partner='"+partner+"', "+
                "partnerHeight="+partnerHeight+", partnerBodyType='"+
                partnerBodyType+"';"
            }

            // alert(query);

            db.executeSql(query, [], 
                function (result){
                    // alert("updating user details done")
                    console.log("updating user details done")
                    callback()
                },
                function (error){
                    alert(error.message)
            })
        },

        getProfileScope: function (db, callback){
            db.executeSql('select * from userDetails', [], 
                function (result){
                    var user = result.rows.item(0)
                    callback(user)
                },
                function (error){
                    alert(error.message)
            })
        }



    };
})

.controller('AppCtrl',['dbConn','$state', '$scope', '$rootScope', '$ionicModal', '$ionicPopover', '$timeout',
    '$window',  function(dbConn, $state, $scope, $rootScope, $ionicModal, $ionicPopover, $timeout,
    $window) {

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

    $scope.logout = function(){
        document.addEventListener('deviceready', function(){
            var db = dbConn.getDB();
            dbConn.logout(db, function (user) {
                $state.go('app.login')
                $scope.$apply()
            });
        });
    }
}])


.controller('FindMatchCtrl',[ 'dbConn', '$scope', '$ionicSideMenuDelegate',
    '$ionicHistory', '$ionicPlatform', '$window',
    function(dbConn, $scope, $ionicSideMenuDelegate, $ionicHistory, 
    $ionicPlatform, $window) {

    $ionicHistory.clearHistory()
    $scope.$parent.showHeader();
    $ionicSideMenuDelegate.canDragContent(true)

    var db;
    document.addEventListener('deviceready', function(){
        db = dbConn.getDB()
        dbConn.getProfileScope(db, function(user){
            var fdata = {'user_id': user.userId, 'partner': user.partner}
            $.ajax({
                url: 'http://10.0.0.77:8080/get_matches',
                method: 'post',
                data: {'data': JSON.stringify(fdata)},
                complete: function(result, status) {
                    var response = JSON.parse(result.responseText)

                    if (response['status'] == 'success'){
                        var matchCards = response['data']
                        showMatchCards(matchCards)
                        // alert('success')
                    }
                    else {
                        alert('failed to load, try again later')
                    }
                }
            });
        });
    });

    var cards = [];
    var showMatchCards = function(matchCards){
        for (var i=0; i<matchCards.length; i++){
            cards.push({
                'index': i,
                'imageUrl': matchCards[i].imageUrl,
                'name': matchCards[i].name,
                'age': matchCards[i].age,
                'sex': matchCards[i].sex,
            })
        }

        // alert(JSON.stringify(cards))

        $scope.cards = cards;
        $scope.$apply()

    }

    $scope.cardDestroyed = function(index) {
        // alert("card Destroyed")
        console.log("cards are destroyed")
        console.log(index)
        $scope.cards.splice(index, 1);
    };

    $scope.addCard = function() {
        var newCard = cardTypes[Math.floor(Math.random() * cardTypes.length)];
        newCard.id = Math.random();
        $scope.cards.push(angular.extend({}, newCard));
    }

    $scope.cardSwipedLeft = function(index) {
        // alert("Card swiped left")
    // $scope.addCard();
    };
    $scope.cardSwipedRight = function(index) {
        // alert("card swiped right")
    // $scope.addCard();
    };

    // }, 3000);



    $("#like").on("click", function (){
        var topCard = $("td-cards").find("td-card")[0];
        $(topCard).remove()
    });

    $("#nope").on('click', function(){
        var topCard = $("td-cards").find("td-card")[0];
        $(topCard).remove()
    })

}])


.controller('LoginCtrl',["$state", 'dbConn','$ionicPlatform', '$scope', '$timeout',
    'ionicMaterialInk', '$ionicSideMenuDelegate', '$location', '$window',
    function($state, dbConn,$ionicPlatform, $scope, $timeout, ionicMaterialInk, 
    $ionicSideMenuDelegate, $location, $window) {

    $ionicSideMenuDelegate.canDragContent(false)
    $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();

    document.addEventListener('deviceready', function(){
        var db = dbConn.getDB();
        dbConn.isUserLoggedIn(db, function (user) {
            // alert(user)
            if (user == true){
                // alert('in if')
                $state.go('app.find')
                $scope.$apply()
            }

            else if (user == "create"){
                // alert('in else if')
                dbConn.dropTable(db, function (){
                    // alert('dropTable returned')
                    dbConn.createUserTable(db);
                })
            }
        });
    });

}])

.controller('MessagesCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
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

.controller('validateLogin',['dbConn', '$scope', '$http', '$location',
    function(dbConn, $scope, $http, $location) {

    var sc = this;

    $scope.validate = function (userId, password){
        var fdata = JSON.stringify({'userId':userId, 'password':password})
        var login = false;
        console.log("called")
        $.ajax({
            url: 'http://10.0.0.77:8080/login',
            method: 'post',
            data: {'data': fdata},
            complete: function(result, status) {
                alert(result.responseText)
                var data = JSON.parse(result.responseText)
                if ( data['status'] == 'success'){
                    var db = dbConn.getDB();
                        dbConn.logout(db, function (){
                            dbConn.insertLoginData(db, userId, password);
                            dbConn.updateUserDetails(db, data['firstName'], data['lastName'],
                            data['age'], data['sex'], data['height'],
                            data['bodyType'], data['fromAge'], data['toAge'],
                            data['partner'], data['partnerHeight'], data['partnerBodyType'],
                            function (){
                                alert("succesfully updated user info")
                            }
                        )
                        })
                    
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

.controller('ProfileCtrl', ['dbConn','$ionicSideMenuDelegate', '$scope', '$stateParams',
    '$timeout', 'ionicMaterialMotion', 'ionicMaterialInk', '$cordovaFile', 
    '$ionicHistory', '$cordovaFileTransfer', function(dbConn, 
    $ionicSideMenuDelegate, $scope, $stateParams, $timeout, ionicMaterialMotion,
    ionicMaterialInk, $cordovaFile, $ionicHistory, $cordovaFileTransfer) {
    
    var db;
    document.addEventListener('deviceready', function(){
        db = dbConn.getDB();
        dbConn.getPhotoUrl(db, function (photoUrl){
            $scope.imageUrl = photoUrl;
            $scope.$apply()
        })
        dbConn.getProfileScope(db, function (user){
            // alert(JSON.stringify(user))
            $scope.firstName = user.firstName
            $scope.lastName = user.lastName
            $scope.age = user.age
            $scope.sex = user.sex
            $scope.height = user.height
            $scope.bodyType = user.bodyType
            $scope.fromAge = user.fromAge
            $scope.toAge = user.toAge
            $scope.partner = user.partner
            $scope.partnerHeight = user.partnerHeight
            $scope.partnerBodyType = user.partnerBodyType
            $scope.$apply()
        })

    })
    // $scope.imageUrl = cordova.file.dataDirectory+'/profile.jpg'
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

    // ionicMaterialInk.displayEffect();

    $('.edit').on('click', function (e){
        console.log('edited');
        $('#saveInfo').show();
    });

    $('#saveInfo').on('click', function (e){
        $(e.currentTarget).hide();
        var fdata = {};
        var spanElements = $('.editable');
        console.log(spanElements)
        for (var span=0; span<spanElements.length; span++){
            fdata[spanElements[span].id] = $(spanElements[span]).html()
        }


        dbConn.getUserDetails(db, function(userId){
            // alert(userId)
            fdata['user_id'] = userId;
            $.ajax({
                url: 'http://10.0.0.77:8080/update_info',
                method: 'post',
                data: {'data': JSON.stringify(fdata)},
                complete: function(result, status) {
                    if (JSON.parse(result.responseText)['status'] == 'success'){
                        // alert('success')
                        // alert(fdata['userAge'])
                        dbConn.updateUserDetails(db, null, null, parseInt(fdata['userAge']), 
                            fdata['userSex'], parseFloat(fdata['userHeight']), fdata['userBody'],
                            parseInt(fdata['fromAge']), parseInt(fdata['toAge']),
                            fdata['partnerValue'], parseFloat(fdata['heightValue']), fdata['bodyValue'],
                            function (){
                                // alert('done updating')
                            })

                    }
                    else {
                        alert('failed to update, try again')
                    }
                }
            });
        })
    });

    $('.ageselect').on('click', function (e){
        $('.ageselect').removeClass('selectedAge');
        $('#'+e.currentTarget.id).addClass('selectedAge');
    });

    $('.age').on('click', function (e){
        var action = e.currentTarget.id;
        var ageId = '#'+$('.selectedAge')[0].id;


        if (action == 'subtract'){
            var ageValue = parseInt($(ageId).html());
            ageValue = ageValue - 1;
            $(ageId).empty().append(ageValue);
        }

        else if (action == 'add'){
            var ageValue = parseInt($(ageId).html());
            ageValue = ageValue + 1;
            $(ageId).empty().append(ageValue);
        }

        else if (action == 'userAgeAdd'){
            var userAgeValue = parseInt($('#userAge').html())
            userAgeValue = userAgeValue + 1;
            $('#userAge').empty().append(userAgeValue);
        }

        else if (action == 'userAgeMinus'){
            var userAgeValue = parseInt($('#userAge').html())
            userAgeValue = userAgeValue - 1;
            $('#userAge').empty().append(userAgeValue);
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
        else if (action == 'partnerRight'){
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

        else if (action == 'userSexLeft'){
            var value = $('#userSex').html()
            if (value == 'Female'){
                $('#userSex').empty().html("Male");
            }
            else {
                $('#userSex').empty().html("Female");   
            }
        }
    });

    $('.height').on('click', function (e){
        var action = e.currentTarget.id;
        if (action == 'heightSub'){
            var heightValue = parseFloat($("#heightValue").html());
            $('#heightValue').empty().html(heightValue - 0.5);
        }
        else if ( action == 'heightAdd' ){
            var heightValue = parseFloat($("#heightValue").html());
            $('#heightValue').empty().html(heightValue + 0.5);
        }

        else if (action == 'userHeightSub'){
            var heightValue = parseFloat($("#userHeight").html());
            $('#userHeight').empty().html(heightValue - 0.5);
        }

        else if (action == 'userHeightAdd'){
            var heightValue = parseFloat($("#userHeight").html());
            console.log('here')
            $('#userHeight').empty().html(heightValue + 0.5);
        }


    });

    $('.body').on('click', function (e){
        var action = e.currentTarget.id;
        var values = ['Slim', 'Athletic', 'Average', 'Heavy'];

        if (action == 'bodyLeft'){
            var index = values.indexOf($('#bodyValue').html())
            if (index == 0){
                $('#bodyValue').empty().html(values[3]);
            }
            else {
                $('#bodyValue').empty().html(values[index - 1]);
            }
        }
        else if (action == 'bodyRight'){
            var index = values.indexOf($('#bodyValue').html())
            if (index == 3){
                $('#bodyValue').empty().html(values[0]);
            }
            else {
                $('#bodyValue').empty().html(values[index + 1]);
            }
        }

        else if (action == 'userBodyLeft'){
            var index = values.indexOf($('#userBody').html())
            if (index == 0){
                $('#userBody').empty().html(values[3]);
            }
            else {
                $('#userBody').empty().html(values[index - 1]);
            }
        }

        else if (action == 'userBodyRight'){
            console.log("here")
            var index = values.indexOf($('#userBody').html())
            if (index == 3){
                $('#userBody').empty().html(values[0]);
            }
            else {
                $('#userBody').empty().html(values[index + 1]);
            }
        }
    });

    var text = ""
    var generatePicName = function (){
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 5; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    var successCallback = function(url) {
        dbConn.getUserDetails(db, function (userId){
            var server = 'http://10.0.0.77:8080/upload_photo';
            var filePath = url;
            // alert(filePath)
            var options = {
                fileKey: "photo",
                chunkedMode: false,
                mimeType: "image/jpg",
                params : {'userId': userId}
            }

            $cordovaFileTransfer.upload(server, filePath, options)
                .then(
                function(result) {
                    var urlsplit = url.split("/")
                    url = urlsplit.pop()
                    var dir = urlsplit.join('/')
                    var picName = generatePicName();
                    $cordovaFile.copyFile(dir+"/", url,
                        cordova.file.dataDirectory, picName+".jpg")
                    .then(function (success) {
                        dbConn.updatePhoto(db, cordova.file.dataDirectory+picName+".jpg")
                        $scope.imageUrl = cordova.file.dataDirectory+picName+".jpg"
                        $scope.$apply()
                    },
                    function (error) {
                        alert("error copying")
                    });
                },
                function(error) {
                    alert("Failed to upload")
                },
                function (progress) {
                }
            );
        })
    }

    var errorCallback = function (error){
        alert(error.message)
    }

    $("#editImage").on('click', function(){
        navigator.camera.getPicture(successCallback, errorCallback, 
            {
                destinationType: Camera.DestinationType.NATIVE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,

            }
        );
    });

}])
    