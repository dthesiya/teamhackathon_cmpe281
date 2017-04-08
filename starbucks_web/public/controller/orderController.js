hackathonApp.controller('orderController', function($scope, $http, $location) {
    $http({
        method : "GET",
        url : '/prices'
    }).success(function(data, status) {
        $scope.prices = JSON.parse(data);
    }).error(function(error) {
        console.log(error);
    });
    $scope.progressValue = 0;

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
            sessionStorage.setItem("orderId", data.orderId);
            console.log("success in placing order");
            $location.path('/details');
        }).error(function(error) {
            console.log(error);
        });
    };

    $scope.getOrderDetails = function() {
        $http({
            method : "GET",
            url : '/order/' + sessionStorage.getItem("orderId")
        }).success(function(data, status) {
            $scope.order = JSON.parse(data);
            $scope.amount = 0;
            for(var i = 0; i < $scope.order.items.length; i++){
                var item = $scope.order.items[i];
                $scope.amount += (item.qty * $scope.prices[item.size]);
            }
        }).error(function(error) {
            console.log(error);
        });
    };

    $scope.getOrderStatus = function() {
        $http({
            method : "GET",
            url : '/order/' + sessionStorage.getItem("orderId")
        }).success(function(data, status) {
            $scope.order = JSON.parse(data);
            $scope.amount = 0;
            for(var i = 0; i < $scope.order.items.length; i++){
                var item = $scope.order.items[i];
                $scope.amount += (item.qty * $scope.prices[item.size]);
            }
            changeProgressValue(25);
            setTimeout(function () {
                changeProgressValue(50);
                setTimeout(function () {
                    changeProgressValue(75);
                    setTimeout(function () {
                        changeProgressValue(100);
                    }, 3000);
                }, 5000);
            }, 3000);
        }).error(function(error) {
            console.log(error);
        });
    };

    function changeProgressValue(value){
        switch(value){
            case 25:
                jQuery('#status').html("PLACED & PAID");
                break;
            case 50:
                jQuery('#status').html("PREPARING");
                break;
            case 75:
                jQuery('#status').html("SERVED");
                break;
            case 100:
            default:
                jQuery('#status').html("COLLECTED");
                jQuery('.progress-bar').removeClass("progress-bar-info").addClass("progress-bar-success");
                jQuery('.progress-striped').removeClass("active");
                break;
        }
        jQuery('#progressbar').css('width', value + '%').attr('aria-valuenow', value);
    };

    $scope.getValue = function(status){
        var result;
        switch(status){
            case "COLLECTED":
                result=100;
                break;
            case "PAID":
                result=40;
                break;
            case "PREPARING":
                result=60;
                break;
            case "SERVED":
                result=80;
                break;
            case "PLACED":
            default:
                result=20;
                break;
        }
        return result;
    }

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
            console.log("success in updating order");
            $location.path('/details');
        }).error(function(error) {
            console.log(error);
        });
    };

    $scope.payOrder = function(){
        $http({
            method : "PUT",
            url : '/pay/' + sessionStorage.getItem("orderId")
        }).success(function(data, status) {
            console.log("success in order payment");
            $location.path('/status');
        }).error(function(error) {
            console.log(error);
        });
    };

    $scope.cancelOrder = function(){
        $http({
            method : "DELETE",
            url : '/order/' + sessionStorage.getItem("orderId")
        }).success(function(data, status) {
            console.log(status);
            console.log(data);
            console.log("success in order cancellation");
            $location.path('/');
        }).error(function(error) {
            console.log(error);
        });
    };

    $scope.getAllOrders = function(){
        $scope.city = "San Jose";
        $http({
            method : "GET",
            url : '/orders',
            headers: {
                'city': 'San Jose'
            }
        }).success(function(data, status) {
            $scope.orders = JSON.parse(data);
        }).error(function(error) {
            console.log(error);
        });
    };

    $scope.onLocationChange = function(){
        $http({
            method : "GET",
            url : '/orders',
            headers: {
                'city': $scope.city
            }
        }).success(function(data, status) {
            console.log(data);
            $scope.orders = JSON.parse(data);
        }).error(function(error) {
            console.log(error);
        });
    };

    $scope.editOrder = function(){
        $location.path('/edit');
    };

    $scope.newOrder = function(){
        $location.path('/');
    };

    $scope.allOrders = function(){
        $location.path('/all');
    };
});