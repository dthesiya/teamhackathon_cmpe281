hackathonApp.controller('orderController', function($scope, $http, $location) {
    $scope.isError = false;
    var errMsg = "An error occurred.";
    $scope.errorMessage = errMsg;
    $http({
        method : "GET",
        url : '/coffees'
    }).success(function(data, status) {
        $scope.coffees = data;
        $scope.prices = $scope.coffees.prices;
    }).error(function(error) {
        console.log(error);
        //set error message
        $scope.isError = true;
    });

    $http({
        method : "GET",
        url : '/locations'
    }).success(function(data, status) {
        $scope.locations = data;
    }).error(function(error) {
        console.log(error);
        //set error message
        $scope.isError = true;
        $scope.errorMessage = errMsg;
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
            console.log(data);
            if(data.data.status === "200"){
                sessionStorage.setItem("orderId", data.data.order_id);
                sessionStorage.setItem("location", order.location);
                $location.path('/details');
            }else{
                //set error message
                $scope.isError = true;
                $scope.errorMessage = data.data.message;
            }
        }).error(function(error) {
            console.log(error);
            //set error message
            $scope.isError = true;
            $scope.errorMessage = errMsg;
        });
    };

    $scope.getOrderDetails = function() {
        $http({
            method : "GET",
            url : '/order/' + sessionStorage.getItem("orderId"),
            headers: {
                'location': sessionStorage.getItem("location")
            }
        }).success(function(data, status) {
            if(data.data.status === "200"){
                $scope.order = data.data.order;
            }else{
                //set error message
                $scope.isError = true;
                $scope.errorMessage = data.data.message;
            }
        }).error(function(error) {
            console.log(error);
            //set error message
            $scope.isError = true;
            $scope.errorMessage = errMsg;
        });
    };

    $scope.getOrderStatus = function() {
        var myInterval = setInterval(function(){
            $http({
                method : "GET",
                url : '/order/' + sessionStorage.getItem("orderId"),
                headers: {
                    'location': sessionStorage.getItem("location")
                }
            }).success(function(data, status) {
                if(data.data.status === "200"){
                    $scope.order = data.data.order;
                    changeProgressValue($scope.order.status);
                    if($scope.order.status === 'COLLECTED'){
                        clearInterval(myInterval);
                    }
                }else{
                    //set error message
                    $scope.isError = true;
                    $scope.errorMessage = data.data.message;
                }
            }).error(function(error) {
                console.log(error);
                //set error message
                $scope.isError = true;
                $scope.errorMessage = errMsg;
            });
        },1000);
    };

    function changeProgressValue(status){
        var value;
        switch(status){
            case 'PAID':
                value = 25;
                jQuery('#status').html("PLACED & PAID");
                break;
            case 'PREPARING':
                value = 50;
                jQuery('#status').html("PREPARING");
                break;
            case 'SERVED':
                value = 75;
                jQuery('#status').html("SERVED");
                break;
            case 'COLLECTED':
                value = 100;
                jQuery('#status').html("COLLECTED");
                jQuery('.progress-bar').removeClass("progress-bar-info").addClass("progress-bar-success");
                jQuery('.progress-striped').removeClass("active");
                break;
            case 'PLACED':
            default:
                value = 25;
                jQuery('#status').html("PLACED");
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
            location : $scope.order.location,
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
            url : '/order/'+sessionStorage.getItem("orderId"),
            data: { order: order }
        }).success(function(data, status) {
            if(data.data.status === "200"){
                $location.path('/details');
            }else{
                //set error message
                $scope.isError = true;
                $scope.errorMessage = data.data.message;
            }
        }).error(function(error) {
            console.log(error);
            //set error message
            $scope.isError = true;
            $scope.errorMessage = errMsg;
        });
    };

    $scope.payOrder = function(){
        $http({
            method : "PUT",
            url : '/pay/' + sessionStorage.getItem("orderId"),
            headers: {
                'location': sessionStorage.getItem("location")
            }
        }).success(function(data, status) {
            if(data.data.status === "200"){
                $location.path('/status');
            }else{
                //set error message
                $scope.isError = true;
                $scope.errorMessage = data.data.message;
            }
        }).error(function(error) {
            console.log(error);
            //set error message
            $scope.isError = true;
            $scope.errorMessage = errMsg;
        });
    };

    $scope.cancelOrder = function(){
        $http({
            method : "DELETE",
            url : '/order/' + sessionStorage.getItem("orderId"),
            headers: {
                'location': sessionStorage.getItem("location")
            }
        }).success(function(data, status) {
            if(data.data.status === "200"){
                $location.path('/');
            }else{
                //set error message
                $scope.isError = true;
                $scope.errorMessage = data.data.message;
            }
        }).error(function(error) {
            console.log(error);
            //set error message
            $scope.isError = true;
            $scope.errorMessage = errMsg;
        });
    };

    $scope.getAllOrders = function(){
        $scope.city = "San Jose";
        $http({
            method : "GET",
            url : '/orders',
            headers: {
                'location': $scope.city
            }
        }).success(function(data, status) {
            if(data.data.status === "200"){
                $scope.orders = data.data.orders;
            }else{
                //set error message
                $scope.isError = true;
                $scope.errorMessage = data.data.message;
            }
        }).error(function(error) {
            console.log(error);
            //set error message
            $scope.isError = true;
            $scope.errorMessage = errMsg;
        });
    };

    $scope.onLocationChange = function(){
        var store = $('#store').find(":selected").text();
        $http({
            method : "GET",
            url : '/orders',
            headers: {
                'location': store
            }
        }).success(function(data, status) {
            if(data.data.status === "200"){
                $scope.orders = data.data.orders;
            }else{
                //set error message
                $scope.isError = true;
                $scope.errorMessage = data.data.message;
            }
        }).error(function(error) {
            console.log(error);
            //set error message
            $scope.isError = true;
            $scope.errorMessage = errMsg;
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