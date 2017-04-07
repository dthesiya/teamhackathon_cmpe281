hackathonApp.controller('orderController', function($scope, $http, $location) {
    $http({
        method : "GET",
        url : '/prices'
    }).success(function(data, status) {
        $scope.prices = JSON.parse(data);
    }).error(function(error) {
        console.log(error);
    });

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
                case "name":{
                    item = {};
                    item.name = field.value;
                    break;
                }
                case "qty":{
                    item.qty = parseInt(field.value);
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
        $http({
            method : "POST",
            url : '/order',
            data: {order: order}
        }).success(function(data, status) {
            console.log(status);
            console.log("success in placing order");
            $location.path('/details');
        }).error(function(error) {
            console.log(error);
        });
    };

    $scope.getOrderDetails = function() {
        $http({
            method : "GET",
            url : '/order/1234'
        }).success(function(data, status) {
            $scope.order = JSON.parse(data);
        }).error(function(error) {
            console.log(error);
        });
    };

    $scope.updateOrder = function(){
        var order = {
            id: $scope.order.id,
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
                case "name":{
                    item = {};
                    item.name = field.value;
                    break;
                }
                case "qty":{
                    item.qty = parseInt(field.value);
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
        $http({
            method : "PUT",
            url : '/order/'+$scope.order.id,
            data: {order: order}
        }).success(function(data, status) {
            console.log(status);
            console.log("success in updating order");
            $location.path('/details');
        }).error(function(error) {
            console.log(error);
        });
    };

    $scope.payOrder = function(){
        $http({
            method : "PUT",
            url : '/pay/'+$scope.order.id
        }).success(function(data, status) {
            console.log(status);
            console.log(data);
            console.log("success in order payment");
            $location.path('/status');
        }).error(function(error) {
            console.log(error);
        });
    };

    $scope.cancelOrder = function(){
        $http({
            method : "DELETE",
            url : '/order/'+$scope.order.id
        }).success(function(data, status) {
            console.log(status);
            console.log(data);
            console.log("success in order cancellation");
            $location.path('/');
        }).error(function(error) {
            console.log(error);
        });
    };

    $scope.editOrder = function(){
        $location.path('/edit');
    };
});