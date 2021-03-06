'use strict';

angular.module('myApp.otherUserProfile', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/otherUserProfile/:otherUserId', {
            templateUrl: 'otherUserProfile/otherUserProfile.html',
            controller: 'otherUserProfileCtrl',
            resolve: {
                // controller will not be loaded until $requireSignIn resolves
                // Auth refers to our $firebaseAuth wrapper in the factory below
                "currentAuth": ["Auth", function(Auth) {
                    // $requireSignIn returns a promise so the resolve waits for it to complete
                    // If the promise is rejected, it will throw a $routeChangeError (see above)
                    return Auth.$requireSignIn();
                }]

            }
        });
    }])
    .controller('otherUserProfileCtrl', ['$scope', '$rootScope', '$routeParams', 'currentAuth', 'UsersFollowService', 'Post',
        function ($scope, $rootScope, $routeParams, currentAuth, UsersFollowService, Post) {
            $scope.dati = {};
            $rootScope.dati= {};
            $rootScope.dati.currentView = "otherUserProfile";

            $scope.dati.userId = UsersFollowService.getUserInfo(currentAuth.uid);
            $scope.dati.otherUserId = $routeParams.otherUserId;
            $scope.dati.otherUserInfo = UsersFollowService.getUserInfo($scope.dati.otherUserId);
            $scope.dati.area = 'profilo';

            $scope.Autore = function (autoreId) {
                if (autoreId === $scope.dati.otherUserId){
                    return autoreId;
                }
            };
            $scope.orderProp = "autoreId";

            $scope.orderProp1 = "followed";

            $scope.dati.posts = Post.getData();
            $scope.dati.follows = UsersFollowService.getFollow();
            $scope.dati.notFollowing = true;

            $scope.dati.follows.$loaded().then(function(){
                var following = $scope.dati.follows;
                for (var keySingleFlowing in following) {
                    if (!angular.isFunction(keySingleFlowing)) {
                        if (!angular.isFunction(following[keySingleFlowing])) {
                            if (following[keySingleFlowing]!==undefined && following[keySingleFlowing].follower!==undefined) {
                                if ($scope.dati.userId.$id === following[keySingleFlowing].follower.id) {
                                    if ($scope.dati.otherUserInfo.$id === following[keySingleFlowing].followed) {
                                        $scope.dati.notFollowing = false;
                                    }
                                }
                            }
                        }
                    }
                }
            });
            $scope.dati.yetFollowing = false;
            $scope.dati.follows.$loaded().then(function(){
                var following = $scope.dati.follows;
                for (var keySingleFlowing in following) {
                    if (!angular.isFunction(keySingleFlowing)) {
                        if (!angular.isFunction(following[keySingleFlowing])) {
                            if (following[keySingleFlowing]!==undefined && following[keySingleFlowing].follower!==undefined) {
                                if ($scope.dati.userId.$id === following[keySingleFlowing].follower.id) {
                                    if ($scope.dati.otherUserInfo.$id === following[keySingleFlowing].followed) {
                                        $scope.dati.Follow = following[keySingleFlowing].id;
                                        console.log($scope.dati.Follow);
                                        $scope.dati.yetFollowing = true;

                                    }
                                }
                            }
                        }
                    }
                }
                return false;
            });


            $scope.CreateFollow = function() {
                UsersFollowService.insertNewUsersFollow($scope.dati.userId, $routeParams.otherUserId, $scope.dati.otherUserInfo.name, $scope.dati.otherUserInfo.surname).then(function (ref) {
                    var followId = ref.key;
                    UsersFollowService.updateUsersFollow(followId);
                    if ($scope.dati.otherUserInfo.numFollowers== null){
                        UsersFollowService.setNumeroFollowers($scope.dati.otherUserId);
                    }else{
                        UsersFollowService.updateUsersFollow($scope.dati.otherUserId);
                    }
                    /*if ($scope.dati.numFollowing == null){
                        UsersFollowService.setNumeroFollowers($scope.dati.userId);
                    }else{
                        UsersFollowService.updateUsersFollow($scope.dati.userId);
                    }*/

                    $scope.dati.notFollowing = false;
                    $scope.dati.yetFollowing = true;

                });
            };

            $scope.removeFollow = function (followId) {
                UsersFollowService.deleteFollow(followId);
                $scope.dati.notFollowing = true;
                $scope.dati.yetFollowing =false;
            };
            //PER ANDARE A RICETTARIO
            $scope.goToRicettario= function () {
                $scope.dati.area = 'ricettario';

            };
            //PER ANDARE A TUTORIAL
            $scope.goToTutorial= function () {
                $scope.dati.area = 'tutorial';

            };
            //PER ANDARE A MEDAGLIE
            $scope.goToMedaglie= function () {
                $scope.dati.area = 'medaglie';

            };
            //PER TORNARE A PROFILO
            $scope.goToProfilo= function () {
                $scope.dati.area = 'profilo';

            };

            $scope.closeModalFollowers = function () {
                var modalDiv = $("#followers");
                modalDiv.modal('hide');
            };
            $scope.closeModalFollowing = function () {
                var modalDiv = $("#following");
                modalDiv.modal('hide');
            };
        }


    ]);
