//loading the 'login' angularJS module
var app = angular.module('app', [ 'ngRoute' ]);

app.controller('appController', function($scope, $http) {
    $scope.getPrices = function() {
        $scope.prices = [];
        $http({
            method : "GET",
            url : '/prices'
        }).success(function(data, status) {
            $scope.prices = JSON.parse(data);
        }).error(function(error) {
            console.log(error);
        });
    };
});