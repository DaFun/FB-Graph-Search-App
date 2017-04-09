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

var myApp = angular.module('navi', []);
myApp.controller('searchCtrl', function($scope) {
    $scope.user = '';
    $scope.page = '';
    $scope.place = '';
    $scope.event = '';
    $scope.group = '';

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
                $('#view').empty();
                $('#view').html($scope.user);
                break;
            case 'page':
                $('#view').empty();
                $('#view').html($scope.page);
                break;
            case 'place':
                $('#view').empty();
                $('#view').html($scope.place);
                break;
            case 'event':
                $('#view').empty();
                $('#view').html($scope.event);
                break;
            case 'group':
                $('#view').empty();
                $('#view').html($scope.group);
                break;
            default:
                $('#view').empty();
                $('#view').html(favorite_global);
        }
    }


    $scope.myFunc = function () {
        var bar = '<div style="margin:150px "><div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar"'+
            'aria-valuenow="40" aria-valuemin="0" aria-valuemax="80" style="width:50%"></div></div></div>';
        $('#view').html(bar);

        if ($scope.keyword) {
            fetchPlace($scope.keyword);
            fetchUser($scope.keyword);
            fetchPage($scope.keyword);
            fetchEvent($scope.keyword);
            fetchGroup($scope.keyword);
        }

        function fetchPlace(keyword) {
            getLocation();

            function getLocation() {
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(getLatLon);
                }
            }

            function getLatLon(position) {
                var crd = position.coords;
                $.ajax({
                    url: 'http://cs-server.usc.edu:10695/server.php',
                    data: {'type': 'place', 'q': keyword, 'lat': crd.latitude, 'lon': crd.longitude},
                    type: 'GET',
                    dataType: 'json',
                    //async: false,
                    crossDomain: true,
                    success: function (response, status, xhr) {
                        var data = response.data;
                        var page = response.paging;
                        $scope.place = dataParser(data, page);
                        console.log('here');
                        $scope.setActive($scope.active);
                    },
                    error: function (xhr, status, error) {
                        alert(xhr.responseText);
                    }
                });
            }
        }

        function dataParser(data, page) {
            var result = '<div class="table-responsive"><table class="table"><thead><tr><th class="col-md-p5">#</th>' +
                '<th class="col-md-2p">Profile photo</th><th class="col-md-5p5">Name</th>' +
                '<th class="col-md-1p5">Favarite</th><th class="col-md-1p5">Details</th></tr></thead><tbody>';
            for (var i = 0, len = data.length; i < len; i++) {
                result += '<tr><th scope="row" style="vertical-align:middle">' + (i+1) + '</th><td style="vertical-align:middle">';
                result += '<img src="' + data[i].picture.data.url + '" class="img-circle" alt="Responsive image" width="50" height="50">';
                result += '</td><td style="vertical-align:middle">' + data[i].name + '</td><td style="vertical-align:middle">';
                var storage = data[i].name + '^' + data[i].picture.data.url + '^' + data[i].id;
                result += '<button class="btn btn-default" onclick="clickStorage(' + storage + ')" id="'+ data[i].id +'"><span class="glyphicon glyphicon-star-empty"></span></button>';
                result += '</td><td style="vertical-align:middle">';
                result += '<button class="btn btn-default" ng-click="clickDetail(' + data[i].id + ')"><span class="glyphicon glyphicon-chevron-right"></span></button>';
                result += '</td></tr>';
            }
            result += '</tbody></table></div><div style="margin: 10px auto">';
            if (page.hasOwnProperty('previous')) {
                result += '<div class="col-sm-offset-5 col-sm-1"><button class="btn btn-default" type="submit">Previous</button></div>';
                result += '<div style="margin: 20px"><button class="btn btn-default" type="submit" style="margin: 0 20px">Next</button></div></div>';
            } else {
                result += '<div class="col-sm-offset-5 col-sm-1"></div><div style="margin: 20px"><button class="btn btn-default" type="submit" style="margin: 0 20px">Next</button></div></div>';
            }
            return result;
        }

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
                    data = response.data;
                    page = response.paging;
                    $scope.user = dataParser(data, page);
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
                    data = response.data;
                    page = response.paging;
                    $scope.page = dataParser(data, page);
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
                    data = response.data;
                    page = response.paging;
                    $scope.event = dataParser(data, page);
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
                    data = response.data;
                    page = response.paging;
                    $scope.group = dataParser(data, page);
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

function clickDelete(id) {
    localStorage.removeItem(id);
    favorite_global = getFavorite();
    $('#view').empty();
    $('#view').html(favorite_global);
}

function clickStorage(data) {
    var value = data.split("^");
    var id = value[2];
    if (id in localStorage) {
        localStorage.removeItem(id);
        $('#'+id).text('<span class="glyphicon glyphicon-star-empty"></span>');
    } else {
        localStorage.setItem(id, data);
        $('#'+id).text('<span class="glyphicon glyphicon-star"></span>');
    }
}