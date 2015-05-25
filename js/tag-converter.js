var app = angular.module( 'TagConverter', [] );

app.controller( 'TagConverterController', function ( $scope ) {
	$scope.id = 705;
	$scope.showGrid = false;
	$scope.getBinaryDigit = function ( pos ) {
		return ( $scope.id & Math.pow( 2, pos ) ) && 1;
	};
	$scope.setBinaryDigit = function ( pos ) {
		$scope.id = $scope.id ^ Math.pow( 2, pos );
	};
	$scope.switchGrid = function () {
		$scope.showGrid = !$scope.showGrid;
	};
});

