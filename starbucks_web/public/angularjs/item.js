var item = angular.module('item', [ 'ngRoute' ]);
item.controller('itemController', function($scope, $http, $location, $window) {
	$scope.result = "";
	$scope.quantity = 1;
	$scope.bidding_price;
	$scope.getItemDetails = function() {
		var item_id = window.item_id;
		$scope.item_id = item_id;
		$http({
			method : "POST",
			url : '/itemdetails?item_id=' + item_id,
			data : {}
		}).success(function(data, status) {
			console.log(data);
			$scope.details = data;
			document.title = data.name + " | MarketPlace";
		}).error(function(error) {
			$scope.result = "Error Occured";
		});
	};
	$scope.buyNow = function(item_id, quantity) {
		if (quantity <= $scope.quantity) {
			$window.location.href = "/payment?is_cart=false&item_id=" + item_id
					+ "&quantity=" + quantity;
		} else {
			$scope.result = "Invalid quantity";
		}
	};
	$scope.placeBid = function(item_id) {
		$http({
			method : "POST",
			url : '/placeBid',
			data : {
				item_id : item_id,
				bid : $scope.bidding_price
			}
		}).success(function(data, status) {
			if (data.status === 400) {
				$scope.result = "Invalid input as bid";
			} else {
				$window.location.href = "/";
			}
		}).error(function(error) {
			$scope.result = "Error Occured";
		});
	};
	$scope.addToCart = function() {
		$http({
			method : "POST",
			url : '/addToCart',
			data : {
				'item_id' : $scope.details.id,
				'quantity' : $scope.quantity
			}
		}).success(
				function(data, status) {
					if (data.status === 200) {
						$window.location.href = '/cartdetails';
					} else if (data.status === 400) {
						$scope.result = "Item is not there or "
								+ "entered item quantity should be "
								+ "less or equals to available quantity";
					} else {
						$window.location.href = '/';
					}
				}).error(function(error) {
			$window.location.href = '/';
		});
	};
});