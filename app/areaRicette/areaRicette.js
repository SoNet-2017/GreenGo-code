'use strict';

angular.module('myApp.areaRicette', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/areaRicette', {
            templateUrl: 'areaRicette/areaRicette.html',
            controller: 'areaRicetteCtrl',
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

    .controller('areaRicetteCtrl', ['$scope', '$rootScope','$routeParams','$firebaseStorage','$firebaseAuth','Post','SinglePost','UsersInfo', 'InsertPostService',
        function($scope, $rootScope,$routeParams,$firebaseStorage, $firebaseAuth, Post, SinglePost, UsersInfo, InsertPostService) {

        $scope.dati={};
        $rootScope.dati={};
        $rootScope.dati.currentView="areaRicette";
        // $scope.dati.userId = currentAuth.uid;
        $scope.dati.userId = $firebaseAuth().$getAuth().uid;
        $scope.dati.user = UsersInfo.getUserInfo($firebaseAuth().$getAuth().uid);
        $scope.dati.posts = Post.getData();
        //$scope.dati.ingr = Ingredienti.getData();
        $scope.orderProp = "ingredienti";
        $scope.ricetteSearch = "";
        $scope.categoriaSearch = "";
        //$scope.ricettaSearch.a = {};
        //$scope.ricettaSearch.b = {};
        $scope.difficoltaSearch = "";
        $scope.dietaSearch = "";
        $scope.ricerca = true;

        //FUNZIONI PER GESTIRE BOTTONI RICERCA
        $scope.cancellaTutto = function () {
            $scope.difficoltaSearch = "";
            $scope.dietaSearch = "";
            $scope.ricetteSearch = "";
            $scope.categoriaSearch = "";
            //$scope.ricerca = false;
        };

        $scope.setRicerca = function () {
            $scope.ricerca = true;
        };

        $scope.deleteIngrediente = function () {
            $scope.ricetteSearch = "";
        };

        $scope.deleteCategoria = function () {
                $scope.categoriaSearch = "";
        };

        $scope.deleteDieta = function () {
                $scope.dietaSearch = "";

        };
        $scope.deleteDifficolta = function () {
                $scope.difficoltaSearch = "";
        };
            //salva la data di oggi e la inserisce come attributo nel firebase del post
            $scope.dati.date = new Date();
            //scompone la data completa in gg/mm/aaa da stampare in html quando serve
            var month = $scope.dati.date.getUTCMonth() + 1;
            $scope.dati.dataStampa = $scope.dati.date.getUTCDate() + "/" + month + "/" + $scope.dati.date.getUTCFullYear();
            //scompone l0ora da date in hh:mm:ss da stampare quando serve
            $scope.dati.oraStampa = $scope.dati.date.getUTCHours() + ":" + $scope.dati.date.getUTCMinutes() + ":" + $scope.dati.date.getUTCSeconds();


            $scope.dati.titolo = "";
            $scope.dati.procedimento = "";
            $scope.dati.categoria= "";
            $scope.dati.dieta="";
            $scope.dati.difficolta = "";
            $scope.dati.tempoP = "";
            $scope.dati.tempoC = "";
            $rootScope.dati.tag = "";
            $scope.dati.ingrediente1 = "";
            $scope.dati.ingrediente2 = "";
            $scope.dati.ingrediente3 = "";
            $scope.dati.ingrediente4 = "";
            $scope.dati.ingrediente5 = "";
            $scope.dati.ingrediente6 = "";
            $scope.dati.ingrediente7 = "";
            $scope.dati.ingrediente8 = "";
            $scope.dati.ingrediente9 = "";
            $scope.dati.ingrediente10 = "";
            $scope.dati.strumento1 = "";
            $scope.dati.strumento2 = "";
            $scope.dati.strumento3 = "";
            $scope.dati.strumento4 = "";
            $scope.dati.strumento5 = "";
            $scope.dati.strumento6 = "";
            $scope.dati.strumento7 = "";
            $scope.dati.strumento8 = "";
            $scope.dati.strumento9 = "";
            $scope.dati.strumento10 = "";
            $scope.dati.strumento10 = "";
            $scope.dati.vegetariana = "";
            $scope.dati.vegana = "";
            $scope.dati.senzaglutine = "";

            var ctrl = this;
            $scope.fileToUpload = null;
            $scope.imgPath = "";


            $scope.addPost = function () {

                //check if the user inserted all the required information
                if ($scope.dati.descrizione != undefined && $scope.dati.descrizione != "") {
                    $scope.dati.error = "";
                    //try to upload the image: if no image was specified, we create a new opera without an image
                    if ($scope.fileToUpload != null) {
                        //get the name of the file
                        var fileName = $scope.fileToUpload.name;
                        //specify the path in which the file should be saved on firebase
                        var storageRef = firebase.storage().ref("images/" + fileName);
                        $scope.storage = $firebaseStorage(storageRef);
                        var uploadTask = $scope.storage.$put($scope.fileToUpload);
                        uploadTask.$complete(function (snapshot) {
                            $scope.imgPath = snapshot.downloadURL;
                            $scope.finalPostAddition();
                            console.log("inserisco immagine");

                        });
                        uploadTask.$error(function (error) {
                            $scope.dati.error = error + " - the Post will be added without a descriptive image!";
                            $scope.finalPostAddition();
                        });
                    }
                    else {
                        //do not add the image
                        $scope.finalPostAddition();

                    }
                }
                else {
                    //write an error message to the user
                    $scope.dati.error = "You forgot to insert one of the required information!";
                }
            };
            //initialize the function that will be called when a new file will be specified by the user
            ctrl.onChange = function onChange(fileList) {
                $scope.fileToUpload = fileList[0];
            };


            $scope.finalPostAddition = function () {
                InsertPostService.insertNewPost($scope.dati.userId, $scope.dati.user.name, $scope.dati.user.surname, $scope.dati.user.img_url,
                    $scope.dati.descrizione, $scope.dati.date, $scope.dati.dataStampa,
                    $scope.dati.oraStampa, $scope.dati.titolo, $scope.dati.procedimento,
                    $scope.dati.categoria, $scope.dati.dieta,
                    $scope.dati.difficolta, $scope.dati.tempoP, $scope.dati.tempoC,
                    $rootScope.dati.tag, $scope.imgPath,
                    $scope.dati.ingrediente1, $scope.dati.ingrediente2, $scope.dati.ingrediente3,
                    $scope.dati.ingrediente4, $scope.dati.ingrediente5, $scope.dati.ingrediente6,
                    $scope.dati.ingrediente7, $scope.dati.ingrediente8,
                    $scope.dati.ingrediente9, $scope.dati.ingrediente10, $scope.dati.strumento1,
                    $scope.dati.strumento2, $scope.dati.strumento3, $scope.dati.strumento4,
                    $scope.dati.strumento5, $scope.dati.strumento6, $scope.dati.strumento7,
                    $scope.dati.strumento8, $scope.dati.strumento9,
                    $scope.dati.strumento10, $scope.dati.vegetariana, $scope.dati.vegana, $scope.dati.senzaglutine)
                    .then(function (ref) {

                        var postId = ref.key;
                        $scope.dati.userInfo = InsertPostService.getUserInfo($scope.dati.userId);
                        InsertPostService.updatePost(postId);
                        $scope.dati.descrizione = "";
                        $scope.dati.titolo = "";
                        $scope.dati.procedimento = "";
                        $scope.dati.categoria = "";
                        $scope.dati.dieta = "";
                        $scope.dati.difficolta = "";
                        $rootScope.dati.tempoP = "";
                        $scope.dati.tempoC = "";
                        $scope.dati.tag = "";
                        $scope.dati.ingrediente1 = "";
                        $scope.dati.ingrediente2 = "";
                        $scope.dati.ingrediente3 = "";
                        $scope.dati.ingrediente4 = "";
                        $scope.dati.ingrediente5 = "";
                        $scope.dati.ingrediente6 = "";
                        $scope.dati.ingrediente7 = "";
                        $scope.dati.ingrediente8 = "";
                        $scope.dati.ingrediente9 = "";
                        $scope.dati.ingrediente10 = "";
                        $scope.dati.strumento1 = "";
                        $scope.dati.strumento2 = "";
                        $scope.dati.strumento3 = "";
                        $scope.dati.strumento4 = "";
                        $scope.dati.strumento5 = "";
                        $scope.dati.strumento6 = "";
                        $scope.dati.strumento7 = "";
                        $scope.dati.strumento8 = "";
                        $scope.dati.strumento9 = "";
                        $scope.dati.strumento10 = "";

                        $scope.dati.vegetariana= InsertPostService.setVegetariana(postId, $scope.dati.veggi, $scope.dati.vegan);
                        $scope.dati.vegana= InsertPostService.setVegana(postId, $scope.dati.vegan);
                        $scope.dati.senzaglutine= InsertPostService.setSenzaGlutine(postId, $scope.dati.glutenfree);


                        // SERVE PER CHIUDERE IL MODAL
                        var modalDiv = $("#modalRicetta");
                        modalDiv.modal('hide');

                    });

            };
            // funzioni per l'aggiunta di input INGREDIENTI
            $scope.addIng2 = function () {
                document.getElementById("ing2").style.display = "block";
                document.getElementById("btn1").classList.remove("btn-success");
                document.getElementById("btn1").classList.add("btn-default");
            };
            $scope.addIng3 = function () {
                document.getElementById("ing3").style.display = "block";
                document.getElementById("btn2").classList.remove("btn-success");
                document.getElementById("btn2").classList.add("btn-default");
            };
            $scope.addIng4 = function () {
                document.getElementById("ing4").style.display = "block";
                document.getElementById("btn3").classList.remove("btn-success");
                document.getElementById("btn3").classList.add("btn-default");
            };
            $scope.addIng5 = function () {
                document.getElementById("ing5").style.display = "block";
                document.getElementById("btn4").classList.remove("btn-success");
                document.getElementById("btn4").classList.add("btn-default");
            };
            $scope.addIng6 = function () {
                document.getElementById("ing6").style.display = "block";
                document.getElementById("btn5").classList.remove("btn-success");
                document.getElementById("btn5").classList.add("btn-default");
            };
            $scope.addIng7 = function () {
                document.getElementById("ing7").style.display = "block";
                document.getElementById("btn6").classList.remove("btn-success");
                document.getElementById("btn6").classList.add("btn-default");
            };
            $scope.addIng8 = function () {
                document.getElementById("ing8").style.display = "block";
                document.getElementById("btn7").classList.remove("btn-success");
                document.getElementById("btn7").classList.add("btn-default");
            };
            $scope.addIng9 = function () {
                document.getElementById("ing9").style.display = "block";
                document.getElementById("btn8").classList.remove("btn-success");
                document.getElementById("btn8").classList.add("btn-default");
            };
            $scope.addIng10 = function () {
                document.getElementById("ing10").style.display = "block";
                document.getElementById("btn9").classList.remove("btn-success");
                document.getElementById("btn9").classList.add("btn-default");
            };

            // TAG RICETTA
            $scope.setTag = function (nometag) {
                $rootScope.dati.tag = nometag;
            };


        }]);

