var app = angular.module("bc-instagram", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider.when("/alerts", {
         templateUrl : "/templates/alerts.html"
    }).when("/suggestions", {
        templateUrl: "/templates/suggestions.html"
    }).when("/profile/:userName", {
        templateUrl: "/templates/profile.html"
    }).otherwise({
        templateUrl: '/templates/feed.html'
    });
});

app.controller('bc-instagram-controller', function ($scope, $rootScope, $routeParams, $http, $route) {
    $http.get('/currentUser').success(function (data) {
        $scope.currentUser = data;
        console.dir(data);
    }).error(function () {
        alert('Unable to load currentUser: ' + error);
    });

    $scope.currentUserName = function () {
        if ($scope.currentUser) {
            return $scope.currentUser.firstName + ' ' +
                ($scope.currentUser.middleName ? $scope.currentUser.middleName + ' ' : '') + 
                $scope.currentUser.lastName;
        } else {
            return "HACKER";
        }
    };

    $scope.getTemplate = function(path) {

        path = path.substr('/templates/'.length);
        path = path.substr(0, path.length - ".html".length);
        return path;
    };

    /**
     * Tests whether the profile should be loaded as read-only
     */
    $scope.getProfileReadOnly = function() {

        if ($scope.profileUser && $scope.profile.currentUser)
        {
            return $scope.profileUser.userName !== $scope.profile.currentUser.userName;
        }
        else
        {
            return true;
        }
    };

    $scope.$on('$viewContentLoaded', function(event) {

        var view = $scope.getTemplate($route.current.templateUrl);

        if (view === "alerts")
        {

        }
        else if (view === "suggestions")
        {
            $scope.suggestion = {
                user: {
                    userName: "jku",
                    firstName: "Jing",
                    lastName: "Ku"
                },
                postIds: [2, 3, 4]
            };
        }
        else if (view === "profile")
        {
            if (!$routeParams.userName)
            {
                $routeParams.userName = $scope.currentUser.userName;
            }

            // Load profile here
            //setTimeout(function() {
                $http.get("/profile/" + $routeParams.userName).success(function(data) {
                    $scope.profileUser = data;
                });
            //}, 500);
        }
        else if (view === "feed")
        {
            $http.get("/get-posts").success(function(data) {
                $scope.posts = data;
            });
        }
    });
});


/*
var loadUserProfile = function (userName) {

    $('div#userName').text(userName);

    var profile;

    $.ajax('/profile/' + userName, {
        async: true,
        cache: false,
        dataType: 'json',
        method: 'GET',
        success: function (data) {
            loadProfileData(data);
            loadUserTweets(userName);
        },
        error: function (jqXhr, status, error) {
            alert('Unable to load profile: ' + error);
        }
    });
};

var loadProfileData = function (profile) {

    if (profile) {
        var user = profile.user;

        if (user.userName === $('#currentUser').val()) {
            // load for update
            $('input#firstName').val(user.firstName);
            $('input#middleName').val(user.middleName);
            $('input#lastName').val(user.lastName);
            $('input#firstName').show();
            $('input#middleName').show();
            $('input#lastName').show();
            $('div#firstName').hide();
            $('div#middleName').hide();
            $('div#lastName').hide();
            $('#updateProfileButton').show();
        }
        else {
            // load for display
            $('div#firstName').text(user.firstName);
            $('div#middleName').text(user.middleName);
            $('div#lastName').text(user.lastName);
            $('input#firstName').hide();
            $('input#middleName').hide();
            $('input#lastName').hide();
            $('div#firstName').show();
            $('div#middleName').show();
            $('div#lastName').show();
            $('#updateProfileButton').hide();
        }
    }

    $('#followers-div').text('');

    if (profile.followers && profile.followers.length) {
        for (var i = 0; i < profile.followers.length; i++) {
            $('#followers-div').append("<div>" + profile.followers[i].userName + "</div>");
        }
    }
    else {
        $('#followers-div').html("<strong>You don't have any followers, but <em>I</em> love you!</strong>");
    }

    $('#following-div').follower({
        following: profile.following,
        userName: profile.user.userName
    });
};

var loadHtml = function (url, cb) {

    $.ajax(url, {
        cache: false,
        method: 'GET',
        dataType: 'html',
        error: function (jqXhr, status, err) {
            alert('Unable to load url ' + url + ': ' + err);
        },
        success: function (html) {
            $('#appContent').html(html);

            if (cb) {
                cb();
            }
        }
    });
};
*/