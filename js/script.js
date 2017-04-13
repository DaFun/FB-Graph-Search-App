/**
 * Created by Ban on 4/3/2017.
 */

angular.module('navi', ['ngAnimate'])
    .controller('searchCtrl', function($scope, $http) {
        $scope.user = '';
        $scope.page = '';
        $scope.place = '';
        $scope.event = '';
        $scope.group = '';
        $scope.article = 1;

        $scope.active = 'users';
        setActiveTab($scope.active);

        localStorage.clear();
        $scope.clickStorage = function(data, index, type) {
            var id = data.id;
            console.log(data);
            var obj = { type: type, data: data };
            if (localStorage.getItem(id) === null) {
                localStorage.setItem(id, JSON.stringify(obj));
                $scope.star[index] = true;
            } else {
                localStorage.removeItem(id);
                $scope.star[index] = false;
            }
        }

        $scope.storage = function(data, type) {
            var id = data.id;
            //console.log(data);
            if (localStorage.getItem(id) === null) {
                localStorage.setItem(id, JSON.stringify({type: type, data: data}));
                $scope.starS = true;
            } else {
                localStorage.removeItem(id);
                $scope.starS = false;
            }
        }

        $scope.getFavorite = function() {
            var result = [];
            for (var i in localStorage) {
                var record = JSON.parse(localStorage.getItem(i));
                if (record) {
                    result.push(record);
                }
            }
            return result;
        }

        $scope.star = new Array(25);

        $scope.getAllStar = function() {
            if ($scope.currentview) {
                for (var i = 0; i < $scope.currentview.data.length; ++i) {
                    if (localStorage.getItem($scope.currentview.data[i].id) === null) {
                        $scope.star[i] = false;
                    } else {
                        $scope.star[i] = true;
                    }
                }
            }
        }

        $scope.clickFB = function(data) {
            FB.ui({
                app_id: '109790709575403',
                method: 'feed',
                link: window.location.href,
                picture: data.picture.data.url,
                name: data.name,
                caption: 'FB SEARCH FROM USC CSCI571',
            }, function(response){
                if (response && !response.error_message)
                    alert('Posted Successfully');
                else
                    alert('Not Posted');
            });
        }

        $scope.setActive = function(tab) {
            unActiveTab($scope.active);
            $scope.active = tab;
            setActiveTab($scope.active);
            switch($scope.active) {
                case 'users':
                    $scope.currentview = $scope.user;
                    $scope.getAllStar();
                    $scope.article = 1;
                    break;
                case 'pages':
                    $scope.currentview = $scope.page;
                    $scope.getAllStar();
                    $scope.article = 1;
                    break;
                case 'places':
                    $scope.currentview = $scope.place;
                    $scope.getAllStar();
                    $scope.article = 1;
                    break;
                case 'events':
                    $scope.currentview = $scope.event;
                    $scope.getAllStar();
                    $scope.article = 1;
                    break;
                case 'groups':
                    $scope.currentview = $scope.group;
                    $scope.getAllStar();
                    $scope.article = 1;
                    break;
                default:
                    $scope.currentFavorite = $scope.getFavorite();
                    $scope.article = 1;
            }
        }

        $scope.updateViews = function() {
            switch($scope.active) {
                case 'users':
                    $scope.user = $scope.currentview;
                    break;
                case 'pages':
                    $scope.page = $scope.currentview;
                    break;
                case 'places':
                    $scope.place = $scope.currentview;
                    break;
                case 'events':
                    $scope.event = $scope.currentview;
                    break;
                case 'groups':
                    $scope.group = $scope.currentview;
                    break;
                default:
                    $scope.currentFavorite = $scope.getFavorite();
            }
        }

        $scope.clickDelete = function(id) {
            localStorage.removeItem(id);
            $scope.currentFavorite = $scope.getFavorite();
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
                    url: 'http://sample-env.bcz3r45x9e.us-west-2.elasticbeanstalk.com/',
                    params: {'type': 'place', 'q': keyword, 'lat': crd.latitude, 'lon': crd.longitude},
                    method: 'GET'}).then(function success(response) {
                    $scope.place = response.data;
                    console.log(response);
                    $('#view').empty();
                    $('#view1').empty();
                    //$scope.currentview = response;
                    $scope.setActive($scope.active);
                });
            }
        }

        $scope.myNext = function(link) {
            $http({
                url: 'http://sample-env.bcz3r45x9e.us-west-2.elasticbeanstalk.com/',
                params: {'link': link},
                method: 'GET'}).then(function success(response) {
                $scope.currentview = response.data;
                console.log("next");
                $scope.updateViews();
                //console.log(response);
                //$scope.setActive($scope.active);
            });
        }

        $scope.myPre = function(link) {
            $http({
                url: 'http://sample-env.bcz3r45x9e.us-west-2.elasticbeanstalk.com/',
                params: {'link': link},
                method: 'GET'}).then(function success(response) {
                $scope.currentview = response.data;
                console.log("pre");
                $scope.updateViews();
                //console.log(response);
                //$scope.setActive($scope.active);
            });
        }

        $scope.show = new Array(5);
        $scope.show[0] = true;
        for (var i = 1; i < $scope.show.length; ++i) { $scope.show[i] = false; }

        $scope.getTime = function(time) {
            return time.substring(0,10) + ' ' + time.substring(11,19);
        }

        $scope.setDetail = function(response) {
            $scope.showTable = true;
            $scope.currentDetail = response;
        }

        $scope.getPhoto = function(id) {
            return "https://graph.facebook.com/v2.8/"+id+"/picture?access_token=EAADstsKuf0MBAO67Hm3DRV5bUx34NzfZAcrSPXid0Eky1ZAMin7YoamWnusmRj7mxF7Ns3J8Au1qNL11iDQCx7Fp4RFZADbXskaszqwCTXwmMQoIpO74FlODxtKPviXbUxHxKMnaJts0wihu8XKoj1bxlgjQfkZD";
        }

        $scope.clickDetail = function(id, data) {
            $scope.showTable = false;
            $scope.article = 2;
            //$scope.currentId = id;
            $http({
                url: 'http://sample-env.bcz3r45x9e.us-west-2.elasticbeanstalk.com/',
                params: {'id': id},
                method: 'GET'}).then(function success(response) {
                $scope.setDetail(response.data);
                console.log(response);
                //console.log($scope.showTable);
            });
            $scope.currentData = data;
            if (id in localStorage) {
                $scope.starS = true;
                //$('#'+id).html('<span class="glyphicon glyphicon-star-empty"></span>');
            } else {
                $scope.starS = false;
                //$('#'+data.id).html('<span class="glyphicon glyphicon-star add-star"></span>');
            }
        }

        $scope.clearAll = function() {
            $scope.currentview = null;
            $scope.keyword = null;
            $scope.user = null;
            $scope.page = null;
            $scope.place = null;
            $scope.event = null;
            $scope.group = null;
        }

        $scope.goBack = function() {
            $scope.getAllStar();
            $scope.article = 1;
            $scope.currentDetail = null;
            $scope.showTable = false;
            $scope.show[0] = true;
            for (var i = 1; i < $scope.show.length; ++i) { $scope.show[i] = false; }
        }

        $scope.myFunc = function () {
            var bar = '<div style="margin:100px "><div class="progress"><div class="progress-bar progress-bar-striped active" role="progressbar"'+
                'aria-valuenow="40" aria-valuemin="0" aria-valuemax="80" style="width:50%"></div></div></div>';
            $scope.currentview = null;
            $scope.showBar = false;

            if ($scope.keyword) {
                $scope.showBar = true;
                $('#view').html(bar);
                $('#view1').html(bar);
                $scope.fetchPlace($scope.keyword);
                fetchUser($scope.keyword);
                fetchPage($scope.keyword);
                fetchEvent($scope.keyword);
                fetchGroup($scope.keyword);

            } else {
                alert('Keywords required');
            }

            function fetchUser(keyword) {
                $.ajax({
                    url: 'http://sample-env.bcz3r45x9e.us-west-2.elasticbeanstalk.com/',
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
                $.ajax({
                    url: 'http://sample-env.bcz3r45x9e.us-west-2.elasticbeanstalk.com/',
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
                $.ajax({
                    url: 'http://sample-env.bcz3r45x9e.us-west-2.elasticbeanstalk.com/',
                    data: {'type': 'event', 'q': keyword},
                    type: 'GET',
                    dataType: 'json',
                    crossDomain: true,
                    success: function(response, status, xhr) {
                        $scope.event = response;
                    },
                    error: function(xhr, status, error) {
                        alert(xhr.responseText);
                    }
                });
            }

            function fetchGroup(keyword) {
                $.ajax({
                    url: 'http://sample-env.bcz3r45x9e.us-west-2.elasticbeanstalk.com/',
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
