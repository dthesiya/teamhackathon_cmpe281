hackathonApp.controller('statusController', function($scope, $http, $location) {



    
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
});