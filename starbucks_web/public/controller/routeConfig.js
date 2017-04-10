/**
 * Created by dthesiya on 4/4/17.
 */
var hackathonApp = angular.module('hackathonApp', ['ngRoute']);

hackathonApp.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "/placeOrder.ejs"
        })
        .when("/details", {
            templateUrl: "/orderDetails.ejs"
        })
        .when("/edit", {
            templateUrl: "editOrder.ejs"
        })
        .when("/status", {
            templateUrl: "orderStatus.ejs"
        })
        .when("/all", {
            templateUrl: "allOrders.ejs"
        })
        .otherwise({
            templateUrl: "/placeOrder.ejs"
        });
});
