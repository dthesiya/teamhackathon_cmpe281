hackathonApp.controller('orderController', function($scope, $http, $location) {
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

    $scope.placeOrder = function(){
        var order = {
            location : "",
            items : []
        };
        var item;
        $.each($('#myForm').serializeArray(), function(i, field) {
            switch(field.name){
                case "location":{
                    order.location = field.value;
                    break;
                }
                case "coffee":{
                    item = {};
                    item.coffee = field.value;
                    break;
                }
                case "qty":{
                    item.qty = field.value;
                    break;
                }
                case "milk_type":{
                    item.milk_type = field.value;
                    break;
                }
                case "size":{
                    item.size = field.value;
                    order.items.push(item);
                    break;
                }
            }
        });
        console.log(order);
        // $location.path('/details');
        // $http({
        //     method : "POST",
        //     url : '/order'
        // }).success(function(data, status) {
        //     $scope.prices = JSON.parse(data);
        // }).error(function(error) {
        //     console.log(error);
        // });
    };

    $scope.getOrderDetails = function() {
        $http({
            method : "GET",
            url : '/order/'+$scope.orderId
        }).success(function(data, status) {
            $scope.order = JSON.parse(data);
        }).error(function(error) {
            console.log(error);
        });
    };
});