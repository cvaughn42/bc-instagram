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