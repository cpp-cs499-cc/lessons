// This is the version used for the HTML home-ajs.html with AngularJS
// This is the trending technology
var cs580App = angular.module('cs580App', []);

cs580App.controller('UserCtrl', function ($scope, $http) {

  $scope.loadUsers = function() {
	   $http.get("http://localhost:3000/list")
	   		.success(function(data) {
	   			$scope.files = data;
	   		});
  }

  $scope.getScreenshot = function() {
	  $http.get("http://localhost:3000/screenshot?url=" + $scope.url_to_get)
	  	.success(function(data) {
	  		$scope.loadUsers();
	  });
  }

  $scope.loadUsers();
});