var item = angular.module('payment', ['ngRoute']);

item.controller('paymentController',
    function ($scope, $http, $location, $window) {
        $scope.paymentitems = [];
        $scope.payment_total = 0;
        $scope.result = "";
        $scope.getPaymentDetails = function () {
            var is_cart = window.is_cart;
            var item_id = window.item_id;
            var quantity = window.quantity;
            console.log(window.is_cart);
            $scope.is_cart = is_cart;
            $scope.item_id = item_id;
            $scope.quantity = quantity;
            if (is_cart === null || is_cart === undefined) {
                $window.location.href = "/";
            }
            if (is_cart === true) {
                $http({
                    method: "POST",
                    url: '/cartItems',
                    data: {}
                }).success(
                    function (data, status) {
                        $scope.paymentitems = data;
                        var total = 0;
                        angular.forEach($scope.paymentitems, function (value, key) {
                            value.total = value.price
                                * value.selected_quantity;
                            total += value.total;
                        });
                        $scope.payment_total = total;
                    }).error(function (error) {
                });
            } else {
                $http({
                    method: "POST",
                    url: '/itemDetails?item_id=' + item_id,
                    data: {}
                }).success(function (data, status) {
                    data.selected_quantity = quantity;
                    $scope.paymentitems.push(data);
                    data.total = quantity * data.price;
                    $scope.payment_total += data.total;
                }).error(function (error) {
                });
            }
            $http({
                method: "GET",
                url: '/userDetails',
                data: {}
            }).success(function (data, status) {
                $scope.user = data;
            }).error(function (error) {
            });
        };

        $scope.pay = function () {
            var d = {
                ccnumber: $scope.CCNumber,
                month: $scope.month,
                year: $scope.year,
                cvv: $scope.cvv,
                is_cart: $scope.is_cart,
                item_id: $scope.item_id,
                quantity: $scope.quantity
            };
            $http.post('/pay', d)
                .success(function (data) {

                    if (data) {
                        $window.location.href = "/";
                    }
                })
                .error(function (data) {
                    console.log(data);
                });

            // $http({
            //     method: "POST",
            //     url: '/pay',
            //     data: d
            // }).success(function (data, status) {
            //     console.log(data);
            //     console.log(status);
            //     $window.location.href = "/";
            // }).error(function (error) {
            //     console.log(error);
            //     $window.location.href = "/";
            // });
        };
    });