var airpi = angular.module('airpiApp', []);
airpi.controller('airpiCntrl', function($scope, $http) {
	
	$scope.submitLogin = function() {
		
		$http({
			method : "POST",
			url : '/checkLogin',
			data : {
				"email" : $scope.emailLogin,
				"password": $scope.password
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				
			}
			else if (data.statusCode == 200){
				window.location.assign('/home');
			} 
		}).error(function(error) {
			
		});
	};
	
	$scope.submitRegister = function() {
		
		$http({
			method : "POST",
			url : '/register',
			data : {
				"firstName" : $scope.firstName,
				"lastName": $scope.lastName,
				"email" : $scope.email,
				"pass": $scope.pass,
				"city" : $scope.city
			}
		}).success(function(data) {
			//checking the response data for statusCode
			if (data.statusCode == 401) {
				
			}
			else if (data.statusCode == 200){
				window.location.assign('/');
			} 
		}).error(function(error) {
			
		});
	};
	
});

