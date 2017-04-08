/**
 * Created by dthesiya on 4/4/17.
 */
var hackathonApp = angular.module('hackathonApp', ['ngRoute']);

hackathonApp.config(function ($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "/placeOrder.ejs",
            controller: "orderController"
        })
        .when("/details", {
            templateUrl: "/orderDetails.ejs",
            controller: "orderController"
        })
        .when("/edit", {
            templateUrl: "editOrder.ejs",
            controller: "orderController"
        })
        .when("/status", {
            templateUrl: "orderStatus.ejs",
            controller: "orderController"
        })
        .when("/all", {
            templateUrl: "allOrders.ejs",
            controller: "orderController"
        })
        .otherwise({
            templateUrl: "/placeOrder.ejs",
            controller: "orderController"
        });
});
