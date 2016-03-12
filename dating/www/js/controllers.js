/* global angular, document, window */
'use strict';

angular.module('controllers', [])

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

.controller('LoginCtrl', function($scope, $timeout, ionicMaterialInk, $ionicSideMenuDelegate) {
    $ionicSideMenuDelegate.canDragContent(false)
    $scope.$parent.clearFabs();
    $timeout(function() {
        $scope.$parent.hideHeader();
    }, 0);
    ionicMaterialInk.displayEffect();
})

.controller('FriendsCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    // Set Header
    console.log("hello")
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.$parent.setHeaderFab('left');

    // Delay expansion
    $timeout(function() {
        $scope.isExpanded = true;
        $scope.$parent.setExpanded(true);
    }, 300);

    // Set Motion
    ionicMaterialMotion.fadeSlideInRight();

    // Set Ink
    ionicMaterialInk.displayEffect();
})

.controller('ProfileCtrl', function($ionicSideMenuDelegate, $scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    // Set Header
    $ionicSideMenuDelegate.canDragContent(true)
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = false;
    $scope.$parent.setExpanded(false);
    $scope.$parent.setHeaderFab(false);

    // Set Motion
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

    // Set Ink
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


})

.controller('FindMatchCtrl', function($scope, $stateParams, $timeout, ionicMaterialMotion, ionicMaterialInk) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab('right');

    $timeout(function() {
        ionicMaterialMotion.fadeSlideIn({
            selector: '.animate-fade-slide-in .item'
        });
    }, 200);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

  //   $(".buddy").on("swiperight",function(){
  //     $(this).addClass('rotate-left').delay(700).fadeOut(1);
  //     $('.buddy').find('.status').remove();

  //     $(this).append('<div class="status like">Like!</div>');      
  //     if ( $(this).is(':last-child') ) {
  //       $('.buddy:nth-child(1)').removeClass ('rotate-left rotate-right').fadeIn(300);
  //      } else {
  //         $(this).next().removeClass('rotate-left rotate-right').fadeIn(400);
  //      }
  //   });  

  //  $(".buddy").on("swipeleft",function(){
  //   $(this).addClass('rotate-right').delay(700).fadeOut(1);
  //   $('.buddy').find('.status').remove();
  //   $(this).append('<div class="status dislike">Dislike!</div>');

  //   if ( $(this).is(':last-child') ) {
  //    $('.buddy:nth-child(1)').removeClass ('rotate-left rotate-right').fadeIn(300);
  //     alert('Na-na!');
  //    } else {
  //       $(this).next().removeClass('rotate-left rotate-right').fadeIn(400);
  //   } 
  // });


})

.controller('GalleryCtrl', function($scope, $stateParams, $timeout, ionicMaterialInk, ionicMaterialMotion) {
    $scope.$parent.showHeader();
    $scope.$parent.clearFabs();
    $scope.isExpanded = true;
    $scope.$parent.setExpanded(true);
    $scope.$parent.setHeaderFab(false);

    // Activate ink for controller
    ionicMaterialInk.displayEffect();

    ionicMaterialMotion.pushDown({
        selector: '.push-down'
    });
    ionicMaterialMotion.fadeSlideInRight({
        selector: '.animate-fade-slide-in .item'
    });

})

.controller('validateLogin', function($scope,  $location, $ionicHistory) {

    var sc = this;

    $scope.validate = function (userId, password){
        console.log("called")
        if (userId == '11008020' && password == "1234"){
            // $ionicHistory.nextViewOptions({
            //     disableAnimate: true,
            //     disableBack: true
            // });
            console.log("logging in");
            $location.path('/app/profile')
            $scope.$apply()
            // alert("Successful");
        }
        else {
            console.log("invalid credentials")
            alert("failed");
        }

    }

    $("#loginBTN").on('click', function(){
        if (sc.userId && sc.password){
            $scope.validate(sc.userId, sc.password)
        }
    });

})

.controller('customTabs', function (){
    console.log('hello controller tab reached')
    $('.custom-tabs').on('click', function(e){

        e.preventDefault();
        $('.custom-tabs').removeClass('tabSelected');
        $(e.currentTarget).addClass('tabSelected');
        $('.tabviews').hide();
        // console.log(e.currentTarget)
        $('.'+e.currentTarget.id).show()
    });
})