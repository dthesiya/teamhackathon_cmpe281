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
        .when("/patients", {
            templateUrl: "patients.ejs",
            controller: "patientsController"
        })
        .when("/files", {
            templateUrl: "files.ejs",
            controller: "filesController"
        })
        .otherwise({
            templateUrl: "/placeOrder.ejs",
            controller: "orderController"
        });
});
