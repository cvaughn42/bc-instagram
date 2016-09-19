var app = angular.module("bc-instagram", ["ngRoute"]);

app.config(function($routeProvider) {
    $routeProvider.when("/alerts", {
        templateUrl : "/templates/alerts.html"
    }).when("/suggestions", {
        templateUrl: "/templates/suggestions.html"
    }).when("/profile", {
        templateUrl: "/templates/profile.html"
    }).otherwise({
        templateUrl: '/templates/feed.html'
    });
});

app.controller('bc-instagram-controller', function ($scope, $rootScope) {
    $.ajax('/currentUser', {
        async: false,
        cache: false,
        dataType: 'json',
        method: 'GET',
        success: function (data) {
            $scope.currentUser = data;
            console.dir(data);
        },
        error: function (jqXhr, status, error) {
            alert('Unable to load currentUser: ' + error);
        }
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

    $scope.$on('$viewContentLoaded', function(event) {
        console.log("content loaded");
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