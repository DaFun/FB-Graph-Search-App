/**
 * Created by Ban on 4/3/2017.
 */
function getFavorite() {
    var result = '<div class="table-responsive"><table class="table"><thead><tr><th class="col-md-p5">#</th>' +
        '<th class="col-md-2p">Profile photo</th><th class="col-md-5p5">Name</th>' +
        '<th class="col-md-1p5">Favarite</th><th class="col-md-1p5">Details</th></tr></thead><tbody>';
    var index = 1;
    if (window.localStorage.length === 0) {
        return '';
    }
    for (var i in window.localStorage){
        var data = localStorage.getItem(i);
        var value = data.split("^");
        var name = value[0];
        var url = value[1];
        result += '<tr><th scope="row" style="vertical-align:middle">' + index + '</th><td style="vertical-align:middle">';
        result += '<img src="' + url + '" class="img-circle" alt="Responsive image" width="50" height="50">';
        result += '</td><td style="vertical-align:middle">' + name + '</td><td style="vertical-align:middle">';
        result += '<button class="btn btn-default" ng-click="clickDelete(' + i + ')"><span class="glyphicon glyphicon-trash"></span></button>';
        result += '</td><td style="vertical-align:middle">';
        result += '<button class="btn btn-default" ng-click="clickDetail(' + i + ')"><span class="glyphicon glyphicon-chevron-right"></span></button>';
        result += '</td></tr>';
        index++;
    }
    result += '</tbody></table></div>';
    return result;
}

var favorite_global = getFavorite();

angular.module('navi', [])
    .controller('searchCtrl', function($scope, $http) {
        $scope.user = '';
        $scope.page = '';
        $scope.place = '';
        $scope.event = '';
        $scope.group = '';
        $scope.article = 1;

        $scope.active = 'user';
        setActiveTab($scope.active);
        $scope.clickStorage = function(data) {
            var info = data.split('^');
            var id = info[2];
            if (localStorage.getItem(id) === null) {
                localStorage.setItem(id, data);
                $('#'+id).addClass('like');
            } else {
                localStorage.removeItem(id);
                $('#'+id).removeClass('like');
            }
        }


        $scope.setActive = function(tab) {
            unActiveTab($scope.active);
            $scope.active = tab;
            setActiveTab($scope.active);
            switch($scope.active) {
                case 'user':
                    $scope.currentview = $scope.user;
                    break;
                case 'page':

                    $scope.currentview = $scope.page;
                    break;
                case 'place':

                    $scope.currentview = $scope.place;
                    break;
                case 'event':

                    $scope.currentview = $scope.event;
                    break;
                case 'group':

                    $scope.currentview = $scope.group;
                    break;
                default:
                    $scope.currentview = favorite_global;
            }
        }

        $scope.clickDelete = function(id) {
            localStorage.removeItem(id);
            favorite_global = getFavorite();
            $('#view').empty();
            $('#view').html(favorite_global);
        }

        $scope.clickStorage = function(data) {
            if (data.id in localStorage) {
                localStorage.removeItem(data.id);
                $('#'+data.id).html('<span class="glyphicon glyphicon-star-empty"></span>');
            } else {
                localStorage.setItem(data.id, data);
                $('#'+data.id).html('<span class="glyphicon glyphicon-star add-star"></span>');
            }
        }

        $scope.fetchPlace = function(keyword) {
            getLocation();

            function getLocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(getLatLon);
                }
            }

            function getLatLon(position) {
                var crd = position.coords;
                $http({
                    //dataType: 'json',
                    //async: false,
                    //crossDomain: true,
                    url: 'http://cs-server.usc.edu:10695/server.php',
                    params: {'type': 'place', 'q': keyword, 'lat': crd.latitude, 'lon': crd.longitude},
                    method: 'GET'}).then(function success(response) {
                        $scope.place = response.data;
                        console.log(response);
                        $('#view').empty();
                        //$scope.currentview = response;
                        $scope.setActive($scope.active);
                });
            }
        }

        $scope.myNext = function(link) {
            $http({
                url: 'http://cs-server.usc.edu:10695/server.php',
                params: {'link': link},
                method: 'GET'}).then(function success(response) {
                    currentview = response;
                    console.log("next");
                    //console.log(response);
                    //$scope.setActive($scope.active);
                });
        }

        $scope.myPre = function(link) {
            $http({
                url: 'http://cs-server.usc.edu:10695/server.php',
                params: {'link': link},
                method: 'GET'}).then(function success(response) {
                    currentview = response;
                    console.log("pre");
                    //console.log(response);
                    //$scope.setActive($scope.active);
                });
        }

        $scope.clickDetail = function(id) {
            $scope.article = 2;

        }

        $scope.myFunc = function () {
            var bar = '<div style="margin:150px "><div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar"'+
                'aria-valuenow="40" aria-valuemin="0" aria-valuemax="80" style="width:50%"></div></div></div>';
            $('#view').html(bar);

            if ($scope.keyword) {
                fetchUser($scope.keyword);
                fetchPage($scope.keyword);
                fetchEvent($scope.keyword);
                fetchGroup($scope.keyword);
                $scope.fetchPlace($scope.keyword);
            }
            //$scope.setActive($scope.active);


            function fetchUser(keyword) {
                var data = '';
                var page = '';
                $.ajax({
                    url: 'http://cs-server.usc.edu:10695/server.php',
                    data: {'type': 'user', 'q': keyword},
                    type: 'GET',
                    dataType: 'json',
                    crossDomain: true,
                    success: function(response, status, xhr) {
                        $scope.user = response;
                    },
                    error: function(xhr, status, error) {
                        alert(xhr.responseText);
                    }
                });
            }

            function fetchPage(keyword) {
                var data = '';
                var page = '';
                $.ajax({
                    url: 'http://cs-server.usc.edu:10695/server.php',
                    data: {'type': 'page', 'q': keyword},
                    type: 'GET',
                    dataType: 'json',
                    crossDomain: true,
                    success: function(response, status, xhr) {

                        $scope.page = response;
                    },
                    error: function(xhr, status, error) {
                        alert(xhr.responseText);
                    }
                });
            }


            function fetchEvent(keyword) {
                var data = '';
                var page = '';
                $.ajax({
                    url: 'http://cs-server.usc.edu:10695/server.php',
                    data: {'type': 'event', 'q': keyword},
                    type: 'GET',
                    dataType: 'json',
                    crossDomain: true,
                    success: function(response, status, xhr) {
                        //console.log(response);

                        $scope.event = response;
                    },
                    error: function(xhr, status, error) {
                        alert(xhr.responseText);
                    }
                });
            }

            function fetchGroup(keyword) {
                var data = '';
                var page = '';
                $.ajax({
                    url: 'http://cs-server.usc.edu:10695/server.php',
                    data: {'type': 'group', 'q': keyword},
                    type: 'GET',
                    dataType: 'json',
                    //async: false,
                    crossDomain: true,
                    success: function(response, status, xhr) {
                        //console.log(response);
                        $scope.group = response;
                    },
                    error: function(xhr, status, error) {
                        alert(xhr.responseText);
                    }
                });
            }
        }
    });




function setActiveTab(tab) {
    $('#'+tab).addClass('active');
}

function unActiveTab(tab) {
    $('#'+tab).removeClass('active');
}

